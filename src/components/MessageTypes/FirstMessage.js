'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'

function FirstMessage ({ loading, hasMoreHistory, channelName, observeReaction, ...rest }) {
  const [t] = useTranslation()
  const [inViewRef, inView] = useInView()
  if (inView && !loading && hasMoreHistory) {
    observeReaction()
  }
  return (
    <div className={classNames('firstMessage', { hasMoreHistory })} ref={inViewRef} {...rest}>
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
  channelName: PropTypes.string.isRequired,
  observeReaction: PropTypes.func
}

export default FirstMessage
