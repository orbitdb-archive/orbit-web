'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { CSSTransitionGroup } from 'react-transition-group'
import { emojiIndex } from 'emoji-mart'
import EmojiPicker from '../components/EmojiPicker'

import '../styles/SendMessage.scss'

class SendMessage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    useEmojis: PropTypes.bool.isRequired,
    emojiSet: PropTypes.string.isRequired
  }

  static defaultProps = {}

  state = { inputValue: '', emojiResults: [], emojiPickerActive: false }

  constructor (props) {
    super(props)

    this.inputField = React.createRef()
    this.emojiPicker = React.createRef()

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onSelectEmoji = this.onSelectEmoji.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()

    const inputField = this.inputField.current
    const text = inputField.value.trim()

    this.setState({ inputValue: '', emojiResults: [], emojiPickerActive: false }, () =>
      inputField.focus()
    )

    this.props.onSendMessage(text).catch(e => {
      // There was an error sending the message
      // Revert input value and focus the field
      this.setState({ inputValue: text }, () => inputField.focus())
    })
  }

  onChange () {
    const inputValue = this.inputField.current.value
    const lastWord = inputValue.split(' ').pop()
    const emojiPickerActive = lastWord.startsWith(':') && this.props.useEmojis
    const lastEmojiIdx = emojiPickerActive ? inputValue.lastIndexOf(':') : null
    const emojiSearch = emojiPickerActive ? inputValue.slice(lastEmojiIdx) : null
    let emojiResults = emojiSearch ? emojiIndex.search(emojiSearch) : []
    if (emojiResults.length === 0) {
      // Slice the ':' prefix so we search for emojis instead of emoticons so
      // ':smile' => 'smile'
      // This is needed because we can also search for ':)' which requires the
      // ':' prefix
      emojiResults = emojiSearch ? emojiIndex.search(emojiSearch.slice(1)) : []
    }
    this.setState({ inputValue, emojiResults, emojiPickerActive })
  }

  onKeyDown (e) {
    if (this.emojiPicker.current) {
      this.emojiPicker.current.onKeyDown(e)
    }
  }

  onSelectEmoji (emoji) {
    if (!emoji) return

    const n1 = this.state.inputValue.lastIndexOf(':')
    const n2 = this.state.inputValue.lastIndexOf(':', n1 - 1)
    const inputValue =
      n1 !== this.state.inputValue.length - 1
        ? this.state.inputValue.slice(0, n1) + emoji.colons
        : this.state.inputValue.slice(0, n2) + emoji.colons

    this.setState({ inputValue }, () => {
      this.inputField.current.focus()
    })
  }

  getEmojiPickerStyle (emojiSize) {
    return {
      maxWidth: (emojiSize + 2) * 10, // 2 * 1px padding or border
      bottom: this.inputField ? this.inputField.current.offsetHeight + 10 : '45px'
    }
  }

  render () {
    const { inputValue, emojiResults, emojiPickerActive } = this.state
    const { t, theme, emojiSet } = this.props

    const pickerEmojiSize = 24

    const emojiPicker =
      emojiPickerActive && emojiResults.length > 0 ? (
        <CSSTransitionGroup
          component="div"
          transitionName="emojiPreview"
          transitionAppear={true}
          transitionAppearTimeout={1000}
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}
        >
          <EmojiPicker
            ref={this.emojiPicker}
            emojis={emojiResults}
            onChange={this.onSelectEmoji}
            emojiSize={pickerEmojiSize}
            emojiSet={emojiSet}
            style={this.getEmojiPickerStyle(pickerEmojiSize)}
          />
        </CSSTransitionGroup>
      ) : null

    return (
      <div className="SendMessage">
        <form onSubmit={this.onSubmit}>
          {emojiPicker}
          <input
            ref={this.inputField}
            type="text"
            placeholder={t('channel.sendMessagePlaceholder')}
            autoComplete="on"
            autoFocus={true}
            style={theme}
            value={inputValue}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
          />
        </form>
      </div>
    )
  }
}

export default withTranslation()(SendMessage)
