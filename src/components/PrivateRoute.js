'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute ({ component: Component, isAuthenticated, loginPath, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : loginPath ? (
          <Redirect
            to={{
              pathname: loginPath,
              state: { from: props.location }
            }}
          />
        ) : null
      }
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.object.isRequired]),
  isAuthenticated: PropTypes.bool.isRequired,
  loginPath: PropTypes.string,
  location: PropTypes.object
}

export default PrivateRoute
