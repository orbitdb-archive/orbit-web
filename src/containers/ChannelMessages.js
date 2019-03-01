'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { InView } from 'react-intersection-observer'

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

    this.state = {
      stayAtBottom: true
    }

    this.messagesEl = React.createRef()
    this.messagesEnd = React.createRef()
    this.updateViewPosition = this.updateViewPosition.bind(this)
    this.onMessageUserClick = this.onMessageUserClick.bind(this)
    this.onFirstMessageInteract = this.onFirstMessageInteract.bind(this)
  }

  componentDidMount () {
    this.updateViewPosition()
  }

  componentDidUpdate () {
    this.updateViewPosition()
  }

  updateViewPosition () {
    // Prevent excessive function calls
    if (!this.messagesEnd.current || this.props.channel.loadingHistory) return

    if (this.state.stayAtBottom) this.messagesEnd.current.scrollIntoView()
  }

  onMessageUserClick (evt, profile, identity) {
    const { uiStore } = this.context

    evt.persist()
    evt.stopPropagation()

    const mousePosition = getMousePosition(evt)

    uiStore.openUserProfilePanel({ identity, profile }, mousePosition)
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
        els.push(
          <MessagesDateSeparator key={'date-sep-' + date.getTime()} date={date} locale={language} />
        )
      }

      els.push(
        <MessageRow
          key={'message-' + message.hash}
          message={message}
          colorifyUsernames={colorifyUsernames}
          useLargeMessage={useLargeMessage}
          highlightWords={[sessionStore.username]}
          onInView={channel.markMessageAsRead}
          onInViewRoot={this.messagesEl.current}
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

  onFirstMessageInteract () {
    this.setState({ stayAtBottom: false }, () => {
      this.props.channel.loadMore()
    })
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
          channelName={channel.channelName}
          loading={channel.loadingHistory}
          hasMoreHistory={channel.hasMoreHistory}
          onClick={this.onFirstMessageInteract}
          onInView={this.onFirstMessageInteract}
          onInViewRoot={this.messagesEl.current}
        />
        {messageEls}
        <InView
          onChange={inView => {
            if (inView) this.setState({ stayAtBottom: true })
          }}
        >
          <span className="messagesEnd" ref={this.messagesEnd} />
        </InView>
      </div>
    )
  }
}

export default observer(ChannelMessages)
