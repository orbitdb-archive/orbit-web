'use strict'

import { action, configure, observable } from 'mobx'
import IPFS from 'ipfs'

import Logger from '../utils/logger'

configure({ enforceActions: 'observed' })

const logger = new Logger()

export default class IpfsStore {
  constructor (networkStore) {
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
    logger.info('ipfs node started')
    this.starting = false
    this.node = node
    if (typeof callback === 'function') callback(node)
  }

  @action.bound
  onStopped (callback) {
    logger.info('ipfs node stopped')
    this.stopping = false
    this.node = null
    if (typeof callback === 'function') callback()
  }

  @action.bound
  async useJsIPFS () {
    if (this.node) return this.node

    if (this.starting) throw new Error('Already starting IPFS')

    this.starting = true
    logger.info('Starting js-ipfs node')

    return new Promise(resolve => {
      const settings = this.settingsStore.networkSettings.ipfs
      const node = new IPFS(settings)
      node.version((err, { version }) => {
        if (err) return
        logger.info(`js-ipfs version ${version}`)
      })
      node.once('ready', () => this.onStarted(node, resolve))
    })
  }

  @action.bound
  async useGoIPFS () {
    if (this.starting) throw new Error('Already starting IPFS')

    this.starting = true
    logger.debug('Activating go-ipfs node')
    this.stop()
    this.starting = false
  }

  @action.bound
  async stop () {
    if (!this.node) return
    if (this.stopping) throw new Error('Already stopping IPFS')

    this.stopping = true
    logger.info('Stopping ipfs node')

    await new Promise(resolve => {
      this.node.once('stop', () => this.onStopped(resolve))
      this.node.stop()
    })
  }
}
