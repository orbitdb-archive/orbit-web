import React from 'react'
import PropTypes from 'prop-types'

import '../styles/Curtain.scss'

const DropZone = props => {
  const { onDrop, onDragLeave, label } = props
  return (
    <div
      className="curtain"
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <div className="curtainlabel">{label}</div>
    </div>
  )
}

DropZone.propTypes = {
  onDrop: PropTypes.func,
  onDragLeave: PropTypes.func,
  label: PropTypes.string
}

export default DropZone
