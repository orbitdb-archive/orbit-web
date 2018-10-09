'use strict'

import Reflux from 'reflux'

const IpfsDaemonActions = Reflux.createActions([
  'initConfiguration',
  'saveConfiguration',
  'start',
  'stop',
  'daemonStarted'
])

export default IpfsDaemonActions
