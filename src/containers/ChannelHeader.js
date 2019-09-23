'use strict'

import React, { useContext } from 'react'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { useObserver } from 'mobx-react'
import { useTranslation } from 'react-i18next'

import RootContext from '../context/RootContext'

import '../styles/ChannelHeader.scss'

function ChannelHeader ({ match }) {
  const { networkStore, uiStore } = useContext(RootContext)
  const [t] = useTranslation()

  function handleMenuButtonClick (e) {
    e.stopPropagation()
    uiStore.openControlPanel()
  }

  const {
    path,
    params: { channel: currentChannelName }
  } = match

  const overrideName = t(`viewNames.${path.slice(1)}`)

  return useObserver(() => (
    <div className='Header'>
      <div
        className='open-controlpanel icon flaticon-lines18'
        onClick={handleMenuButtonClick}
        style={{ ...uiStore.theme }}
      >
        {networkStore.unreadEntriesCount > 0 ? (
          <span className='unreadMessages'>{networkStore.unreadEntriesCount}</span>
        ) : null}
      </div>
      <div className='currentChannel'>
        {currentChannelName ? `#${currentChannelName}` : overrideName}
      </div>
    </div>
  ))
}

ChannelHeader.propTypes = {
  match: PropTypes.object.isRequired
}

export default hot(module)(ChannelHeader)
