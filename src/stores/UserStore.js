'use strict'

import Reflux from 'reflux'

import NetworkActions from 'actions/NetworkActions'

import OrbitStore from 'stores/OrbitStore'

import Logger from 'utils/logger'

const logger = new Logger()

const UserStore = Reflux.createStore({
  listenables: [NetworkActions],
  init: function () {
    this.user = null
    OrbitStore.listen(orbit => {
      orbit.events.on('connected', (network, user) => {
        logger.debug(`Connected as ${user}`)
        this._update(user)
      })
    })
  },
  onDisconnect: function () {
    this._update(null)
  },
  _update: function (user) {
    logger.debug(`User updated: ${user}`)
    const oldUser = this.user
    this.user = user

    if (!this.user) logger.debug('Not logged in!')

    this.trigger(this.user, oldUser)
  }
})

export default UserStore
