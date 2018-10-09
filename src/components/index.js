'use strict'
import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import App from './App'

import { version } from '../../package.json'

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('content')
)

console.info(`Version ${version} running`)
