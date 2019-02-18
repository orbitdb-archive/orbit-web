'use strict'
import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import fixtures from '../fixtures.json'
import PreviewVideoFile from '../../src/components/FilePreview/PreviewVideoFile'

describe('<PreviewVideoFile />', () => {
  it('Should return <video /> element with correct url when running with Electron', () => {
    window.ipfsInstance = true
    const videoPreview = mount(
      <PreviewVideoFile src={fixtures.testVideo} stream={{}} filename="" />
    )
    const componentMounts = videoPreview.find(`[src="${fixtures.testVideo}"]`).exists()
    expect(componentMounts).to.equal(true)
  })
  it("Should fail loading if browser doesn't support MediaSource", () => {
    window.ipfsInstance = false
    let error = false
    try {
      mount(<PreviewVideoFile src={fixtures.testVideo} stream={{}} filename="" />)
    } catch (err) {
      error = err
    }
    expect(error.message).to.equal('web browser lacks MediaSource support')
  })
})
