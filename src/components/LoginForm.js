'use strict'

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import { useTranslation } from 'react-i18next'

import '../styles/SubmitButton.scss'
import '../styles/InputField.scss'

function LoginForm ({ theme, onSubmit, setUsernameInputRef }) {
  const [t] = useTranslation()
  const [usernameLength, setUsernameLength] = useState(0)
  const [passwordLength, setPasswordLength] = useState(0)

  const usernameInputRef = useRef()
  const passwordInputRef = useRef()
  var PasswordRequired = false

  useEffect(() => {
    if (typeof setUsernameInputRef === 'function') setUsernameInputRef(usernameInputRef)
    if (typeof setPasswordInputRef === 'function') setPasswordInputRef(passwordInputRef)
    return () => {
      if (typeof setUsernameInputRef === 'function') setUsernameInputRef(null)
      if (typeof setPasswordInputRef === 'function') setPasswordInputRef(null)
    }
  })

  return (
    <form onSubmit={e => passwordLength > 0 ?(onSubmit(e, usernameInputRef.current.value.trim(),passwordInputRef.current.value.trim())):(PasswordRequired=true)}>
      <CSSTransitionGroup
        transitionName="loginScreenAnimation"
        transitionAppear={true}
        component="div"
        className="inputs"
        transitionAppearTimeout={5000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}>
        <div className="usernameRow" onClick={() => usernameInputRef.current.focus()}>
          <input
            ref={usernameInputRef}
            type="text"
            placeholder={t('Email')}
            maxLength="32"
            autoFocus
            style={theme}
            onChange={() => setUsernameLength(usernameInputRef.current.value.length)}
          />
        </div>
        <div className="usernameRow" >
          <input  
            ref={passwordInputRef}          
            type="password"
            placeholder={t('Password')}
            maxLength="32"
            style={theme}
            onChange={() => setPasswordLength(passwordInputRef.current.value.length)}
           />
        </div>
        <div className="connectButtonRow">
          <span className="hint">{usernameLength > 0 ? t('login.pressEnterToLogin') : PasswordRequired=false }</span>
          <span className="hint">{usernameLength > 0 ? null : (PasswordRequired = true ? t('Please provide the username and password'): null )}</span>
          <input type="submit" value="Connect" style={{ display: 'none' }} />
        </div>
      </CSSTransitionGroup>
    </form>
  )
}

LoginForm.propTypes = {
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setUsernameInputRef: PropTypes.func
}

export default LoginForm
