'use strict'

import React, { useContext } from 'react'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { Observer } from 'mobx-react'
import LoadAsync from '../components/Loadable'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/ChannelView.scss'

const Channel = LoadAsync({
  loader: () => import(/* webpackChunkName: "Channel" */ '../containers/Channel')
})
const MessageUserProfilePanel = LoadAsync({
  loader: () =>
    import(/* webpackChunkName: "MessageUserProfilePanel" */ '../containers/MessageUserProfilePanel')
})

function ChannelView (props) {
  const { networkStore } = useContext(RootStoreContext)

  return (
    <Observer>
      {() =>
        networkStore.isOnline ? (
          <div className="ChannelView">
            {/* Render the profile panel of a user */}
            {/* This is the panel that is shown when a username is clicked in chat  */}
            <MessageUserProfilePanel />

            {/* Render the channel */}
            <Channel channelName={props.match.params.channel} />
          </div>
        ) : null
      }
    </Observer>
  )
}

ChannelView.propTypes = {
  match: PropTypes.object.isRequired
}

export default hot(module)(ChannelView)
