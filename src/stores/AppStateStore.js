'use strict'

import Reflux from 'reflux'

import AppActions from 'actions/AppActions'
import NetworkActions from 'actions/NetworkActions'
import NotificationActions from 'actions/NotificationActions'

import UserStore from 'stores/UserStore'

import { getFormattedTime } from 'utils/utils.js'
import hasMentions from 'utils/has-mentions'

const AppStateStore = Reflux.createStore({
  listenables: [AppActions, NetworkActions, NotificationActions],
  init: function () {
    this.state = {
      location: null,
      channel: null,
      unreadMessages: {},
      mentions: {},
      hasFocus: true
    }
  },
  onSetLocation: function (location) {
    if (location === this.state.location) return

    this.state.channel = null
    this.state.location = location
    this.trigger(this.state)
  },
  onSetChannel: function (channel) {
    if (channel !== this.state.channel) {
      this.state.channel = channel
      this.state.location = channel ? `#${channel}` : null
      delete this.state.unreadMessages[channel]
      delete this.state.mentions[channel]
      this.trigger(this.state)
    }
  },
  onLeaveChannel: function (channel) {
    if (channel === this.state.channel) this.onSetChannel(null)
  },
  onNewMessage: function (channel, post) {
    if (channel !== this.state.channel || !this.state.hasFocus) {
      if (!this.state.unreadMessages[channel]) {
        this.state.unreadMessages[channel] = 0
      }

      this.state.unreadMessages[channel] += 1

      if (
        post.content &&
        hasMentions(post.content.toLowerCase(), UserStore.user.name.toLowerCase())
      ) {
        this.onMention(channel, post)
      }

      this.trigger(this.state)
    }
  },
  onMention: function (channel, post) {
    if (channel !== this.state.channel || !this.state.hasFocus) {
      if (!this.state.mentions[channel]) this.state.mentions[channel] = 0

      this.state.mentions[channel] += 1

      if (Notification) {
        if (Notification.permission !== 'granted') {
          Notification.requestPermission()
        }

        // Display the notification
        const notification = new Notification(
          post.meta.from.name + ' mentioned you in #' + channel,
          {
            icon: 'images/OrbitLogo_32x32.png',
            body: getFormattedTime(post.meta.ts) + '\n<' + post.meta.from.name + '> ' + post.content
          }
        )

        // Handle click
        notification.onclick = e => {
          e.preventDefault()
          notification.close()
          NetworkActions.joinChannel(channel)
        }
      }

      this.trigger(this.state)
    }
  },
  onWindowLostFocus: function () {
    this.state.hasFocus = false
    this.trigger(this.state)
  },
  onWindowOnFocus: function () {
    this.state.hasFocus = true
    this.trigger(this.state)
  }
})

export default AppStateStore
