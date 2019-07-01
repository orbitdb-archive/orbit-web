'use strict'

import '@babel/polyfill'

import JsIPFS from 'ipfs'
import Orbit from 'orbit_'

import promiseQueue from '../utils/promise-queue'

const ORBIT_EVENTS = ['connected', 'disconnected', 'joined', 'left', 'peers']
const CHANNEL_EVENTS = [
  'error',
  // 'entry',
  // 'write',
  'load.progress',
  'load.done',
  'replicate.progress',
  'replicate.done'
]

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
    default:
      console.warn('Unknown action', data.action)
      break
  }
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
    channelName: channelName,
    replicationStatus: channel.replicationStatus
  }

  if (['load.done', 'replicate.done'].indexOf(eventName) !== -1) {
    meta['entries'] = channel.feed.iterator({ limit: -1 }).collect()
  }

  if (eventName === 'write') {
    meta['entries'] = [args[2][0]]
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

async function handleStop ({ options }) {
  await this.orbit.disconnect()
  await this.ipfs.stop()
  delete this.orbit
  delete this.ipfs
}

async function handleJoinChannel ({ options }) {
  const channel = await this.orbit.join(options.channelName)

  channel.load()

  // Bind all relevant events
  CHANNEL_EVENTS.forEach(eventName => {
    channel.on(eventName, channelEvent.bind(this, eventName, options.channelName))
  })

  // Bind to "feed on write" directly since "channel on write" does not include the entry
  channel.feed.events.on('write', channelEvent.bind(this, 'write', options.channelName))
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
  this.orbit = new Orbit(this.ipfs, {
    dbOptions: {
      directory: `${options.orbit.root}/data/orbit-db`
    },
    channelOptions: {}
  })

  this.orbit.connect(options.username)

  // Bind all relevant events
  ORBIT_EVENTS.forEach(eventName => {
    this.orbit.events.on(eventName, orbitEvent.bind(this, eventName))
  })

  return new Promise(resolve => {
    this.orbit.events.once('connected', () => resolve())
  })
}

onmessage = onMessage.bind(self || {})
