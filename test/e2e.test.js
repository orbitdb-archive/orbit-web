/* eslint-env jest */
/* globals page */

require('@babel/polyfill')
const path = require('path')

// URL of the http-server running the production build
const baseUrl = 'http://localhost:8088'

// Fixtures
const channelName = 'testchannel'
const channelName2 = 'testchannel2'
const username = 'testuser'
const testMessage = 'testing testing'
let timedMessage, timedMessage2, timedMessage3

/*
 * A test scenario of a user logging in,
 * and sending messages to different channels
 */
describe('User scenario', () => {
  beforeAll(async () => {
    await page.goto(baseUrl)
  })

  it('successfully loads', async () => {
    // App should load the Orbit login screen
    await page.waitForSelector('h1')
    await expect(page).toMatchElement('h1', { text: 'Orbit' })
  })

  it('is able to log in', async () => {
    // Wait for the username input, write "testuser" and press enter to log in
    await page.waitForSelector('input[type=text]')
    await expect(page).toFill('input[type=text]', username)
    await page.keyboard.press('Enter')

    // Wait for the default channel to show up, press the name to open the side panel
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toClick('.Header .ChannelName .currentChannel')

    // Shown username should equal "testuser" and the darkener(curtain) element should be visible
    await page.waitForSelector('.username')
    await page.waitForSelector('.darkener')
    await expect(page).toMatchElement('.username', { text: username })
    await expect(page).toClick('.darkener')
  })

  it('joins #orbitdb by default', async () => {
    // New user should join #orbitdb by default with the channel opened
    await page.waitForSelector('.Controls .SendMessage input[type=text]')
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toMatchElement('.Header .ChannelName .currentChannel', {
      text: '#orbitdb'
    })
  })

  describe('First channel', () => {
    it('joins a channel', async () => {
      // Open the sidebar
      await page.waitForSelector('.Header .ChannelName .currentChannel')
      await expect(page).toClick('.Header .ChannelName .currentChannel')

      // Fill in "testchannel" and press enter
      await page.waitForSelector('.JoinChannel span.field input[placeholder="Join channel"]')
      await expect(page).toFill(
        '.JoinChannel span.field input[placeholder="Join channel"]',
        channelName
      )
      await page.keyboard.press('Enter')

      // Controls should open on channel join
      await page.waitForSelector('.Controls')
      await expect(page).toMatchElement('.Controls')

      // Current channel name should equal "testchannel" in the header
      await page.waitForSelector('.Header .ChannelName .currentChannel')
      await expect(page).toMatchElement('.Header .ChannelName .currentChannel', {
        text: `#${channelName}`
      })
    })

    it('sends a message to channel', async () => {
      // Create a unique, timestamped message
      timedMessage = testMessage + Date.now()

      // Fill in a message and send it
      await page.waitForSelector('.Controls .SendMessage input[type=text]')
      await expect(page).toFill('.Controls .SendMessage input[type=text]', timedMessage)
      await page.keyboard.press('Enter')

      // The sent message should show up in messages
      await page.waitForSelector('.Channel .Messages .Message .Message__Content .TextMessage div')
      await expect(page).toMatchElement(
        '.Channel .Messages .Message .Message__Content .TextMessage div',
        { text: timedMessage }
      )
    })

    it('sends a video file to channel', async () => {
      // Upload the sample video from test directory to testchannel
      await page.waitForSelector('#file')
      const fileInput = await page.$('#file')
      await fileInput.uploadFile(path.join(__dirname, 'sample.mp4'))

      // The uploaded video's name should show in messages
      await page.waitForSelector('.FileMessage .name')
      /* await expect(page).toClick('.FileMessage .name')

      // When the video's name is pressed, the video should be opened and start playing
      await page.waitForSelector('.FilePreview video')
      const videoElement = await page.$('.FilePreview video')
      await expect(videoElement.paused).toBe(false) */
    })

    it('sends another message to channel', async () => {
      // Create a unique, timestamped message
      timedMessage2 = testMessage + " I'm second " + Date.now()

      // Fill in a message and send it
      await page.waitForSelector('.Controls .SendMessage input[type=text]')
      await expect(page).toFill('.Controls .SendMessage input[type=text]', timedMessage2)
      await page.keyboard.press('Enter')

      // The sent message should show up in messages
      await page.waitForSelector('.Channel .Messages .Message .Message__Content .TextMessage div')
      await expect(page).toMatchElement(
        '.Channel .Messages .Message .Message__Content .TextMessage div',
        { text: timedMessage2 }
      )
    })
  })

  describe('Second channel', () => {
    it('is able to join another channel', async () => {
      // Press the current channel's name to open the sidebar
      await page.waitForSelector('.Header .ChannelName .currentChannel')
      await expect(page).toClick('.Header .ChannelName .currentChannel')

      // Write "testchannel2" as the channel name, press enter
      await page.waitForSelector('.JoinChannel span.field input[placeholder="Join channel"]')
      await expect(page).toFill(
        '.JoinChannel span.field input[placeholder="Join channel"]',
        channelName2
      )
      await page.keyboard.press('Enter')

      // Current channel should equal "testchannel2"
      await page.waitForSelector('.Header .ChannelName .currentChannel')
      await expect(page).toMatchElement('.Header .ChannelName .currentChannel', {
        text: `#${channelName2}`
      })

      // Expect the previous channel, "testchannel" to exist as a link in the header
      await page.waitForSelector('.Header .ChannelName .ChannelLink')
      await expect(page).toMatchElement('.Header .ChannelName .ChannelLink', {
        text: `#${channelName}`
      })
    })

    it('sends a message to another channel', async () => {
      // Create a unique, timestamped message
      timedMessage3 = testMessage + Date.now()

      // Type in the message, press enter to send it
      await page.waitForSelector('.Controls .SendMessage input[type=text]')
      await expect(page).toFill('.Controls .SendMessage input[type=text]', timedMessage3)
      await page.keyboard.press('Enter')

      // The sent message should show up in messages
      await page.waitForSelector('.Channel .Messages .Message .Message__Content .TextMessage div')
      await expect(page).toMatchElement(
        '.Channel .Messages .Message .Message__Content .TextMessage div',
        { text: timedMessage3 }
      )
    })
  })

  describe('Changing channels', () => {
    it('is able to change channels', async () => {
      // Press "testchannel" link in the header
      await page.waitForSelector('.Header .ChannelName .ChannelLink')
      await expect(page).toClick('.Header .ChannelName .ChannelLink', { text: `#${channelName}` })

      // "testchannel" should be the current channel instead of "testchannel2"
      await page.waitForSelector('.Header .ChannelName .currentChannel')
      await expect(page).toMatchElement('.Header .ChannelName .currentChannel', {
        text: `#${channelName}`
      })
    })

    it('persists messages between channel changes', async () => {
      // Both previously sent messages should be loaded in "testchannel"
      await page.waitForSelector('.Channel .Messages .Message')
      await expect(page).toMatch(timedMessage)
      await expect(page).toMatch(timedMessage2)

      // A previously sent message should be loaded on join in "testchannel2"
      await page.waitForSelector('.Header .ChannelName .ChannelLink')
      await expect(page).toClick('.Header .ChannelName .ChannelLink', { text: `#${channelName2}` })
      await page.waitForSelector('.Channel .Messages .Message')
      await expect(page).toMatch(timedMessage3)
    })
  })

  it('user is able to log out', async () => {
    // Press the current channel's name to open the sidebar
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toClick('.Header .ChannelName .currentChannel')

    // Wait for logout button, click it
    await page.waitForSelector('.flaticon-prohibition35')
    await expect(page).toClick('.flaticon-prohibition35')

    // App should load the Orbit login screen
    await page.waitForSelector('h1')
    await expect(page).toMatchElement('h1', { text: 'Orbit' })
  })

  it('persists channels and their messages between logins', async () => {
    // Wait for the username input, write "testuser" and press enter to log in
    await page.waitForSelector('input[type=text]')
    await expect(page).toFill('input[type=text]', username)
    await page.keyboard.press('Enter')

    // Press the current channel's name to open the sidebar
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toClick('.Header .ChannelName .currentChannel')

    // Expect recent channels to be shown in the side panel
    await page.waitForSelector('.ChannelLink')
    await expect(page).toMatchElement('.ChannelLink', {
      text: '#orbitdb'
    })
    await expect(page).toMatchElement('.ChannelLink', {
      text: `#${channelName}`
    })
    await expect(page).toMatchElement('.ChannelLink', {
      text: `#${channelName2}`
    })

    // Join #testchannel
    await expect(page).toClick('.ChannelLink', { text: `#${channelName}` })

    // Both previously sent messages should be loaded in "testchannel"
    await page.waitForSelector('.Channel .Messages .Message')
    await expect(page).toMatch(timedMessage)
    await expect(page).toMatch(timedMessage2)
  })
})
