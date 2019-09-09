'use strict'

import '@babel/polyfill'

import JsIPFS from 'ipfs'
import Orbit from 'orbit_'

import promiseQueue from '../utils/promise-queue'

const ORBIT_EVENTS = ['connected', 'disconnected', 'joined', 'left', 'peers']
const CHANNEL_FEED_EVENTS = ['write', 'load.progress', 'replicate.progress', 'ready', 'replicated']

function onMessage ({ data }) {
  if (!data.action || !(typeof data.action === 'string')) return

  switch (data.action) {
    case 'network:start':
      handleStart.call(this, data)
      break
    case 'network:stop':
      handleStop.call(this, data)
      break
    case 'orbit:join-channel':
      handleJoinChannel.call(this, data)
      break
    case 'orbit:leave-channel':
      handleLeaveChannel.call(this, data)
      break
    case 'channel:send-text-message':
      handleSendTextMessage.call(this, data)
      break
    case 'channel:send-file-message':
      handleSendFileMessage.call(this, data)
      break
    case 'proxy:req':
      handleProxyRequest.call(this, data)
      break
    default:
      console.warn('Unknown action', data.action)
      break
  }
}

async function handleProxyRequest ({ req, options, key }) {
  switch (req) {
    case 'ipfs-file':
      try {
        if (!options.asStream) {
          const array = await getFileBuffer(this.orbit, options.hash, options)
          this.postMessage({ action: 'proxy:res', key, value: array }, [array.buffer])
        } else {
          this.postMessage({
            action: 'proxy:res',
            key,
            value: null,
            errorMsg: 'Streams are not supported yet'
          })
        }
      } catch (error) {
        this.postMessage({ action: 'proxy:res', key, value: null, errorMsg: error.message })
      }
      break

    default:
      break
  }
}

function getFileBuffer (orbit, hash, options = {}) {
  const timeoutError = new Error('Timeout while fetching file')
  const timeout = options.timeout || 5 * 1000
  return new Promise((resolve, reject) => {
    let timeoutTimer = setTimeout(() => {
      reject(timeoutError)
    }, timeout)
    const stream = orbit.getFile(hash)
    let array = new Uint8Array(0)
    stream.on('error', error => {
      clearTimeout(timeoutTimer)
      reject(error)
    })
    stream.on('data', chunk => {
      clearTimeout(timeoutTimer)
      const tmp = new Uint8Array(array.length + chunk.length)
      tmp.set(array)
      tmp.set(chunk, array.length)
      array = tmp
      timeoutTimer = setTimeout(() => {
        reject(timeoutError)
      }, timeout)
    })
    stream.on('end', () => {
      clearTimeout(timeoutTimer)
      resolve(array)
    })
  })
}

function orbitEvent (eventName, ...args) {
  if (typeof eventName !== 'string') return

  if (['joined', 'left'].indexOf(eventName) !== -1) {
    args = [args[0]]
  } else {
    args = []
  }

  this.postMessage({ action: 'orbit-event', name: eventName, args })
}

async function channelEvent (eventName, channelName, ...args) {
  if (typeof eventName !== 'string') return
  if (typeof channelName !== 'string') return

  const channel = this.orbit.channels[channelName]

  const meta = {
    channelName: channelName
  }

  if (eventName === 'peer.update') {
    meta['peers'] = await channel.peers
  }

  this.postMessage({
    action: 'channel-event',
    name: eventName,
    meta,
    args
  })
}

async function handleStart ({ options }) {
  await startIPFS.call(this, options)
  await startOrbit.call(this, options)
}

async function handleStop () {
  await this.orbit.disconnect()
  await this.ipfs.stop()
  delete this.orbit
  delete this.ipfs
}

async function handleJoinChannel ({ options: { channelName } }) {
  const channel = await this.orbit.join(channelName)

  channel.load()

  // Bind all relevant events
  CHANNEL_FEED_EVENTS.forEach(eventName => {
    channel.feed.events.on(eventName, channelEvent.bind(this, eventName, channelName))
  })
}

function handleLeaveChannel ({ options }) {
  this.orbit.leave(options.channelName)
}

function handleSendTextMessage ({ options }) {
  const channel = this.orbit.channels[options.channelName]
  const sendFunc = channel.sendMessage.bind(channel, options.message)
  queueCall.call(this, sendFunc)
}

function handleSendFileMessage ({ options }) {
  const channel = this.orbit.channels[options.channelName]
  const sendFunc = channel.sendFile.bind(channel, options.file)
  queueCall.call(this, sendFunc)
}

// Queue the calls to a promise queue
function queueCall (func) {
  // Get a reference to the buffer used by current promise queue
  this._callBuffer = this._callBuffer || []
  // Push to the buffer used by current promise queue
  this._callBuffer.push(func)

  // Either let the current queue run until it is done
  // or create a new queue
  this._promiseQueue =
    this._promiseQueue ||
    promiseQueue(this._callBuffer, () => {
      // Remove the current queue when done
      this._promiseQueue = null
    })
}

function startIPFS (options) {
  this.ipfs = new JsIPFS(options.ipfs)

  return new Promise(resolve => {
    this.ipfs.once('ready', () => resolve())
  })
}

function startOrbit (options) {
  this.orbit = new Orbit(this.ipfs, options.orbit)

  this.orbit.connect({ username: options.username })

  // Bind all relevant events
  ORBIT_EVENTS.forEach(eventName => {
    this.orbit.events.on(eventName, orbitEvent.bind(this, eventName))
  })

  return new Promise(resolve => {
    this.orbit.events.once('connected', () => resolve())
  })
}

function refreshChannelPeers () {
  if (this.orbit && this.orbit.channels) {
    Object.keys(this.orbit.channels).forEach(channelName => {
      channelEvent.call(this, 'peer.update', channelName)
    })
  }
}

// Get a reference just so we can bind onmessage and use 'call' on setinterval
const worker = self || {}
onmessage = onMessage.bind(worker)

setInterval(() => {
  refreshChannelPeers.call(worker)
}, 1000)
