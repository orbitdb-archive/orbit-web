'use strict'

import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'

import { version } from '../package.json'

import { BigSpinner } from './components/Spinner'

import './styles/normalize.css'
import './styles/Fonts.scss'
import './styles/Main.scss'
import './styles/flaticon.css'

const App = lazy(() => import(/* webpackChunkName: "App" */ './views/App'))

render(
  <Suspense fallback={<BigSpinner />}>
    <App />
  </Suspense>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
