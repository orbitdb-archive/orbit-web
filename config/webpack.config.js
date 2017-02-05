'use strict'

const webpack = require('webpack')
const path = require('path')
const common = require('./common.config.js')

let config = {
  output: {
    path: path.resolve(process.cwd(), 'dist/assets/'),
    publicPath: '/assets/',
    filename: '[name].js'
  },
  entry: {
    app: [
      'webpack/hot/only-dev-server',
      './src/components/App.js'
    ]
  },
  target: 'web',
  devtool: 'sourcemap',
  cache: false,
  // TODO: check if still needed with the new webpack-dev-server
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

Object.assign(config, common)

module.exports = config
