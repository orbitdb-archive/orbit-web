'use strict'

import React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'

import RootStoreContext from '../context/RootStoreContext'

import '../styles/DevTools.scss'

@observer
class DebugChannelList extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { networkStore } = this.context
    return (
      <div>
        Channels: <br />
        <ul>
          {networkStore.channelsAsArray.map(channel => (
            <li key={channel.channelName}>
              <strong>Channel name: {channel.channelName}</strong> <br />
              <strong>Peers: {channel.peers.length}</strong> <br />
              <button onClick={() => networkStore.leaveChannel(channel.channelName)}>Leave</button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

@observer
class DebugControlButtons extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { ipfsStore, sessionStore, networkStore, uiStore } = this.context

    return (
      <div>
        <button
          onClick={() => sessionStore.login({ username: 'test-user-' + Date.now() })}
          disabled={sessionStore.isAuthenticated}
        >
          Login
        </button>
        <button onClick={() => sessionStore.logout()} disabled={!sessionStore.isAuthenticated}>
          Logout
        </button>
        <br />
        <button
          onClick={() => ipfsStore.useGoIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !sessionStore.username}
        >
          Use go-ipfs
        </button>
        <button
          onClick={() => ipfsStore.useJsIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !sessionStore.username}
        >
          Use js-ipfs
        </button>
        <button onClick={() => networkStore.stop()} disabled={!networkStore.isOnline}>
          Stop
        </button>

        <br />
        <Link to="/channel/test1">
          <button>Channel test1</button>
        </Link>
        <Link to="/channel/test2">
          <button>Channel test2</button>
        </Link>
        <Link to="/channel/test3">
          <button>Channel test3</button>
        </Link>
        <br />
        <button onClick={() => uiStore.toggleControlPanel()}>Toggle control panel</button>
        <button
          disabled={uiStore.sidePanelPosition === 'left'}
          onClick={() => (uiStore.sidePanelPosition = 'left')}
        >
          Left side
        </button>
        <button
          disabled={!uiStore.sidePanelPosition === 'right'}
          onClick={() => (uiStore.sidePanelPosition = 'right')}
        >
          Right side
        </button>

        <br />
        <br />

        <button
          disabled={uiStore.themeName === 'Default'}
          onClick={() => (uiStore.themeName = 'Default')}
        >
          Set default theme
        </button>
        <button
          disabled={uiStore.themeName === 'Green'}
          onClick={() => (uiStore.themeName = 'Green')}
        >
          Set green theme
        </button>
        <button
          disabled={uiStore.themeName === 'Blue1'}
          onClick={() => (uiStore.themeName = 'Blue1')}
        >
          Set blue theme
        </button>

        <br />

        <button disabled={uiStore.language === 'en'} onClick={() => (uiStore.language = 'en')}>
          Set locale to EN
        </button>
        <button disabled={uiStore.language === 'fi'} onClick={() => (uiStore.language = 'fi')}>
          Set locale to FI
        </button>

        <br />

        <button
          disabled={uiStore.colorifyUsernames}
          onClick={() => (uiStore.colorifyUsernames = true)}
        >
          Set colorifyUsernames to true
        </button>
        <button
          disabled={!uiStore.colorifyUsernames}
          onClick={() => (uiStore.colorifyUsernames = false)}
        >
          Set colorifyUsernames to false
        </button>

        <br />

        <button disabled={uiStore.useEmojis} onClick={() => (uiStore.useEmojis = true)}>
          Set useEmojis to true
        </button>
        <button disabled={!uiStore.useEmojis} onClick={() => (uiStore.useEmojis = false)}>
          Set useEmojis to false
        </button>

        <br />

        <button
          disabled={uiStore.emojiSet === 'emojione'}
          onClick={() => (uiStore.emojiSet = 'emojione')}
        >
          Set emojiSet to emojione
        </button>
        <button
          disabled={uiStore.emojiSet === 'google'}
          onClick={() => (uiStore.emojiSet = 'google')}
        >
          Set emojiSet to google
        </button>
        <button
          disabled={uiStore.emojiSet === 'apple'}
          onClick={() => (uiStore.emojiSet = 'apple')}
        >
          Set emojiSet to apple
        </button>
        <br />
        <button
          disabled={uiStore.emojiSet === 'facebook'}
          onClick={() => (uiStore.emojiSet = 'facebook')}
        >
          Set emojiSet to facebook
        </button>
        <button
          disabled={uiStore.emojiSet === 'twitter'}
          onClick={() => (uiStore.emojiSet = 'twitter')}
        >
          Set emojiSet to twitter
        </button>

        <br />

        <button disabled={uiStore.useLargeMessage} onClick={() => (uiStore.useLargeMessage = true)}>
          Set useLargeMessage to true
        </button>
        <button
          disabled={!uiStore.useLargeMessage}
          onClick={() => (uiStore.useLargeMessage = false)}
        >
          Set useLargeMessage to false
        </button>

        <br />

        <button
          disabled={uiStore.useMonospaceFont}
          onClick={() => (uiStore.useMonospaceFont = true)}
        >
          Set useMonospaceFont to true
        </button>
        <button
          disabled={!uiStore.useMonospaceFont}
          onClick={() => (uiStore.useMonospaceFont = false)}
        >
          Set useMonospaceFont to false
        </button>

        <br />
        <br />
      </div>
    )
  }
}

@observer
class DevTools extends React.Component {
  static contextType = RootStoreContext

  render () {
    // const { networkStore } = this.context
    return (
      <div className="devtools">
        <DebugControlButtons />
        {/* <br />
        <br /> */}
        {/* {networkStore.isOnline ? <DebugChannelList /> : null} */}
      </div>
    )
  }
}

export default DevTools
