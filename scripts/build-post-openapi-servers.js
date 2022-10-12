const toml = require('toml')
const fs = require('fs')
const url = require('url')

const glob = require('glob')
const { version, mainnetVersion } = require('./lib/version.js')

/**
 * Grabs a network definition file used for vega-wallet and
 * returns a list of the REST servers known for that network
 *
 * @param isMainnet Select which network definition file to use
 * @return Object the parsed TOML file
 */
async function serversForNetwork (isMainnet = false) {
  const knownConfigUrls = require(`../package.json`).specs.networks
  const configUrl = isMainnet ? knownConfigUrls.mainnet1 : knownConfigUrls.fairground

  try {
    const configRaw = await fetch(configUrl)
    const configText = await configRaw.text()
    const network = await toml.parse(configText)

    // Store the output for later
    const tomlOutput = isMainnet ? './specs/mainnet_network.json' : './specs/testnet_network.json'
    fs.writeFileSync(tomlOutput, JSON.stringify(network), 'utf-8')

    return network
  } catch (e) {
    console.error(`Failed to fetch config from ${configUrl}`)
  }
}

/**
 * Vaguer is a tool for comparing data nodes. We use the output of this to filter out
 * servers that don't respond, so that the REST api docs are likely to only present
 * servers that are actually available
 *
 * @param isMainnet Boolean select which vaguer file to load
 * @return array of hostnames for servers that appear to be reliable
 */
function getVaguerFilters (isMainnet) {
  const isGoodServer = '🥇'
  const vaguer = isMainnet ? './specs/mainnet_vaguer.json' : './specs/testnet_vaguer.json'
  const vaguerOutput = JSON.parse(fs.readFileSync(vaguer, 'utf-8'))

  const filter = vaguerOutput.filter(s => {
    return s[isGoodServer] === isGoodServer
  }).map(s => {
    return s['host'].replace(/\/(.*)/, '')
  })

  return filter
}

/**
 * OpenAPI 3 lets us label servers, which gives nicer output
 * than just showing the URL.
 *
 * Testnet URLs are predictable, mainnet1 nodes less so. This
 * function takes a URL and returns a reasonable label
 *
 * @param server String the full URL to the server
 * @param isMainnet boolean Produce labels differently if the network is mainnet
 * @return Object an object containing a url and description for the server
 */
function descriptionForServer (server, isMainnet) {
  const parts = url.parse(server).hostname.split('.')
  if (isMainnet) {
    if (server.indexOf('.vega.community') !== -1) {
      return parts[0]
    } else {
      return parts.join('.')
    }
  } else {
    if (parts) {
      return `${parts[1]} (data node)`
    } else {
      // Fallback: Just use the full URL
      return server
    }
  }
}

// Allows overriding the generattion through env var. Probably needs to be smarter
const generateForMainnet = !!process.env.MAINNET
const v = generateForMainnet ? mainnetVersion : version

const filter = getVaguerFilters(generateForMainnet)

// Get files we're going to update
const specs = glob.sync(`./specs/v${v}/*.openapi.json`)

// Fetch server list, filter it by vaguer output *and also require HTTPS, add a description
serversForNetwork(generateForMainnet).then(servers => {
  const openApiServers = servers.API.REST.Hosts.filter(h => {
    let base = url.parse(h).hostname
    if (generateForMainnet) {
      base = base.replace('.vega.community', '')
    }
    return filter.indexOf(base) !== -1
  }).map(h => {
    // Manual fix: two servers in mainnet1.toml have https, but not enabled. Override those
    if (h.indexOf('chorus.one') !== -1 || h.indexOf('xprv') !== -1) {
      h = h.replace('http:', 'https:')
    }

    return {
      url: h,
      description: descriptionForServer(h, generateForMainnet)
    }
  }).filter(h => {
    return (h.url.indexOf('https') !== -1)
  })

  if (openApiServers.length === 0) {
    console.error('No good servers after vaguer filter')
    throw new Error('Bail out')
  }

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
