/**
 * A simple wrapper around @vegaprotocol/openrpc-md to generate from the correct
 * file (by package.json version), to the right file
 */

const { exec } = require('child_process')
const { writeFileSync } = require('fs')

let version = process.env.npm_package_version

if (process.argv[3]) {
  version = process.argv[3]
}

if (!version) {
  version = require('../package.json').version
}

// Config
// Magic number based on the current length (if it's less than a quarter the current size, something is off)
const MIN_LENGTH = 10000  
const title = 'OpenRPC Wallet API'
const url = `./specs/v${version}/openrpc.json`
const dest = './docs/api/vega-wallet/v2-api/openrpc.md'
console.info(`Using schema at: ${url}`)
const cmd = `npx openrpc-md ${url} ${title}`
console.info(`Running: "${cmd}"`)
exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`)
    return
  }

  if (stderr) {
    console.error(`stderr output`)
    console.dir(stderr)
    return
  }

  if (stdout.length > MIN_LENGTH) {
    console.log(`Success, writing to ${dest}`)
    writeFileSync(dest, stdout);
  }

  console.log(`Success! Wrote output to: ${dest}`)
})
