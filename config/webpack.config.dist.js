'use strict'

const webpack = require('webpack')
const path = require('path')
const common = require('./common.config.js')

let config = {
  output: {
    path: 'dist/assets/',
    publicPath: '/assets/',
    filename: 'app.js'
  },
  entry: {
    app: './src/components/App.js'
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}

Object.assign(config, common)

module.exports = config
