'use strict'

import React from 'react'

// Returns a React element or a string
function reactHighlight (word, options, wordIndex) {
  const { highlightWords, ...props } = options
  // TODO: Improve match checking
  // - not 'startsWith' but '===' maybe?
  // - highlightWords is an array
  const match =
    word.startsWith(highlightWords) ||
    word.startsWith(highlightWords + ':') ||
    word.startsWith('@' + highlightWords) ||
    word.startsWith(highlightWords + ',')
  props.key = `${word}-${wordIndex}`
  return match ? React.createElement('span', Object.assign({}, props), word) : word
}

export default reactHighlight
