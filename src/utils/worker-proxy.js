import uuid from './uuid'

import NetworkWorker from '../workers/network.worker.js'

function WorkerProxy (store, worker) {
  this.store = store
  this.worker = worker || new NetworkWorker()

  this.worker.addEventListener('message', this.onMessage.bind(this))
  this.worker.addEventListener('error', this.onError.bind(this))

  this.worker.postMessage('') // Init the worker
}

/**
 * Async wrapper for worker.postMessage
 */
WorkerProxy.prototype.postMessage = function (data) {
  return new Promise((resolve, reject) => {
    const key = uuid()
    data.asyncKey = key
    const asyncListener = ({ data }) => {
      if (!data.asyncKey || data.asyncKey !== key) return
      this.worker.removeEventListener('message', asyncListener)
      delete data.asyncKey
      if (data.errorMsg) reject(data.errorMsg)
      else resolve(data)
    }
    this.worker.addEventListener('message', asyncListener)
    this.worker.postMessage(data)
  })
}

WorkerProxy.prototype.startNetwork = function ({ ipfs, orbit }) {
  return this.postMessage({
    action: 'network:start',
    options: { ipfs, orbit }
  })
}

WorkerProxy.prototype.stopNetwork = function () {
  return this.postMessage({
    action: 'network:stop'
  })
}

WorkerProxy.prototype.joinChannel = function (channelName) {
  return this.postMessage({
    action: 'orbit:join-channel',
    options: { channelName }
  })
}

WorkerProxy.prototype.leaveChannel = function (channelName) {
  return this.postMessage({
    action: 'orbit:leave-channel',
    options: { channelName }
  })
}

WorkerProxy.prototype.sendTextMessage = function (channelName, message) {
  return this.postMessage({
    action: 'channel:send-text-message',
    options: { channelName, message }
  })
}

WorkerProxy.prototype.sendFileMessage = function (channelName, file, buffer) {
  return this.postMessage({
    action: 'channel:send-file-message',
    options: {
      channelName,
      file: {
        filename: file.name,
        buffer,
        meta: { mimeType: file.type, size: file.size }
      }
    }
  })
}

WorkerProxy.prototype.getFile = function ({ hash, asStream, timeout }) {
  return this.postMessage({
    action: 'ipfs:get-file',
    options: { hash, asStream, timeout }
  })
}

WorkerProxy.prototype.onMessage = function ({ data }) {
  if (typeof data.action !== 'string') return
  if (typeof data.name !== 'string') return

  const channel = data.meta ? this.store.channels[data.meta.channelName] : null

  switch (data.action) {
    case 'orbit-event':
      switch (data.name) {
        case 'connected':
          this.store._onOrbitConnected()
          break
        case 'disconnected':
          this.store._onOrbitDisconnected()
          break
        case 'joined':
          this.store._onJoinedChannel(...data.args)
          break
        case 'left':
          this.store._onLeftChannel(...data.args)
          break
        case 'peers':
          this.store._onSwarmPeerUpdate(...data.args)
          break
        default:
          break
      }
      break
    case 'channel-event':
      if (!channel) return

      switch (data.name) {
        case 'error':
          channel._onError(...data.args)
          break
        case 'peer.update':
          channel._onPeerUpdate(data.meta.peers)
          break
        case 'load.progress':
          // args: [address, hash, entry, progress, total]
          channel._onLoadProgress(data.args[2], data.meta.replicationStatus)
          break
        case 'replicate.progress':
          // args: [address, hash, entry, progress, have]
          channel._onReplicateProgress(data.args[2], data.meta.replicationStatus)
          break
        case 'ready': // load.done
          channel._onLoaded()
          break
        case 'replicated': // replicate.done
          channel._onReplicated()
          break
        case 'write':
          // args: [dbname, hash, entry]
          channel._onWrite(data.args[2][0])
          break
        default:
          break
      }
      break
    default:
      break
  }
}

WorkerProxy.prototype.onError = function (error) {
  console.error(error.message)
}

export default WorkerProxy
