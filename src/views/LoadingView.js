'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { CSSTransitionGroup } from 'react-transition-group'
import LoadAsync from '../components/Loadable'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/LoadingView.scss'

const BackgroundAnimation = LoadAsync({
  loader: () =>
    import(/* webpackChunkName: "BackgroundAnimation" */ '../components/BackgroundAnimation')
})

class LoadingView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { uiStore } = this.context
    uiStore.setTitle('Loading | Orbit')
  }

  render () {
    const { uiStore } = this.context
    const { t } = this.props

    const transitionProps = {
      transitionAppear: true,
      transitionAppearTimeout: 5000,
      transitionEnterTimeout: 5000,
      transitionLeaveTimeout: 5000
    }

    return (
      <div className="LoadingView">
        <CSSTransitionGroup
          className="header"
          component="div"
          transitionName="loadingHeaderAnimation"
          {...transitionProps}
        >
          <h1>{t('loading')}</h1>
        </CSSTransitionGroup>
        <BackgroundAnimation size={480} theme={{ ...uiStore.theme }} />
      </div>
    )
  }
}

export default withTranslation()(observer(LoadingView))
