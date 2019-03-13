'use strict'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toArrayBuffer } from '../../utils/file-helpers'

function PreviewVideoFile ({ loadAsBlob, stream, filename, mimeType, ...rest }) {
  const fallback = !!window.ipfsInstance

  const codec =
    mimeType === 'video/mp4'
      ? 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      : 'video/webm; codecs="vp8, vorbis"'
  const source = new MediaSource()

  const [url, setUrl] = useState(window.URL.createObjectURL(source))

  async function loadBlob () {
    const { buffer } = await loadAsBlob()
    const blob = new Blob([toArrayBuffer(buffer)], { type: mimeType })
    setUrl(window.URL.createObjectURL(blob))
  }

  function processStream () {
    if (!fallback) {
      const sourceBuffer = source.sourceBuffers.length === 0 && source.addSourceBuffer(codec)
      const buf = []
      if (sourceBuffer) {
        sourceBuffer.addEventListener('updateend', () => {
          if (buf.length > 0 && !sourceBuffer.updating) {
            sourceBuffer.appendBuffer(buf.shift())
          }
        })
        stream.on('data', data => {
          if (!sourceBuffer.updating) {
            if (buf.length > 0) {
              sourceBuffer.appendBuffer(buf.shift())
            } else {
              sourceBuffer.appendBuffer(toArrayBuffer(data))
            }
          } else {
            buf.push(toArrayBuffer(data))
          }
        })
        stream.on('end', () => {
          setTimeout(() => {
            if (source.readyState === 'open' && !sourceBuffer.updating) source.endOfStream()
          }, 100)
        })
        stream.on('error', e => console.error(e))
      }
    } else {
      loadBlob()
    }
  }

  source.addEventListener('sourceopen', e => {
    processStream()
  })

  return <video controls autoPlay={true} src={url} onError={() => loadBlob()} />
}

PreviewVideoFile.propTypes = {
  stream: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  loadAsBlob: PropTypes.func.isRequired
}

export default PreviewVideoFile
