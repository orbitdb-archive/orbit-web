'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Observer } from 'mobx-react'

function ChannelStatus ({ channel, theme }) {
  const [t] = useTranslation()
  return (
    <Observer>
      {() => (
        <div className="ChannelStatus" style={{ ...theme }}>
          {channel.userCount} {t('channel.status.users', { count: channel.userCount })}
        </div>
      )}
    </Observer>
  )
}

ChannelStatus.propTypes = {
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default ChannelStatus
