'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function FileUploadButton ({ onSelectFiles, theme }) {
  const fileInput = React.createRef()

  function handleClick (e) {
    e.preventDefault()
    fileInput.current.click()
  }

  function handleFileSelect () {
    const files = fileInput.current.files
    if (files) onSelectFiles(files)
    fileInput.current.value = null
  }

  return (
    <div className="FileUploadButton" style={{ ...theme }}>
      <input
        type="file"
        id="file"
        multiple={true}
        ref={fileInput}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <div className="icon flaticon-tool490" onClick={handleClick} />
    </div>
  )
}

FileUploadButton.propTypes = {
  onSelectFiles: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

export default FileUploadButton
