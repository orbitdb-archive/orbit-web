'use strict'

import React, { useContext } from 'react'
import { observer } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import PrivateRoute from '../components/PrivateRoute'

function PrivateRouteWithContext ({ ...rest }) {
  const { sessionStore } = useContext(RootStoreContext)

  return sessionStore ? (
    <PrivateRoute {...rest} isAuthenticated={sessionStore.isAuthenticated} />
  ) : null
}

export default observer(PrivateRouteWithContext)
