'use strict'

import React from 'react'
import Autolinker from 'autolinker'

const autolinker = new Autolinker()

// Returns an array of React elements
function reactAutoLink (input, options, wordIndex) {
  const parsed = autolinker
    .parse(input)
    .map(i => ({ start: i.offset, end: i.offset + i.matchedText.length, tag: i.buildTag() }))
    .reduce(
      (store, part, idx, arr) => {
        const { result, lastEnd } = store

        // Check if there is plain text before this part
        if (part.start > lastEnd) {
          result.push(input.substring(lastEnd, part.start))
        }

        // Push current part to store
        result.push(part.tag)

        // Check if this is the last part and if there is plain text after it
        if (idx === arr.length - 1 && part.end < input.length) {
          result.push(input.substring(part.end))
        }

        return { result, lastEnd: part.end }
      },
      { result: [], lastEnd: 0 }
    )
    .result.map((tag, i) => {
      if (typeof tag === 'string') return tag
      return React.createElement(
        tag.getTagName(),
        Object.assign(tag.attrs, { key: `${tag.attrs.href}-${wordIndex}-${i}` }, options),
        tag.getInnerHTML()
      )
    })

  return parsed.length > 0 ? parsed : [input]
}

export default reactAutoLink
