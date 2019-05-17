const https = require('https')
require('dotenv').config()

const body = {
  hashToPin: process.env.IPFS_HASH
}

const options = {
  hostname: 'api.pinata.cloud',
  port: 443,
  path: '/pinning/pinHashToIPFS',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    pinata_api_key: process.env.PINATA_API_KEY,
    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
  }
}

const req = https.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`)
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
  res.setEncoding('utf8')
  res.on('data', chunk => {
    console.log(`BODY: ${chunk}`)
  })
  res.on('end', () => {
    console.log('No more data in response.')
  })
})

req.on('error', e => {
  console.error(`problem with request: ${e.message}`)
})

// Write data to request body
req.write(JSON.stringify(body))
req.end()
