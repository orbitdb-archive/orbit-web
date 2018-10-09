'use strict'

const hasMentions = (text, mention) => {
  return (
    text
      .split(' ')
      .map(word => {
        const match =
          word.startsWith(mention) ||
          word.startsWith(mention + ':') ||
          word.startsWith('@' + mention) ||
          word.startsWith(mention + ',')
        return match
      })
      .filter(f => f === true).length > 0
  )
}

export default hasMentions
