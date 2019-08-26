'use strict'

import React, { useEffect, useState, useRef } from 'react'

function useTimeout (callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function run () {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setTimeout(run, delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}

function Suspense (props) {
  const [displayFallback, setDisplayFallback] = useState(false)

  useTimeout(() => {
    setDisplayFallback(true)
    if (props.loading && typeof props.callback === 'function') props.callback()
  }, props.delay)

  return !props.loading
    ? props.children
    : displayFallback
      ? props.fallback
      : props.passThrough
        ? props.children
        : null
}

export default Suspense
