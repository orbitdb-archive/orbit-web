'use strict'

import React from 'react'

// Returns an array of React elements
function reactHighlight (input, options, wordIndex) {
  const { highlightWords, ...props } = options
  // TODO: Improve match checking
  // - not 'startsWith' but '===' maybe?
  // - highlightWords is an array
  return input.split(' ').map((word, i) => {
    const match =
      word.startsWith(highlightWords) ||
      word.startsWith(highlightWords + ':') ||
      word.startsWith('@' + highlightWords) ||
      word.startsWith(highlightWords + ',')
    const innerHtml = word + ' '
    props.key = `${word}-${wordIndex}-${i}`
    return match ? React.createElement('span', Object.assign({}, props), innerHtml) : innerHtml
  })
}

export default reactHighlight
