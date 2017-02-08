'use strict'

var React = require('react')
var assign = require('domkit/appendVendorPrefix')
var insertKeyframesRule = require('domkit/insertKeyframesRule')

/**
 * @type {Object}
 */
var keyframes = {
    '100%': {
        transform: 'rotate(360deg)'
    }
}

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes)

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
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
    getBallStyle: function getBallStyle(size) {
        return {
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
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '0.8s', '0s', 'infinite', 'linear'].join(' ')
        var animationFillMode = 'forwards'

        return {
            animation: animation,
            animationFillMode: animationFillMode
        }
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        var size = parseInt(this.props.size)
        var moonSize = size / 7

        if (i == 1) {
            return assign(this.getBallStyle(moonSize), this.getAnimationStyle(i), {
                backgroundColor: this.props.color,
                opacity: '0.8',
                position: 'absolute',
                top: size / 2 - moonSize / 2
            })
        } else if (i == 2) {
            return assign(this.getBallStyle(size), {
                border: moonSize + 'px solid ' + this.props.color,
                opacity: 0.1
            })
        } else {
            return assign(this.getAnimationStyle(i), {
                position: 'relative'
            })
        }
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
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

    render: function render() {
        return this.renderLoader(this.props.loading)
    }
})

module.exports = Loader
