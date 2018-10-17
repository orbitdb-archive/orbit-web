'use strict'

export function getHumanReadableBytes (size) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(i > 2 ? 2 : 0) * 1 +
    ' ' +
    ['Bytes', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

export function getFormattedTime (timestamp) {
  const safeTime = time => ('0' + time).slice(-2)
  const date = new Date(timestamp)
  return (
    safeTime(date.getHours()) +
    ':' +
    safeTime(date.getMinutes()) +
    ':' +
    safeTime(date.getSeconds())
  )
}

export function toArrayBuffer (buffer) {
  const ab = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}
