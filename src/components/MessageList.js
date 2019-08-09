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
  const [{ height: listHeight, width: listWidth }, setListSize] = useState({ height: 0, width: 0 })
  const [openFilepreviews, setOpenFilepreviews] = useState([])
  const [lastOpenedPreviewIndex, setLastOpenedPreviewIndex] = useState(null)

  const list = useRef()

  const rowHeightCache = useRef(
    new CellMeasurerCache({
      defaultHeight: 21,
      fixedWidth: true
    })
  )

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
    setTimeout(() => {
      // Scroll to bottom
      list.current.scrollToRow(messages.length - 1)
    }, 0)
  }, [channelName])

  useEffect(() => {
    if (atBottom) list.current.scrollToRow(messages.length - 1)
  }, [messages.length])

  function checkBottom ({ stopIndex }) {
    const scrollAtBottom = stopIndex === messages.length - 1
    if ((!scrollAtBottom && atBottom) || (scrollAtBottom && !atBottom)) {
      setAtBottom(!atBottom)
      if (typeof onAtBottomChange === 'function') onAtBottomChange(!atBottom)
    }
  }

  function toggleFilepreview (messageIndex, messageHash) {
    const newArr = [...openFilepreviews]
    const idx = newArr.indexOf(messageHash)
    if (idx > -1) newArr.splice(idx, 1)
    else newArr.push(messageHash)
    setOpenFilepreviews(newArr)
    setLastOpenedPreviewIndex(messageIndex)
  }

  function onFilePreviewLoaded (measure, scrollTo) {
    measure()
    if (scrollTo && lastOpenedPreviewIndex) {
      list.current.scrollToRow(lastOpenedPreviewIndex)
      setLastOpenedPreviewIndex(null)
    }
  }

  function rowRenderer ({ index, key, isVisible, style, parent }) {
    if (isVisible && typeof onMessageInView === 'function') onMessageInView(index)

    // Parse dates so we know if we must add a date separator
    const message = messages[index]
    const prevMessage = messages[index - 1]
    const prevDate = prevMessage && new Date(prevMessage.meta.ts)
    const date = new Date(message.meta.ts)
    // Add separator when this is the first message or the dates between messages differ
    const addDateSepator =
      date && (!prevDate || (prevDate && date.getDate() !== prevDate.getDate()))

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
              filepreviewOpen={openFilepreviews.indexOf(message.hash) > -1}
              toggleFilepreview={toggleFilepreview.bind(null, index)}
              onFilePreviewLoaded={onFilePreviewLoaded.bind(null, measure)}
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
          onRowsRendered={checkBottom}
          noRowsRenderer={LoadingOrFirstMessage.bind(null, { loading, channelName })}
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
