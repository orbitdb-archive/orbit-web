'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import FilePreview from '../FilePreview'

import { getHumanReadableSize, isAudio, isText, isImage, isVideo } from '../../utils/file-helpers'

import '../../styles/FileMessage.scss'

function FileMessage ({
  messageHash,
  fileHash,
  meta,
  filepreviewOpen,
  toggleFilepreview,
  ...filePreviewProps
}) {
  const [t] = useTranslation()

  const { name, size, mimeType } = meta

  function handleNameClick () {
    if (!isImage(name) && !isText(name) && !isAudio(name) && !isVideo(name)) return
    toggleFilepreview(messageHash)
    setTimeout(filePreviewProps.onSizeUpdate, 0)
  }

  const ipfsLink =
    (window.gatewayAddress ? 'http://' + window.gatewayAddress : 'https://ipfs.io/ipfs/') + fileHash

  return (
    <div className="FileMessage">
      <div>
        <span className="name" onClick={handleNameClick}>
          {name}
        </span>
        <span className="size">{getHumanReadableSize(size)}</span>
        <a className="download" href={ipfsLink} target="_blank" rel="noopener noreferrer">
          {t('channel.file.open')}
        </a>
        <a className="download" href={ipfsLink} download={name}>
          {t('channel.file.download')}
        </a>
        {filepreviewOpen && (
          <FilePreview hash={fileHash} name={name} mimeType={mimeType} {...filePreviewProps} />
        )}
      </div>
    </div>
  )
}

FileMessage.propTypes = {
  messageHash: PropTypes.string.isRequired,
  fileHash: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    mimeType: PropTypes.string.isRequired
  }).isRequired,
  filepreviewOpen: PropTypes.bool.isRequired,
  toggleFilepreview: PropTypes.func.isRequired
}

FileMessage.defaultProps = {}

export default FileMessage
