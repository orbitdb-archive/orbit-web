function Logger () {}

Logger.prototype.debug = process.env.NODE_ENV === 'development' ? console.log : () => {}
Logger.prototype.log = console.log
Logger.prototype.info = console.info
Logger.prototype.warn = console.warn
Logger.prototype.error = console.error

export default Logger
