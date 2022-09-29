const toml = require('toml')
const fs = require('fs')
const glob = require('glob')
const { version, mainnetVersion } = require('./lib/version.js')

async function serversForNetwork (isMainnet = false) {
  const knownConfigUrls = {
    fairground: 'https://raw.githubusercontent.com/vegaprotocol/networks/master/fairground/fairground.toml',
    mainnet1: 'https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml'
  }

  const configUrl = isMainnet ? knownConfigUrls.mainnet1 : knownConfigUrls.fairground

  try {
    const configRaw = await fetch(configUrl)
    const configText = await configRaw.text()

    return await toml.parse(configText)
  } catch (e) {
    console.error(`Failed to fetch config from ${configUrl}`)
  }
}

const generateForMainnet = !!process.env.MAINNET
const v = generateForMainnet ? mainnetVersion : version

const specs = glob.sync(`./specs/v${v}/*.openapi.json`)

serversForNetwork(generateForMainnet).then(servers => {
  const openApiServers = servers.API.REST.Hosts.map(h => {
    return {
      url: h
    }
  })

  console.group('Found servers')
  console.dir(openApiServers)
  console.groupEnd()

  specs.forEach(s => {
    console.group(`Opening ${s}`)
    const spec = JSON.parse(fs.readFileSync(s, 'utf-8'))
    spec.servers = openApiServers

    console.log('Updated server list')

    console.log('Writing server list...')
    fs.writeFileSync(s, JSON.stringify(spec), 'utf-8')
    console.log('Wrote server list')
    console.groupEnd()
  })
})
