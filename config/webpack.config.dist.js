'use strict'

const webpack = require('webpack')
const path = require('path')
const common = require('./common.config.js')
const Uglify = require('uglifyjs-webpack-plugin')

const extractCommons = new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: 'commons.js'
})

const uglifyOptions = {
  uglifyOptions: {
    mangle: false,
    compress: false,
  },
}

let config = {
  output: {
    path: path.resolve(process.cwd(), 'dist/assets/'),
    publicPath: '/assets/',
    filename: 'app.js'
  },
  entry: {
    app: './src/components/App.js'
  },
  target: 'web',
  plugins: [
    // extractCommons,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new Uglify(uglifyOptions),
  ]
}

Object.assign(config, common)

module.exports = config
