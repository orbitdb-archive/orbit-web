'use strict'

import { useContext, useEffect } from 'react'
import { hot } from 'react-hot-loader'

import RootStoreContext from '../context/RootStoreContext'

function IndexView () {
  const { uiStore } = useContext(RootStoreContext)

  useEffect(() => {
    uiStore.setTitle('Orbit')
    uiStore.openControlPanel()
  })

  return null
}

export default hot(module)(IndexView)
