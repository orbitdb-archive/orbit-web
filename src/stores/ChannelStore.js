'use strict'

import { action, computed, configure, observable, reaction, values } from 'mobx'
import debounce from 'lodash.debounce'

import Logger from '../utils/logger'
import notify from '../utils/notify'

configure({ enforceActions: 'observed' })

const logger = new Logger()

const formatMeta = meta => Object.assign(meta, { from: formatFrom(meta.from) })

const formatFrom = from => {
  return {
    name: formatName(from),
    image: from.image,
    location: from.location
  }
}

const formatName = from => {
  if ('name' in from) {
    if (checkName(from.name)) return from.name
    else if ('id' in from.name && checkName(from.name.id)) return from.name.id
  }
  return 'anonymous'
}

const checkName = name => {
  return typeof name === 'string' && name.length > 0
}

const defaultMessageOffset = 64

export default class ChannelStore {
  constructor ({ network, channelName }) {
    this.network = network
    this.channelName = channelName

    this.sendMessage = this.sendMessage.bind(this)
    this.sendFiles = this.sendFiles.bind(this)
    this.loadFile = this.loadFile.bind(this)

    this._loadState()

    // Save channel state on changes
    reaction(() => values(this._storableState), this._saveState.bind(this))
  }

  // Private instance variables

  @observable
  _storableState = {}

  _sendQueue = []

  _sending = false

  @observable
  _sendingMessageCounter = 0

  // Public instance variables
  @observable
  entriesMap = {}

  @observable
  peers = []

  @observable
  loading = false

  @observable
  replicating = false

  @observable
  messageOffset = defaultMessageOffset

  // Public instance getters

  @computed
  get entries () {
    return Object.values(this.entriesMap).sort(
      // Ascending chronological order by entry timestamp
      (a, b) => a.payload.value.meta.ts - b.payload.value.meta.ts
    )
  }

  @computed
  get visibleEntries () {
    return this.entries.slice(-this.messageOffset)
  }

  @computed
  get unreadEntries () {
    const lastSeenTimestamp = this._storableState.lastSeenTimestamp || 0
    return this.entries.filter(e => e.payload.value.meta.ts > lastSeenTimestamp)
  }

  @computed
  get messages () {
    return this._formatMessages(this.visibleEntries)
  }

  @computed
  get unreadMessages () {
    return this._formatMessages(this.unreadEntries)
  }

  @computed
  get hasUnreadMessages () {
    return this.unreadEntries ? this.unreadEntries.length > 0 : false
  }

  @computed
  get hasMentions () {
    // TODO: Implement
    return false
  }

  @computed
  get sendingMessage () {
    return this._sendingMessageCounter > 0
  }

  @computed
  get storagekey () {
    const username = this.network.sessionStore.username
    if (!username) throw new Error('No logged in user')
    return `orbit-chat.${username}.channel-states`
  }

  @computed
  get userCount () {
    return this.peers.length + 1
  }

  // Private instance actions

  @action
  _decrementSendingMessageCounter () {
    this._sendingMessageCounter = Math.max(0, this._sendingMessageCounter - 1)
  }

  @action
  _incrementSendingMessageCounter () {
    this._sendingMessageCounter += 1
  }

  @action
  _updateEntries (entries) {
    if (!(entries instanceof Array)) return
    entries.forEach(e => (this.entriesMap[e.hash] = e))
  }

  @action
  _updatePeers (peers) {
    this.peers = peers
  }

  @action // Called while loading from local filesystem
  _onLoadProgress (entry) {
    if (!this.loading) this.loading = true
    this._onEntry(entry)
  }

  @action // Called when done loading from local filesystem
  _onLoaded () {
    if (this.loading) this.loading = false
  }

  @action // Called while loading from IPFS (receiving new messages)
  _onReplicateProgress (entry) {
    if (!this.replicating) this.replicating = true
    this._onEntry(entry)
  }

  @action // Called when done loading from IPFS
  _onReplicated () {
    if (this.replicating) this.replicating = false
  }

  _onEntry (entry) {
    if (!entry) return
    // this._sendNotification(entry)

    // We need to cache the updates to not freeze the browser
    this._entrycache = this._entrycache || []
    this._entrycache.push(entry)
    this._debouncedUpdate =
      this._debouncedUpdate ||
      debounce(
        () => {
          this._updateEntries(this._entrycache)
          this._entrycache = []
        },
        250,
        { maxWait: 1000 }
      )
    this._debouncedUpdate()
  }

  // Called when the user writes a message (text or file)
  _onWrite (entry) {
    this._markEntryAsRead(entry)
    this._updateEntries([entry])
    this._decrementSendingMessageCounter()
  }

  _onPeerUpdate (peers) {
    this._updatePeers(peers)
  }

  @action
  _onError (err) {
    logger.error(this.channelName, err)
    this.loading = false
    this.replicating = false
  }

  @action
  _loadState () {
    try {
      Object.assign(this._storableState, this._getStoredStates()[this.channelName] || {})
    } catch (err) {}
  }

  @action.bound
  _markEntryAsRead (entry) {
    if (!entry) return

    this._storableState.lastSeenTimestamp = Math.max(
      this._storableState.lastSeenTimestamp || 0,
      entry.payload.value.meta.ts || 0
    )
  }

  // Private instance methods

  // Format entries to better suit a chat channel
  _formatMessages (entries) {
    const lastSeenTimestamp = this._storableState.lastSeenTimestamp || 0
    return JSON.parse(JSON.stringify(entries)) // Deep copy
      .map(entry =>
        Object.assign(entry.payload.value, {
          hash: entry.hash,
          userIdentity: entry.identity,
          unread: entry.payload.value.meta.ts > lastSeenTimestamp,
          meta: formatMeta(entry.payload.value.meta)
        })
      )
  }

  _getStoredStates () {
    return JSON.parse(localStorage.getItem(this.storagekey)) || {}
  }

  _saveState () {
    try {
      const states = Object.assign(this._getStoredStates(), {
        [this.channelName]: this._storableState
      })
      localStorage.setItem(this.storagekey, JSON.stringify(states))
    } catch (err) {
      logger.error(err)
    }
  }

  _sendNotification (entry) {
    const {
      sessionStore: {
        rootStore: { uiStore: currentChannelName }
      }
    } = this.network
    const payload = entry.payload.value
    if (document.hidden || this.channelName !== currentChannelName) {
      if (this.unreadMessages.length > 1) {
        notify(`${this.unreadMessages.length} unread messages in #${this.channelName}`, '')
      } else {
        notify(
          `New message in #${this.channelName}`,
          `${payload.meta.from.name}: ${payload.content}`
        )
      }
    }
  }

  _sendFile (file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = event => {
        this.network.worker.postMessage({
          action: 'channel:send-file-message',
          options: {
            channelName: this.channelName,
            file: {
              filename: file.name,
              buffer: event.target.result,
              meta: { mimeType: file.type, size: file.size }
            }
          }
        })
        resolve()
      }
      reader.readAsArrayBuffer(file)
    })
  }

  // Public instance actions

  @action.bound
  markEntryAsReadAtIndex (index) {
    if (typeof index !== 'number') return
    this._markEntryAsRead(this.entries[index])
  }

  @action.bound
  markEntryAsReadWithHash (hash) {
    if (typeof hash !== 'string') return
    this._markEntryAsRead(this.entriesMap[hash])
  }

  @action.bound
  increaseMessageOffset (count = defaultMessageOffset / 2) {
    if (this.messageOffset >= this.entries.length) {
      // Don't allow the offset to grow too far beyond current entry count
      return
    }
    this.messageOffset += count
  }

  @action.bound
  resetMessageOffset () {
    this.messageOffset = defaultMessageOffset
  }

  // Public instance methods

  sendMessage (text) {
    if (typeof text !== 'string' || text === '') return Promise.resolve()

    this._incrementSendingMessageCounter()

    this.network.worker.postMessage({
      action: 'channel:send-text-message',
      options: { channelName: this.channelName, message: text }
    })

    return Promise.resolve()
  }

  sendFiles (files) {
    const promises = []
    for (let i = 0; i < files.length; i++) {
      promises.push(this._sendFile(files[i]))
    }
    return Promise.all(promises)
  }

  async loadFile (hash, asStream) {
    const array = await this.network.workerProxy(
      'ipfs-file',
      { hash, asStream, timeout: 20 * 1000 },
      hash
    )
    return { buffer: array, url: null, stream: null }
    // return new Promise((resolve, reject) => {
    //   // TODO: Handle electron
    //   const stream = this.network.orbit.getFile(hash)
    //   if (asStream) resolve({ buffer: null, url: null, stream })
    //   else {
    //     let buffer = new Uint8Array(0)
    //     stream.on('error', reject)
    //     stream.on('data', chunk => {
    //       const tmp = new Uint8Array(buffer.length + chunk.length)
    //       tmp.set(buffer)
    //       tmp.set(chunk, buffer.length)
    //       buffer = tmp
    //     })
    //     stream.on('end', () => {
    //       resolve({ buffer, url: null, stream: null })
    //     })
    //   }
    // })
  }
}
