import React from 'react'
import PropTypes from 'prop-types'

import '../styles/DropZone.scss'

const DropZone = props => {
  const { onDrop, onDragLeave, channelName } = props
  return (
    <div
      className="dropzone"
      onDrop={event => {
        event.preventDefault()
        onDrop && onDrop(event)
      }}
      onDragLeave={() => onDragLeave()}
    >
      <div className="droplabel">Add files to #{channelName}</div>
    </div>
  )
}

DropZone.propTypes = {
  onDrop: PropTypes.func,
  onDragLeave: PropTypes.func,
  channelName: PropTypes.string
}

export default DropZone
