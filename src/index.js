'use strict'

import React from 'react'
import { render } from 'react-dom'
import LoadAsync from './components/Loadable'

import offlinePluginRuntime from 'offline-plugin/runtime'

import { version } from '../package.json'

const App = LoadAsync({
  loader: () => import(/* webpackChunkName: "App" */ './views/App')
})

if (process.env.NODE_ENV === 'production') {
  offlinePluginRuntime.install()
}

render(<App />, document.getElementById('root'))

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
