'use strict'

import React from "react"
import MentionHighlighter from 'components/plugins/mention-highlighter'
import User from "components/User"
import File from "components/File"
import TextMessage from "components/TextMessage"
import Directory from "components/Directory"
import ChannelActions from 'actions/ChannelActions'
import UserActions from 'actions/UserActions'
import NotificationActions from 'actions/NotificationActions'
import TransitionGroup from "react-addons-css-transition-group"
import { getFormattedTime } from '../utils/utils.js'
import "styles/Message.scss"

class Message extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      post: props.post,
      user: props.post.meta.from,
      hasHighlights: false,
      isCommand: props.post.content && props.post.content.startsWith('/me'),
      formattedTime: getFormattedTime(props.post.meta.ts),
      showSignature: false,
      showProfile: null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.post !== nextState.post && this.state.post.hash !== nextState.post.hash)
      || this.state.user !== nextState.user
  }

  renderContent() {
    const { highlightWords, useEmojis, entry } = this.props
    const { isCommand, post } = this.state
    const contentClass = isCommand ? "Content command" : "Content"
    let content = (<div></div>)
    if (post) {
      const key = post.hash + post.meta.ts
      switch (post.meta.type) {
        case 'text':
          content = (
            <TextMessage
              text={post.content}
              replyto={null}
              useEmojis={useEmojis}
              highlightWords={highlightWords}
              key={key} />
          )
          break
        case 'file':
          content = <File hash={post.hash} name={post.name} size={post.size} meta={post.meta} onPreviewOpened={this.props.onScrollToPreview} key={key}/>
          break
        case 'directory':
          content = <Directory hash={post.hash} name={post.name} size={post.size} root={true} onPreviewOpened={this.props.onScrollToPreview} key={key}/>
          break
      }
    }
    return <div className={contentClass}>{content}</div>
  }

  render() {
    const { message, colorifyUsername, style, onDragEnter } = this.props
    const { user, post, isCommand, hasHighlights, formattedTime } = this.state
    const className = hasHighlights ? "Message highlighted" : "Message"

    return (
      <div className={className} style={style} onDragEnter={onDragEnter}>
        <span className="Timestamp">{formattedTime}</span>
        <User
          user={user}
          colorify={colorifyUsername}
          highlight={isCommand}
          onShowProfile={this.props.onShowProfile.bind(this, user)}
          />
        {this.renderContent()}
      </div>
    )
  }

}

export default Message
