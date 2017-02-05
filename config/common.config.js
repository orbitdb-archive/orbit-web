'use strict'

const webpack = require('webpack')
const path = require('path')
const babelPlugins = require('./babel-plugins')

module.exports = {
   node: {
    Buffer: true,
    console: false,
    process: 'mock'
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    alias: {
      'node_modules': path.join(__dirname + '/node_modules'),
      'zlib': 'browserify-zlib-next',
      'http': 'stream-http',
      'https': 'https-browserify',
      'Buffer': 'buffer',
      'app': path.join(__dirname, '../src/app/'),
      'styles': path.join(__dirname, '../src/styles'),
      'components': path.join(__dirname, '../src/components/'),
      'stores': path.join(__dirname, '../src/stores/'),
      'actions': path.join(__dirname, '../src/actions/'),
      'lib': path.join(__dirname, '../src/lib/'),
      'utils': path.join(__dirname, '../src/utils/')
    }
  },
  module: {
    loaders: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: babelPlugins
    }, 
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, 
    {
      test: /\.scss/,
      loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
    }, 
    {
      test: /\.(png|jpg|woff|woff2)$/,
      loader: 'url-loader?limit=8192'
    }, 
    {
      test: /\.(png|jpg)$/,
      loader: 'file-loader?name=[path][name].[ext]',
    }, 
    {
      test: /\.json$/,
      loader: 'json-loader'
    }
    ]
  },
  externals: {
    fs: '{}',
    du: '{}',
    net: '{}',
    tls: '{}',
    console: '{}',
    'require-dir': '{}',
    mkdirp: '{}'
  }
}
