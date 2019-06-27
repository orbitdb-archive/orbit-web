'use strict'

import '@babel/polyfill'

import JsIPFS from 'ipfs'
import Orbit from 'orbit_'

const ORBIT_EVENTS = ['connected', 'disconnected', 'joined', 'left', 'peers']
const CHANNEL_EVENTS = [
  'error',
  'entry',
  'write',
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

  switch (eventName) {
    case 'joined':
      this.postMessage({ action: 'orbit-event', name: eventName, args: [args[0]] })
      break
    case 'left':
      this.postMessage({ action: 'orbit-event', name: eventName, args: [args[0]] })
      break
    default:
      this.postMessage({ action: 'orbit-event', name: eventName, args: [] })
      break
  }
}

async function channelEvent (eventName, channelName, ...args) {
  if (typeof eventName !== 'string') return

  const channel = this.orbit.channels[channelName]

  const replicationStatus = channel.replicationStatus

  switch (eventName) {
    default:
      this.postMessage({
        action: 'channel-event',
        name: eventName,
        meta: {
          channelName,
          replicationStatus
        },
        args
      })
      break
  }
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
}

function handleLeaveChannel ({ options }) {
  this.orbit.leave(options.channelName)
}

function handleSendTextMessage ({ options }) {
  this.orbit.channels[options.channelName].sendMessage(options.message)
}

function handleSendFileMessage ({ options }) {
  this.orbit.channels[options.channelName].sendFile(options.file)
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
