'use strict'

import flatten from 'lodash.flatten'
import React from "react"
import TransitionGroup from "react-addons-css-transition-group"
import ReactEmoji from "react-emoji"
import ReactAutolink from "react-autolink"
import ReactIpfsLink from "components/plugins/react-ipfs-link"
import MentionHighlighter from 'components/plugins/mention-highlighter'
import "styles/TextMessage.scss"

class TextMessage extends React.Component {
  constructor(props) {
    super(props)

    // Remove the command prefix from the rendered text
    let text = props.text
    if (text.startsWith("/me")) {
      text = text.substring(3, text.length)
    }

    // Create links from urls
    let finalText = ReactAutolink.autolink(text, { target: "_blank", rel: "nofollow", key: Math.random() })
    finalText = this._highlight(finalText, props.highlightWords)
    // finalText = this._ipfsfy(finalText) // TODO: fix ipfs links
    finalText = props.useEmojis ? this._emojify(finalText) : finalText

    this.state = {
      text: text,
      finalText: finalText,
      useEmojis: props.useEmojis,
      highlightWords: props.highlightWords
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.text !== nextState.text
  }

  // Higlight specified words (ie. username)
  _highlight(items, highlightWords) {
    return flatten(items.map((item) => {
      return MentionHighlighter.highlight(item, highlightWords, { highlightClassName: 'highlight', key: Math.random() })
    }))
  }

  // Create emojis
  _emojify(items, size) {
    const emojiOpts = {
      emojiType: 'emojione',
      attributes: { width: size || '16px', height: size || '16px' }
    }

    return flatten(items.map((item) => {
      if(typeof item !== 'string') return item
      if(item[0] !== ':' && item.indexOf('d:') > 0) return item // Handle 'd:' specially
      emojiOpts.attributes.alt = item.trim()
      return ReactEmoji.emojify(item, emojiOpts)
    }))
  }

  // Create links from IPFS hashes
  _ipfsfy(items) {
    return flatten(items.map((item) => {
      return (typeof item === 'string') ? ReactIpfsLink.linkify(item, { target: "_blank", rel: "nofollow", key: Math.random() }) : item
    }))
  }

  render() {
    const content = (
      <TransitionGroup
        transitionName="textAnimation"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        className="content2">
        <span className="content2" key={"1"}>{this.state.finalText}</span>
      </TransitionGroup>
    )

    return (<div className="TextMessage">{content}</div>)
  }
}

export default TextMessage
