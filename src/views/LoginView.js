'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { CSSTransitionGroup } from 'react-transition-group'
import LoadAsync from '../components/Loadable'

import { version } from '../../package.json'

import Logger from '../utils/logger'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/LoginView.scss'

const BackgroundAnimation = LoadAsync({
  loader: () =>
    import(/* webpackChunkName: "BackgroundAnimation" */ '../components/BackgroundAnimation')
})
const LoginForm = LoadAsync({
  loader: () => import(/* webpackChunkName: "LoginForm" */ '../components/LoginForm')
})

const logger = new Logger()

class LoginView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    location: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.onConfigure = this.onConfigure.bind(this)
    this.onLogin = this.onLogin.bind(this)
    this.focusUsernameInput = this.focusUsernameInput.bind(this)
  }

  componentDidMount () {
    const { uiStore } = this.context
    uiStore.setTitle('Login | Orbit')
    uiStore.closeControlPanel()
  }

  onConfigure () {
    logger.warn('Settings view not implemented')
  }

  onLogin (e, username) {
    const { sessionStore } = this.context

    e.preventDefault()

    if (username !== '') {
      sessionStore.login({ username }).catch(e => {
        logger.error(e)
      })
    }
  }

  focusUsernameInput () {
    if (this.usernameInputRef) this.usernameInputRef.current.focus()
  }

  render () {
    const { sessionStore, uiStore } = this.context
    const { t, location } = this.props

    const { from } = location.state || { from: { pathname: '/' } }

    if (sessionStore.isAuthenticated) return <Redirect to={from} />

    return (
      <div className="LoginView">
        <CSSTransitionGroup
          className="header"
          transitionName="loginHeaderAnimation"
          transitionAppear={true}
          component="div"
          transitionAppearTimeout={5000}
          transitionEnterTimeout={5000}
          transitionLeaveTimeout={5000}
        >
          <h1 onClick={this.focusUsernameInput}>Orbit</h1>
        </CSSTransitionGroup>
        <LoginForm
          theme={{ ...uiStore.theme }}
          onSubmit={this.onLogin}
          setUsernameInputRef={ref => (this.usernameInputRef = ref)}
        />
        <div className="Version">
          {t('version')}: {version}
        </div>
        <button
          type="button"
          className="ConfigurationButton submitButton"
          style={{ ...uiStore.theme }}
          onClick={this.onConfigure}
        >
          {t('configuration')}
        </button>
        <BackgroundAnimation
          size={480}
          theme={{ ...uiStore.theme }}
          onClick={this.focusUsernameInput}
        />
      </div>
    )
  }
}

export default hot(module)(withTranslation()(observer(LoginView)))
