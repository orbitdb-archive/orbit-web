# Orbit Web Application

**This repo is currently being transfered from https://github.com/haadcode/orbit and is work in progress. YMMV.**

## Run

`make start`

or

```
npm install
npm run build
npm start
```

## Development

### Run

`npm run dev`

*Run will start a development server, open the app in the browser and watch for changes in the source files. Upon change, it'll automatically compile and reload the app in the browser*

### Build

#### Release

`make build`

or

```
npm run build
```

#### Debug

*Debug build is a non-minified build and produces source maps for debugging*

`npm run build:debug`

#### Distribution Package

`npm run dist`

**This script will add `dist/` to IPFS and the last hash in the output is a distributable directory in IPFS.**

### Clean

`make clean`
