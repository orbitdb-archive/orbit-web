'use strict'

import IPFS from 'ipfs'
import Reflux from 'reflux'
import path from 'path'

import AppActions from 'actions/AppActions'
import NetworkActions from 'actions/NetworkActions'
import IpfsDaemonActions from 'actions/IpfsDaemonActions'

import { defaultIpfsDaemonSettings } from '../config/ipfs-daemon.config'
import { defaultOrbitSettings } from '../config/orbit.config'

import Logger from 'utils/logger'

const logger = new Logger()

// const LOCAL_STORAGE_KEY = 'ipfs-daemon-settings'

const IpfsDaemonStore = Reflux.createStore({
  listenables: [AppActions, IpfsDaemonActions, NetworkActions],
  init: function () {
    logger.debug('IpfsDaemonStore Init sequence')

    this.isElectron = window.isElectron
    this.ipfs = null

    const orbitDataDir = window.orbitDataDir || '/orbit'
    const ipfsDataDir = window.ipfsDataDir || '/orbit/ipfs'

    this.settings = Object.assign(
      {},
      defaultIpfsDaemonSettings(ipfsDataDir),
      defaultOrbitSettings(orbitDataDir)
    )

    if (this.isElectron) {
      ipcRenderer.on('ipfs-daemon-instance', () => {
        logger.debug('daemon callback')
        window.ipfsInstance = window.remote.getGlobal('ipfsInstance')
        this.ipfs = window.ipfsInstance
        window.gatewayAddress = this.ipfs.GatewayAddress
        IpfsDaemonActions.daemonStarted(this.ipfs)
      })
    }

    this.trigger(this.settings)
  },
  onStart: function (user) {
    const settings = JSON.parse(JSON.stringify(this.settings))

    if (settings.IpfsDataDir.includes(settings.OrbitDataDir + '/ipfs')) {
      settings.IpfsDataDir = settings.IpfsDataDir.replace(
        settings.OrbitDataDir + '/ipfs',
        settings.OrbitDataDir
      )
      settings.IpfsDataDir = path.join(settings.IpfsDataDir, '/' + user, '/ipfs')
    }

    settings.OrbitDataDir = path.join(settings.OrbitDataDir, '/' + user)

    this.settings = JSON.parse(JSON.stringify(settings))

    if (this.isElectron) {
      logger.debug('start electron ipfs-daemon')
      ipcRenderer.send('ipfs-daemon-start', settings)
    } else {
      logger.debug('start js-ipfs')
      this.ipfs = new IPFS({
        repo: this.settings.IpfsDataDir,
        config: this.settings,
        EXPERIMENTAL: {
          pubsub: true,
          sharding: false,
          dht: false
        }
      })
      this.ipfs.on('ready', () => {
        IpfsDaemonActions.daemonStarted(this.ipfs)
      })
      this.ipfs.on('error', e => logger.error(e))
    }
  },
  onStop: function () {
    if (this.isElectron) {
      logger.debug('stop electron ipfs-daemon')
      ipcRenderer.send('ipfs-daemon-stop')
    } else {
      logger.debug('stop js-ipfs daemon')
      throw new Error('should stop js-ipfs daemon. not implemented yet')
    }
  },
  onSaveConfiguration: function (settings) {
    this.settings = Object.assign(this.settings, settings)
  },
  onInitConfiguration: function (callback) {
    logger.debug('get config')
    this.trigger(this.settings)
  },
  getIpfsSettings: function () {
    return this.settings
  }
})

export default IpfsDaemonStore
