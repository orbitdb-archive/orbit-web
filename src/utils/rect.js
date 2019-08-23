export function isRectInside (parent, child, options = {}) {
  const { topMargin, botMargin } = Object.assign({ topMargin: 1, botMargin: 1 }, options)
  let inside = true
  inside = inside && child.top >= parent.top - topMargin
  inside = inside && child.bottom <= parent.bottom + botMargin
  return inside
}
