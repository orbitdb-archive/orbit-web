'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import RootStoreContext from '../context/RootStoreContext'

import BackgroundAnimation from '../components/BackgroundAnimation'
import JoinChannel from '../components/JoinChannel'
import Spinner from '../components/Spinner'

import ChannelLink from './ChannelLink'

import '../styles/flaticon.css'
import '../styles/ControlPanel.scss'

setConfig({
  pureSFC: true,
  pureRender: true
})

class ControlPanel extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  state = { redirectTo: null }

  constructor (props) {
    super(props)
    this.onClose = this.onClose.bind(this)
    this.onJoinChannel = this.onJoinChannel.bind(this)
    this.redirect = this.redirect.bind(this)
    this.isClosable = this.isClosable.bind(this)
    this.renderJoinChannelInput = this.renderJoinChannelInput.bind(this)
    this.renderChannelsList = this.renderChannelsList.bind(this)
    this.renderBottomRow = this.renderBottomRow.bind(this)
  }

  componentDidMount () {
    this.focusJoinChannelInput()
  }

  componentDidUpdate () {
    this.focusJoinChannelInput()
  }

  focusJoinChannelInput () {
    if (this.joinChannelInput) this.joinChannelInput.focus()
  }

  onClose () {
    if (!this.isClosable()) return
    this.context.uiStore.closeControlPanel()
  }

  onJoinChannel (e) {
    e.preventDefault()
    if (!this.joinChannelInput) return
    const { networkStore } = this.context
    const channel = this.joinChannelInput.value.trim()
    networkStore.joinChannel(channel).then(() => {
      this.joinChannelInput.value = ''
      this.redirect(`/channel/${channel}`)
    })
  }

  isClosable () {
    const {
      history: {
        location: { pathname }
      }
    } = this.props

    return pathname !== '/'
  }

  redirect (to) {
    this.setState({ redirectTo: to }, () => {
      // Reset the state so we will not continue to redirect after one redirect
      // since this component is always mounted
      this.setState({ redirectTo: null }, () => {
        // Remember to close the panel
        this.onClose()
      })
    })
  }

  renderJoinChannelInput (transitionProps) {
    const { networkStore, uiStore } = this.context
    const { t } = this.props

    return networkStore.isOnline ? (
      <CSSTransitionGroup
        {...transitionProps}
        transitionName="joinChannelAnimation"
        className="joinChannelInput"
      >
        <JoinChannel
          onSubmit={this.onJoinChannel}
          autoFocus
          // requirePassword={this.state.requirePassword}
          theme={{ ...uiStore.theme }}
          inputRef={el => (this.joinChannelInput = el)}
        />
      </CSSTransitionGroup>
    ) : !networkStore.starting ? (
      <button
        className="startIpfsButton submitButton"
        style={{ ...uiStore.theme }}
        onClick={() => networkStore.start()}
      >
        {t('controlPanel.startJsIpfs')}
      </button>
    ) : (
      <div style={{ position: 'relative' }}>
        <Spinner />
      </div>
    )
  }

  renderChannelsList (channels) {
    const { networkStore, uiStore } = this.context
    const { t } = this.props

    return (
      <div className="RecentChannelsView">
        <div className="RecentChannels">
          {channels.map(c => (
            <div
              className={classNames('row link', {
                active: uiStore.currentChannelName === c.channelName
              })}
              key={c.channelName}
            >
              <ChannelLink
                channel={c}
                theme={{ ...uiStore.theme }}
                onClick={e => {
                  e.preventDefault()
                  this.redirect(`/channel/${c.channelName}`)
                }}
              />
              <span
                className="closeChannelButton"
                onClick={() => {
                  if (uiStore.currentChannelName === c.channelName) this.redirect('/')
                  networkStore.leaveChannel(c.channelName)
                }}
              >
                {t('controlPanel.closeChannel')}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderBottomRow () {
    const { sessionStore, uiStore } = this.context

    return (
      <div className="bottomRow">
        <div
          className="icon flaticon-gear94"
          onClick={() => this.redirect('/settings')}
          style={{ ...uiStore.theme }}
          key="settingsIcon"
        />
        <div
          className="icon flaticon-sharing7"
          // onClick={this.props.onOpenSwarmView}
          style={{ ...uiStore.theme }}
          key="swarmIcon"
        />
        <div
          className="icon flaticon-prohibition35"
          onClick={() => sessionStore.logout()}
          style={{ ...uiStore.theme }}
          key="disconnectIcon"
        />
      </div>
    )
  }

  render () {
    const { redirectTo } = this.state
    if (redirectTo) return <Redirect to={redirectTo} />

    const { networkStore, sessionStore, uiStore } = this.context

    if (!uiStore.isControlPanelOpen) return null

    const { t } = this.props

    const leftSide = uiStore.sidePanelPosition === 'left'

    const transitionProps = {
      component: 'div',
      transitionAppear: true,
      transitionAppearTimeout: 5000,
      transitionEnterTimeout: 5000,
      transitionLeaveTimeout: 5000
    }

    const channels = networkStore.channelsAsArray.sort(({ channelName: a }, { channelName: b }) =>
      a.localeCompare(b)
    )

    return (
      <React.Fragment>
        <CSSTransitionGroup
          {...transitionProps}
          transitionName={leftSide ? 'openPanelAnimationLeft' : 'openPanelAnimationRight'}
        >
          <div
            className={classNames('ControlPanel', {
              left: leftSide,
              right: !leftSide,
              'no-close': !this.isClosable()
            })}
          >
            <div style={{ opacity: 0.8, zIndex: -1 }}>
              <BackgroundAnimation
                size={320}
                startY={58}
                theme={{ ...uiStore.theme }}
                style={{ alignItems: 'flex-start' }}
              />
            </div>
            <CSSTransitionGroup
              {...transitionProps}
              transitionName={leftSide ? 'panelHeaderAnimationLeft' : 'panelHeaderAnimationRight'}
            >
              <div className="header" onClick={this.onClose}>
                <div className="logo">Orbit</div>
              </div>
            </CSSTransitionGroup>

            <CSSTransitionGroup {...transitionProps} transitionName="networkNameAnimation">
              <div className="networkName">
                <div className="text">{networkStore.networkName}</div>
              </div>
            </CSSTransitionGroup>

            <div className="username">{sessionStore.username}</div>

            {this.renderJoinChannelInput(transitionProps)}

            <div
              className={classNames({
                panelHeader: channels.length > 0,
                hidden: channels.length === 0
              })}
            >
              {t('controlPanel.channels')}
            </div>

            <CSSTransitionGroup
              {...transitionProps}
              transitionName="joinChannelAnimation"
              className="openChannels"
            >
              {this.renderChannelsList(channels)}
            </CSSTransitionGroup>

            {this.renderBottomRow()}
          </div>
        </CSSTransitionGroup>
        <CSSTransitionGroup
          {...transitionProps}
          transitionName="darkenerAnimation"
          className={classNames('darkener', { 'no-close': !this.isClosable() })}
          onClick={this.onClose}
        />
      </React.Fragment>
    )
  }
}

export default hot(module)(withTranslation()(observer(ControlPanel)))
