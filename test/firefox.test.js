import puppeteerFirefox from 'puppeteer-firefox'

require('@babel/polyfill')

// URL of the http-server running the production build
const baseUrl = 'http://localhost:8001'

let browser, page

// Fixtures
const channelName = 'testchannel'
const channelName2 = 'testchannel2'
const username = 'testuser'
const testMessage = 'testing testing'
let timedMessage, timedMessage2, timedMessage3

jest.setTimeout(30000)

/*
 * A test scenario of a user logging in,
 * and sending messages to different channels
 */
describe('User scenario', () => {
  beforeAll(async () => {
    browser = await puppeteerFirefox.launch()
    page = await browser.newPage()
    await page.goto(baseUrl)
  })

  afterAll(async () => {
    await browser.close()
  })

  it('successfully loads', async () => {
    await page.waitForSelector('h1')
    const headingText = await page.$eval('h1', e => e.innerHTML)
    await expect(headingText).toBe('Orbit')
  })

  it('allows the user to log in', async () => {
    await page.$('input[type=text]')
    await page.type('input[type=text]', username)
    await page.keyboard.press('Enter')

    // Wait for the default channel to show up, press the name to open the side panel
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await page.click('.Header .ChannelName .currentChannel')

    // Shown username should equal "testuser" and the darkener(curtain) element should be visible
    await page.waitForSelector('.username')
    await page.waitForSelector('.darkener')
    const userName = await page.$eval('.username', e => e.innerHTML)
    await expect(userName).toBe(username)
    await page.click('.darkener')
  })

  it('joins #orbitdb by default', async () => {
    // New user should join #orbitdb by default with the channel opened
    await page.waitForSelector('.Controls .SendMessage input[type=text]')
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    const currentChannel = await page.$eval(
      '.Header .ChannelName .currentChannel',
      e => e.innerText
    )
    await expect(currentChannel).toBe('#orbitdb')
  })

  it('joins a channel', async () => {
    // Open the sidebar
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await page.click('.Header .ChannelName .currentChannel')

    // Fill in "testchannel" and press enter
    await page.waitForSelector('.JoinChannel span.field input[placeholder="Join channel"]')
    await page.click('.JoinChannel span.field input[placeholder="Join channel"]')
    await page.type('.JoinChannel span.field input[placeholder="Join channel"]', channelName)
    await page.keyboard.press('Enter')

    // Controls should open on channel join
    await page.waitForSelector('.Controls')
    await page.waitForSelector('.Header .ChannelName .ChannelLink')

    // Current channel name should equal "testchannel" in the header
    const currentChannel = await page.$eval(
      '.Header .ChannelName .currentChannel',
      e => e.innerText
    )
    await expect(currentChannel).toBe(`#${channelName}`)
  })

  it('sends a message to channel', async () => {
    // Create a unique, timestamped message
    timedMessage = testMessage + Date.now()

    // Fill in a message and send it
    await page.waitForSelector('.Controls .SendMessage input[type=text]')
    await page.click('.Controls .SendMessage input[type=text]')
    await page.type('.Controls .SendMessage input[type=text]', timedMessage)
    await page.keyboard.press('Enter')

    // The sent message should show up in messages
    await page.waitForSelector(
      '.Channel .Messages .Message .Message__Content .TextMessage .content div'
    )
    const sentMessage = await page.$eval(
      '.Channel .Messages .Message .Message__Content .TextMessage .content div',
      e => e.innerText.replace(/\s+/g, ' ').trim()
    )
    await expect(sentMessage).toBe(timedMessage)
  })

  it('sends another message to channel', async () => {
    // Create a unique, timestamped message
    timedMessage2 = testMessage + " I'm second " + Date.now()

    // Fill in a message and send it
    await page.waitForSelector('.Controls .SendMessage input[type=text]')
    await page.click('.Controls .SendMessage input[type=text]')
    await page.type('.Controls .SendMessage input[type=text]', timedMessage2)
    await page.keyboard.press('Enter')

    await page.waitFor(500)

    // The sent message should show up in messages
    const messages = await page.$$('.Channel .Messages .Message')
    await expect(messages.length).toBe(2)
  })

  it('is able to join another channel', async () => {
    // Open the sidebar
    await page.waitForSelector('.Header .ChannelName .currentChannel')
    await page.click('.Header .ChannelName .currentChannel')

    // Fill in "testchannel" and press enter
    await page.waitForSelector('.JoinChannel span.field input[placeholder="Join channel"]')
    await page.click('.JoinChannel span.field input[placeholder="Join channel"]')
    await page.type('.JoinChannel span.field input[placeholder="Join channel"]', channelName2)
    await page.keyboard.press('Enter')

    // Controls should open on channel join
    await page.waitForSelector('.Controls')
    await page.waitForFunction(
      `document.querySelector(".Header .ChannelName .currentChannel").innerText == "#${channelName2}"`
    )
  })

  it('sends a message to another channel', async () => {
    // Create a unique, timestamped message
    timedMessage3 = testMessage + Date.now()

    // Fill in a message and send it
    await page.waitForSelector('.Controls .SendMessage input[type=text]')
    await page.click('.Controls .SendMessage input[type=text]')
    await page.type('.Controls .SendMessage input[type=text]', timedMessage3)
    await page.keyboard.press('Enter')

    // The sent message should show up in messages
    await page.waitForSelector(
      '.Channel .Messages .Message .Message__Content .TextMessage .content div'
    )
    const sentMessage = await page.$eval(
      '.Channel .Messages .Message .Message__Content .TextMessage .content div',
      e => e.innerText.replace(/\s+/g, ' ').trim()
    )
    await expect(sentMessage).toBe(timedMessage3)
  })
})
