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
      'utils': path.join(__dirname, '../src/utils/'),
      'fonts': path.join(__dirname, '../src/fonts')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelPlugins
      }, 
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          { loader: 'css-loader', options: { url: false }}
        ]
      }, 
      {
        test: /\.scss/,
        exclude: /\.(woff|woff2|ttf)$/,
        use: [
          'style-loader', 
          { loader: 'css-loader', options: { url: false }}, 
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg)$/,
        use: { loader: 'url-loader', options: { limit: 8192 }}
      }, 
      {
        test: /\.(png|jpg)$/,
        use: { loader: 'file-loader', options: { name: '[path][name].[ext]' }}
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
