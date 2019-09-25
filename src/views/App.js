'use strict'

import { HashRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { useObserver } from 'mobx-react'

import i18n from '../config/i18n.config'

import RootStore from '../stores/RootStore'

import { addDebug } from '../utils/debug'
import { askPermission } from '../utils/notify'
import { usePrivateRoutes } from '../utils/hooks'

import PrivateRouteWithContext from '../containers/PrivateRouteWithContext'

import RootContext from '../context/RootContext'

import { BigSpinner } from '../components/Spinner'

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

function AppView ({ isAuthenticated }) {
  const location = useLocation()
  const redirectToLogin = usePrivateRoutes(['/', '/settings', '/channel/:channel'], isAuthenticated)

  return (
    <div className='App view'>
      <React.Suspense fallback={<BigSpinner />}>
        {/* Controlpanel */}
        <Route children={props => <ControlPanel {...props} />} />

        {/* Channelheader */}
        <Route exact path={['/channel/:channel', '/settings']} component={ChannelHeader} />

        <Switch>
          {/* Channel */}
          <Route exact path='/channel/:channel' component={ChannelView} />

          {/* Settings */}
          <Route exact path='/settings' component={SettingsView} />

          {/* Log out */}
          <Route exact path='/logout' component={LogoutView} />

          {/* Log in */}
          <Route exact path={loginPath} component={LoginView} />

          {/* Index */}
          <Route component={IndexView} />
        </Switch>

        {/* Render an alpha disclaimer on login page */}
        <Route exact path={loginPath} component={AlphaDisclaimer} />

        {redirectToLogin ? (
          <Redirect
            to={{
              pathname: loginPath,
              state: { from: location }
            }}
          />
        ) : null}
      </React.Suspense>
    </div>
  )
}

function App () {
  return (
    <RootContext.Provider value={rootStore}>
      <Router>
        {useObserver(() => (
          <AppView isAuthenticated={rootStore.sessionStore.isAuthenticated} />
        ))}
      </Router>
    </RootContext.Provider>
  )
}

export default App
