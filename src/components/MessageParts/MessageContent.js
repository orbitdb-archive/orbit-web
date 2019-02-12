'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { FileMessage, TextMessage } from '../MessageTypes'

function MessageContent ({ isCommand, message, ...rest }) {
  let content

  switch (message.meta.type) {
    case 'text':
      content = <TextMessage text={message.content} {...rest} />
      break
    case 'file':
      content = <FileMessage hash={message.content} meta={message.meta} {...rest} />
      break
    case 'directory':
      break
    default:
      content = message.content
  }
  return <div className={classNames('Message__Content', { command: isCommand })}>{content}</div>
}

MessageContent.propTypes = {
  isCommand: PropTypes.bool,
  message: PropTypes.object.isRequired
}

MessageContent.defaultProps = {
  isCommand: false
}

export default MessageContent
