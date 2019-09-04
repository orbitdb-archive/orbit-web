'use strict'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import debounce from 'lodash.debounce'

import MessageRow from './MessageRow'
import MessagesDateSeparator from './MessagesDateSeparator'
import { FirstMessage, LoadingMessages, LoadMore } from './MessageTypes'
import DelayRender from './DelayRender'

import { useVisibility } from '../utils/hooks'

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
  const listRef = useRef()

  const [atTop, setAtTop] = useState(false)
  const [atBottom, setAtBottom] = useState(true)

  const topMargin = 20
  const botMargin = 20

  function checkBoundaries () {
    if (!listRef.current) return

    const el = listRef.current
    const topVisible = el.scrollTop <= 0 + topMargin
    const botVisible = el.scrollTop + el.clientHeight >= el.scrollHeight - botMargin

    setAtTop(topVisible)
    setAtBottom(botVisible)
  }

  function stayAtBottom () {
    if (!listRef.current) return
    if (atBottom) listRef.current.scrollTop = listRef.current.scrollHeight
  }

  useEffect(() => () => resetOffset(), [])
  useLayoutEffect(checkBoundaries, [listRef])
  useLayoutEffect(stayAtBottom, [atBottom, listRef, entryCount])

  const checkBoundariesDebounced = useCallback(debounce(checkBoundaries, 40, { leading: true }), [
    listRef
  ])

  return (
    <React.Fragment>
      <div ref={listRef} onScroll={checkBoundariesDebounced} className={classNames('MessageList')}>
        {loading ? (
          <LoadingMessages />
        ) : atTop && messages.length < entryCount ? (
          <LoadMore parentElement={listRef.current} onActivate={loadMore} />
        ) : (
          <FirstMessage channelName={channelName} />
        )}
        {messages.map((m, index) => (
          <MessageListRow
            key={`message-${m.hash}`}
            parentElement={listRef.current}
            message={m}
            prevMessage={messages[index - 1]}
            {...messageRowProps}
          />
        ))}
      </div>
      {!atBottom && hasUnreadMessages ? <div className="unreadIndicator" /> : null}
      <DelayRender visible={loading}>
        <div className="progressBar" />
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
