'use strict'

const common = require('./webpack.common.js')

const config = {
  mode: 'development',
  entry: {
    app: ['webpack/hot/only-dev-server', './src/components/App.js']
  },
  devtool: 'sourcemap',
  cache: false
}

module.exports = Object.assign(config, common)
