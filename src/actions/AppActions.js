'use strict'

import Reflux from 'reflux'

const AppActions = Reflux.createActions([
  'initialize',
  'login',
  'disconnect',
  'setLocation',
  'setCurrentChannel',
  'windowLostFocus',
  'windowOnFocus'
])

export default AppActions
