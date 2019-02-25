'use strict'

import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import LoadAsync from '../components/Loadable'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/Channel.scss'

const ChannelControls = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelControls" */ './ChannelControls')
})
const ChannelMessages = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelMessages" */ './ChannelMessages')
})
const DropZone = LoadAsync({
  loader: () => import(/* webpackChunkName: "DropZone" */ '../components/DropZone')
})

function Channel ({ channelName }) {
  const [channel, setChannel] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const { networkStore, uiStore } = useContext(RootStoreContext)
  const [t] = useTranslation()

  let mounted = true

  useEffect(handleChannelNameChange, [channelName])

  function handleChannelNameChange () {
    uiStore.setTitle(`#${channelName} | Orbit`)
    uiStore.setCurrentChannelName(channelName)

    networkStore.joinChannel(channelName).then(channel => {
      if (mounted) setChannel(channel)
    })

    return () => {
      mounted = false
      uiStore.setCurrentChannelName(null)
      uiStore.closeUserProfilePanel()
    }
  }

  async function onDrop (event) {
    event.preventDefault()
    setDragActive(false)

    const files = []
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const file = event.dataTransfer.items[i]
        file.kind === 'file' && files.push(file.getAsFile())
      }
    } else {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        files.push(event.dataTransfer.files.item(i))
      }
    }

    try {
      await channel.sendFiles(files)
    } catch (err) {
      throw err
    }
  }

  return channel ? (
    <div
      className="Channel flipped"
      onDragOver={event => {
        event.preventDefault()
        !dragActive && setDragActive(true)
      }}
    >
      {dragActive && (
        <DropZone
          label={t('channel.file.dropzone.add', { channel: channelName })}
          onDragLeave={() => setDragActive(false)}
          onDrop={event => onDrop(event)}
        />
      )}
      <ChannelMessages channel={channel} />
      <ChannelControls channel={channel} />
    </div>
  ) : null
}

Channel.propTypes = {
  channelName: PropTypes.string.isRequired
}

export default Channel
