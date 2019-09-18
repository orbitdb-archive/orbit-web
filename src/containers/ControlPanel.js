'use strict'

import React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useObserver } from 'mobx-react'
import classNames from 'classnames'

import RootContext from '../context/RootContext'

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

function ControlPanel ({ history }) {
  const { networkStore, uiStore, sessionStore, setAppState } = React.useContext(RootContext)
  const [t] = useTranslation()

  const inputRef = React.useRef()

  const focusInput = React.useCallback(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  React.useLayoutEffect(focusInput)

  const isClosable = history.location ? history.location.pathname !== '/' : true

  const handleClose = React.useCallback(
    force => {
      if (force || isClosable) uiStore.closeControlPanel()
    },
    [isClosable]
  )

  const handleRedirect = React.useCallback(
    url => {
      setAppState({ redirectTo: url })
      handleClose(url !== '/')
    },
    [handleClose]
  )

  const handleJoinChannel = React.useCallback(
    e => {
      e.preventDefault()
      if (!inputRef.current) return
      const channel = inputRef.current.value.trim()
      networkStore.joinChannel(channel).then(() => {
        inputRef.current.value = ''
        handleRedirect(`/channel/${channel}`)
      })
    },
    [handleRedirect]
  )

  const handleCloseChannel = React.useCallback(
    channel => {
      if (uiStore.currentChannelName === channel.channelName) handleRedirect('/')
      networkStore.leaveChannel(channel.channelName)
    },
    [uiStore.currentChannelName]
  )

  function renderJoinChannelInput () {
    return networkStore.isOnline ? (
      <div className='joinChannelInput fadeInAnimation' style={{ animationDuration: '.5s' }}>
        <JoinChannel
          onSubmit={handleJoinChannel}
          autoFocus
          theme={{ ...uiStore.theme }}
          inputRef={inputRef}
        />
      </div>
    ) : !networkStore.starting ? (
      <button
        className='startIpfsButton submitButton'
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

  function renderChannelsList () {
    return (
      <>
        <div
          className={classNames({
            panelHeader: networkStore.channelsAsArray.length > 0,
            hidden: networkStore.channelsAsArray.length === 0
          })}
        >
          {t('controlPanel.channels')}
        </div>

        <div className='openChannels fadeInAnimation' style={{ animationDuration: '.5s' }}>
          <div className='channelsList'>
            {networkStore.channelsAsArray.map(c => (
              <div
                className={classNames('row', {
                  active: uiStore.currentChannelName === c.channelName
                })}
                key={c.channelName}
              >
                <ChannelLink
                  channel={c}
                  theme={{ ...uiStore.theme }}
                  onClick={e => {
                    e.preventDefault()
                    handleRedirect(`/channel/${c.channelName}`)
                  }}
                />
                <span className='closeChannelButton' onClick={() => handleCloseChannel(c)}>
                  {t('controlPanel.closeChannel')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  function renderBottomRow () {
    return (
      <div className='bottomRow'>
        <div
          className='icon flaticon-gear94'
          onClick={() => handleRedirect('/settings')}
          style={{ ...uiStore.theme }}
          key='settingsIcon'
        />
        {/* <div
          className="icon flaticon-sharing7"
          // onClick={onOpenSwarmView}
          style={{ ...uiStore.theme }}
          key="swarmIcon"
        /> */}
        <div
          className='icon flaticon-prohibition35'
          onClick={() => sessionStore.logout()}
          style={{ ...uiStore.theme }}
          key='disconnectIcon'
        />
      </div>
    )
  }

  return useObserver(() =>
    uiStore.isControlPanelOpen && sessionStore.isAuthenticated ? (
      <>
        <div
          className={classNames('ControlPanel slideInAnimation', uiStore.sidePanelPosition, {
            'no-close': !isClosable
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

          <div
            className={classNames('header bounceInAnimation', uiStore.sidePanelPosition)}
            onClick={handleClose}
          >
            <div className='logo'>Orbit</div>
          </div>

          <div className='networkName fadeInAnimation' style={{ animationDuration: '1s' }}>
            {networkStore.networkName}
          </div>

          <div className='username'>{sessionStore.username}</div>

          {renderJoinChannelInput()}
          {renderChannelsList()}
          {renderBottomRow()}
        </div>
        <div
          className={classNames('darkener fadeInAnimation', { 'no-close': !isClosable })}
          style={{ animationDuration: '1s' }}
          onClick={handleClose}
        />
      </>
    ) : null
  )
}

ControlPanel.propTypes = {
  history: PropTypes.object.isRequired
}

export default hot(module)(ControlPanel)
