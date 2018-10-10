'use strict'

import sortBy from 'lodash.sortby'
import differenceWith from 'lodash.differencewith'
import Reflux from 'reflux'

import AppActions from 'actions/AppActions'
import UIActions from 'actions/UIActions'
import NetworkActions from 'actions/NetworkActions'
import ChannelActions from 'actions/ChannelActions'
import NotificationActions from 'actions/NotificationActions'
import UserActions from 'actions/UserActions'

import Logger from 'utils/logger'

const logger = new Logger()

const messagesBatchSize = 64

const MessageStore = Reflux.createStore({
  listenables: [AppActions, UIActions, NetworkActions, ChannelActions],
  init: function () {
    this._processQueueInterval = null

    // Set our internal state to its initial values
    this._reset()
  },
  _reset: function () {
    this.orbit = null
    this._messages = {}
    this.syncCount = {}
    this.sendQueue = []
    this.sending = false
    this.loadingHistory = false
    if (this._processQueueInterval) clearInterval(this._processQueueInterval)
  },
  _updateStore (channel, messages, isNewMessage = false) {
    // Messages are { Hash: <multihash base58 string>, Post: Post{} }
    messages = messages || []

    const uniqueNew = differenceWith(
      messages,
      this._messages[channel],
      (a, b) => a.Hash === b.Hash && a.Post.meta.ts === b.Post.meta.ts
    )

    if (uniqueNew.length <= 0) return

    // Process all new messages
    if (isNewMessage) {
      // TODO: check against the timestamp if the message is new
      uniqueNew.forEach(m => {
        // Add users to the known users list
        UserActions.addUser(m.Post.meta.from)
        // Fire notifications
        NotificationActions.newMessage(channel, m.Post)
      })
    }

    this._messages[channel] = this._messages[channel] || []
    this._messages[channel] = this._messages[channel].concat(uniqueNew)
    this._messages[channel] = sortBy(this._messages[channel], e => e.Post.meta.ts)

    setImmediate(() => {
      this.trigger(channel, this._messages[channel])
    })
  },
  _processQueue: async function () {
    if (!(this.sendQueue && this.sendQueue.length > 0 && !this.sending)) return

    const task = this.sendQueue.shift()
    this.sending = true

    try {
      await this.orbit.send(task.channel, task.message)
      this.sending = false
      if (task.callback) task.callback()
    } catch (err) {
      logger.error(err)
    }
  },
  _processMessages: function (channel, messages, newMessages = true) {
    setImmediate(() => {
      this._updateStore(channel, messages, newMessages)
      if (this.syncCount[channel] <= 0) {
        setImmediate(() => UIActions.stopLoading(channel, 'load'))
      }
    })
  },
  _getMessages: async function (channel, amount, newMessages = true) {
    try {
      const messages = await this.orbit.get(channel, null, null, amount)
      this._processMessages(channel, messages, newMessages)
    } catch (err) {
      logger.error(err)
    }
  },
  _orbitOnMessage: function (channel, message) {
    this._getMessages(channel, this._messages[channel] ? this._messages[channel].length + 1 : 1)
  },
  _orbitOnChannelJoin: function (channel) {
    logger.debug(`Joined #${channel}`)

    const feed = this.orbit.getChannel(channel).feed
    const name = channel.split('/').pop()

    this.syncCount[channel] = this.syncCount[channel] || 0

    // Get the messages we have already loaded locally
    this.syncCount[channel]++
    setImmediate(() => UIActions.startLoading(name, 'load'))
    this._getMessages(channel, messagesBatchSize, false)

    feed.events.on('load.progress', () => {
      setImmediate(() => UIActions.startLoading(name, 'load'))
    })

    // Catch and display db errors
    feed.events.on('error', err => {
      logger.error(channel, err)
    })

    // When the database has loaded its history,
    // get the messages and update the state
    feed.events.on('ready', () => {
      // logger.debug("ready -->", channel)
      this.syncCount[channel]--
      this.syncCount[channel] = Math.max(0, this.syncCount[channel])
      this._getMessages(channel, messagesBatchSize, false)
      setImmediate(() => UIActions.stopLoading(name, 'load'))
    })

    // When the database starts syncing new messages,
    // send a message that we're loading
    feed.events.on('replicate', channel => {
      // logger.debug("sync -->", channel, name)
      this.syncCount[channel]++
      setImmediate(() => UIActions.startLoading(name, 'load'))
    })

    feed.events.on('replicate.progress', channel => {
      setImmediate(() => UIActions.startLoading(name, 'load'))
    })

    // When we receive new messages from peers,
    // get the messages and update the store state
    feed.events.on('replicated', () => {
      // logger.debug("synced -->", channel)
      this.syncCount[channel]--
      this.syncCount[channel] = Math.max(0, this.syncCount[channel])
      this._getMessages(
        channel,
        this._messages[channel]
          ? this._messages[channel].length + messagesBatchSize
          : messagesBatchSize
      )
    })
  },
  onInitialize: function (orbit) {
    this.orbit = orbit
    this.syncCount = {}

    if (this._processQueueInterval) clearInterval(this._processQueueInterval)

    // Start processing the send queue at an interval
    this._processQueueInterval = setInterval(this._processQueue, 10)

    // New message
    // NOTE: currently only messages sent by the user, not from other users
    this.orbit.events.on('message', this._orbitOnMessage)

    this.orbit.events.on('joined', this._orbitOnChannelJoin)
  },
  onDisconnect: function () {
    this._reset()
  },
  onLoadMessages: function (channel) {
    if (this.orbit && this.orbit.getChannel(channel) !== undefined) {
      this.trigger(channel, this._messages[channel] || [])
    }
  },
  onLoadMoreMessages: function (channel, force, refresh) {
    this._getMessages(
      channel,
      this._messages[channel]
        ? this._messages[channel].length + messagesBatchSize
        : messagesBatchSize,
      false
    )
  },
  loadMessages: async function (channel, amount, force, refresh) {
    if (this._messages[channel].length <= 0) return

    // How many we consider to fit in our view in the UI. TODO: make dynamic based on screen height
    const viewSize = 64

    if (refresh) {
      this.loadingHistory = true

      // Get the first <viewSize> entries
      const entriesInView = this._messages[channel].slice(-viewSize).map(e => e.Entry)

      try {
        await this.orbit.loadMoreHistory(channel, messagesBatchSize, entriesInView)
        this.loadingHistory = false
      } catch (err) {
        logger.error(err)
      }
    } else {
      const len = this._messages[channel].length
      const first = this._messages[channel][0]

      const messages = await this.orbit.get(channel, null, first, len + messagesBatchSize)

      setImmediate(async () => {
        this._updateStore(channel, messages)

        if (!((messages.length > 0 && messages.length > len && !this.loadingHistory) || force)) {
          return
        }

        this.loadingHistory = true

        // Get the last <viewSize> entries
        const entriesInView = this._messages[channel].slice(0, viewSize).map(e => e.Entry)

        try {
          await this.orbit.loadMoreHistory(channel, messagesBatchSize, entriesInView)
          this.loadingHistory = false
        } catch (err) {
          logger.error(err)
        }
      })
    }
  },
  onSendMessage: function (channel, text, replyToHash, cb) {
    // logger.debug("--> Send message: ", channel, text)
    if (!this.sendQueue) this.sendQueue = []

    this.sendQueue.push({
      channel: channel,
      message: text,
      callback: cb
    })
  },
  onAddFile: function (channel, filePath, buffer, meta) {
    logger.debug('--> Add file: ' + filePath + buffer !== null)
    UIActions.startLoading(channel, 'file')
    this.orbit
      .addFile(channel, filePath, buffer, meta)
      .then(post => UIActions.stopLoading(channel, 'file'))
      .catch(e => {
        const error = e.toString()
        logger.error(`Couldn't add file: ${JSON.stringify(filePath)} -  ${error}`)
        UIActions.raiseError(error)
      })
  },
  onLoadFile: function (hash, asURL, asStream, callback) {
    // TODO: refactor
    const isElectron = window.isElectron
    if (isElectron && asURL) {
      callback(null, null, 'http://' + window.gatewayAddress + hash)
    } else if (isElectron) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', 'http://' + window.gatewayAddress + hash, true)
      xhr.responseType = 'blob'
      xhr.onload = function (e) {
        if (this.status === 200) {
          callback(null, this.response) // this.response is a Blob
        }
      }
      xhr.send()
    } else {
      this.orbit
        .getFile(hash)
        .then(stream => {
          if (asStream) {
            callback(null, null, null, stream)
          } else {
            let buf = new Uint8Array(0)
            stream.on('error', err => callback(err, null))
            stream.on('data', chunk => {
              const tmp = new Uint8Array(buf.length + chunk.length)
              tmp.set(buf)
              tmp.set(chunk, buf.length)
              buf = tmp
            })
            stream.on('end', () => {
              callback(null, buf)
            })
          }
        })
        .catch(e => logger.error(e))
    }
  },
  onLoadDirectoryInfo: function (hash, callback) {
    // TODO: refactor
    this.orbit
      .getDirectory(hash)
      .then(result => {
        result = result.map(e => {
          return {
            hash: e.Hash,
            size: e.Size,
            type: e.Type === 1 ? 'directory' : 'file',
            name: e.Name
          }
        })
        callback(null, result)
      })
      .catch(e => logger.error(e))
  }
})

export default MessageStore
