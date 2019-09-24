'use strict'

import React from 'react'

// Returns a React element or a string
function reactHighlight (word, options, wordIndex) {
  const { highlightWords, ...props } = options
  const re = new RegExp(`@?(${highlightWords.join('|')})(?!\\w)`, 'gu')
  const match = re.test(word)
  props.key = `${word}-${wordIndex}`
  return match ? React.createElement('span', props, word) : word
}

export default reactHighlight
