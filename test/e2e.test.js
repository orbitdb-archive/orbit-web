/* eslint-disable no-undef */
require('@babel/polyfill')

const baseUrl = 'http://localhost:8001'

const channelName = 'testchannel'
const channelName2 = 'testchannel2'
const username = 'testuser'
const testMessage = 'testing testing'

describe('User scenario', () => {
  beforeAll(async () => {
    await page.goto(baseUrl)
  })
  it('successfully loads', async () => {
    await expect(page).toMatchElement('h1', { text: 'Orbit' })
  })
  it('is able to log in', async () => {
    await expect(page).toFill('input[type=text]', username)
    await page.keyboard.press('Enter')
    await expect(page).toMatchElement('.username', { text: username })
  })
  it('joins a channel', async () => {
    await page.waitForSelector('.JoinChannel span.field input[placeholder="Join channel"]')
    await expect(page).toFill(
      '.JoinChannel span.field input[placeholder="Join channel"]',
      channelName
    )
    await page.keyboard.press('Enter')

    await page.waitForSelector('.Controls')
    await expect(page).toMatchElement('.Controls')

    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toMatchElement('.Header .ChannelName .currentChannel', {
      text: `#${channelName}`
    })
  })
  it('sends a message to channel', async () => {
    await page.waitForSelector('.Controls .SendMessage input[type=text]')
    await expect(page).toFill('.Controls .SendMessage input[type=text]', testMessage)
  })
  it('is able to join another channel', async () => {
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toClick('.Header .ChannelName .currentChannel')

    await page.waitForSelector('.JoinChannel span.field input[placeholder="Join channel"]')
    await expect(page).toFill(
      '.JoinChannel span.field input[placeholder="Join channel"]',
      channelName2
    )
    await page.keyboard.press('Enter')

    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toMatchElement('.Header .ChannelName .currentChannel', {
      text: `#${channelName2}`
    })

    await page.waitForSelector('.Header .ChannelName .ChannelLink')
    await expect(page).toMatchElement('.Header .ChannelName .ChannelLink', {
      text: `#${channelName}`
    })
  })
  it('sends a message to another channel', async () => {
    await page.waitForSelector('.Controls .SendMessage input[type=text]')
    await expect(page).toFill('.Controls .SendMessage input[type=text]', testMessage)
    await page.keyboard.press('Enter')
  })
  it('is able to change channels', async () => {
    await page.waitForSelector('.Header .ChannelName .ChannelLink')
    await expect(page).toClick('.Header .ChannelName .ChannelLink')

    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await expect(page).toMatchElement('.Header .ChannelName .currentChannel', {
      text: `#${channelName}`
    })

    await page.waitForSelector('.Header .ChannelName .ChannelLink')
    await expect(page).toMatchElement('.Header .ChannelName .ChannelLink', {
      text: `#${channelName2}`
    })
  })
})
