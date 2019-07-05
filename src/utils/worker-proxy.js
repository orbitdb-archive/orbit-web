import uuid from './uuid'

export default function workerProxy (worker) {
  return function (req, options, key) {
    return new Promise((resolve, reject) => {
      const reqKey = key || uuid()
      function listener ({ data }) {
        if (data.action === 'proxy:res' && data.key === reqKey) {
          worker.removeEventListener('message', listener)
          if (data.errorMsg) reject(new Error(data.errorMsg))
          else resolve(data.value)
        }
      }
      worker.addEventListener('message', listener)
      worker.postMessage({ action: 'proxy:req', req, options, key: reqKey })
    })
  }
}
