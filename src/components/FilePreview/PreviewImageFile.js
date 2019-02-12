'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function PreviewImageFile ({ src, ...rest }) {
  return <img src={src} {...rest} />
}

PreviewImageFile.propTypes = {
  src: PropTypes.string.isRequired
}

export default PreviewImageFile
