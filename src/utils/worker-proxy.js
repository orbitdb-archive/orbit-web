import uuid from './uuid'

export default function workerProxy (worker) {
  this.pending = {}
  return function (req, options, key) {
    const reqKey = key || uuid()
    if (!this.pending[reqKey]) {
      this.pending[reqKey] = new Promise((resolve, reject) => {
        function listener ({ data }) {
          if (data.action === 'proxy:res' && data.key === reqKey) {
            worker.removeEventListener('message', listener)
            delete this.pending[reqKey]
            if (data.errorMsg) reject(new Error(data.errorMsg))
            else resolve(data.value)
          }
        }
        worker.addEventListener('message', listener.bind(this))
        worker.postMessage({ action: 'proxy:req', req, options, key: reqKey })
      })
    }
    return this.pending[reqKey]
  }.bind(this)
}
