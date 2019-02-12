'use strict'

import React from 'react'
import PropTypes from 'prop-types'

function PreviewAudioFile ({ src, ...rest }) {
  return <audio src={src} controls autoPlay={true} {...rest} />
}

PreviewAudioFile.propTypes = {
  src: PropTypes.string.isRequired
}

export default PreviewAudioFile
