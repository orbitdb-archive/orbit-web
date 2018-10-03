'use strict'

import React from 'react'
import PropTypes from 'prop-types'

class NewMessageNotification extends React.Component {
  render () {
    const { onClick, unreadMessages } = this.props
    if (unreadMessages > 0) {
      if (unreadMessages === 1) {
        return (
          <div className="newMessagesBar" onClick={onClick}>
            There is <span className="newMessagesNumber">1</span> new message
          </div>
        )
      } else {
        return (
          <div className="newMessagesBar" onClick={onClick}>
            There are{' '}
            <span className="newMessagesNumber">{unreadMessages}</span> new
            messages
          </div>
        )
      }
    }
    return null
  }
}

NewMessageNotification.propTypes = {
  onClick: PropTypes.func,
  unreadMessages: PropTypes.number
}

export default NewMessageNotification
