'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import MoonLoader from 'components/plugins/MoonLoader'

class Spinner extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isLoading !== this.props.isLoading
  }

  render () {
    const { className, isLoading, color, size } = this.props
    return (
      <div className={className}>
        <MoonLoader className="spinnerIcon" loading={isLoading} color={color} size={size} />
      </div>
    )
  }
}

Spinner.defaultProps = {
  className: 'spinner'
}

Spinner.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string
}

export default Spinner
