'use strict'

import React from 'react'

import Loadable from 'react-loadable'
import Spinner from './Spinner'

function Loading (props) {
  if (props.error) {
    console.error('Error while loading component')
    return null
  } else if (props.timedOut) {
    console.error('Timeout while loading component')
    return null
  } else if (props.pastDelay) {
    return <Spinner />
  } else {
    return null
  }
}

function LoadAsync (opts) {
  return Loadable(
    Object.assign(
      {
        loading: Loading,
        delay: 200,
        timeout: 10000
      },
      opts
    )
  )
}

export default LoadAsync
