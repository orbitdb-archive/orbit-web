'use strict'

import React, { PropTypes } from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import flatten from 'lodash.flatten'
import ReactEmoji from 'react-emoji'
import ReactAutolink from 'components/plugins/react-autolink'
import ReactIpfsLink from 'components/plugins/react-ipfs-link'
import MentionHighlighter from 'components/plugins/mention-highlighter'
import 'styles/TextMessage.scss'

// Attributes to pass to <a/> elements
const linkProps = { target: '_blank', rel: 'nofollow' }

// Higlight specified words (ie. username)
function _highlight(items, highlightWords) {
  const props = { className: 'highlight' }
  return flatten(items.map((item) => {
    return MentionHighlighter.highlight(item, highlightWords, props)
  }))
}

// Create emojis
function _emojify(items, size) {
  const emojiOpts = {
    emojiType: 'emojione',
    attributes: { 
      width: size || '16px', 
      height: size || '16px' 
    },
  }

  return flatten(items.map((item) => {
    if (typeof item !== 'string') return item
    // Handle 'd:' specially
    if (item[0] !== ':' && item.indexOf('d:') > 0) return item
    emojiOpts.attributes.alt = item.trim()
    return ReactEmoji.emojify(item, emojiOpts)
  }))
}

// Create links from IPFS hashes
function _ipfsfy(items) {
  return flatten(items.map((item) => {
    return (typeof item === 'string')
      ? ReactIpfsLink.linkify(item, linkProps) 
      : item
  }))
}

function _autolink(items) {
  return ReactAutolink.autolink(items, linkProps)
}

class TextMessage extends React.Component {
  constructor(props) {
    super(props)

    let content = props.text

    // Remove the command prefix from the rendered text
    content = content.startsWith('/me') 
      ? content.substring(3, content.length) 
      : content

    // Create links from urls
    content = _autolink(content)
    // Create links from multihashes
    content = _ipfsfy(content)
    // Higlight words from the text
    content = _highlight(content, props.highlightWords)
    // Convert emoji-words to emoji-pictures
    content = props.useEmojis ? _emojify(content) : content

    this.state = { content: content }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.props.text
  }

  render() {
    return (
      <div className='TextMessage'>
        <TransitionGroup
          transitionName='textAnimation'
          transitionAppear={true}
          transitionEnter={false}
          transitionLeave={false}
          transitionAppearTimeout={200}
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}
          className='content2'>
          <span className='content2' key={Math.random() * 1000}>{this.state.content}</span>
        </TransitionGroup>
      </div>
    )
  }
}

export default TextMessage
