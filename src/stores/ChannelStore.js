'use strict'

import Reflux from 'reflux'
import Logger from 'logplease'

import AppActions from 'actions/AppActions'
import NetworkActions from 'actions/NetworkActions'
import ChannelActions from 'actions/ChannelActions'

import AppStateStore from 'stores/AppStateStore'

const logger = Logger.create('ChannelStore', { color: Logger.Colors.Blue })

const ChannelStore = Reflux.createStore({
  listenables: [AppActions, NetworkActions, ChannelActions],
  init: function () {
    this.peers = {}
    this.timers = {}
  },
  onInitialize: function (orbit) {
    this.orbit = orbit
  },
  // TODO: remove this function once nobody's using it anymore
  get: function (channel) {
    return this.orbit.getChannel(channel)
  },
  all: function () {
    return this.orbit ? this.orbit.channels : []
  },
  onDisconnect: function () {
    this.peers = {}
    Object.keys(this.timers).forEach(e => clearInterval(this.timers[e]))
    this.timers = {}
    this.trigger(this.orbit.channels, this.peers)
  },
  onJoinChannel: async function (channel) {
    // TODO: check if still needed?
    if (channel === AppStateStore.state.currentChannel) return

    logger.debug(`Join channel #${channel}`)

    await this.orbit.join(channel)

    logger.debug(`Joined channel #${channel}`)
    NetworkActions.joinedChannel(channel)

    setImmediate(() => this.trigger(this.orbit.channels, this.peers))

    if (this.timers[channel]) clearInterval(this.timers[channel])

    this.timers[channel] = setInterval(async () => {
      try {
        const peers = await this.orbit._ipfs.pubsub.peers(
          this.orbit.channels[channel].feed.address.toString()
        )
        this.peers[channel] = peers
        setImmediate(() => {
          this.trigger(this.orbit.channels, this.peers)
        })
      } catch (err) {
        console.error(err)
      }
    }, 1000)
  },
  onLeaveChannel: function (channel) {
    logger.debug(`Leave channel #${channel}`)
    this.orbit.leave(channel)
    delete this.peers[channel]
    clearInterval(this.timers[channel])
    this.trigger(this.orbit.channels, this.peers)
  }
})

export default ChannelStore
