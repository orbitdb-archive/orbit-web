'use strict'

import Orbit from 'orbit_'
import Reflux from 'reflux'
import path from 'path'

import AppActions from 'actions/AppActions'
import IpfsDaemonActions from 'actions/IpfsDaemonActions'
import ChannelActions from 'actions/ChannelActions'

import IpfsDaemonStore from 'stores/IpfsDaemonStore'

const isElectron = window.remote
const ipcRenderer = window.ipcRenderer

const OrbitStore = Reflux.createStore({
  listenables: [AppActions, IpfsDaemonActions],
  init: function () {
    this.orbit = null
    this.listeners = []
    this.trigger(this.orbit)
  },
  _onOrbitConnected: function (network, user) {
    if (ipcRenderer) ipcRenderer.send('connected', network, user)
  },
  _onOrbitDisconnected: function () {
    if (ipcRenderer) ipcRenderer.send('disconnected')
  },
  onDisconnect: function () {
    this.orbit.events.removeListener('connected', this._onOrbitConnected)
    this.orbit.events.removeListener('disconnected', this._onOrbitDisconnected)
    this.orbit.events.removeListener('message', ChannelActions.userMessage)

    this.orbit.disconnect()
  },
  onDaemonStarted: function (ipfs) {
    const options = {
      // path where to keep generates keys
      keystorePath: path.join(IpfsDaemonStore.getIpfsSettings().OrbitDataDir, '/data/keys'),
      // path to orbit-db cache file
      cachePath: path.join(IpfsDaemonStore.getIpfsSettings().OrbitDataDir, '/data/orbit-db'),
      // how many messages to retrieve from history on joining a channel
      maxHistory: isElectron ? 2 : 2
    }

    this.orbit = new Orbit(ipfs, options)

    this.orbit.events.on('connected', this._onOrbitConnected)
    this.orbit.events.on('disconnected', this._onOrbitDisconnected)
    this.orbit.events.on('message', ChannelActions.userMessage)

    AppActions.initialize(this.orbit)

    this.trigger(this.orbit)
  }
})

export default OrbitStore
