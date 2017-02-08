import React  from 'react'
import assign from 'object-assign'

let ReactIpfsLink = () => {
  return {
    linkify(text, options = {}) {
      if (!text) return []
      return text.split(' ').map(word => {
        let match = word.length === 46 && word.startsWith('Qm')
        let url = 'https://ipfs.io/ipfs/' + word
        return match
          ? React.createElement('a', assign({href: url, key: word + Math.random() * 10000}, options), word + " ")
          : word + " "
      })
    }
  }
}

export default ReactIpfsLink()
