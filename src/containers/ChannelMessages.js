'use strict'

import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useObserver } from 'mobx-react-lite'
import classNames from 'classnames'

import getMousePosition from '../utils/mouse-position'

import RootStoreContext from '../context/RootStoreContext'

import MessageList from '../components/MessageList'

function ChannelMessages ({ channel }) {
  const { sessionStore, uiStore } = useContext(RootStoreContext)
  const [atBottom, setAtBottom] = useState(true)

  function onMessageUserClick (evt, profile, identity) {
    evt.persist()
    evt.stopPropagation()
    uiStore.openUserProfilePanel({ identity, profile }, getMousePosition(evt))
  }

  return useObserver(() => (
    <div
      className={classNames('Messages', {
        'size-normal': !uiStore.useLargeMessage,
        'size-large': uiStore.useLargeMessage,
        'font-normal': !uiStore.useMonospaceFont,
        'font-monospace': uiStore.useMonospaceFont,
        notAtBottom: !atBottom
      })}
    >
      <MessageList
        messages={channel.messages}
        channelName={channel.channelName}
        loading={channel.loading}
        replicating={channel.replicating}
        highlightWords={[sessionStore.username]}
        loadFile={channel.loadFile}
        useLargeMessage={uiStore.useLargeMessage}
        useMonospaceFont={uiStore.useMonospaceFont}
        colorifyUsernames={uiStore.colorifyUsernames}
        language={uiStore.language}
        useEmojis={uiStore.useEmojis}
        emojiSet={uiStore.emojiSet}
        onMessageInView={channel.markEntryAsReadAtIndex}
        onMessageUserClick={onMessageUserClick}
        onAtBottomChange={setAtBottom}
      />
    </div>
  ))
}

ChannelMessages.propTypes = {
  channel: PropTypes.object.isRequired
}

export default ChannelMessages
