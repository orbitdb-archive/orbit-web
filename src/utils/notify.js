/* eslint-disable no-new */
import { debounce } from './throttle'

export function askPermission () {
  Notification.requestPermission()
}

const notify = (title, body) => {
  const options = {
    body: body,
    icon: 'src/images/orbit_logo_32x32.png'
  }

  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, options)
    }
  }
}

export default debounce(notify, 5000, true)
