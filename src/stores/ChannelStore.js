'use strict'

import Reflux from 'reflux'
import AppActions from 'actions/AppActions'
import NetworkActions from 'actions/NetworkActions'
import ChannelActions from 'actions/ChannelActions'
import MessageStore from 'stores/MessageStore'
import AppStateStore from 'stores/AppStateStore'
import Logger from 'logplease'

const logger = Logger.create('ChannelStore', { color: Logger.Colors.Blue })

const ChannelStore = Reflux.createStore({
  listenables: [AppActions, NetworkActions, ChannelActions],
  init: function() {
    this.peers = {}
    this.timers = {}
  },
  onInitialize: function(orbit) {
    this.orbit = orbit
  },
  // TODO: remove this function once nobody's using it anymore
  get: function(channel) {
    return this.orbit.getChannel(channel)
  },
  all: function() {
    return this.orbit ? this.orbit.channels : []
  },
  onDisconnect: function() {
    this.peers = {}
    Object.keys(this.timers).forEach((e) => clearInterval(this.timers[e]))
    this.timers = {}
    this.trigger(this.orbit.channels, this.peers)
  },
  onJoinChannel: function(channel, password) {
    // TODO: check if still needed?
    if(channel === AppStateStore.state.currentChannel)
      return

    logger.debug(`Join channel #${channel}`)
    this.orbit.join(channel)
      .then(c => {
        logger.debug(`Joined channel #${channel}`)
        NetworkActions.joinedChannel(channel)
        setImmediate(() => this.trigger(this.orbit.channels, this.peers))

        this.timers[channel] = setInterval(() => {
          this.orbit._ipfs.pubsub.peers(this.orbit.channels[channel].feed.address.toString())
            .then((peers) => {
              this.peers[channel] = peers
              setImmediate(() => {
                this.trigger(this.orbit.channels, this.peers)
              })
            })
            .catch((e) => console.error(e))
        }, 1000)
      })
  },
  onLeaveChannel: function(channel) {
    logger.debug(`Leave channel #${channel}`)
    this.orbit.leave(channel)
    delete this.peers[channel]
    clearInterval(this.timers[channel])
    this.trigger(this.orbit.channels, this.peers)
  }
})

export default ChannelStore
