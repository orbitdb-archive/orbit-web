'use strict'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash.debounce'

function LoadMore ({ parentElement, onActivate, ...rest }) {
  const [t] = useTranslation()
  const [paddingTop, setPaddingTop] = useState(0)
  const lastTouchY = useRef(-1)

  const activate = useCallback(() => {
    if (typeof onActivate === 'function') onActivate()
  }, [onActivate])

  const onInteract = useCallback(
    event => {
      switch (event.type) {
        case 'click':
          activate()
          break
        case 'wheel':
          if (event.deltaY < 0) onScrollUp()
          else onScrollDown()
          break
        case 'touchmove':
          const clientY = event.changedTouches[0].clientY
          if (lastTouchY.current > 0 && clientY - lastTouchY.current > 0) onScrollUp()
          else onScrollDown()
          lastTouchY.current = clientY
          break
        case 'keydown':
          if (event.keyCode === 38) onScrollUp()
          else if (event.keyCode === 40) onScrollDown()
          break
        default:
          break
      }
    },
    [activate]
  )

  useEffect(() => {
    if (!parentElement) return
    parentElement.addEventListener('wheel', onInteract)
    parentElement.addEventListener('touchmove', onInteract)
    document.addEventListener('keydown', onInteract)
    return () => {
      debouncedOnActivate.cancel()
      parentElement.removeEventListener('wheel', onInteract)
      parentElement.removeEventListener('touchmove', onInteract)
      document.removeEventListener('keydown', onInteract)
    }
  }, [parentElement, onInteract])

  const debouncedOnActivate = useCallback(debounce(activate, 200), [activate])

  function onScrollUp () {
    setPaddingTop(40)
    debouncedOnActivate()
  }

  function onScrollDown () {
    setPaddingTop(0)
    debouncedOnActivate.cancel()
  }

  return (
    <div
      style={{ paddingTop: paddingTop > 0 ? paddingTop : '' }}
      className="firstMessage loadMore"
      {...rest}
      onClick={onInteract}
    >
      {t('channel.loadMore')}
    </div>
  )
}

LoadMore.propTypes = {
  parentElement: PropTypes.instanceOf(Element),
  onActivate: PropTypes.func
}

export default LoadMore
