'use strict'

const path = require('path')

module.exports = {
  entry: {
    app: ['@babel/polyfill', './src/components/index.js']
  },
  output: {
    path: path.resolve(process.cwd(), 'dist/assets/'),
    publicPath: '/assets/',
    filename: '[name].js',
    chunkFilename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      app: path.join(__dirname, '../src/app/'),
      actions: path.join(__dirname, '../src/actions/'),
      components: path.join(__dirname, '../src/components/'),
      fonts: path.join(__dirname, '../src/fonts'),
      lib: path.join(__dirname, '../src/lib/'),
      stores: path.join(__dirname, '../src/stores/'),
      styles: path.join(__dirname, '../src/styles'),
      utils: path.join(__dirname, '../src/utils/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { url: false } }]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', { loader: 'css-loader', options: { url: false } }, 'sass-loader']
      },
      {
        test: /\.(png|jpg)$/,
        use: { loader: 'url-loader', options: { limit: 8192 } }
      },
      {
        test: /\.(png|jpg)$/,
        use: { loader: 'file-loader', options: { name: '[path][name].[ext]' } }
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
