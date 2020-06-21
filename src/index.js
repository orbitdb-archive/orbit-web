'use strict'

import React from 'react'
import { render } from 'react-dom'

import { version } from '../package.json'

import redirectToHttps from './utils/https'

import { BigSpinner } from './components/Spinner'

import './styles/normalize.css'
import './styles/Fonts.scss'
import './styles/Main.scss'
import './styles/flaticon.css'



import Vconsole from './vconsole'

//redirectToHttps(!(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === 'orbit.chat.ipns.localhost'))

const App = React.lazy(() => import(/* webpackChunkName: "App" */ './views/App'))

render(
  <React.Suspense fallback={<BigSpinner />}>
    adsfsadf
    <App />
  </React.Suspense>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
