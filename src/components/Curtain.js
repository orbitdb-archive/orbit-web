import React from 'react'
import PropTypes from 'prop-types'

const Curtain = ({ label }) => (
  <div className="curtain">
    <div className="curtainlabel">{label}</div>
  </div>
)

Curtain.propTypes = {
  label: PropTypes.string.isRequired
}

export default Curtain
