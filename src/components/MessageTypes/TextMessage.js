'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import textProcessor from '../textProcessor'

import '../../styles/TextMessage.scss'

function TextMessage ({ text, animationProps, emojiSet, highlightWords, useEmojis, isCommand }) {
  text = isCommand ? text.substring(4, text.length) : text

  let content = textProcessor.tokenize(text)

  content = textProcessor.ipfsfy(content, { useAutolink: true })
  content = textProcessor.autolink(content)
  content = textProcessor.highlight(content, { className: 'highlight', highlightWords })
  content = useEmojis ? textProcessor.emojify(content, { set: emojiSet }) : content

  const rendered = textProcessor.render(content)

  return (
    <div className="TextMessage">
      <CSSTransitionGroup {...animationProps}>{rendered}</CSSTransitionGroup>
    </div>
  )
}

TextMessage.propTypes = {
  text: PropTypes.string.isRequired,
  animationProps: PropTypes.object.isRequired,
  emojiSet: PropTypes.string.isRequired,
  highlightWords: PropTypes.array,
  useEmojis: PropTypes.bool,
  isCommand: PropTypes.bool
}

TextMessage.defaultProps = {
  highlightWords: [],
  useEmojis: true,
  isCommand: false
}

export default TextMessage
