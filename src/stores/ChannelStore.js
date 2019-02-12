'use strict'

import { action, computed, configure, observable, reaction, runInAction, values } from 'mobx'

import { throttleFunc } from '../utils/throttle'
import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class ChannelStore {
  constructor ({ network, feed, name }) {
    this.network = network
    this.feed = feed
    this.name = name

    this.leave = this.leave.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.stop = this.stop.bind(this)

    this._processSendQueue = throttleFunc(this._processSendQueue.bind(this))
    this._saveState = this._saveState.bind(this)

    this.peerInterval = setInterval(this._updatePeers, 1000)
    this.processSendQueueInterval = setInterval(this._processSendQueue, 10)

    this.feed.events.on('error', this._onError.bind(this))
    this.feed.events.on('load.progress', this._onLoadProgress.bind(this))
    this.feed.events.on('ready', this._onLoaded.bind(this))
    this.feed.events.on('replicate.progress', this._onReplicateProgress.bind(this))
    this.feed.events.on('replicated', this._onReplicated.bind(this))
    this.feed.events.on('write', this._onWrite.bind(this))

    this._loadState()

    this.feed.load(20)

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

  _loadEntriesBatch = []
  _replicateEntriesBatch = []

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
    // For backwards compatibility
    // TODO: REMOVE
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
  _updateEntries (entries) {
    const oldHashes = this.entryHashes
    const { lastSeenTimestamp = 0 } = this._storableState

    const newEntries = entries
      // Filter out entries we already have
      .filter(e => oldHashes.indexOf(e.hash) === -1)
      // Set entries as seen
      .map(e => Object.assign(e, { seen: e.payload.value.meta.ts <= lastSeenTimestamp }))

    this.entries = this.entries
      .concat(newEntries)
      .sort((a, b) => a.payload.value.meta.ts - b.payload.value.meta.ts)
  }

  @action.bound
  async _updatePeers () {
    const peers = await this._getPeers()
    runInAction(() => {
      this.peers = peers
    })
  }

  @action.bound
  _updateReplicationStatus () {
    Object.assign(this._replicationStatus, this.feed.replicationStatus)
  }

  @action // Called while loading from local filesystem
  _onLoadProgress (...args) {
    this._updateReplicationStatus()
    const entry = args[2]
    this._loadEntriesBatch.push(entry)
    this.loadingHistory = true
  }

  @action // Called when done loading from local filesystem
  _onLoaded () {
    this._updateReplicationStatus()
    const entries = this._loadEntriesBatch.filter(e => e)
    this._loadEntriesBatch = []
    this._updateEntries(entries)
    this.loadingHistory = false
  }

  @action // Called while loading from IPFS (receiving new messages)
  _onReplicateProgress (...args) {
    this._updateReplicationStatus()
    const entry = args[2]
    this._replicateEntriesBatch.push(entry)
    this.loadingNewMessages = true
  }

  @action // Called when done loading from IPFS
  _onReplicated () {
    this._updateReplicationStatus()
    const entries = this._replicateEntriesBatch.filter(e => e)
    this._replicateEntriesBatch = []
    this._updateEntries(entries)
    this.loadingNewMessages = false
  }

  @action // Called when the user writes a message (text or file)
  _onWrite (...args) {
    const entry = args[2][0]
    this._updateEntries([entry])
    if (this._sendingMessageCounter > 0) this._sendingMessageCounter -= 1
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
      Object.assign(this._storableState, this._getStoredStates()[this.name] || {})
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
    this.entries.filter(e => e.hash === message.hash).map(this.markEntryAsRead)
  }

  @action.bound
  sendMessage (text) {
    if (typeof text !== 'string' || text === '') return Promise.resolve()

    this._sendingMessageCounter += 1

    return new Promise((resolve, reject) => {
      this._sendQueue.push({ text, resolve, reject })
    })
  }

  @action.bound
  sendFiles (files) {
    const promises = []
    for (let i = 0; i < files.length; i++) {
      promises.push(
        new Promise((resolve, reject) => {
          runInAction(() => {
            this._sendingMessageCounter += 1
          })
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
    return this.network.ipfs.pubsub.peers(this.feed.address.toString())
  }

  _getStoredStates () {
    return JSON.parse(localStorage.getItem(this.storagekey)) || {}
  }

  _saveState () {
    try {
      const states = Object.assign(this._getStoredStates(), { [this.name]: this._storableState })
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
      promise = this.network.orbit.send(this.name, task.text)
    } else if (task.file) {
      promise = this.network.orbit.addFile(this.name, task.file)
    }

    if (promise && promise.then) {
      // Wrap the tasks reject function so we can decrement the '_sendingMessageCounter'
      const wrappedReject = (...args) => {
        runInAction(() => {
          if (this._sendingMessageCounter > 0) this._sendingMessageCounter -= 1
        })
        task.reject(...args)
      }

      promise.then(task.resolve, wrappedReject).finally(() => {
        this._sending = false
      })
    } else this._sending = false
  }

  // Public instance methods
  leave () {
    this.network.leaveChannel(this.name)
  }

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

  async loadMore () {
    // TODO: This is a bit hacky, but at the time of writing is the only way
    // to load more entries

    if (!this.hasMoreHistory) return

    const log = this.feed._oplog
    const Log = log.constructor

    if (!Log.monkeyPatched) {
      monkeyPatchIpfsLog(Log)
      Log.monkeyPatched = true
    }

    const newLog = await Log.fromEntryHash(
      this.feed._ipfs,
      this.feed.access,
      this.feed.identity,
      log.tails[0].next[0],
      log.id,
      log.values.length + 10,
      log.values,
      this.feed._onLoadProgress.bind(this.feed)
    )

    await log.join(newLog)

    await this.feed._updateIndex()

    this.feed.events.emit('ready', this.feed.address.toString(), log.heads)
  }

  stop () {
    clearInterval(this.peerInterval)
    clearInterval(this.processSendQueueInterval)

    this.feed.events.removeListener('error', this._onError)
    this.feed.events.removeListener('load.progress', this._onLoadProgress)
    this.feed.events.removeListener('ready', this._onLoaded)
    this.feed.events.removeListener('replicate.progress', this._onReplicateProgress)
    this.feed.events.removeListener('replicated', this._onReplicated)
    this.feed.events.removeListener('write', this._onWrite)
  }
}

function monkeyPatchIpfsLog (Log) {
  Log.difference = (a, b) => {
    // let stack = Object.keys(a._headsIndex)
    const stack = Object.keys(a._entryIndex) // This is the only change
    const traversed = {}
    const res = {}

    const pushToStack = hash => {
      if (!traversed[hash] && !b.get(hash)) {
        stack.push(hash)
        traversed[hash] = true
      }
    }

    while (stack.length > 0) {
      const hash = stack.shift()
      const entry = a.get(hash)
      if (entry && !b.get(hash) && entry.id === b.id) {
        res[entry.hash] = entry
        traversed[entry.hash] = true
        entry.next.forEach(pushToStack)
      }
    }
    return res
  }
}
