'use strict'

import React, { Suspense, lazy, useContext } from 'react'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { useObserver } from 'mobx-react'

import RootContext from '../context/RootContext'

import { BigSpinner } from '../components/Spinner'

import '../styles/ChannelView.scss'

const Channel = lazy(() => import(/* webpackChunkName: "Channel" */ '../containers/Channel'))
const MessageUserProfilePanel = lazy(() =>
  import(/* webpackChunkName: "MessageUserProfilePanel" */ '../containers/MessageUserProfilePanel')
)

function ChannelView (props) {
  const { networkStore } = useContext(RootContext)

  return useObserver(() =>
    networkStore.isOnline ? (
      <div className='ChannelView'>
        <Suspense fallback={<BigSpinner />}>
          {/* Render the profile panel of a user */}
          {/* This is the panel that is shown when a username is clicked in chat  */}
          <MessageUserProfilePanel />

          {/* Render the channel */}
          <Channel channelName={props.match.params.channel} />
        </Suspense>
      </div>
    ) : (
      <BigSpinner />
    )
  )
}

ChannelView.propTypes = {
  match: PropTypes.object.isRequired
}

export default hot(module)(ChannelView)
