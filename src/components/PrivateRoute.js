'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute ({ component: Component, loginPath, isAuthenticated, ...rest }) {
  function renderComponent (props) {
    return isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: loginPath,
          state: { from: props.location }
        }}
      />
    )
  }

  return <Route {...rest} render={renderComponent} />
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  loginPath: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.object
}

export default PrivateRoute
