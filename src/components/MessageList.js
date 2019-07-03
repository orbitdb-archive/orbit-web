'use strict'

import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import MessageRow from '../components/MessageRow'
import MessagesDateSeparator from '../components/MessagesDateSeparator'
import { FirstMessage, LoadingMessages } from '../components/MessageTypes'

import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'

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
  loading,
  useLargeMessage,
  useMonospaceFont,
  ...messageRowProps
}) {
  const list = useRef()

  // Monitor changes and invalidate CellMeasurerCache if changes occur
  useEffect(refreshRowSizes, [useLargeMessage, useMonospaceFont, messages.length])

  function refreshRowSizes () {
    rowHeightCache.clearAll()
    list.current.forceUpdateGrid()
    list.current.scrollToRow(-1)
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
          {index === 0 &&
            (loading ? <LoadingMessages /> : <FirstMessage channelName={channelName} />)}

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
   * - Show something while loading
   * - Show something if 'messages' is emtpy
   * - If user has scrolled up, do not force scroll to bottom on new messages
   * - Indicate that there are something below (newer messages) when scrolled up
   */
  return (
    <AutoSizer onResize={refreshRowSizes}>
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
  loading: PropTypes.bool,
  useLargeMessage: PropTypes.bool,
  useMonospaceFont: PropTypes.bool
}

export default MessageList
