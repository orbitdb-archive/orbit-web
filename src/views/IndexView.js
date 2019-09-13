'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import { autorun } from 'mobx'

import RootStoreContext from '../context/RootStoreContext'

function IndexView () {
  const { networkStore, uiStore, appState, setAppState } = React.useContext(RootStoreContext)

  React.useEffect(() => {
    uiStore.setTitle('Orbit')
  }, [])

  React.useEffect(
    () =>
      autorun(() => {
        if (networkStore.channelsAsArray.length === 1) {
          setAppState(
            Object.assign({}, appState, {
              redirectTo: `/channel/${networkStore.channelsAsArray[0]}`
            })
          )
        } else {
          setAppState(
            Object.assign({}, appState, {
              redirectTo: `/channel/${networkStore.defaultChannels[0]}`
            })
          )
        }
      }),
    []
  )

  return null
}

export default hot(module)(IndexView)
