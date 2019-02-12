/* eslint-disable no-global-assign */
require('@babel/register')()
require('babel-polyfill')
require('ignore-styles')

const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const jsdom = require('jsdom')
MediaSource = require('mediasource')
const { JSDOM } = jsdom

configure({ adapter: new Adapter() })
const { window } = new JSDOM()
window.MediaSource = MediaSource
global.document = window.document
global.window = window

global.navigator = {
  userAgent: 'node.js'
}
