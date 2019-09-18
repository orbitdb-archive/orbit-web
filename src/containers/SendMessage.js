'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
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
  }

  handleInputSubmit (e) {
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

  handleInputChange () {
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

  handleInputKeyDown (e) {
    if (this.emojiPicker.current) {
      this.emojiPicker.current.onKeyDown(e)
    }
  }

  handleEmojiChange (emoji, done = false) {
    if (!emoji) return

    const i = this.state.inputValue.lastIndexOf(':')

    const inputValue = this.state.inputValue.slice(0, i) + emoji.colons

    this.setState({ inputValue, emojiPickerActive: !done }, () => {
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
        <EmojiPicker
          ref={this.emojiPicker}
          emojis={emojiResults}
          onChange={this.handleEmojiChange.bind(this)}
          emojiSize={pickerEmojiSize}
          emojiSet={emojiSet}
          style={this.getEmojiPickerStyle(pickerEmojiSize)}
        />
      ) : null

    return (
      <div className='SendMessage'>
        <form onSubmit={this.handleInputSubmit.bind(this)}>
          {emojiPicker}
          <input
            ref={this.inputField}
            type='text'
            placeholder={t('channel.sendMessagePlaceholder')}
            autoComplete='on'
            autoFocus
            style={theme}
            value={inputValue}
            onKeyDown={this.handleInputKeyDown.bind(this)}
            onChange={this.handleInputChange.bind(this)}
          />
        </form>
      </div>
    )
  }
}

export default withTranslation()(SendMessage)
