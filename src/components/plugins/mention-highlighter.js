// Based on https://github.com/banyan/react-emoji

import React from 'react'
import assign from 'object-assign'

const MentionHighlighter = () => {
  return {
    highlight (srcText, highlightText, options = {}) {
      if (typeof srcText !== 'string') return srcText
      if (!srcText || !highlightText) return srcText
      if (highlightText === '' || srcText === '') return srcText

      const result = srcText.split(' ').map(word => {
        const match =
          word.startsWith(highlightText) ||
          word.startsWith(highlightText + ':') ||
          word.startsWith('@' + highlightText) ||
          word.startsWith(highlightText + ',')
        if (match) {
          return React.createElement(
            'span',
            assign({ className: options.className, key: Math.random() }, options),
            word + ' '
          )
        } else {
          return word + ' '
        }
      })

      const r = []
      let s = ''
      result.forEach(e => {
        if (typeof e === 'string') {
          s += e
        } else {
          r.push(s)
          r.push(e)
          s = ''
        }
      })
      r.push(s)

      return r
    }
  }
}

export default MentionHighlighter()
