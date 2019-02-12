'use strict'

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Observer } from 'mobx-react'

import Logger from '../utils/logger'

import RootStoreContext from '../context/RootStoreContext'

import FileUploadButton from '../components/FileUploadButton'
import Spinner from '../components/Spinner'

import ChannelStatus from './ChannelStatus'
import SendMessage from './SendMessage'

const logger = new Logger()

function ChannelControls ({ channel }) {
  const { uiStore } = useContext(RootStoreContext)

  async function sendMessage (text) {
    try {
      await channel.sendMessage(text)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async function sendFiles (files) {
    try {
      await channel.sendFiles(files)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  return (
    <Observer>
      {() => (
        <div className="Controls">
          <Spinner loading={channel.loadingNewMessages || channel.sendingMessage} />
          <SendMessage
            onSendMessage={sendMessage}
            theme={uiStore.theme}
            useEmojis={uiStore.useEmojis}
            emojiSet={uiStore.emojiSet}
          />
          <FileUploadButton onSelectFiles={sendFiles} theme={uiStore.theme} />
          <ChannelStatus channel={channel} theme={uiStore.theme} />
        </div>
      )}
    </Observer>
  )
}

ChannelControls.propTypes = {
  channel: PropTypes.object.isRequired
}

export default ChannelControls
