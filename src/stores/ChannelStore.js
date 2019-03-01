'use strict'

import { action, computed, configure, observable, reaction, runInAction, values } from 'mobx'

import { throttleFunc } from '../utils/throttle'
import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

const loadAmount = 10 // How many entries are loaded per load call

export default class ChannelStore {
  constructor ({ network, orbitChannel }) {
    this.network = network
    this.orbitChannel = orbitChannel

    this.loadFile = this.loadFile.bind(this)
    this.processSendQueue = throttleFunc(this._processSendQueue.bind(this))
    this.updatePeers = throttleFunc(this._updatePeers.bind(this))

    this.loadMore = this.loadMore.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendFiles = this.sendFiles.bind(this)

    this._saveState = this._saveState.bind(this)

    this.orbitChannel.on('error', this._onError.bind(this))
    this.orbitChannel.on('entry', this._onNewEntry.bind(this))
    this.orbitChannel.on('write', this._onWrite.bind(this))
    this.orbitChannel.on('load.progress', this._onLoadProgress.bind(this))
    this.orbitChannel.on('load.done', this._onLoaded.bind(this))
    this.orbitChannel.on('replicate.progress', this._onReplicateProgress.bind(this))
    this.orbitChannel.on('replicate.done', this._onReplicated.bind(this))

    this._loadState()

    this.orbitChannel.load(loadAmount)

    // Save channel state on changes
    reaction(() => values(this._storableState), this._saveState)
  }

  // Private instance variables

  @observable
  _storableState = {}

  _sendQueue = []
  _sending = false

  @observable
  _sendingMessageCounter = 0

  @observable
  _replicationStatus = {}

  // Public instance variables

  @observable
  entries = []

  @observable
  peers = []

  @observable
  loadingHistory = false

  @observable
  loadingNewMessages = false

  // Public instance getters

  get channelName () {
    return this.orbitChannel.channelName
  }

  // TODO: object.name is reserved so remove code which uses this
  get name () {
    console.warn(
      'Deprecation warning: "channel.name" is deprecated, use channel.channelName instead'
    )
    return this.channelName
  }

  @computed
  get entryCIDs () {
    return this.entries.map(e => e.cid)
  }

  @computed
  get entryHashes () {
    return this.entryCIDs
  }

  @computed
  get seenEntries () {
    return this.entries.filter(e => e.seen)
  }

  @computed
  get unseenEntries () {
    return this.entries.filter(e => !e.seen)
  }

  @computed
  get hasUnseenEntries () {
    return this.unseenEntries.length > 0
  }

  @computed
  get messages () {
    // Format entries to better suit a chat channel
    return this.entries.map(entry =>
      Object.assign(JSON.parse(JSON.stringify(entry.payload.value)), {
        hash: entry.cid,
        userIdentity: entry.identity,
        unread: !entry.seen
      })
    )
  }

  @computed
  get messageHashes () {
    return this.messages.map(m => m.hash)
  }

  @computed
  get readMessages () {
    return this.messages.filter(m => !m.unread)
  }

  @computed
  get unreadMessages () {
    return this.messages.filter(m => m.unread)
  }

  @computed
  get hasUnreadMessages () {
    return this.unreadMessages.length > 0
  }

  @computed
  get hasMentions () {
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
  get hasMoreHistory () {
    return this._replicationStatus.progress < this._replicationStatus.max
  }

  @computed
  get userCount () {
    return this.peers.length + 1
  }

  // Private instance actions

  @action.bound
  _decrementSendingMessageCounter () {
    this._sendingMessageCounter = Math.max(0, this._sendingMessageCounter - 1)
  }

  @action.bound
  _incrementSendingMessageCounter () {
    this._sendingMessageCounter += 1
  }

  _onNewEntry (entry) {
    this._updateEntries([entry])
  }

  @action.bound
  _updateEntries (entries) {
    const oldCIDs = this.entryCIDs
    const { lastSeenTimestamp = 0 } = this._storableState

    const newEntries = entries
      // Filter out entries we already have
      .filter(e => oldCIDs.indexOf(e.cid) === -1)
      // Set entries as seen
      .map(e => Object.assign(e, { seen: e.payload.value.meta.ts <= lastSeenTimestamp }))

    this.entries = this.entries
      .concat(newEntries)
      .sort((a, b) => a.payload.value.meta.ts - b.payload.value.meta.ts)
  }

  @action
  async _updatePeers () {
    const peers = await this._getPeers()
    runInAction(() => {
      this.peers = peers
    })
  }

  @action.bound
  _updateReplicationStatus () {
    Object.assign(this._replicationStatus, this.orbitChannel.replicationStatus)
  }

  @action // Called while loading from local filesystem
  _onLoadProgress () {
    this._updateReplicationStatus()
    this.loadingHistory = true
  }

  @action // Called when done loading from local filesystem
  _onLoaded () {
    this._updateReplicationStatus()
    this.loadingHistory = false
  }

  @action // Called while loading from IPFS (receiving new messages)
  _onReplicateProgress () {
    this._updateReplicationStatus()
    this.loadingNewMessages = true
  }

  @action // Called when done loading from IPFS
  _onReplicated () {
    this._updateReplicationStatus()
    this.loadingNewMessages = false
  }

  // Called when the user writes a message (text or file)
  _onWrite () {
    this._decrementSendingMessageCounter()
  }

  @action
  _onError (err) {
    logger.error(this.channelName, err)
    this.loadingHistory = false
    this.loadingNewMessages = false
  }

  @action.bound
  _loadState () {
    try {
      Object.assign(this._storableState, this._getStoredStates()[this.channelName] || {})
    } catch (err) {}
  }

  // Public instance actions

  @action.bound
  markEntryAsRead (entry) {
    entry.seen = true

    // Update the last read timestamp
    this._storableState.lastSeenTimestamp = Math.max(
      this._storableState.lastSeenTimestamp || 0,
      entry.payload.value.meta.ts || 0
    )
  }

  @action.bound
  markMessageAsRead (message) {
    if (!message.unread) return
    this.entries.filter(e => e.cid === message.hash).forEach(this.markEntryAsRead)
  }

  sendMessage (text) {
    if (typeof text !== 'string' || text === '') return Promise.resolve()

    this._incrementSendingMessageCounter()

    return new Promise((resolve, reject) => {
      this._sendQueue.push({ text, resolve, reject })
    })
  }

  sendFiles (files) {
    const promises = []
    for (let i = 0; i < files.length; i++) {
      promises.push(
        new Promise((resolve, reject) => {
          this._incrementSendingMessageCounter()
          const f = files[i]
          const reader = new FileReader()
          reader.onload = event => {
            this._sendQueue.push({
              file: {
                filename: f.name,
                buffer: event.target.result,
                meta: { mimeType: f.type, size: f.size }
              },
              resolve,
              reject
            })
          }
          reader.readAsArrayBuffer(f)
        })
      )
    }

    return Promise.all(promises)
  }

  // Private instance methods

  _getPeers () {
    return this.orbitChannel.peers
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

  @action
  _processSendQueue () {
    if (this._sendQueue.length === 0 || this._sending) return

    this._sending = true

    const task = this._sendQueue.shift()

    let promise

    if (task.text) {
      promise = this.orbitChannel.sendMessage(task.text)
    } else if (task.file) {
      promise = this.orbitChannel.sendFile(task.file)
    }

    if (promise && promise.then) {
      // Wrap the tasks reject function so we can decrement the '_sendingMessageCounter'
      const wrappedReject = (...args) => {
        this._decrementSendingMessageCounter()
        task.reject(...args)
      }

      promise.then(task.resolve, wrappedReject).finally(() => {
        this._sending = false
      })
    } else this._sending = false
  }

  // Public instance methods

  loadFile (hash, asStream) {
    return new Promise((resolve, reject) => {
      // TODO: Handle electron
      const stream = this.network.orbit.getFile(hash)
      if (asStream) resolve({ buffer: null, url: null, stream })
      else {
        let buffer = new Uint8Array(0)
        stream.on('error', reject)
        stream.on('data', chunk => {
          const tmp = new Uint8Array(buffer.length + chunk.length)
          tmp.set(buffer)
          tmp.set(chunk, buffer.length)
          buffer = tmp
        })
        stream.on('end', () => {
          resolve({ buffer, url: null, stream: null })
        })
      }
    })
  }

  loadMore () {
    if (!this.loadingHistory && this.hasMoreHistory) return this.orbitChannel.loadMore(loadAmount)
    else return Promise.resolve()
  }
}
