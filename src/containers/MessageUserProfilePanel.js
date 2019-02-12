'use strict'

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'

import Countries from '../config/countries.json'

import RootStoreContext from '../context/RootStoreContext'

import BackgroundAnimation from '../components/BackgroundAnimation'

import '../styles/MessageUserProfilePanel.scss'
import earthImg from '../images/earth.png'

function MessageUserProfilePanel () {
  const { uiStore } = useContext(RootStoreContext)
  const [t] = useTranslation()

  return (
    <Observer>
      {() =>
        uiStore.userProfilePanelIsOpen ? (
          <div
            className="MessageUserProfilePanel"
            style={calculatePanelStyle(uiStore.userProfilePanelPosition, uiStore.windowDimensions)}>
            <BackgroundAnimation
              style={{ top: '-30px', left: '-70px', zIndex: '-1', display: 'block' }}
              size={256}
              theme={{ ...uiStore.theme }}
            />
            <span className="close" onClick={uiStore.closeUserProfilePanel}>
              X
            </span>
            {renderUserCard(t, uiStore.userProfilePanelUser)}
          </div>
        ) : null
      }
    </Observer>
  )
}

function calculatePanelStyle (panelPosition, windowDimensions) {
  const { x: left, y: top } = panelPosition
  const translateHorizontal = left > windowDimensions.width / 2 ? '-100%' : '0'
  const translateVertical = top > windowDimensions.height / 2 ? '-100%' : '0'
  return {
    left,
    top,
    transform: `translate(${translateHorizontal}, ${translateVertical})`
  }
}

function renderUserCard (t, user) {
  const country = Countries[user.profile.location]
  return (
    <React.Fragment>
      <CSSTransitionGroup
        transitionName="profilePictureAnimation"
        transitionAppear={true}
        component="div"
        transitionAppearTimeout={1500}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}>
        <img className="picture" src={earthImg} />
      </CSSTransitionGroup>
      <div className="name">{user.profile.name}</div>
      <div className="country">{country ? country + ', Earth' : 'Earth'}</div>
      <dl className="profileDataContainer">
        <dt>{t('userProfile.identityType')}:</dt>
        <dd>{user.identity.type}</dd>
        <dt>{t('userProfile.identityId')}:</dt>
        <dd className="code">{user.identity.id}</dd>
        <dt>{t('userProfile.identityPublicKey')}:</dt>
        <dd className="code">{user.identity.publicKey}</dd>
      </dl>
    </React.Fragment>
  )
}

MessageUserProfilePanel.propTypes = {}

export default MessageUserProfilePanel
