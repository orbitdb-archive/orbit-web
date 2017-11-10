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
import UserStore from 'stores/UserStore'
import Logger from 'logplease'

const logger = Logger.create('MessageStore', { color: Logger.Colors.Magenta })

window.LOG = 'none' // turn off logging

const messagesBatchSize = 64

const MessageStore = Reflux.createStore({
  listenables: [AppActions, UIActions, NetworkActions, ChannelActions],
  init: function() {
    this._messages = {}
    // Set our internal state to its initial values
    this._reset()

    // Start processing the send queue at an interval
    setInterval(() => this._processQueue(), 10)
  },
  _reset: function() {
    this.orbit = null
    this._messages = {}
    this.syncCount = {}
    this.sendQueue = []
    this.sending = false
    this.loadingHistory = false
  },
  _updateStore(channel, messages, isNewMessage = false) {
    // Messages are { Hash: <multihash base58 string>, Post: Post{} }
    messages = messages || []
    let uniqueNew = differenceWith(messages, this._messages[channel], (a, b) => a.Hash === b.Hash && a.Post.meta.ts === b.Post.meta.ts)

    if (uniqueNew.length > 0) {
      // Process all new messages
      if (isNewMessage) {
        // TODO: check against the timestamp if the message is new
        uniqueNew.forEach((m) => {
          // Add users to the known users list
          UserActions.addUser(m.Post.meta.from)
          // Fire notifications
          NotificationActions.newMessage(channel, m.Post)
        })
      }

      // this.channels[channel].messages = messages
      this._messages[channel] = this._messages[channel] || []
      this._messages[channel] = this._messages[channel].concat(uniqueNew)
      this._messages[channel] = sortBy(this._messages[channel], (e) => e.Post.meta.ts)
      // console.log("Messages in UI:", this.channels[channel].messages.length)

      setImmediate(() => {
        this.trigger(channel, this._messages[channel])
      })
    }
  },
  _processQueue: function() {
    const canProcessNext = this.sendQueue && this.sendQueue.length > 0 && !this.sending
    if (canProcessNext) {
      const task = this.sendQueue.shift()
      this.sending = true

      return this.orbit.send(task.channel, task.message)
        .then((post) => {
          this.sending = false
          if (task.callback) task.callback()
        })
        .catch((e) => console.error(e))
    } else {
      return Promise.resolve()
    }
  },
  onInitialize: function(orbit) {
    this.orbit = orbit
    this.syncCount = {}

    const processMessages = (channel, messages, newMessages = true) => {
      setImmediate(() => {
        this._updateStore(channel, messages, newMessages)
        if (this.syncCount[channel] <= 0)
          setImmediate(() => UIActions.stopLoading(channel, "load"))
      })
    }

    const getMessages = (channel, amount, newMessages = true) => {
      this.orbit.get(channel, null, null, amount)
        .then((messages) => processMessages(channel, messages, newMessages))
        .catch((e) => console.error(e))
    }

    // New message
    // NOTE: currently only messages sent by the user, not from other users
    this.orbit.events.on('message', (channel, message) => {
      // logger.info("message -->", channel, message)
      getMessages(channel, this._messages[channel] ? this._messages[channel].length + 1 : 1)
    })

    this.orbit.events.on('joined', (channel) => {
      logger.info(`Joined #${channel}`)

      const feed = this.orbit.getChannel(channel).feed
      const name = channel.split('/').pop()

      this.syncCount[channel] = this.syncCount[channel] ? this.syncCount[channel] : 0

      // Get the messages we have already loaded locally
      this.syncCount[channel] ++
      setImmediate(() => UIActions.startLoading(name, "load"))
      getMessages(channel, messagesBatchSize, false)

      feed.events.on('load.progress', (channel) => {
        setImmediate(() => UIActions.startLoading(name, "load"))
      })

      // Catch and display db errors
      feed.events.on('error', (err) => {
        console.error(channel, err)
      })

      // When the database has loaded its history,
      // get the messages and update the state
      feed.events.on('ready', () => {
        // logger.info("ready -->", channel)
        this.syncCount[channel]--
        this.syncCount[channel] = Math.max(0, this.syncCount[channel])
        console.log("GET MESSAGES", messagesBatchSize)
        getMessages(channel, messagesBatchSize, false)
        setImmediate(() => UIActions.stopLoading(name, "load"))
      })

      // When the database starts syncing new messages,
      // send a message that we're loading
      feed.events.on('replicate', (channel) => {
        // logger.info("sync -->", channel, name)
        this.syncCount[channel] ++
        setImmediate(() => UIActions.startLoading(name, "load"))
      })

      feed.events.on('replicate.progress', (channel) => {
        setImmediate(() => UIActions.startLoading(name, "load"))
      })

      // When we receive new messages from peers,
      // get the messages and update the store state
      feed.events.on('replicated', () => {
        // logger.info("synced -->", channel)
        this.syncCount[channel] --
        this.syncCount[channel] = Math.max(0, this.syncCount[channel])
        getMessages(channel, this._messages[channel] ? this._messages[channel].length + messagesBatchSize : messagesBatchSize)
      })
    })
  },
  onDisconnect: function() {
    this._reset()
  },
  onLoadMessages: function(channel: string) {
    if (this.orbit && this.orbit.getChannel(channel) !== undefined) {
      this.trigger(channel, this._messages[channel] || [])
    }
  },
  onLoadMoreMessages: function(channel: string, force: boolean, refresh: boolean) {
    // this.loadMessages(channel, messagesBatchSize, force, refresh)

    const processMessages = (channel, messages, newMessages = true) => {
      setImmediate(() => {
        this._updateStore(channel, messages, newMessages)
        if (this.syncCount[channel] <= 0)
          setImmediate(() => UIActions.stopLoading(channel, "load"))
      })
    }

    const getMessages = (channel, amount, newMessages = true) => {
      this.orbit.get(channel, null, null, amount)
        .then((messages) => processMessages(channel, messages, newMessages))
        .catch((e) => console.error(e))
    }

    getMessages(channel, this._messages[channel].length + messagesBatchSize, false)
  },
  loadMessages: function(channel: string, amount: number, force: boolean, refresh) {
    if (this._messages[channel].length > 0) {
      if (refresh) {
        this.loadingHistory = true
        const viewSize = 64 // How many we consider to fit in our view in the UI. TODO: make dynamic based on screen height
        // Get the first <viewSize> entries
        const entriesInView = this._messages[channel].slice(-viewSize).map(e => e.Entry)
        // console.log("Refresh from:", entriesInView)
        this.orbit.loadMoreHistory(channel, messagesBatchSize, entriesInView)
          .then(() => this.loadingHistory = false)
          .catch((e) => console.error(e))
      } else {
        const len = this._messages[channel].length
        const first = this._messages[channel][0]
        this.orbit.get(channel, null, first, len + messagesBatchSize)
          .then((messages) => {
            setImmediate(() => {
              this._updateStore(channel, messages)
              if ((messages.length > 0 && !this.loadingHistory && messages.length > len) || force) {
                this.loadingHistory = true
                const viewSize = 64 // How many we consider to fit in our view in the UI. TODO: make dynamic based on screen height
                // Get the last <viewSize> entries
                const entriesInView = this._messages[channel].slice(0, viewSize).map(e => e.Entry)
                // console.log("Load more history")
                this.orbit.loadMoreHistory(channel, messagesBatchSize, entriesInView)
                  .then(() => this.loadingHistory = false)
                  .catch((e) => console.error(e))
              }
            })
          })
          .catch((e) => console.error(e))
      }
    }
  },
  onSendMessage: function(channel: string, text: string, replyToHash: string, cb) {
    // logger.debug("--> Send message: ", channel, text)
    if(!this.sendQueue) this.sendQueue = []

    this.sendQueue.push({ 
      channel: channel, 
      message: text, 
      callback: cb
    })
  },
  onAddFile: function(channel: string, filePath: string, buffer, meta) {
    logger.debug("--> Add file: " + filePath + buffer !== null)
    UIActions.startLoading(channel, "file")
    this.orbit.addFile(channel, filePath, buffer, meta)
      .then((post) => UIActions.stopLoading(channel, "file"))
      .catch((e) => {
        const error = e.toString()
        logger.error(`Couldn't add file: ${JSON.stringify(filePath)} -  ${error}`)
        UIActions.raiseError(error)
      })
  },
  onLoadFile: function(hash: string, asURL: boolean, asStream: boolean, callback) {
    // TODO: refactor
    const isElectron = window.isElectron
    if(isElectron && asURL) {
      // console.log(window.gatewayAddress, this.orbit._ipfs.GatewayAddress)
      callback(null, null, 'http://' + window.gatewayAddress + hash)
    } else if(isElectron) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', 'http://' + window.gatewayAddress + hash, true)
      xhr.responseType = 'blob'
      xhr.onload = function(e) {
        if(this.status == 200) {
          callback(null, this.response) // this.response is a Blob
        }
      }
      xhr.send()
    } else {
      this.orbit.getFile(hash)
        .then((stream) => {
          if(asStream) {
            callback(null, null, null, stream)
          } else {
            let buf = new Uint8Array(0)
            stream.on('error', () => callback(err, null))
            stream.on('data', (chunk) => {
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
        .catch((e) => console.error(e))
    }
  },
  onLoadDirectoryInfo: function(hash, callback) {
    // TODO: refactor
    this.orbit.getDirectory(hash)
      .then((result) => {
        result = result.map((e) => {
          return {
            hash: e.Hash,
            size: e.Size,
            type: e.Type === 1 ? "directory" : "file",
            name: e.Name
          }
        })
        callback(null, result)
      })
      .catch((e) => console.error(e))
  }
})

export default MessageStore
