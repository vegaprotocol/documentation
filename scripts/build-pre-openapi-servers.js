const fs = require('fs')

const glob = require('glob')
const { version, mainnetVersion } = require('./lib/version.js')
// Allows overriding the generation through env var. Probably needs to be smarter
const generateForMainnet = !!process.env.MAINNET
const v = generateForMainnet ? mainnetVersion : version

// Get files we're going to update
const specs = glob.sync(`./specs/v${v}/*.openapi.json`)

specs.forEach(s => {
  console.group(`Opening ${s}`)
  const spec = JSON.parse(fs.readFileSync(s, 'utf-8'))
  if (!!s.match('blockexplorer')) {
    console.log('**SPECIAL CASE FOR BLOCK EXPLORER: be**')
    spec.servers = [ {
      url: '{Server}',
      description: 'Block Explorer',
      variables: {
        Server: {
          default: 'https://be.testnet.vega.xyz/rest',
          description: 'Base URL of the Block Explorer'
        }
      }
    }]
  } else if (!!s.match('wallet')) {
    console.log('**SPECIAL CASE FOR wallet: localhost**')
    spec.servers = [ {
      url: '{Server}',
      description: 'Local wallet',
      variables: {
      Server: {
        default: 'http://localhost:1789/api/',
        description: 'Base URL of the wallet'
      }
    }}]
  } else if (!!s.match('transfer')) {
    spec.servers = {
        url: '{Server}',
        description: 'Data node',
        variables: {
          Server: {
            default: 'https://api.testnet.vega.rocks/',
            description: 'Base URL of the data node',
          }
        }
      }
    console.log(`Updating ${s} with`)
    console.dir(spec.servers)
  } else {
    spec.servers = {
        url: '{Server}',
        description: 'Data node',
        variables: {
          Server: {
            default: 'https://api.testnet.vega.rocks/',
            description: 'Base URL of the data node',
          }
        }
      }
  }

  console.log('Writing server list...')
  fs.writeFileSync(s, JSON.stringify(spec), 'utf-8')
  console.log('Wrote server list')
  console.groupEnd()
})
