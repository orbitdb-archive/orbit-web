'use strict'

const path = require('path')
const webpack = require('webpack')

const common = require('./webpack.common.js')

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(process.cwd(), 'dist'),
    compress: true,
    hot: true,
    port: 8000,
    publicPath: '/assets/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}

module.exports = Object.assign(config, common)
