'use strict'

import Please from "pleasejs"

const createColor = (text) => {
  return Please.make_color({
    seed: text,
    saturation: 0.5,
    value: 1,
    golden: false
  })  
}

export default createColor
