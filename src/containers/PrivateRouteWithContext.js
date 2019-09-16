'use strict'

import React from 'react'
import { useObserver } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import PrivateRoute from '../components/PrivateRoute'

function PrivateRouteWithContext ({ ...rest }) {
  const { sessionStore } = React.useContext(RootStoreContext)
  return useObserver(() => (
    <PrivateRoute {...rest} isAuthenticated={sessionStore.isAuthenticated} />
  ))
}

export default PrivateRouteWithContext
