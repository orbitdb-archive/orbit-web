'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import Spinner from 'components/Spinner'
import SendMessage from 'components/SendMessage'

class ChannelControls extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.isLoading !== this.props.isLoading ||
      nextProps.channelMode !== this.props.channelMode
    )
  }

  render () {
    const {
      onSendMessage,
      onSendFiles,
      isLoading,
      channelMode,
      appSettings,
      theme
    } = this.props
    return (
      <div className="Controls" key="controls">
        <Spinner
          isLoading={isLoading}
          color="rgba(255, 255, 255, 0.7)"
          size="16px"
        />
        <SendMessage
          onSendMessage={onSendMessage}
          theme={theme}
          useEmojis={appSettings.useEmojis}
        />
        <Dropzone className="dropzone2" onDrop={onSendFiles}>
          <div className="icon flaticon-tool490" style={theme} />
        </Dropzone>
        <div className="statusMessage" style={theme}>
          {channelMode}
        </div>
      </div>
    )
  }
}

ChannelControls.propTypes = {
  onSendMessage: PropTypes.func,
  onSendFiles: PropTypes.func,
  isLoading: PropTypes.bool,
  channelMode: PropTypes.string,
  appSettings: PropTypes.object,
  theme: PropTypes.object,
  replyto: PropTypes.object
}

export default ChannelControls
