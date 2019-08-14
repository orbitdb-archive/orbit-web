'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CSSTransitionGroup } from 'react-transition-group'

import { FileMessage, TextMessage } from '../MessageTypes'

function MessageContent ({
  message,
  isCommand,
  loadFile,
  filepreviewOpen,
  toggleFilepreview,
  ...rest
}) {
  let content

  switch (message.meta.type) {
    case 'text':
      content = (
        <TextMessage key={message.hash} text={message.content} isCommand={isCommand} {...rest} />
      )
      break
    case 'file':
      content = (
        <FileMessage
          key={message.hash}
          messageHash={message.hash}
          fileHash={message.content}
          meta={message.meta}
          loadFile={loadFile}
          filepreviewOpen={filepreviewOpen}
          toggleFilepreview={toggleFilepreview}
          {...rest}
        />
      )
      break
    case 'directory':
      break
    default:
      content = message.content
  }

  const animationProps = {
    transitionName: 'messageAnimation',
    transitionAppear: message.unread,
    transitionEnter: false,
    transitionLeave: false,
    transitionAppearTimeout: 500,
    transitionEnterTimeout: 0,
    transitionLeaveTimeout: 0,
    component: 'div'
  }

  return (
    <CSSTransitionGroup
      className={classNames('Message__Content', { command: isCommand })}
      {...animationProps}
    >
      {content}
    </CSSTransitionGroup>
  )
}

MessageContent.propTypes = {
  message: PropTypes.object.isRequired,
  isCommand: PropTypes.bool,
  filepreviewOpen: PropTypes.bool,
  toggleFilepreview: PropTypes.func.isRequired,
  loadFile: PropTypes.func.isRequired
}

MessageContent.defaultProps = {
  isCommand: false,
  filepreviewOpen: false
}

export default MessageContent
