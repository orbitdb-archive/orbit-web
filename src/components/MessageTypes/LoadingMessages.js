'use strict'

import React from 'react'
import { useTranslation } from 'react-i18next'

function LoadingMessages ({ ...rest }) {
  const [t] = useTranslation()

  return (
    <div className="loadingMessages" {...rest}>
      {t('channel.loadingHistory')}
    </div>
  )
}

export default LoadingMessages
