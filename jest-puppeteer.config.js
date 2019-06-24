module.exports = {
  server: {
    command: 'http-server dist -p 8001 --cors',
    launchTimeout: 50000,
    port: 8001
  },
  launch: {
    headless: true
  }
}
