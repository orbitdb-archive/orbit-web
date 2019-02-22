'use strict'

import { action, configure, observable, runInAction } from 'mobx'
import ipfsClient from 'ipfs-http-client'
import JsIPFS from 'ipfs'

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
  useEmbeddedIPFS () {
    return new Promise((resolve, reject) => {
      if (this.node) resolve(this.node)
      else if (this.starting) reject(new Error('Already starting IPFS'))
      else {
        runInAction(() => (this.starting = true))
        logger.info('Starting js-ipfs node')
        const settings = this.settingsStore.networkSettings.ipfs
        const node = new JsIPFS(settings)
        node.version((err, { version }) => {
          if (err) return
          logger.info(`js-ipfs version ${version}`)
        })
        node.once('ready', () => this.onStarted(node, resolve))
      }
    })
  }

  @action.bound
  useExternalIPFS () {
    return new Promise((resolve, reject) => {
      if (this.node) resolve(this.node)
      else if (this.starting) reject(new Error('Already starting IPFS'))
      else {
        runInAction(() => (this.starting = true))
        logger.debug('Activating go-ipfs node')
        // TODO: Allow user to change the settings
        const node = ipfsClient('localhost', '5001')
        this.onStarted(node, resolve)
      }
    })
  }

  @action.bound
  stop () {
    return new Promise((resolve, reject) => {
      if (!this.node) resolve()
      else if (this.stopping) reject(new Error('Already stopping IPFS'))
      // Only the embedded node should be stopped
      // and only the embedded node has ".once" method
      else if (this.node.once) {
        runInAction(() => (this.stopping = true))
        logger.info('Stopping embedded ipfs node')
        this.node.once('stop', () => this.onStopped(resolve))
        this.node.stop()
      } else {
        logger.info('Not stopping ipfs node')
      }
    })
  }
}
