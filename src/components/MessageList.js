'use strict'

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'

import MessageRow from '../components/MessageRow'
import MessagesDateSeparator from '../components/MessagesDateSeparator'
import { LoadingOrFirstMessage } from '../components/MessageTypes'

import 'react-virtualized/styles.css'

function MessageList ({
  messages,
  channelName,
  language,
  onMessageInView,
  onAtBottomChange,
  loading,
  replicating,
  useLargeMessage,
  useMonospaceFont,
  ...messageRowProps
}) {
  const [atBottom, setAtBottom] = useState(true)
  const [{ clientHeight, scrollHeight, scrollTop }, setScroll] = useState({
    clientHeight: 0,
    scrollHeight: 0,
    scrollTop: 0
  })
  const [{ height: listHeight, width: listWidth }, setListSize] = useState({ height: 0, width: 0 })

  const list = useRef()

  const rowHeightCache = useRef(
    new CellMeasurerCache({
      defaultHeight: 21,
      fixedWidth: true
    })
  )

  useEffect(checkBottom, [scrollTop, listHeight, listWidth])

  // Monitor changes and invalidate CellMeasurerCache if changes occur

  useEffect(() => {
    // Size of the rows changed
    rowHeightCache.current.clearAll()
    list.current.recomputeRowHeights()
  }, [useLargeMessage, useMonospaceFont])

  useEffect(() => {
    // Size of the whole list changed
    rowHeightCache.current.clearAll()
    list.current.recomputeRowHeights()
  }, [listHeight, listWidth])

  useEffect(() => {
    // Indexing of the list might have changed
    rowHeightCache.current.clearAll()
  }, [loading, replicating])

  useEffect(() => {
    // Channel changed
    rowHeightCache.current.clearAll()
  }, [channelName])

  function checkBottom () {
    const scrollable = scrollHeight > clientHeight
    if (!scrollable || messages.length < 2) {
      setAtBottom(true)
      if (typeof onAtBottomChange === 'function') onAtBottomChange(true)
      return
    }
    const lastMessageOffset = list.current.getOffsetForRow({
      alignment: 'end',
      index: messages.length - 2
    })
    const scrollAtBottom = scrollTop >= lastMessageOffset
    if ((!scrollAtBottom && atBottom) || (scrollAtBottom && !atBottom)) {
      setAtBottom(!atBottom)
      if (typeof onAtBottomChange === 'function') onAtBottomChange(!atBottom)
    }
  }

  function rowRenderer ({ index, key, isVisible, style, parent }) {
    if (isVisible && typeof onMessageInView === 'function') onMessageInView(index)

    // Parse dates so we know if we must add a date separator
    const message = messages[index]
    const prevMessage = messages[index - 1]
    const prevDate = prevMessage && new Date(prevMessage.meta.ts)
    const date = prevDate && new Date(message.meta.ts)
    const addDateSepator = date && prevDate && date.getDate() !== prevDate.getDate()

    return (
      <CellMeasurer
        cache={rowHeightCache.current}
        key={key}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
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

  /*
   * TODO:
   * - List needs to be at the bottom of the screen
   * - If user has scrolled up, do not force scroll to bottom on new messages
   */
  return (
    <AutoSizer onResize={setListSize}>
      {({ height, width }) => (
        <List
          ref={list}
          width={width}
          height={height}
          rowCount={messages.length}
          deferredMeasurementCache={rowHeightCache.current}
          rowHeight={rowHeightCache.current.rowHeight}
          rowRenderer={rowRenderer}
          scrollToIndex={messages.length - 1}
          noRowsRenderer={LoadingOrFirstMessage.bind(null, { loading, channelName })}
          onScroll={setScroll}
        />
      )}
    </AutoSizer>
  )
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  channelName: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  onMessageInView: PropTypes.func.isRequired,
  onAtBottomChange: PropTypes.func,
  loading: PropTypes.bool,
  replicating: PropTypes.bool,
  useLargeMessage: PropTypes.bool,
  useMonospaceFont: PropTypes.bool
}

export default MessageList
