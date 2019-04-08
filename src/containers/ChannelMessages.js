'use strict'

import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Observer } from 'mobx-react'
import classNames from 'classnames'
import { useInView } from 'react-intersection-observer'

import getMousePosition from '../utils/mouse-position'
import { debounce } from '../utils/throttle'

import RootStoreContext from '../context/RootStoreContext'

import MessageList from '../components/MessageList'
import { FirstMessage } from '../components/MessageTypes'

function ChannelMessages ({ channel }) {
  const messagesEl = useRef()
  const { sessionStore, uiStore } = useContext(RootStoreContext)
  const [atBottom, setAtBottom] = useState(true)
  const [topRef, topInView] = useInView({ root: messagesEl.current })
  const [bottomRef, bottomInView] = useInView({ root: messagesEl.current, rootMargin: '50px' })

  const debounceOnScroll = debounce(onScroll, 100, true)

  // When top in view
  useEffect(onTopInteract, [topInView])

  // When bottom in view
  useEffect(onBottomInteract, [bottomInView])

  // Handle scroll and touch events
  useEffect(() => {
    document.addEventListener('wheel', debounceOnScroll, { passive: true })
    document.addEventListener('touchmove', debounceOnScroll, { passive: true })
    return () => {
      document.removeEventListener('wheel', debounceOnScroll)
      document.removeEventListener('touchmove', debounceOnScroll)
    }
  })

  function updateViewPosition () {
    // Prevent calls in rendering edge cases
    if (!messagesEl.current) return

    // Prevent successive unnecessary calls
    if (channel.loadingHistory) return

    // Scroll to bottom of messages element if we were at the bottom
    if (atBottom) messagesEl.current.scrollTop = messagesEl.current.scrollHeight
  }

  function onScroll (e) {
    if (e.deltaY >= 0) return
    onTopInteract()
  }

  function onTopInteract () {
    if (channel.loadingHistory) return
    if (topInView) channel.loadMore()
  }

  function onBottomInteract () {
    setAtBottom(bottomInView)
  }

  function onMessageUserClick (evt, profile, identity) {
    evt.persist()
    evt.stopPropagation()
    uiStore.openUserProfilePanel({ identity, profile }, getMousePosition(evt))
  }

  return (
    <Observer>
      {() => (
        <div
          className={classNames('Messages', {
            'size-normal': !uiStore.useLargeMessage,
            'size-large': uiStore.useLargeMessage,
            'font-normal': !uiStore.useMonospaceFont,
            'font-monospace': uiStore.useMonospaceFont,
            hasNewerMessages: !atBottom
          })}
          ref={messagesEl}
        >
          <span className="messagesTop" ref={topRef} />
          <FirstMessage
            channelName={channel.channelName}
            loading={channel.loadingHistory}
            hasMoreHistory={channel.hasMoreHistory}
            onClick={onTopInteract}
          />
          <MessageList
            messages={channel.messages}
            highlightWords={[sessionStore.username]}
            loadFile={channel.loadFile}
            useLargeMessage={uiStore.useLargeMessage}
            useMonospaceFont={uiStore.useMonospaceFont}
            colorifyUsernames={uiStore.colorifyUsernames}
            language={uiStore.language}
            useEmojis={uiStore.useEmojis}
            emojiSet={uiStore.emojiSet}
            onMessageInView={channel.markMessageAsRead}
            messageInViewRoot={messagesEl.current}
            onMessageUserClick={onMessageUserClick}
            onMessagesChange={updateViewPosition}
          />
          <span className="messagesBottom" ref={bottomRef} />
        </div>
      )}
    </Observer>
  )
}

ChannelMessages.propTypes = {
  channel: PropTypes.object.isRequired
}

export default ChannelMessages
