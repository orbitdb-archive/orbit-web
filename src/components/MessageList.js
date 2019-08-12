'use strict'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'

import MessageRow from '../components/MessageRow'
import MessagesDateSeparator from '../components/MessagesDateSeparator'
import { LoadingOrFirstMessage } from '../components/MessageTypes'

import { debounce } from '../utils/throttle'

import 'react-virtualized/styles.css'

function MessageList ({
  messages,
  channelName,
  language,
  onMessageInView,
  onAtBottomChange,
  atBottom,
  loading,
  replicating,
  useLargeMessage,
  useMonospaceFont,
  ...messageRowProps
}) {
  const [listWidth, setListWidth] = useState(0)
  const [openFilepreviews, setOpenFilepreviews] = useState([])
  const [lastOpenedPreviewIndex, setLastOpenedPreviewIndex] = useState(null)

  const _onAtBottomChange = typeof onAtBottomChange === 'function' ? onAtBottomChange : () => {}
  const list = useRef()

  const rowHeightCache = useMemo(
    () =>
      new CellMeasurerCache({
        defaultHeight: useLargeMessage ? 46 : 20,
        fixedWidth: true
      }),
    [useLargeMessage, channelName]
  )

  const onListSizeChange = useCallback(
    debounce(() => {
      rowHeightCache.clearAll()
      list.current.measureAllRows()
      list.current.forceUpdateGrid()
    }, 100),
    [rowHeightCache, list.current]
  )

  const onChannelChange = useCallback(() => {
    setOpenFilepreviews([])
    setLastOpenedPreviewIndex(null)
    setTimeout(() => {
      list.current.scrollToRow(-1)
    }, 0)
  }, [list.current])

  function onNewMessage () {
    if (atBottom) list.current.scrollToRow(-1)
  }

  function onRowsRendered ({ stopIndex }) {
    checkBottom({ stopIndex })
  }

  function onFilePreviewLoaded (measure, scrollTo) {
    measure()
    if (scrollTo && lastOpenedPreviewIndex) {
      list.current.scrollToRow(lastOpenedPreviewIndex)
      setLastOpenedPreviewIndex(null)
    }
  }

  useEffect(onListSizeChange, [useLargeMessage, useMonospaceFont, loading, replicating])
  useEffect(onChannelChange, [channelName])
  useEffect(onNewMessage, [messages.length])

  function checkBottom ({ stopIndex }) {
    const scrollAtBottom = stopIndex === messages.length - 1
    if ((!scrollAtBottom && atBottom) || (scrollAtBottom && !atBottom)) {
      _onAtBottomChange(!atBottom)
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
        cache={rowHeightCache}
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
    <AutoSizer onResize={onListSizeChange}>
      {({ height, width }) => (
        <List
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
  atBottom: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  replicating: PropTypes.bool,
  useLargeMessage: PropTypes.bool,
  useMonospaceFont: PropTypes.bool
}

export default MessageList
