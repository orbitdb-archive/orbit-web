'use strict'

import React from 'react'
import { NavLink } from 'react-router-dom'
import { Observer } from 'mobx-react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import '../styles/ChannelLink.scss'

function ChannelLink ({ channel, theme, ...navLinkProps }) {
  return (
    <Observer>
      {() => (
        <NavLink
          to={`/channel/${channel.channelName}`}
          key={channel.channelName}
          className={classNames('ChannelLink', {
            hasUnreadMessages: channel.hasUnreadMessages,
            hasMentions: channel.hasMentions
          })}
          style={theme}
          {...navLinkProps}
        >
          #{channel.channelName}
          {channel.hasUnreadMessages ? (
            <span className="unreadMessages">{channel.unreadMessages.length}</span>
          ) : null}
        </NavLink>
      )}
    </Observer>
  )
}

ChannelLink.propTypes = {
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default ChannelLink
