# orbit-web

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby)
[![Project Status](https://badge.waffle.io/haadcode/orbit.svg?label=In%20Progress&title=In%20Progress)](https://waffle.io/haadcode/orbit)

> A distributed, peer-to-peer chat application built on [IPFS](http://ipfs.io)

Browser application for [Orbit](https://github.com/orbitdb/orbit). Try it at https://orbit.chat.

**NOTE!** Orbit is still more or less experimental. It means Orbit is currently **not secure**, APIs will change and builds can break over the coming months. If you come across problems, it would help greatly to open issues so that we can fix them as quickly as possible.

<img src="https://raw.githubusercontent.com/orbitdb/orbit-web/master/screenshots/screenshot1.png" width="49%">
<img src="https://raw.githubusercontent.com/orbitdb/orbit-web/master/screenshots/screenshot2.png" width="49%">

If you prefer a stand-alone Desktop application, see [orbit-electron](https://github.com/orbitdb/orbit-electron)

Built with the following packages:

- [orbit-core](https://github.com/orbitdb/orbit-core) - Core Orbit communication library.
- [js-ipfs](https://github.com/ipfs/js-ipfs) - A new p2p hypermedia protocol for content-addressed storage.

See also:

- [orbit-db](https://github.com/orbitdb/orbit-db) - Serverless, p2p database that orbit-core uses to store its data.
- [orbit-textui](https://github.com/orbitdb/orbit-textui) - Terminal client prototype for Orbit.
- [IPFS](https://ipfs.io) - IPFS

## Table of Contents

- [From Source Code](#from-source-code)
- [Development](#development)
	- [Run](#run)
	- [Build](#build)
		- [Release](#release)
		- [Debug](#debug)
		- [Distribution Package](#distribution-package)
	- [Publish](#publish)
	- [Clean](#clean)
- [Contribute](#contribute)
- [License](#license)

## From Source Code

Get the source code:

```
git clone https://github.com/orbitdb/orbit-web.git
cd orbit-web/
```

Start the application:

`make start`

## Development

### Run

First, get the source code and install dependencies:

```
git clone https://github.com/orbitdb/orbit-web.git
cd orbit-web/
npm install
```

Then start the development environment:

`npm run dev`

*Run will start a development server, open the app in the browser and watch for changes in the source files. Upon change, it'll automatically compile and reload the app in the browser*

### Build

#### Release

`make build`

or

`npm run build`

*This produces a fully stand-alone build in `dist/` which can be run from `dist/index.html` file or on a http-server.*

To test the release build, run:

`npm start`

And open http://localhost:8081/index.html in your browser.

#### Debug

*Debug build is a non-minified build and produces source maps for debugging*

`npm run build:debug`

#### Distribution Package

`make dist`

or

`npm run dist`

*This script will add `dist/` to IPFS and the last hash in the output is a distributable directory in IPFS.*

### Publish

*This automatically opens an issue in ipfs/ops-requests with the hash of the build. You will need to have a GitHub basic authentication token called `$NODE_GITHUB_ISSUE_BOT` with `repos` scope enabled in order for this to work.*

`make publish`

### Clean

`make clean`

## Contribute

We would be happy to accept PRs! If you want to work on something, it'd be good to talk beforehand to make sure nobody else is working on it. You can reach us [on Gitter](https://gitter.im/orbitdb/Lobby), or in the [issues section](https://github.com/orbitdb/orbit-web/issues).

We also have **regular community calls**, which we announce in the issues in OrbitDB [welcome repository](https://github.com/orbitdb/welcome/issues). Join us!

For specific guidelines for contributing to this repository, check out the [Contributing guide](CONTRIBUTING.md). For more on contributing to OrbitDB in general, take a look at the OrbitDB [welcome repo](https://github.com/orbitdb/welcome). Please note that all interactions in [@OrbitDB](https://github.com/orbitdb) fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2017-2018 Protocol Labs Inc., Haja Networks Oy
