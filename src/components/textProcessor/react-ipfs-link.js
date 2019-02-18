'use strict'

import React from 'react'

import { base58 } from '../../utils/base-x'

// Returns an array of React elements
function reactIpfsLink (
  input,
  { baseIpfsUrl = 'https://ipfs.io/ipfs/', useAutolink = false, props },
  wordIndex
) {
  return input.split(' ').map((word, i) => {
    const firstCheck = word.length === 46 && word.startsWith('Qm')
    const innerHtml = word + ' '
    if (!firstCheck) return innerHtml
    try {
      base58.decode(word)
      const href = baseIpfsUrl + word
      if (useAutolink) return href + ' ' // Autolinker will handle the creation of an 'a' tag
      props.key = `${href}-${wordIndex}-${i}`
      return React.createElement('a', Object.assign({ href }, props), innerHtml)
    } catch (e) {
      return innerHtml
    }
  })
}

export default reactIpfsLink
