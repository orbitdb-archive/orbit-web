'use strict'

import Reflux from 'reflux'

const ChannelActions = Reflux.createActions([
  'reachedChannelStart',
  'channelInfoReceived',
  'loadMessages',
  'loadMoreMessages',
  'sendMessage',
  'addFile',
  'loadPost',
  'loadFile',
  'loadDirectoryInfo',
  'setChannelMode',
  'channelModeUpdated'
])

export default ChannelActions
