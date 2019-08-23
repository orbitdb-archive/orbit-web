'use strict'

import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'
import classNames from 'classnames'
import debounce from 'lodash.debounce'

import Suspense from '../components/Suspense'

import MessageRow from '../components/MessageRow'
import MessagesDateSeparator from '../components/MessagesDateSeparator'
import { LoadingOrFirstMessage } from '../components/MessageTypes'

import 'react-virtualized/styles.css'

function MessageList ({
  messages,
  channelName,
  language,
  markMessageRead,
  loading,
  replicating,
  hasUnreadMessages,
  useLargeMessage,
  useMonospaceFont,
  ...messageRowProps
}) {
  const [atBottom, setAtBottom] = useState(true)
  const [listWidth, setListWidth] = useState(0)
  const [openFilepreviews, setOpenFilepreviews] = useState([])
  const [lastOpenedPreviewIndex, setLastOpenedPreviewIndex] = useState(null)

  const list = useRef()

  const rowHeightCache = useMemo(
    () =>
      new CellMeasurerCache({
        defaultHeight: useLargeMessage ? 46 : 20,
        fixedWidth: true
      }),
    [useLargeMessage, channelName]
  )

  const holdBottom = useCallback(
    _atBottom => {
      if (list.current && _atBottom) list.current.scrollToRow(-1)
    },
    [list.current]
  )

  const refreshListSize = useCallback(
    debounce(
      _atBottom => {
        rowHeightCache.clearAll()
        if (list.current) {
          list.current.measureAllRows()
          list.current.forceUpdateGrid()
        }
        // Holds bottom when list indexing or size has changed
        holdBottom(_atBottom)
      },
      17,
      { maxWait: 1000 }
    ),
    [holdBottom, rowHeightCache, list.current]
  )

  function onListSizeChange () {
    if (messages.length === 0) {
      if (!atBottom) setAtBottom(true)
      return
    }
    refreshListSize(atBottom)
    holdBottom(atBottom) // Holds bottom when new messages are rendered
    setTimeout(() => holdBottom(atBottom), 0) // Holds bottom when entering a channel
  }

  useEffect(onListSizeChange, [
    useLargeMessage,
    useMonospaceFont,
    loading,
    replicating,
    messages.length
  ])

  function onRowsRendered ({ stopIndex }) {
    checkBottom({ stopIndex })
  }

  function onFilePreviewLoaded () {
    if (lastOpenedPreviewIndex) {
      if (list.current) list.current.scrollToRow(lastOpenedPreviewIndex)
      setLastOpenedPreviewIndex(null)
    }
  }

  function checkBottom ({ stopIndex }) {
    const scrollAtBottom = stopIndex === messages.length - 1
    if (
      !(loading || replicating) &&
      ((!scrollAtBottom && atBottom) || (scrollAtBottom && !atBottom))
    ) {
      setAtBottom(!atBottom)
    }
  }

  function toggleFilepreview (messageIndex, messageHash) {
    const newArr = [...openFilepreviews]
    const idx = newArr.indexOf(messageHash)
    if (idx > -1) {
      // Close
      newArr.splice(idx, 1)
    } else {
      // Open
      newArr.push(messageHash)
      setLastOpenedPreviewIndex(messageIndex)
    }
    setOpenFilepreviews(newArr)
  }

  function rowRenderer ({ index, key, isVisible, style, parent }) {
    // Parse dates so we know if we must add a date separator
    const message = messages[index]
    const prevMessage = messages[index - 1]
    const prevDate = prevMessage && new Date(prevMessage.meta.ts)
    const date = new Date(message.meta.ts)
    // Add separator when this is the first message or the dates between messages differ
    const addDateSepator =
      date && (!prevDate || (prevDate && date.getDate() !== prevDate.getDate()))

    if (isVisible && !message.read) markMessageRead(message.hash)

    return (
      <CellMeasurer
        cache={rowHeightCache}
        key={key}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
        width={listWidth}
      >
        {({ measure }) => (
          <div style={style}>
            {index === 0 && LoadingOrFirstMessage({ loading, channelName })}
            {addDateSepator && <MessagesDateSeparator date={date} locale={language} />}
            <MessageRow
              message={message}
              useLargeMessage={useLargeMessage}
              useMonospaceFont={useMonospaceFont}
              onSizeUpdate={measure}
              filepreviewOpen={openFilepreviews.indexOf(message.hash) > -1}
              toggleFilepreview={toggleFilepreview.bind(null, index)}
              onFilePreviewLoaded={() => {
                measure()
                onFilePreviewLoaded()
              }}
              {...messageRowProps}
            />
          </div>
        )}
      </CellMeasurer>
    )
  }

  rowRenderer.propTypes = {
    index: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    parent: PropTypes.node.isRequired
  }

  return (
    <AutoSizer onResize={onListSizeChange}>
      {({ height, width }) => {
        if (width !== listWidth) setListWidth(width)
        return (
          <Fragment>
            <List
              className="MessageList"
              ref={list}
              width={width}
              height={height}
              rowCount={messages.length}
              deferredMeasurementCache={rowHeightCache}
              rowHeight={rowHeightCache.rowHeight}
              rowRenderer={rowRenderer}
              onRowsRendered={onRowsRendered}
              noRowsRenderer={LoadingOrFirstMessage.bind(null, { loading, channelName })}
            />
            <Suspense
              key={`status-indicator-${messages.length}`}
              fallback={<div className="progressBar" />}
              delay={500}
              loading={loading || replicating}
              passThrough={true}
            >
              {!atBottom && hasUnreadMessages ? <div className="unreadIndicator" /> : null}
            </Suspense>
          </Fragment>
        )
      }}
    </AutoSizer>
  )
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  channelName: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  markMessageRead: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  replicating: PropTypes.bool,
  hasUnreadMessages: PropTypes.bool,
  useLargeMessage: PropTypes.bool,
  useMonospaceFont: PropTypes.bool
}

export default MessageList
