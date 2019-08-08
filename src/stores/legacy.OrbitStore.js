'use strict'

import { action, configure, observable } from 'mobx'
import Orbit from 'orbit_'

import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class OrbitStore {
  constructor (networkStore) {
    this.sessionStore = networkStore.sessionStore
    this.settingsStore = networkStore.settingsStore
  }

  @observable
  node = null

  @observable
  starting = false

  @observable
  stopping = false

  @action.bound
  onStarted (node, callback) {
    logger.info('orbit node started')
    this.starting = false
    this.node = node
    if (typeof callback === 'function') callback(node)
  }

  @action.bound
  onStopped (callback) {
    logger.info('orbit node stopped')
    this.stopping = false
    this.node = null
    if (typeof callback === 'function') callback()
  }

  @action.bound
  async init (ipfs) {
    if (this.node) return this.node

    if (!ipfs) throw new Error('IPFS is not defined')
    if (!this.sessionStore.username) throw new Error('Username is not defined')
    if (this.starting) throw new Error('Already starting Orbit')

    this.starting = true
    logger.info('Starting orbit node')

    await this.stop()

    return new Promise(resolve => {
      const settings = this.settingsStore.networkSettings.orbit
      const options = {
        dbOptions: {
          directory: `${settings.root}/data/orbit-db`
        },
        channelOptions: {}
      }
      const node = new Orbit(ipfs, options)
      node.events.once('connected', () => this.onStarted(node, resolve))
      node.connect(this.sessionStore.username)
    })
  }

  @action.bound
  async stop () {
    if (!this.node) return
    if (this.stopping) throw new Error('Already stopping Orbit')

    this.stopping = true
    logger.info('Stopping orbit node')

    await new Promise(resolve => {
      this.node.events.once('disconnected', () => this.onStopped(resolve))
      this.node.disconnect()
    })
  }
}
