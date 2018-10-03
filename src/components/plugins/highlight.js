// Based on: https://github.com/bvaughn/react-highlight.js

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import highlight from 'highlight.js'

class Highlight extends React.Component {
  componentDidMount () {
    highlight.initHighlightingOnLoad()
    highlight.highlightBlock(findDOMNode(this))
  }

  onScroll (evt) {
    if (this.refs.root.scrollHeight > this.refs.root.clientHeight) {
      if (
        evt.deltaY > 0 &&
        this.refs.root.clientHeight + this.refs.root.scrollTop >=
          this.refs.root.scrollHeight
      ) {
        evt.stopPropagation()
        evt.preventDefault()
      } else if (evt.deltaY < 0 && this.refs.root.scrollTop === 0) {
        evt.stopPropagation()
        evt.preventDefault()
      }
    }
  }

  render () {
    const { children, language } = this.props

    return (
      <pre ref="root">
        <code className={language}>{children}</code>
      </pre>
    )
  }
}

Highlight.propTypes = {
  children: PropTypes.element,
  language: PropTypes.string
}

export default Highlight
