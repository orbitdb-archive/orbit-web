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

async function loadPreviewContent (loadFunc, hash, name, mimeType) {
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
      return <PreviewAudioFile src={srcUrl} />
    } else if (fileIsImage) {
      return <PreviewImageFile src={srcUrl} />
    } else if (fileIsVideo) {
      return (
        <PreviewVideoFile
          loadAsBlob={async () => loadFunc(hash, false)}
          stream={stream}
          filename={name}
          mimeType={mimeType}
        />
      )
    } else {
      return <PreviewTextFile blob={blob} filename={name} />
    }
  }
}

function FilePreview ({ animationProps, hash, loadFile, name, mimeType, show }) {
  const [t] = useTranslation()
  const [previewContent, setPreviewContent] = useState(t('channel.file.previewLoading'))
  let isMounted // track whether component is mounted

  useEffect(
    () => {
      isMounted = true

      if (!show) {
        setPreviewContent(t('channel.file.previewLoading'))
      } else {
        loadPreviewContent(loadFile, hash, name, mimeType)
          .then(html => {
            if (isMounted) setPreviewContent(html)
          })
          .catch(e => {
            logger.error(e)
            if (isMounted) setPreviewContent(t('channel.file.unableToDisplay'))
          })
      }

      return () => {
        // clean up, called when react dismounts this component
        isMounted = false
      }
    },
    [hash, show] // Only run effect if 'hash' or 'show' change
  )

  if (!show) return null

  return (
    <div className="FilePreview">
      <CSSTransitionGroup {...animationProps}>
        <span className="preview smallText">{previewContent}</span>
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
  show: PropTypes.bool.isRequired
}

export default FilePreview
