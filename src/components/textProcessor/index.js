'use strict'

import React from 'react'

import reactAutoLink from './react-auto-link'
import reactEmoji from './react-emoji'
import reactIpfsLink from './react-ipfs-link'
import reactHighlight from './react-highlight'

import { flatten } from '../../utils/flatten'

function process (strFunc, input, options = {}, wordIndex = 0) {
  if (!input) return null
  else if (input instanceof Array) {
    return flatten(input.map((i, idx) => process(strFunc, i, options, idx)))
  } else if (typeof input === 'string') {
    return strFunc(input, options, wordIndex)
  } else return input
}

function render (children, { tag = 'div', ...props } = {}) {
  return React.createElement(tag, props, children)
}

export default {
  autolink: process.bind(null, reactAutoLink),
  emojify: process.bind(null, reactEmoji),
  highlight: process.bind(null, reactHighlight),
  ipfsfy: process.bind(null, reactIpfsLink),
  render
}
