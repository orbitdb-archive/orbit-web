'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import getMousePosition from '../utils/mouse-position'

import RootStoreContext from '../context/RootStoreContext'

import MessageRow from '../components/MessageRow'
import { FirstMessage } from '../components/MessageTypes'
import MessagesDateSeparator from '../components/MessagesDateSeparator'

class ChannelMessages extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    channel: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.messagesEl = React.createRef()
    this.messagesEnd = React.createRef()
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.onMessageUserClick = this.onMessageUserClick.bind(this)
    this.onFirstMessageClick = this.onFirstMessageClick.bind(this)
  }

  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  scrollToBottom () {
    if (!this.messagesEnd.current || this.props.channel.loadingHistory) return
    if (
      this.messagesEl.current.scrollHeight - this.messagesEl.current.scrollTop <=
      this.messagesEl.current.clientHeight + 300
    ) {
      this.messagesEnd.current.scrollIntoView()
    } else {
      this.messagesEl.current.scrollTop = 50
    }
  }

  onMessageUserClick (evt, profile, identity) {
    const { uiStore } = this.context

    evt.persist()
    evt.stopPropagation()

    const mousePosition = getMousePosition(evt)

    uiStore.openUserProfilePanel({ identity, profile }, mousePosition)
  }

  onFirstMessageClick (evt) {
    const { channel } = this.props
    evt.preventDefault()
    channel.loadMore()
  }

  renderMessages () {
    const { sessionStore, uiStore } = this.context
    const { colorifyUsernames, useLargeMessage, language, theme, useEmojis, emojiSet } = uiStore
    const { channel } = this.props

    let prevDate

    // Reduce so we can put the date separators in
    return channel.messages.reduce((els, message) => {
      const date = new Date(message.meta.ts)

      if (date.getDate() !== prevDate) {
        prevDate = date.getDate()
        els.push(<MessagesDateSeparator key={date} date={date} locale={language} />)
      }

      els.push(
        <MessageRow
          key={message.hash}
          message={message}
          colorifyUsernames={colorifyUsernames}
          useLargeMessage={useLargeMessage}
          highlightWords={[sessionStore.username]}
          onInViewChange={inView => {
            if (message.unread && inView) channel.markMessageAsRead(message)
          }}
          onMessageUserClick={this.onMessageUserClick}
          loadFile={channel.loadFile}
          theme={theme}
          useEmojis={useEmojis}
          emojiSet={emojiSet}
        />
      )

      return els
    }, [])
  }

  render () {
    const { useLargeMessage, useMonospaceFont } = this.context.uiStore
    const { channel } = this.props

    const messageEls = this.renderMessages()

    return (
      <div
        className={classNames('Messages', {
          'size-normal': !useLargeMessage,
          'size-large': useLargeMessage,
          'font-normal': !useMonospaceFont,
          'font-monospace': useMonospaceFont
        })}
        ref={this.messagesEl}
      >
        <FirstMessage
          channelName={channel.name}
          loading={channel.loadingHistory}
          hasMoreHistory={channel.hasMoreHistory}
          onClick={this.onFirstMessageClick}
          observeReaction={() => channel.loadMore()}
        />
        {messageEls}
        <span className="messagesEnd" ref={this.messagesEnd} />
      </div>
    )
  }
}

export default observer(ChannelMessages)
