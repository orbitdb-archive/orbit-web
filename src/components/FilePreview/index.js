'use strict'

import React, { useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import { useTranslation } from 'react-i18next'

import PreviewAudioFile from './PreviewAudioFile'
import PreviewImageFile from './PreviewImageFile'
import PreviewTextFile from './PreviewTextFile'
import PreviewVideoFile from './PreviewVideoFile'

import Suspense from '../Suspense'

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

function FilePreview ({ hash, loadFile, name, mimeType, onSizeUpdate, onFilePreviewLoaded }) {
  const [t] = useTranslation()
  const [previewContent, setPreviewContent] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(true)
  const isMounted = useRef() // track whether component is mounted

  const _onLoad = useCallback(() => {
    if (isMounted.current) onFilePreviewLoaded()
  }, [isMounted.current])

  const _onSizeUpdate = useCallback(() => {
    if (isMounted.current) onSizeUpdate()
  }, [isMounted.current])

  useEffect(
    () => {
      isMounted.current = true
      setPreviewLoading(true)

      loadPreviewContent(loadFile, hash, name, mimeType, _onLoad)
        .then(html => {
          if (isMounted.current) {
            setPreviewContent(html)
            setPreviewLoading(false)
          }
        })
        .catch(e => {
          logger.error(e)
          if (isMounted.current) {
            setPreviewLoading(false)
            _onSizeUpdate()
          }
        })

      return () => {
        // clean up, called when react dismounts this component
        isMounted.current = false
      }
    },
    [hash] // Only run effect if 'hash' changes
  )

  const animationProps = {
    transitionName: 'filepreviewAnimation',
    transitionAppear: true,
    transitionEnter: false,
    transitionLeave: false,
    transitionAppearTimeout: 250,
    transitionEnterTimeout: 0,
    transitionLeaveTimeout: 0,
    component: 'div'
  }

  const loadingElement = (
    <CSSTransitionGroup className="FilePreview" {...animationProps}>
      <span className="previewStatus smallText">{t('channel.file.previewLoading')}</span>
    </CSSTransitionGroup>
  )

  const errorElement = (
    <CSSTransitionGroup className="FilePreview" {...animationProps}>
      <span className="previewStatus smallText">{t('channel.file.unableToDisplay')}</span>
    </CSSTransitionGroup>
  )

  const previewElement = (
    <CSSTransitionGroup className="FilePreview" {...animationProps}>
      <span className="preview smallText">{previewContent}</span>
    </CSSTransitionGroup>
  )

  return (
    <Suspense
      fallback={loadingElement}
      callback={_onSizeUpdate}
      delay={250}
      loading={previewLoading}
    >
      {previewContent ? previewElement : errorElement}
    </Suspense>
  )
}

FilePreview.propTypes = {
  hash: PropTypes.string.isRequired,
  loadFile: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  onSizeUpdate: PropTypes.func.isRequired,
  onFilePreviewLoaded: PropTypes.func.isRequired
}

export default FilePreview
