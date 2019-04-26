const channelName = 'testchannel'
const channelName2 = 'testchannel2'
const username = 'testuser'
const testMessage = 'testing testing'

describe('User scenario', () => {
  it('successfully loads', () => {
    cy.visit('/')
    cy.get('h1').should('contain', 'Orbit')
  })
  it('is able to log in', () => {
    cy.get('input[type=text]').type(`${username}{enter}`)
    cy.get('.username').should('contain', username)
  })
  it('joins a channel', () => {
    cy.get('.JoinChannel span.field input[placeholder="Join channel"]').type(
      `${channelName}{enter}`
    )
    cy.get('.Controls').should('exist')
    cy.get('.Header .ChannelName .currentChannel').should('contain', `#${channelName}`)
  })
  it('sends a message to channel', () => {
    cy.get('.Controls .SendMessage input[type=text]').type(`${testMessage}{enter}`)
  })
  it('is able to join another channel', () => {
    cy.get('.Header .ChannelName .currentChannel').click()
    cy.get('.JoinChannel span.field input[placeholder="Join channel"]').type(
      `${channelName2}{enter}`
    )
    cy.get('.Header .ChannelName .currentChannel').should('contain', `#${channelName2}`)
    cy.get('.Header .ChannelName .ChannelLink').should('contain', `#${channelName}`)
  })
  it('sends a message to another channel', () => {
    cy.get('.Controls .SendMessage input[type=text]').type(`${testMessage}{enter}`)
  })
  it('is able to change channels', () => {
    cy.get('.Header .ChannelName .ChannelLink').click()
    cy.get('.Header .ChannelName .currentChannel').should('contain', `#${channelName}`)
    cy.get('.Header .ChannelName .ChannelLink').should('contain', `#${channelName2}`)
  })
})
