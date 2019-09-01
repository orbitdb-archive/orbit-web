'use strict'

import React, { useCallback, useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import debounce from 'lodash.debounce'

import RootStoreContext from '../context/RootStoreContext'

import MessageRow from './MessageRow'
import MessagesDateSeparator from './MessagesDateSeparator'
import { FirstMessage, LoadingMessages, LoadMore } from './MessageTypes'
import DelayRender from './DelayRender'

import { isRectInside } from '../utils/rect'
import { useVisibility, useRefCallback } from '../utils/hooks'

function MessageList ({
  messages,
  channelName,
  loading,
  hasUnreadMessages,
  entryCount,
  loadMore,
  resetOffset,
  ...messageRowProps
}) {
  const { uiStore } = useContext(RootStoreContext)
  const [setListRef, listElement] = useRefCallback()
  const [setTopRef, topElement] = useRefCallback()
  const [setBotRef, botElement] = useRefCallback()

  const [atTop, setAtTop] = useState(false)
  const [atBottom, setAtBottom] = useState(false)

  const topMargin = 20
  const botMargin = 20

  function checkBoundaries () {
    if (!listElement || !topElement || !botElement) return
    const listRect = listElement.getBoundingClientRect()
    const topRect = topElement.getBoundingClientRect()
    const botRect = botElement.getBoundingClientRect()

    const topVisible = isRectInside(listRect, topRect, { topMargin })
    const botVisible = isRectInside(listRect, botRect, { botMargin })

    setAtTop(topVisible)
    setAtBottom(botVisible)

    if (topVisible && botVisible) loadMore()
  }

  useEffect(() => {
    checkBoundaries()
  }, [messages.length])

  useEffect(() => {
    resetOffset()
  }, [channelName])

  const checkBoundariesDebounced = useCallback(debounce(checkBoundaries, 40, { leading: true }), [
    listElement,
    topElement,
    botElement
  ])

  // NOTE: MessageList is reversed by CSS!
  return (
    <React.Fragment>
      <div
        ref={setListRef}
        onScroll={checkBoundariesDebounced}
        className={classNames('MessageList')}
      >
        <span ref={setBotRef} />
        {messages.map((m, index) => (
          <MessageListRow
            key={`message-${m.hash}`}
            parentElement={listElement}
            message={m}
            prevMessage={messages[index + 1]}
            {...messageRowProps}
          />
        ))}
        <span ref={setTopRef} />
        {loading ? (
          <LoadingMessages />
        ) : atTop && messages.length < entryCount ? (
          <LoadMore parentElement={listElement} onActivate={loadMore} />
        ) : (
          <LoadMore parentElement={listElement} onActivate={loadMore} />
          // <FirstMessage channelName={channelName} />
        )}
      </div>
      {!atBottom && hasUnreadMessages ? <div className="unreadIndicator" /> : null}
      <DelayRender visible={loading}>
        <div className="progressBar" style={uiStore.theme} />
      </DelayRender>
    </React.Fragment>
  )
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  channelName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  hasUnreadMessages: PropTypes.bool.isRequired,
  entryCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  resetOffset: PropTypes.func.isRequired
}

function MessageListRow ({
  parentElement,
  message,
  prevMessage,
  language,
  markMessageRead,
  ...rest
}) {
  const [setRef, isVisible] = useVisibility(parentElement)

  // Parse dates so we know if we must add a date separator
  const prevDate = prevMessage && new Date(prevMessage.meta.ts)
  const date = new Date(message.meta.ts)
  // Add separator when this is the first message or the dates between messages differ
  const addDateSepator = date && (!prevDate || (prevDate && date.getDate() !== prevDate.getDate()))

  if (isVisible && !message.read) markMessageRead(message.hash)

  return (
    <div ref={setRef}>
      {addDateSepator && <MessagesDateSeparator date={date} locale={language} />}
      <MessageRow message={message} {...rest} />
    </div>
  )
}

MessageListRow.propTypes = {
  parentElement: PropTypes.instanceOf(Element),
  message: PropTypes.object.isRequired,
  prevMessage: PropTypes.object,
  language: PropTypes.string,
  markMessageRead: PropTypes.func.isRequired
}

export default MessageList
