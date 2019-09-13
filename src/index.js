'use strict'

import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'

import { version } from '../package.json'

import Spinner from './components/Spinner'

import './styles/normalize.css'
import './styles/Main.scss'

const App = lazy(() => import(/* webpackChunkName: "App" */ './views/App'))

render(
  <Suspense fallback={<Spinner className='spinner suspense-fallback' size='64px' />}>
    <App />
  </Suspense>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
