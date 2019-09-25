'use strict'

import { useRouteMatch } from 'react-router-dom'
import debounce from 'lodash.debounce'

import { isRectInside } from './rect'

export function useTimeout (callback, delay) {
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

export function useRefCallback () {
  const ref = useRef(null)

  const [element, setElement] = useState()

  const setRef = useCallback(node => {
    if (ref.current) setElement(undefined)
    if (node) setElement(node)
    ref.current = node
  }, [])

  return [element, setRef]
}

export function useVisibility (element, parentElement, margins, delay = 100) {
  const [isVisible, setIsVisible] = useState(false)

  function checkVisibility () {
    if (!element || !parentElement) return
    const parentRect = parentElement.getBoundingClientRect()
    const rect = element.getBoundingClientRect()
    const visible = isRectInside(parentRect, rect, margins)
    setIsVisible(visible)
  }

  const checkVisibilityDebounced = useCallback(debounce(checkVisibility, delay), [
    element,
    parentElement,
    margins,
    delay
  ])

  useLayoutEffect(() => {
    if (!parentElement) return
    parentElement.addEventListener('scroll', checkVisibilityDebounced)
    return () => {
      checkVisibilityDebounced.cancel()
      parentElement.removeEventListener('scroll', checkVisibilityDebounced)
    }
  }, [parentElement, checkVisibilityDebounced])

  useLayoutEffect(checkVisibility, [element, parentElement, margins])

  return isVisible
}

export function usePrivateRoutes (privatePaths, isAuthenticated) {
  const [shouldRedirect, setShouldRedirect] = React.useState(false)

  const matched =
    privatePaths.map(path => useRouteMatch({ path })).filter(match => match && match.isExact)
      .length > 0

  React.useEffect(() => {
    if (!shouldRedirect && !isAuthenticated && matched) {
      setShouldRedirect(true)
    } else if (shouldRedirect) {
      setShouldRedirect(false)
    }
  }, [matched, privatePaths, isAuthenticated])

  return shouldRedirect
}
