'use strict'

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import { useTranslation } from 'react-i18next'

import PreviewAudioFile from './PreviewAudioFile'
import PreviewImageFile from './PreviewImageFile'
import PreviewTextFile from './PreviewTextFile'
import PreviewVideoFile from './PreviewVideoFile'

import Logger from '../../utils/logger'
import { isAudio, isImage, isVideo, toArrayBuffer } from '../../utils/file-helpers'

const logger = new Logger()

async function loadPreviewContent (loadFunc, hash, name, mimeType, onLoad) {
  const fileIsAudio = isAudio(name)
  const fileIsImage = isImage(name)
  const fileIsVideo = isVideo(name)

  const asStream = fileIsVideo
  const { buffer, url, stream } = await loadFunc(hash, asStream)

  let blob = new Blob([])

  if (buffer instanceof Blob) {
    blob = buffer
  } else if (buffer && mimeType) {
    blob = new Blob([toArrayBuffer(buffer)], { type: mimeType })
  }

  const srcUrl = buffer ? window.URL.createObjectURL(blob) : url

  if (buffer || url || stream) {
    if (fileIsAudio) {
      return <PreviewAudioFile src={srcUrl} onLoad={onLoad} />
    } else if (fileIsImage) {
      return <PreviewImageFile src={srcUrl} onLoad={onLoad} />
    } else if (fileIsVideo) {
      return (
        <PreviewVideoFile
          loadAsBlob={async () => loadFunc(hash, false)}
          stream={stream}
          filename={name}
          mimeType={mimeType}
          onLoad={onLoad}
        />
      )
    } else {
      return <PreviewTextFile blob={blob} filename={name} onLoad={onLoad} />
    }
  }
}

function FilePreview ({ animationProps, hash, loadFile, name, mimeType, onSizeUpdate }) {
  const [t] = useTranslation()
  const [previewContent, setPreviewContent] = useState(null)
  const [statusMessage, setStatusMessage] = useState(t('channel.file.previewLoading'))
  let isMounted // track whether component is mounted

  useEffect(
    () => {
      isMounted = true

      loadPreviewContent(loadFile, hash, name, mimeType, onSizeUpdate)
        .then(html => {
          if (isMounted) {
            setPreviewContent(html)
          }
        })
        .catch(e => {
          logger.error(e)
          if (isMounted) setStatusMessage(t('channel.file.unableToDisplay'))
        })

      return () => {
        // clean up, called when react dismounts this component
        isMounted = false
      }
    },
    [hash] // Only run effect if 'hash' or 'show' change
  )

  useEffect(() => {
    onSizeUpdate()
    return () => {
      // setTimeout(func, 0) will put the call to the end of the callstack and allow us
      // to call 'onSizeUpdate' after everything else
      setTimeout(onSizeUpdate, 0)
    }
  }, [])

  return (
    <div className="FilePreview">
      <CSSTransitionGroup {...animationProps}>
        {previewContent ? (
          <span className="preview smallText">{previewContent}</span>
        ) : (
          <span className="previewStatus smallText">{statusMessage}</span>
        )}
      </CSSTransitionGroup>
    </div>
  )
}

FilePreview.propTypes = {
  animationProps: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  loadFile: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  onSizeUpdate: PropTypes.func.isRequired
}

export default FilePreview
