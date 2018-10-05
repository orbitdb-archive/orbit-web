'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function NewMessageNotification ({ onClick, unreadMessages }) {
  if (unreadMessages <= 0) {
    return null
  }

  const isOnlyOneMessage = unreadMessages === 1

  return (
    <div className="newMessagesBar" onClick={onClick}>
      <span>
        There {isOnlyOneMessage ? 'is' : 'are'}
        <span className="newMessagesNumber">{unreadMessages}</span>
        new {isOnlyOneMessage ? 'message' : 'messages'}
      </span>
    </div>
  )
}

NewMessageNotification.propTypes = {
  onClick: PropTypes.func,
  unreadMessages: PropTypes.number
}

export default NewMessageNotification
