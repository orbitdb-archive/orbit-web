'use strict'

import Loadable from 'react-loadable'
import Spinner from './Spinner'

const LoadAsync = opts =>
  Loadable(
    Object.assign(
      {
        loading: Spinner,
        delay: 300
      },
      opts
    )
  )

export default LoadAsync
