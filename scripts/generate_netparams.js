/**
 * A simple fetch and write that performs some very basic validation
 * Could just be a curl, except this makes it more verbose and less
 * fiddly to avoid overwriting valid json with bad results if an API
 * server is down
 */
const { writeFileSync } = require('fs')

// Config
const networks = [
  { name: 'testnet', url: 'https://api.n07.testnet.vega.xyz/network/parameters', dest: 'testnet_network_parameters.json' },
  { name: 'mainnet', url: 'https://api.vega.xyz/network/parameters', dest: 'mainnet_network_parameters.json' }
]

networks.forEach(getParams)

async function getParams (n) {
  console.log(`Fetching ${n.name} from ${n.url}`)
  let raw, output, json

  try {
    raw = await fetch(n.url)
  } catch (e) {
    console.error(`Failed to fetch ${n.name}: ${JSON.stringify(e)}`)
    console.error(`Not overwriting ${n.dest}`)
    return
  }

  try {
    // Needlessly parse and stringify as a basic form of validation
    json = await raw.json()
    output = JSON.stringify(json)
  } catch (e) {
    console.error(`Failed to parse ${n.name}: ${JSON.stringify(e)}`)
    console.error(`Not overwriting ${n.dest}`)
    return
  }

  try {
    writeFileSync(`./specs/${n.dest}`, output)
    console.log(`Wrote ${n.dest}`)
  } catch (e) {
    console.error(`Failed to fetch ${n.name}: ${JSON.stringify(e)}`)
  }
}
