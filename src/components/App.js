'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import AppActions from 'actions/AppActions'
import UIActions from 'actions/UIActions'
import NetworkActions from 'actions/NetworkActions'
import IpfsDaemonActions from 'actions/IpfsDaemonActions'

import OrbitStore from 'stores/OrbitStore'
import AppStateStore from 'stores/AppStateStore'
import UserStore from 'stores/UserStore'
import NetworkStore from 'stores/NetworkStore'
import ChannelStore from 'stores/ChannelStore'
import SettingsStore from 'stores/SettingsStore'

import ChannelsPanel from 'components/ChannelsPanel'
import ChannelView from 'components/ChannelView'
import SettingsView from 'components/SettingsView'
import IpfsSettingsView from 'components/IpfsSettingsView'
import SwarmView from 'components/SwarmView'
import LoginView from 'components/LoginView'
import LoadingView from 'components/LoadingView'
import Header from 'components/Header'
import Themes from 'app/Themes'

import Logger from 'utils/logger'

import 'normalize.css'
import 'styles/Main.scss'
import 'styles/App.scss'
import 'styles/Scrollbars.scss'
import 'highlight.js/styles/atom-one-dark.css'
// Agate, Atom One Dark, Github, Monokai, Monokai Sublime, Vs, Xcode

const logger = new Logger()

const views = {
  Index: '/',
  Settings: '/settings',
  IpfsSettings: '/ipfs-settings',
  Swarm: '/swarm',
  Connect: '/connect',
  Channel: '/channel/',
  Loading: '/loading'
}

const ipcRenderer = window.ipcRenderer

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = this.getInitialState()
  }

  getInitialState () {
    return {
      panelOpen: false,
      leftSidePanel: false,
      joiningToChannel: null,
      requirePassword: false,
      theme: null,
      networkName: 'Unknown Network'
    }
  }

  componentDidMount () {
    if (!UserStore.user) {
      this._reset()
      AppActions.setLocation('Connect')
    }

    document.title = 'Orbit'

    NetworkActions.joinChannel.listen(this.onJoinChannel.bind(this))
    NetworkActions.joinedChannel.listen(this.onJoinedChannel.bind(this))
    NetworkActions.joinChannelError.listen(this.onJoinChannelError.bind(this))
    NetworkActions.leaveChannel.listen(this.onLeaveChannel.bind(this))
    AppActions.login.listen(this.onLogin.bind(this))

    NetworkStore.listen(this.onNetworkUpdated.bind(this))
    UserStore.listen(this.onUserUpdated.bind(this))
    AppStateStore.listen(this.onAppStateUpdated.bind(this))
    SettingsStore.listen(this.onSettingsUpdated.bind(this))
  }

  _reset () {
    if (ipcRenderer) ipcRenderer.send('disconnected')
    this.setState(this.getInitialState())
  }

  _makeChannelsKey (username, networkName) {
    return 'orbit.app.' + username + '.' + networkName + '.channels'
  }

  _getSavedChannels (networkName, username) {
    const channelsKey = this._makeChannelsKey(username, networkName)
    let channels = JSON.parse(localStorage.getItem(channelsKey))

    // If we have a first time user (nothing saved in local storage),
    // add #ipfs to their saved channel list in order to join it
    // automatically on first login
    if (!channels) {
      channels = [{ name: 'ipfs' }]
    }

    return channels
  }

  _saveChannels (networkName, username, channels) {
    const channelsKey = this._makeChannelsKey(username, networkName)
    localStorage.setItem(channelsKey, JSON.stringify(channels))
  }

  _showConnectView () {
    AppActions.setLocation('Connect')
  }

  _parseDocumentTitle (newState) {
    const { hasFocus, unreadMessages, channel, location } = newState

    let prefix = ''
    let suffix = ''

    if (!hasFocus && unreadMessages[channel] > 0) {
      suffix = ` (${unreadMessages[channel]})`
    }

    const channelsWithNewMessages = Object.keys(unreadMessages)

    if (
      channelsWithNewMessages.length > 1 ||
      (channelsWithNewMessages.length === 1 && !channelsWithNewMessages.includes(channel))
    ) {
      prefix = '* '
    }

    if (Object.keys(newState.mentions).length > 0) {
      prefix = '! '
    }

    if (channel) {
      return `${prefix}${location}${suffix}`
    }

    return `${prefix}Orbit`
  }

  onAppStateUpdated (newState) {
    document.title = this._parseDocumentTitle(newState)

    const { channel, location } = newState

    if (channel) {
      this.goToLocation(channel, views.Channel + encodeURIComponent(channel))
    } else {
      this.goToLocation(location, views[location])
    }
  }

  onSettingsUpdated (settings) {
    this.setState({
      theme: Themes[settings.theme] || null,
      leftSidePanel: settings.leftSidePanel
    })
  }

  onNetworkUpdated (network) {
    logger.debug('Network updated')

    if (!network) {
      this._reset()
      AppActions.setLocation('Connect')
    } else {
      this.setState({ networkName: network.name }, () => {
        const { networkName } = this.state
        const { user } = UserStore
        const channels = this._getSavedChannels(networkName, user.name)
        channels.forEach(channel => NetworkActions.joinChannel(channel.name, ''))
      })
    }
  }

  onUserUpdated (newUser, oldUser) {
    if (!newUser) {
      AppActions.setLocation('Connect')
      return
    }

    if (newUser === oldUser) return

    if (!this.state.panelOpen) this.openPanel()

    AppActions.setLocation(null)
  }

  onLogin (username) {
    IpfsDaemonActions.start(username)
    OrbitStore.listen(orbit => {
      logger.debug('Connect as ' + username)
      orbit.connect(username)
    })
  }

  onJoinChannel (channelName, password) {
    if (channelName === AppStateStore.state.channel) {
      this.closePanel()
    }
  }

  onJoinChannelError (channel, err) {
    this.setState({
      joiningToChannel: channel,
      requirePassword: true,
      panelOpen: true
    })
  }

  onJoinedChannel (channel) {
    const { networkName } = this.state
    const { user } = UserStore

    this.closePanel()

    document.title = `#${channel}`
    logger.debug('Set title: ' + document.title)

    AppActions.setChannel(channel)

    const channels = this._getSavedChannels(networkName, user.name)

    if (!channels.find(e => e.name === channel)) {
      channels.push({ name: channel })
      this._saveChannels(networkName, user.name, channels)
    }
  }

  onLeaveChannel (channel) {
    const { networkName } = this.state
    const { user } = UserStore

    const channelsKey = this._makeChannelsKey(user.name, networkName)
    const savedChannels = this._getSavedChannels(networkName, user.name)
    const remainingChannels = savedChannels.filter(c => c.name !== channel)

    if (remainingChannels.length === 0) {
      localStorage.removeItem(channelsKey)
    } else {
      this._saveChannels(networkName, user.name, remainingChannels)
    }
  }

  onDaemonDisconnected () {
    AppActions.setLocation('Connect')
  }

  openSettings () {
    this.closePanel()
    AppActions.setLocation('Settings')
  }

  openSwarmView () {
    this.closePanel()
    AppActions.setLocation('Swarm')
  }

  closePanel () {
    this.setState({ panelOpen: false })
    UIActions.onPanelClosed()
  }

  openPanel () {
    this.setState({ panelOpen: true })
  }

  disconnect () {
    logger.debug('app disconnect')
    this.closePanel()
    NetworkActions.disconnect()
    AppActions.setLocation('Connect')
  }

  goToLocation (name, url) {
    this.context.router.history.push(url || '/')
  }

  render () {
    const { requirePassword, theme, leftSidePanel, networkName, joiningToChannel } = this.state
    const { location } = AppStateStore.state
    const { user } = UserStore

    const noHeader = ['Connect', 'IpfsSettings', 'Loading']

    const header =
      location && noHeader.indexOf(location) < 0 ? (
        <Header
          onClick={this.openPanel.bind(this)}
          title={location}
          channels={ChannelStore.all()}
          theme={this.state.theme}
        />
      ) : null

    const panel = this.state.panelOpen ? (
      <ChannelsPanel
        onClose={this.closePanel.bind(this)}
        onOpenSwarmView={this.openSwarmView.bind(this)}
        onOpenSettings={this.openSettings.bind(this)}
        onDisconnect={this.disconnect.bind(this)}
        channel={location}
        username={user ? user.name : ''}
        requirePassword={requirePassword}
        theme={theme}
        left={leftSidePanel}
        networkName={networkName}
        joiningToChannel={joiningToChannel}
      />
    ) : null

    return (
      <div className="App view">
        {panel}
        {header}
        <Switch>
          <Route path="/channel/:channel" component={ChannelView} />
          <Route path="/settings" component={SettingsView} />
          <Route path="/ipfs-settings" component={IpfsSettingsView} />
          <Route path="/swarm" component={SwarmView} />
          <Route path="/connect" component={LoginView} />
          <Route path="/loading" component={LoadingView} />
        </Switch>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element
}

App.contextTypes = {
  router: PropTypes.object
}

export default hot(module)(App)
