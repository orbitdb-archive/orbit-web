'use strict'

/**
 * Plugins used by Webpack to compile orbit-web
 */

const presets = [
  "es2015", 
  "stage-0", 
  "react"
]

const plugins = [
  // Use Flow, add support for the syntax
  "syntax-flow",
  "transform-flow-strip-types"
]

const babelPlugins = {
  "plugins": plugins.map((p) => require.resolve('babel-plugin-' + p)),
  "presets": presets.map((p) => require.resolve('babel-preset-' + p))
}

module.exports = babelPlugins
