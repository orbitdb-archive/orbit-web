'use strict'

import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import i18n from '../config/i18n.config'

import RootStore from '../stores/RootStore'

import { addDebug } from '../utils/debug'

import PrivateRouteWithContext from '../containers/PrivateRouteWithContext'

import RootStoreContext from '../context/RootStoreContext'

import LoadAsync from '../components/Loadable'

import '../styles/normalize.css'
import '../styles/Main.scss'
import '../styles/App.scss'
import '../styles/Scrollbars.scss'

const rootStore = new RootStore(i18n)

// Load default settings
rootStore.settingsStore.load()

// Load a session (user) from cache
rootStore.sessionStore.loadFromCache()

addDebug({ rootStore })

const loginPath = '/connect'

const ControlPanel = LoadAsync({
  loader: () => import(/* webpackChunkName: "ControlPanel" */ '../containers/ControlPanel')
})

const ChannelHeader = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelHeader" */ '../containers/ChannelHeader')
})

const ChannelView = LoadAsync({
  loader: () => import(/* webpackChunkName: "ChannelView" */ './ChannelView')
})

const IndexView = LoadAsync({
  loader: () => import(/* webpackChunkName: "IndexView" */ './IndexView')
})

const LoginView = LoadAsync({
  loader: () => import(/* webpackChunkName: "LoginView" */ './LoginView')
})

const SettingsView = LoadAsync({
  loader: () => import(/* webpackChunkName: "SettingsView" */ './SettingsView')
})

const AlphaDisclaimer = LoadAsync({
  loader: () => import(/* webpackChunkName: "AlphaDisclaimer" */ '../containers/AlphaDisclaimer')
})

function AppView () {
  return (
    <div className="App view">
      {/* Only render ControlPanel when logged in */}
      <PrivateRouteWithContext component={ControlPanel} loginPath={loginPath} />

      {/* Render ChannelHeader when in a channel OR when in settings */}
      <Route exact path="/channel/:channel" component={ChannelHeader} />
      <Route exact path="/settings" component={ChannelHeader} />

      <Switch>
        <Route exact path={loginPath} component={LoginView} />
        <PrivateRouteWithContext
          exact
          path="/channel/:channel"
          component={ChannelView}
          loginPath={loginPath}
        />
        <PrivateRouteWithContext
          exact
          path="/settings"
          component={SettingsView}
          loginPath={loginPath}
        />
        <PrivateRouteWithContext component={IndexView} loginPath={loginPath} />
      </Switch>

      {/* Render an alpha disclaimer on login page */}
      <Route exact path={loginPath} component={AlphaDisclaimer} />
    </div>
  )
}

function App () {
  return (
    <RootStoreContext.Provider value={rootStore}>
      <Router>
        {/* Render App in a route so it will receive the "location"
              prop and rerender properly on location changes */}
        <Route component={AppView} />
      </Router>
    </RootStoreContext.Provider>
  )
}

export default App
