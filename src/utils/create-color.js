'use strict'

import Please from "pleasejs"

const createColor = (text) => {
  return Please.make_color({
    seed: text,
    saturation: 0.4,
    value: 0.9,
    golden: false
  })  
}

export default createColor
