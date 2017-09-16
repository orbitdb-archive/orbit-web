// Ipfs daemon's default settings
export function defaultIpfsDaemonSettings(ipfsDataDir) {
  return {
    IpfsDataDir: ipfsDataDir,
    config : {
      Addresses: {
        API: '/ip4/127.0.0.1/tcp/0',
        Swarm: [
          // '/ip4/0.0.0.0/tcp/0',
        '/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss',
        ],
        Gateway: '/ip4/0.0.0.0/tcp/0'
      },
      API: {
        HTTPHeaders: {
          "Access-Control-Allow-Origin": ['*'],
          "Access-Control-Allow-Methods": ["PUT", "GET", "POST"],
          "Access-Control-Allow-Credentials": ["true"]
        }
      },
      Bootstrap: [],
      Discovery: {
        MDNS: {
          Enabled: false,
          Interval: 10
        },
        webRTCStar: {
          Enabled: false
        }
      },
    }
  }
}
