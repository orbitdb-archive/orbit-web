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

const messagesBatchSize = 4

const MessageStore = Reflux.createStore({
  listenables: [AppActions, UIActions, NetworkActions, ChannelActions],
  init: function() {
    // Set our internal state to its initial values
    this._reset()

    // Start processing the send queue at an interval
    setInterval(() => this._processQueue(), 16)
  },
  _reset: function() {
    this.orbit = null
    this.channels = {}
    this.syncCount = {}
    this.sendQueue = []
    this.sending = false
    this.loadingHistory = false
  },
  _updateStore(channel, messages, isNewMessage = false) {
    // Messages are { Hash: <multihash base58 string>, Post: Post{} }
    messages = messages || []
    let uniqueNew = differenceWith(messages, this.channels[channel].messages, (a, b) => a.Hash === b.Hash && a.Post.meta.ts === b.Post.meta.ts)

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
      this.channels[channel].messages = this.channels[channel].messages.concat(uniqueNew)
      this.channels[channel].messages = sortBy(this.channels[channel].messages, (e) => e.Post.meta.ts)
      // console.log("Messages in UI:", this.channels[channel].messages.length)

      setImmediate(() => {
        this.trigger(channel, this.channels[channel].messages)
      })
    }
  },
  _processQueue: function() {
    const canProcessNext = this.sendQueue && this.sendQueue.length > 0 && !this.sending    
    if (canProcessNext) {
      const task = this.sendQueue.shift()
      this.sending = true

      this.orbit.send(task.channel, task.message)
        .then((post) => {
          this.sending = false
          if (task.callback) task.callback()
        })
        .catch((e) => console.error(e))
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
      getMessages(channel, this.channels[channel].messages.length + 1)
    })

    this.orbit.events.on('joined', (channel) => {
      logger.info(`Joined #${channel}`)

      const feed = this.orbit.channels[channel].feed

      this.syncCount[channel] = this.syncCount[channel] ? this.syncCount[channel] : 0

      // When the database has loaded its history,
      // get the messages and update the state
      feed.events.on('ready', () => {
        // logger.info("ready -->", channel)
        this.syncCount[channel]--
        this.syncCount[channel] = Math.max(0, this.syncCount[channel])
        getMessages(channel, messagesBatchSize, false)
      })

      // When the database starts syncing new messages,
      // send a message that we're loading
      feed.events.on('sync', (channel) => {
        // logger.info("sync -->", channel, name)
        this.syncCount[channel] ++
        setImmediate(() => UIActions.startLoading(channel, "load"))
      })

      // When we receive new messages from peers,
      // get the messages and update the store state
      feed.events.on('synced', (channel) => {
        // logger.info("synced -->", channel)
        this.syncCount[channel] --
        this.syncCount[channel] = Math.max(0, this.syncCount[channel])
        getMessages(channel, this.channels[channel].messages.length + messagesBatchSize)
      })
    })
  },
  onDisconnect: function() {
    this._reset()
  },
  onJoinChannel: function(channel, password) {
    if(!this.channels[channel]) {
      this.syncCount[channel] = 0
      this.channels[channel] = { messages: [] }
    }
  },
  onLeaveChannel: function(channel: string) {
    delete this.syncCount[channel]
    delete this.channels[channel]
  },
  onLoadMessages: function(channel: string) {
    if (this.channels[channel]) {
      this.trigger(channel, this.channels[channel].messages)
    }
  },
  onLoadMoreMessages: function(channel: string, force: boolean, refresh: boolean) {
    this.loadMessages(channel, messagesBatchSize, force, refresh)
  },
  loadMessages: function(channel: string, amount: number, force: boolean, refresh) {
    if (this.channels[channel].messages.length > 0) {
      if (refresh) {
        this.loadingHistory = true
        const viewSize = 64 // How many we consider to fit in our view in the UI. TODO: make dynamic based on screen height
        // Get the first <viewSize> entries
        const entriesInView = this.channels[channel].messages.slice(-viewSize).map(e => e.Entry)
        // console.log("Refresh from:", entriesInView)
        this.orbit.loadMoreHistory(channel, messagesBatchSize, entriesInView)
          .then(() => this.loadingHistory = false)
          .catch((e) => console.error(e))
      } else {
        const len = this.channels[channel].messages.length
        const first = this.channels[channel].messages[0]
        this.orbit.get(channel, null, first, len + messagesBatchSize)
          .then((messages) => {
            setImmediate(() => {
              this._updateStore(channel, messages)
              if ((messages.length > 0 && !this.loadingHistory && messages.length > len) || force) {
                this.loadingHistory = true
                const viewSize = 64 // How many we consider to fit in our view in the UI. TODO: make dynamic based on screen height
                // Get the last <viewSize> entries
                const entriesInView = this.channels[channel].messages.slice(0, viewSize).map(e => e.Entry)
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
