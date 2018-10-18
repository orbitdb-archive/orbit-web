'use strict'

import Reflux from 'reflux'

const AppActions = Reflux.createActions([
  'initialize',
  'login',
  'setLocation',
  'setChannel',
  'windowLostFocus',
  'windowOnFocus'
])

export default AppActions
