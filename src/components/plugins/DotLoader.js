'use strict'
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Object}
 */
const rotateKeyframes = {
  '100%': {
    transform: 'rotate(360deg)'
  }
}

/**
 * @type {Object}
 */
const bounceKeyframes = {
  '0%, 100%': {
    transform: 'scale(0)'
  },
  '50%': {
    transform: 'scale(1.0)'
  }
}

/**
 * @type {String}
 */
const rotateAnimationName = insertKeyframesRule(rotateKeyframes)

/**
 * @type {String}
 */
const bounceAnimationName = insertKeyframesRule(bounceKeyframes)

const Loader = createReactClass({
  displayName: 'Loader',

  /**
   * @type {Object}
   */
  propTypes: {
    loading: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.string,
    margin: PropTypes.string,
    verticalAlign: PropTypes.string,
    ballSize: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string
  },

  /**
   * @return {Object}
   */
  getDefaultProps: function getDefaultProps () {
    return {
      loading: true,
      color: '#ffffff',
      size: '60px'
    }
  },

  /**
   * @param  {String} size
   * @return {Object}
   */
  getBallStyle: function getBallStyle (size) {
    return {
      backgroundColor: this.props.color,
      width: size,
      height: size,
      borderRadius: '100%',
      verticalAlign: this.props.verticalAlign
    }
  },

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle: function getAnimationStyle (i) {
    const speed = 4
    const animation = [
      i === 0 ? rotateAnimationName : bounceAnimationName,
      `${speed}s`,
      i === 2 ? `-${speed / 2}s` : '0s',
      'infinite',
      'linear'
    ].join(' ')
    const animationFillMode = 'forwards'

    return {
      animation: animation,
      animationFillMode: animationFillMode
    }
  },

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getStyle: function getStyle (i) {
    const size = parseInt(this.props.size)
    const ballSize = this.props.ballSize

    if (i) {
      return assign(this.getBallStyle(ballSize), this.getAnimationStyle(i), {
        position: 'absolute',
        top: i % 2 ? 0 : 'auto',
        bottom: i % 2 ? 'auto' : 0
      })
    }

    return assign(this.getAnimationStyle(i), {
      width: size,
      height: size,
      position: 'relative'
    })
  },

  /**
   * @param  {Boolean} loading
   * @return {ReactComponent || null}
   */
  renderLoader: function renderLoader (loading) {
    if (loading) {
      return React.createElement(
        'div',
        { id: this.props.id, className: this.props.className },
        React.createElement(
          'div',
          { style: this.getStyle(0) },
          React.createElement('div', { style: this.getStyle(1) }),
          React.createElement('div', { style: this.getStyle(2) })
        )
      )
    }

    return null
  },

  render: function render () {
    return this.renderLoader(this.props.loading)
  }
})

export default Loader
