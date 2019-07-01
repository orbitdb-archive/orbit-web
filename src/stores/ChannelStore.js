'use strict'

import { action, computed, configure, observable, reaction, values } from 'mobx'

import { throttleFunc } from '../utils/throttle'
import Logger from '../utils/logger'
import notify from '../utils/notify'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class ChannelStore {
  constructor ({ network, channelName }) {
    this.network = network
    this.channelName = channelName

    this.loadFile = this.loadFile.bind(this)
    this.updatePeers = throttleFunc(this._updatePeers.bind(this))

    this.loadMore = this.loadMore.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendFiles = this.sendFiles.bind(this)

    this._saveState = this._saveState.bind(this)

    this._loadState()

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

  // TODO: object.name is reserved so remove code which uses this
  get name () {
    console.warn(
      'Deprecation warning: "channel.name" is deprecated, use channel.channelName instead'
    )
    return this.channelName
  }

  @computed
  get entryHashes () {
    return this.entries.map(e => e.hash)
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
        hash: entry.hash,
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

  sendNotification (entry) {
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

  _onNewEntry (entry) {
    // TOOD: This is not called anymore; how to handle notification?
    this.sendNotification(entry)
    this._updateEntries([entry])
  }

  @action
  _updateEntries (entries) {
    const oldHashes = this.entryHashes
    const { lastSeenTimestamp = 0 } = this._storableState

    const newEntries = entries
      // Filter out entries we already have
      .filter(e => !oldHashes.includes(e.hash))
      // Set entries as seen
      .map(e => Object.assign(e, { seen: e.payload.value.meta.ts <= lastSeenTimestamp }))

    this.entries = this.entries
      .concat(newEntries)
      .sort((a, b) => a.payload.value.meta.ts - b.payload.value.meta.ts)
  }

  @action
  _updatePeers (peers) {
    this.peers = peers
  }

  @action.bound
  _updateReplicationStatus (replicationStatus) {
    Object.assign(this._replicationStatus, replicationStatus)
  }

  @action // Called while loading from local filesystem
  _onLoadProgress (replicationStatus) {
    this._updateReplicationStatus(replicationStatus)
    this.loadingHistory = true
  }

  @action // Called when done loading from local filesystem
  _onLoaded (replicationStatus, entries) {
    this._updateReplicationStatus(replicationStatus)
    this._updateEntries(entries)
    this.loadingHistory = false
  }

  @action // Called while loading from IPFS (receiving new messages)
  _onReplicateProgress (replicationStatus) {
    this._updateReplicationStatus(replicationStatus)
    this.loadingNewMessages = true
  }

  @action // Called when done loading from IPFS
  _onReplicated (replicationStatus, entries) {
    this._updateReplicationStatus(replicationStatus)
    this._updateEntries(entries)
    this.loadingNewMessages = false
  }

  // Called when the user writes a message (text or file)
  _onWrite (replicationStatus, entries) {
    this._updateReplicationStatus(replicationStatus)
    this._updateEntries(entries)
    this._decrementSendingMessageCounter()
  }

  _onPeerUpdate (peers) {
    this._updatePeers(peers)
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
    this.entries.filter(e => e.hash === message.hash).forEach(this.markEntryAsRead)
  }

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
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const reader = new FileReader()
      reader.onload = event => {
        this.network.worker.postMessage({
          action: 'channel:send-file-message',
          options: {
            channelName: this.channelName,
            file: {
              filename: f.name,
              buffer: event.target.result,
              meta: { mimeType: f.type, size: f.size }
            }
          }
        })
      }
      reader.readAsArrayBuffer(f)
    }
  }

  // Private instance methods

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
    // TODO: Refactor the use array  indexes and orbit log iterator
    // if (!this.loadingHistory && this.hasMoreHistory) return this.orbitChannel.loadMore(loadAmount)
    // else return Promise.resolve()
  }
}
