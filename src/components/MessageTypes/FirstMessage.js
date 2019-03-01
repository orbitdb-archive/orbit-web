'use strict'

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'

function FirstMessage ({ loading, hasMoreHistory, channelName, onInView, onInViewRoot, ...rest }) {
  const [t] = useTranslation()
  const [inViewRef, inView] = useInView({ root: onInViewRoot, threshold: 1 })

  useEffect(() => {
    if (inView && typeof onInView === 'function') onInView()
  }, [inView])

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
  onInView: PropTypes.func,
  onInViewRoot: PropTypes.instanceOf(Element)
}

export default FirstMessage
