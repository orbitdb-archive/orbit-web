'use strict'

import React from 'react'
import { observer } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import PrivateRoute from '../components/PrivateRoute'

function PrivateRouteWithContext ({ ...rest }) {
  const { sessionStore } = React.useContext(RootStoreContext)
  return <PrivateRoute {...rest} isAuthenticated={sessionStore.isAuthenticated} />
}

export default observer(PrivateRouteWithContext)
