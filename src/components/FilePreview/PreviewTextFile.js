'use strict'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Highlight from '../Highlight'

import { getFileExtension } from '../../utils/file-helpers'

function PreviewTextFile ({ blob, filename, ...rest }) {
  const [fileContent, setfileContent] = useState(null)

  useEffect(
    () => {
      const fileReader = new FileReader()
      fileReader.onload = ({ target: { result } }) => {
        setfileContent(
          <Highlight extension={getFileExtension(filename)} {...rest}>
            {result}
          </Highlight>
        )
      }
      fileReader.onerror = () => {
        fileReader.abort()
        throw new Error('Unable to read file')
      }
      fileReader.readAsText(blob, 'utf-8')
    },
    [filename]
  )

  return fileContent || null
}

PreviewTextFile.propTypes = {
  blob: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired
}

export default PreviewTextFile
