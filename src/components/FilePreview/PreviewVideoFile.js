'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { toArrayBuffer } from '../../utils/file-helpers'

function PreviewVideoFile ({ src, stream, filename, mimeType, ...rest }) {
  const isElectron = !!window.ipfsInstance
  let url

  if (isElectron) {
    url = src
  } else {
    const codec =
      mimeType === 'video/mp4'
        ? 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        : 'video/webm; codecs="vp8, vorbis"'
    const source = new MediaSource()
    url = window.URL.createObjectURL(source)

    source.readyState === 'closed' &&
      source.addEventListener('sourceopen', e => {
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
      })
  }

  return (
    <div>
      <video controls autoPlay={true}>
        <source src={url} type={mimeType} />
      </video>
    </div>
  )
}

PreviewVideoFile.propTypes = {
  stream: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
  mimeType: PropTypes.string,
  src: PropTypes.string
}

export default PreviewVideoFile
