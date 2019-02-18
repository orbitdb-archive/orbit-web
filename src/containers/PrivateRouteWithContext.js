'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import PrivateRoute from '../components/PrivateRoute'

class PrivateRouteWithContext extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    loginPath: PropTypes.string.isRequired
  }

  render () {
    const { sessionStore } = this.context
    const { loginPath, ...rest } = this.props

    if (!sessionStore) return null

    return (
      <PrivateRoute
        {...rest}
        loginPath={loginPath}
        isAuthenticated={sessionStore.isAuthenticated}
      />
    )
  }
}

export default observer(PrivateRouteWithContext)
