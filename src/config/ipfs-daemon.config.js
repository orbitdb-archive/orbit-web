// Ipfs daemon's default settings
export function defaultIpfsDaemonSettings(ipfsDataDir) {
  return {
    IpfsDataDir: ipfsDataDir,
    Addresses: {
      API: '/ip4/127.0.0.1/tcp/0',
      Swarm: [
        '/ip4/0.0.0.0/tcp/0'
      ],
      Gateway: '/ip4/0.0.0.0/tcp/0'
    },
    // How to use a local webrtc-star server: 
    // https://github.com/libp2p/js-libp2p-webrtc-star
    // SignalServer: '0.0.0.0:9090', // localhost
    // SignalServer: '178.62.241.75', // old dev server
    SignalServer: 'star-signal.cloud.ipfs.team', // IPFS dev server
    API: {
      HTTPHeaders: {
        "Access-Control-Allow-Origin": ['*'],
        "Access-Control-Allow-Methods": ["PUT", "GET", "POST"],
        "Access-Control-Allow-Credentials": ["true"]
      }
    },
    Discovery: {
      MDNS: {
        Enabled: false,
        Interval: 10
      },
      webRTCStar: {
        Enabled: true
      }
    },    
  }
}
