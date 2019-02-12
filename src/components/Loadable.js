'use strict'

import Loadable from 'react-loadable'
import Spinner from './Spinner'

const LoadAsync = opts =>
  Loadable(
    Object.assign(
      {
        loading: Spinner,
        delay: 200,
        timeout: 10000
      },
      opts
    )
  )

export default LoadAsync
