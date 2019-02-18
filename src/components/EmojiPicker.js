'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Emoji } from 'emoji-mart'

import 'emoji-mart/css/emoji-mart.css'
import '../styles/EmojiPicker.scss'

class EmojiPicker extends React.Component {
  static propTypes = {
    emojis: PropTypes.array.isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojiSet: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {}

  state = {
    selected: 0
  }

  constructor (props) {
    super(props)

    this.listElement = React.createRef()

    this.onChange = this.onChange.bind(this)
    this.calculateLeftRightIndex = this.calculateLeftRightIndex.bind(this)
    this.calculateUpDownIndex = this.calculateUpDownIndex.bind(this)
  }

  onKeyDown (e) {
    let handled = false

    if (this.state.selected > this.props.emojis.length) this.setState({ selected: 0 })

    switch (e.key) {
      case 'ArrowRight':
        this.setState({ selected: this.calculateLeftRightIndex(true) }, this.onChange)
        handled = true
        break
      case 'ArrowLeft':
        this.setState({ selected: this.calculateLeftRightIndex(false) }, this.onChange)
        handled = true
        break
      case 'ArrowDown':
        this.setState({ selected: this.calculateUpDownIndex(true) }, this.onChange)
        handled = true
        break
      case 'ArrowUp':
        this.setState({ selected: this.calculateUpDownIndex(false) }, this.onChange)
        handled = true
        break
      case 'Tab':
        this.onChange()
        handled = true
        break
      default:
        break
    }

    if (handled) e.preventDefault()
  }

  calculateLeftRightIndex (right) {
    const { selected: currentIndex } = this.state
    const { emojis } = this.props

    if (right) {
      return (currentIndex + 1) % emojis.length
    } else {
      return currentIndex > 0 ? currentIndex - 1 : emojis.length - 1
    }
  }

  calculateUpDownIndex (down) {
    if (!this.listElement.current) return
    const { selected: currentIndex } = this.state
    const { emojis } = this.props

    const actualEmojiSize = this.props.emojiSize + 2 * 1 // 1px padding
    const actualWidth = this.listElement.current.offsetWidth - 5 * 2 // 5px padding
    const itemsPerRow = actualWidth / actualEmojiSize

    if (down) {
      if (currentIndex + itemsPerRow > emojis.length - 1) {
        // Going over the bottom, must flip
        return currentIndex % itemsPerRow
      } else {
        // Normal case
        return currentIndex + itemsPerRow
      }
    } else {
      if (currentIndex - itemsPerRow < 0) {
        // Going over the top, must flip
        const rows = Math.floor(emojis.length / itemsPerRow)
        if (emojis.length % itemsPerRow > currentIndex) {
          // There is an element at the same index on the last row
          return currentIndex + itemsPerRow * rows
        } else {
          // There is NOT an element at the same index on the last row
          // Go to the second last row since it should have this index
          return currentIndex + itemsPerRow * (rows - 1)
        }
      } else {
        // Normal case
        return currentIndex - itemsPerRow
      }
    }
  }

  onChange () {
    try {
      const emoji = this.props.emojis[this.state.selected]
      return this.props.onChange(emoji)
    } catch (e) {
      return this.props.onChange(null)
    }
  }

  onClick (e, idx) {
    this.setState({ selected: idx }, this.onChange)
  }

  render () {
    const { selected } = this.state
    const { emojis, emojiSize, emojiSet, ...rest } = this.props

    return (
      <ul ref={this.listElement} className="EmojiPicker" {...rest}>
        {emojis.map((emoji, idx) => {
          return (
            <li
              key={emoji.id}
              className={selected === idx ? 'selected' : ''}
              onClick={e => this.onClick(e, idx)}>
              <Emoji emoji={emoji} size={emojiSize} set={emojiSet} />
            </li>
          )
        })}
      </ul>
    )
  }
}

export default EmojiPicker
