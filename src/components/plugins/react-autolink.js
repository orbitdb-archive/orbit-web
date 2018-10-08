// https://github.com/banyan/react-autolink/blob/master/src/react-autolink.js

import React from 'react'
import assign from 'object-assign'

const ReactAutolink = () => {
  const delimiter = /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=%+?\-\\(\\)]*)/gi

  const strStartsWith = (str, prefix) => {
    return str.slice(0, prefix.length) === prefix
  }

  return {
    autolink (text, options = {}) {
      if (!text) return []

      return text.split(delimiter).map(word => {
        const match = word.match(delimiter)
        if (match) {
          const url = match[0]

          const segments = url.split('/')
          // no scheme given, so check host portion length
          if (segments[1] !== '' && segments[0].length < 5) {
            return word
          }

          return React.createElement(
            'a',
            assign(
              {
                href: strStartsWith(url, 'http') ? url : `http://${url}`,
                key: Math.random() * 10000
              },
              options
            ),
            url
          )
        } else {
          return word
        }
      })
    }
  }
}

export default ReactAutolink()
