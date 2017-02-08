'use strict'

import React, { PropTypes } from 'react'
import MoonLoader from 'components/plugins/MoonLoader'

class Spinner extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.string,
  }

  static defaultProps = {
    className: 'spinner',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isLoading !== this.props.isLoading
  }

  render() {
    const { className, isLoading, color, size } = this.props
    return (
      <div className={className}>
        <MoonLoader className="spinnerIcon" loading={isLoading} color={color} size={size} />
      </div>
    )
  }

}

export default Spinner
