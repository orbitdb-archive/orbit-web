'use strict'

import React, { Suspense, lazy, useContext } from 'react'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { useObserver } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import Spinner from '../components/Spinner'

import '../styles/ChannelView.scss'

const Channel = lazy(() => import(/* webpackChunkName: "Channel" */ '../containers/Channel'))
const MessageUserProfilePanel = lazy(() =>
  import(/* webpackChunkName: "MessageUserProfilePanel" */ '../containers/MessageUserProfilePanel')
)

function ChannelView (props) {
  const { networkStore } = useContext(RootStoreContext)

  return useObserver(() =>
    networkStore.isOnline ? (
      <div className='ChannelView'>
        <Suspense fallback={<Spinner className='spinner suspense-fallback' size='64px' />}>
          {/* Render the profile panel of a user */}
          {/* This is the panel that is shown when a username is clicked in chat  */}
          <MessageUserProfilePanel />

          {/* Render the channel */}
          <Channel channelName={props.match.params.channel} />
        </Suspense>
      </div>
    ) : null
  )
}

ChannelView.propTypes = {
  match: PropTypes.object.isRequired
}

export default hot(module)(ChannelView)
