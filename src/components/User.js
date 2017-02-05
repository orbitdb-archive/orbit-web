'use strict'

import React from 'react'
import Profile from 'components/Profile'
import createColor from 'utils/create-color'
import 'styles/User.scss'

const getUserColor = (props) => {
  return props.colorify && props.user
    ? createColor(props.user.name) 
    : 'rgb(250, 250, 250)'
}

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
      highlight: props.highlight,
      color: getUserColor(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      highlight: nextProps.highlight,
      color: getUserColor(nextProps)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.user 
      && this.state.user.id !== nextState.user 
      && nextState.user.id
  }

  render() {
    const { user, color, highlight } = this.state
    const className = highlight ? 'User command' : 'User'

    return (
      <div
        className={className}
        style={{ color: color }}
        onClick={this.props.onShowProfile}
      >
        {user ? user.name : ''}
      </div>
    )
  }
}

export default User
