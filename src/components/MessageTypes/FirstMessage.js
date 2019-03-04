'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

function FirstMessage ({ loading, hasMoreHistory, channelName, ...rest }) {
  const [t] = useTranslation()

  return (
    <div className={classNames('firstMessage', { hasMoreHistory })} {...rest}>
      {loading
        ? t('channel.loadingHistory')
        : hasMoreHistory
          ? t('channel.loadMore', { channel: channelName })
          : t('channel.beginningOf', { channel: channelName })}
    </div>
  )
}

FirstMessage.propTypes = {
  loading: PropTypes.bool.isRequired,
  hasMoreHistory: PropTypes.bool.isRequired,
  channelName: PropTypes.string.isRequired
}

export default FirstMessage
