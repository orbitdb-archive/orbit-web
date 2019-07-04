'use strict'

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'

import MessageRow from '../components/MessageRow'
import MessagesDateSeparator from '../components/MessagesDateSeparator'
import { LoadingOrFirstMessage } from '../components/MessageTypes'

import 'react-virtualized/styles.css'

const rowHeightCache = new CellMeasurerCache({
  defaultHeight: 21,
  fixedWidth: true
})

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
  const [{ scrollTop }, setScroll] = useState({
    scrollTop: 0
  })
  const [{ height: listHeight, width: listWidth }, setListSize] = useState({ height: 0, width: 0 })

  const list = useRef()

  useEffect(checkBottom, [scrollTop])

  // Monitor changes and invalidate CellMeasurerCache if changes occur

  useEffect(() => {
    // Size of the rows changed
    rowHeightCache.clearAll()
    list.current.recomputeRowHeights()
  }, [useLargeMessage, useMonospaceFont])

  useEffect(() => {
    // Size of the whole list changed
    rowHeightCache.clearAll()
    list.current.recomputeRowHeights()
  }, [listHeight, listWidth])

  useEffect(() => {
    // Indexing of the list might have changed
    rowHeightCache.clearAll()
  }, [loading, replicating])

  useEffect(() => {
    // Channel changed
    rowHeightCache.clearAll()
  }, [channelName])

  function checkBottom () {
    // TODO: Check if list actually is scrollable
    if (messages.length < 2) return
    const lastMessageOffset = list.current.getOffsetForRow({
      alignment: 'end',
      index: messages.length - 2
    })
    const scrollAtBottom = scrollTop >= lastMessageOffset
    if ((!scrollAtBottom && atBottom) || (scrollAtBottom && !atBottom)) {
      toggleAtBottom()
    }
  }

  function toggleAtBottom () {
    setAtBottom(!atBottom)
    if (typeof onAtBottomChange === 'function') onAtBottomChange(!atBottom)
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
        cache={rowHeightCache}
        key={key}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          {index === 0 && LoadingOrFirstMessage({ loading, channelName })}

          {addDateSepator && <MessagesDateSeparator date={date} locale={language} />}

          <MessageRow
            message={message}
            useLargeMessage={useLargeMessage}
            useMonospaceFont={useMonospaceFont}
            {...messageRowProps}
          />
        </div>
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
          deferredMeasurementCache={rowHeightCache}
          rowHeight={rowHeightCache.rowHeight}
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
