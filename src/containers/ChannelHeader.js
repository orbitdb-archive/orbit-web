'use strict'

import React, { useContext } from 'react'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { Observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'

import RootStoreContext from '../context/RootStoreContext'

import ChannelLink from './ChannelLink'

import '../styles/ChannelHeader.scss'

function ChannelHeader ({ match }) {
  const { networkStore, uiStore } = useContext(RootStoreContext)
  const [t] = useTranslation()

  function onChannelClick (e) {
    // Stop propagation to Header
    e.stopPropagation()
    // No other actions needed since ChannelLink is doing the rest
  }

  function onHeaderClick (e) {
    uiStore.openControlPanel()
  }

  const {
    path,
    params: { channel: currentChannelName }
  } = match

  const overrideName = t(`viewNames.${path.slice(1)}`)

  return (
    <Observer>
      {() => (
        <div className="Header" onClick={onHeaderClick}>
          <div className="ChannelName">
            <div className="currentChannel">
              {currentChannelName ? `#${currentChannelName}` : overrideName}
            </div>
            {networkStore.channelsAsArray
              .filter(c => c.channelName !== currentChannelName)
              .sort((a, b) => a.channelName.localeCompare(b.channelName))
              .map(c => (
                <ChannelLink
                  key={c.channelName}
                  channel={c}
                  theme={{ ...uiStore.theme }}
                  onClick={onChannelClick}
                />
              ))}
          </div>
        </div>
      )}
    </Observer>
  )
}

ChannelHeader.propTypes = {
  match: PropTypes.object.isRequired
}

export default hot(module)(ChannelHeader)
