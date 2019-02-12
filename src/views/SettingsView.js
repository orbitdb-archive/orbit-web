'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { CSSTransitionGroup } from 'react-transition-group'

import settingsOptions from '../config/setting.options.json'

import locales from '../locales'
import themes from '../themes'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/SettingsView.scss'

settingsOptions.themeName.options = Object.keys(themes)
settingsOptions.language.options = Object.keys(locales)

class SettingsView extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.renderField = this.renderField.bind(this)
    this.renderSelectField = this.renderSelectField.bind(this)
    this.renderBooleanField = this.renderBooleanField.bind(this)
  }

  componentDidMount () {
    const { uiStore } = this.context
    const { t } = this.props
    uiStore.setTitle(`${t('viewNames.settings')} | Orbit`)
  }

  handleChange (e, field) {
    const { uiStore } = this.context
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    uiStore[field.name] = value
  }

  renderSelectField (field) {
    const { uiStore } = this.context
    const { t } = this.props
    return (
      <select value={uiStore[field.name]} onChange={e => this.handleChange(e, field)}>
        {field.options.map(o => (
          <option key={`${field.name}-${o}`} value={o}>
            {t(`settings.options.${field.name}.${o}`)}
          </option>
        ))}
      </select>
    )
  }

  renderBooleanField (field) {
    const { uiStore } = this.context
    return (
      <input
        name={field.name}
        type="checkbox"
        checked={uiStore[field.name]}
        onChange={e => this.handleChange(e, field)}
      />
    )
  }

  renderField (key) {
    const { t } = this.props

    const field = settingsOptions[key]
    field.name = key

    let fieldEl
    switch (field.type) {
      case 'select':
        fieldEl = this.renderSelectField(field)
        break
      case 'boolean':
        fieldEl = this.renderBooleanField(field)
        break
      default:
        break
    }

    return (
      <CSSTransitionGroup
        key={field.name}
        transitionName="rowAnimation"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        component="div"
        className="row">
        <span className="key">{t(`settings.names.${field.name}`)}</span>
        {fieldEl}
        {field.description ? (
          <span className="description">{t(`settings.descriptions.${field.description}`)}</span>
        ) : null}
      </CSSTransitionGroup>
    )
  }

  render () {
    return <div className="SettingsView">{Object.keys(settingsOptions).map(this.renderField)}</div>
  }
}

export default hot(module)(withTranslation()(observer(SettingsView)))
