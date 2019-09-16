'use strict'

import React from 'react'
import { useObserver } from 'mobx-react'

import RootContext from '../context/RootContext'

import PrivateRoute from '../components/PrivateRoute'

function PrivateRouteWithContext ({ ...rest }) {
  const { sessionStore } = React.useContext(RootContext)
  return useObserver(() => (
    <PrivateRoute {...rest} isAuthenticated={sessionStore.isAuthenticated} />
  ))
}

export default PrivateRouteWithContext
