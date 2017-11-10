'use strict'

const webpack = require('webpack')
const path = require('path')
const common = require('./common.config.js')

const extractCommons = new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: 'commons.js'
})

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
    ],
    // commons: [
    //   './node_modules/bignumber.js/bignumber.js',
    //   './node_modules/bn.js/lib/bn.js',
    //   // './node_modules/dexie/dist/dexie.js',
    //   './node_modules/orbit_/src/Orbit.js',
    //   './src/utils/emojilist.js', 
    //   './node_modules/highlight.js/lib/index.js'
    // ],
  },
  target: 'web',
  devtool: 'sourcemap',
  cache: false,
  // TODO: check if still needed with the new webpack-dev-server
  devServer: {
    contentBase: './dist',
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  plugins: [
    // extractCommons,
    new webpack.HotModuleReplacementPlugin(),
  ]
}

Object.assign(config, common)

module.exports = config
