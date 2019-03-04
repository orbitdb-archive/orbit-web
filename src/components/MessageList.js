'use strict'

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import MessageRow from '../components/MessageRow'
import MessagesDateSeparator from '../components/MessagesDateSeparator'

function MessageList ({ messages, language, onMessagesChange, ...messageRowProps }) {
  let prevDate

  useEffect(() => {
    if (typeof onMessagesChange === 'function') onMessagesChange()
  }, [messages.length])

  return (
    <React.Fragment>
      {messages.reduce((els, message) => {
        const date = new Date(message.meta.ts)

        if (date.getDate() !== prevDate) {
          prevDate = date.getDate()
          els.push(
            <MessagesDateSeparator
              key={'date-sep-' + date.getTime()}
              date={date}
              locale={language}
            />
          )
        }

        els.push(
          <MessageRow key={'message-' + message.hash} message={message} {...messageRowProps} />
        )

        return els
      }, [])}
    </React.Fragment>
  )
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  language: PropTypes.string,
  onMessagesChange: PropTypes.func
}

export default MessageList
