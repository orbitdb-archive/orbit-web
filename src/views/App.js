'use strict'

import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import i18n from '../config/i18n.config'

import RootStore from '../stores/RootStore'

import { addDebug } from '../utils/debug'
import { askPermission } from '../utils/notify'

import PrivateRouteWithContext from '../containers/PrivateRouteWithContext'

import RootContext from '../context/RootContext'

import Spinner from '../components/Spinner'

import '../styles/App.scss'
import '../styles/Scrollbars.scss'

const rootStore = new RootStore(i18n)

// Load settings
rootStore.settingsStore.load()

// Load a session (user) from cache
rootStore.sessionStore.loadFromCache()

addDebug({ rootStore })

askPermission()

const loginPath = '/connect'

const ControlPanel = lazy(() =>
  import(/* webpackChunkName: "ControlPanel" */ '../containers/ControlPanel')
)

const ChannelHeader = lazy(() =>
  import(/* webpackChunkName: "ChannelHeader" */ '../containers/ChannelHeader')
)

const ChannelView = lazy(() => import(/* webpackChunkName: "ChannelView" */ './ChannelView'))

const IndexView = lazy(() => import(/* webpackChunkName: "IndexView" */ './IndexView'))

const LoginView = lazy(() => import(/* webpackChunkName: "LoginView" */ './LoginView'))

const LogoutView = lazy(() => import(/* webpackChunkName: "LogoutView" */ './LogoutView'))

const SettingsView = lazy(() => import(/* webpackChunkName: "SettingsView" */ './SettingsView'))

const AlphaDisclaimer = lazy(() =>
  import(/* webpackChunkName: "AlphaDisclaimer" */ '../containers/AlphaDisclaimer')
)

function AppView () {
  return (
    <div className='App view'>
      <Suspense fallback={<Spinner className='spinner suspense-fallback' size='64px' />}>
        {/* Controlpanel */}
        <PrivateRouteWithContext children={props => <ControlPanel {...props} />} />

        {/* Channelheader */}
        <PrivateRouteWithContext
          exact
          path={['/channel/:channel', '/settings']}
          component={ChannelHeader}
        />

        <Switch>
          {/* Channel */}
          <PrivateRouteWithContext
            exact
            path='/channel/:channel'
            loginPath={loginPath}
            component={ChannelView}
          />

          {/* Settings */}
          <PrivateRouteWithContext
            exact
            path='/settings'
            loginPath={loginPath}
            component={SettingsView}
          />

          {/* Log out */}
          <Route exact path='/logout' component={LogoutView} />

          {/* Log in */}
          <Route exact path={loginPath} component={LoginView} />

          {/* Index */}
          <PrivateRouteWithContext loginPath={loginPath} component={IndexView} />
        </Switch>

        {/* Render an alpha disclaimer on login page */}
        <Route exact path={loginPath} component={AlphaDisclaimer} />
      </Suspense>
    </div>
  )
}

function App () {
  return (
    <RootContext.Provider value={rootStore}>
      <Router>
        {/* Render App in a route so it will receive the "location"
              prop and rerender properly on location changes */}
        <Route children={props => <AppView {...props} />} />
      </Router>
    </RootContext.Provider>
  )
}

export default App
