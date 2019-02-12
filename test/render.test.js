'use strict'
import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'

import App from '../src/views/App'

describe('<App />', () => {
  it('Should show <Login/> on entry', () => {
    const app = mount(<App />)
    const loginIsMounted = app.find('.LoginView').exists()
    expect(loginIsMounted).to.equal(true)
  })
})
