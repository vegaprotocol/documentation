const appDir = process.env.PWD

function shortenVersion (version) {
  return version.split('.').slice(0, 2).join('.')
}

let version = process.env.npm_package_version
const mainnetVersion = require(`${appDir}/package.json`).mainnetVersion

if (!version) {
  version = require(`${appDir}/package.json`).version
}

if (!version.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/)) {
  throw new Error('Version incorrectly formatted')
}

if (!mainnetVersion.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/)) {
  throw new Error('Mainnet Version incorrectly formatted')
}


module.exports = {
  version,
  mainnetVersion,
  shortenVersion
}
