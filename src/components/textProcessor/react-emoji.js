'use strict'

import React from 'react'
import { Emoji } from 'emoji-mart'

import 'emoji-mart/css/emoji-mart.css'

const pattern = /(:[^:\s]+:?)/gim

// TODO: emoticons are not rendering properly

// Returns an array of React elements
function reactEmoji (input, { size = 16, set = 'emojione', ...rest }, wordIndex) {
  return input.split(' ').map((word, i1) => {
    if (word[0] !== ':' || word.length === 1) return word + ' '
    const props = Object.assign(
      {
        size,
        set,
        fallback: (emoji, props) => props.emoji // Return whatever was given as input
      },
      { ...rest }
    )
    const fragmentKey = `${word}-${wordIndex}-${i1}`
    const emojis = word.match(pattern)
    return (
      <React.Fragment key={fragmentKey}>
        {emojis.map((emoji, i2) => (
          <Emoji emoji={emoji} {...props} key={`${fragmentKey}-${i2}`} />
        ))}{' '}
      </React.Fragment>
    )
  })
}

export default reactEmoji
