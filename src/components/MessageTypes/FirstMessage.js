'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

function FirstMessage ({ channelName, ...rest }) {
  const [t] = useTranslation()

  return (
    <div className="firstMessage" {...rest}>
      {t('channel.beginningOf', { channel: channelName })}
    </div>
  )
}

FirstMessage.propTypes = {
  channelName: PropTypes.string.isRequired
}

export default FirstMessage
