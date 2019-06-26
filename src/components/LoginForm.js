'use strict'

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import { useTranslation } from 'react-i18next'

import metamaskLogo from '../images/metamask-fox.svg'

import '../styles/SubmitButton.scss'
import '../styles/InputField.scss'

function LoginForm ({ theme, onSubmit, setUsernameInputRef, enableMetamask, metamaskEnabled }) {
  const [t] = useTranslation()
  const [currentLength, setCurrentLength] = useState(0)

  const usernameInputRef = useRef()

  useEffect(() => {
    if (typeof setUsernameInputRef === 'function') setUsernameInputRef(usernameInputRef)
    return () => {
      if (typeof setUsernameInputRef === 'function') setUsernameInputRef(null)
    }
  })

  return (
    <form onSubmit={e => onSubmit(e, usernameInputRef.current.value.trim())}>
      <CSSTransitionGroup
        transitionName="loginScreenAnimation"
        transitionAppear={true}
        component="div"
        className="inputs"
        transitionAppearTimeout={5000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}
      >
        <div className="usernameRow" onClick={() => usernameInputRef.current.focus()}>
          <input
            ref={usernameInputRef}
            type="text"
            placeholder={t('login.nickname')}
            maxLength="32"
            autoFocus
            style={theme}
            onChange={() => setCurrentLength(usernameInputRef.current.value.length)}
          />
        </div>
        <div className="connectButtonRow">
          <span className="hint">{currentLength > 0 ? t('login.pressEnterToLogin') : null}</span>
          <input type="submit" value="Connect" style={{ display: 'none' }} />
        </div>
        <div className="loginOptions">
          <button
            onClick={enableMetamask}
            className={`metamaskButton${metamaskEnabled ? ' enabled' : ''}`}
          >
            <img src={metamaskLogo} className="metamaskLogo" />
            {metamaskEnabled ? t('login.metamask.enabled') : t('login.metamask.disabled')}
          </button>
        </div>
      </CSSTransitionGroup>
    </form>
  )
}

LoginForm.propTypes = {
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setUsernameInputRef: PropTypes.func,
  enableMetamask: PropTypes.func,
  metamaskEnabled: PropTypes.bool
}

export default LoginForm
