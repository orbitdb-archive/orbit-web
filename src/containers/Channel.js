'use strict'

import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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
    const files = []
    if (event.dataTransfer.items) {
      console.log(event.dataTransfer.items)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const file = event.dataTransfer.items[i]
        file.kind === 'file' && files.push(file.getAsFile())
      }
    } else {
      event.dataTransfer.files.map(files.push)
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
          channelName={channelName}
          onDragLeave={() => setDragActive(false)}
          onDrop={event => {
            event.preventDefault()
            onDrop(event)
            setDragActive(false)
          }}
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
