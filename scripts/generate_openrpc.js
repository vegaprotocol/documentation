/**
 * A simple wrapper around @vegaprotocol/openrpc-md to generate from the correct
 * file (by package.json version), to the right file
 */

const { exec } = require('child_process')

let version = process.env.npm_package_version

if (process.argv[3]) {
  version = process.argv[3]
}

if (!version) {
  version = require('../package.json').version
}

// Config
const title = 'OpenRPC Wallet API'
const url = `./specs/v${version}/openrpc.json`
const dest = './docs/api/vega-wallet/v2-api/openrpc.md'
console.info(`Using schema at: ${url}`)

exec(`npx openrpc-md ${url} ${title} > ${dest}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`)
    return
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }

  console.log(`Success! Wrote output to: ${dest}`)
})
