/**
 * This set of functions generates the configuration for the plugin
 * https://github.com/PaloAltoNetworks/docusaurus-openapi-docs
 * so that both mainnet and testnet versions are kept up to date
 * when ./scripts/build.sh is run
 */

const glob = require('glob')
const { version, mainnetVersion, shortenVersion } = require('./lib/version.js')

/**
 * Mainnet version is also taken from package.json, but only
 * this plugin rebuilds that folder automatically. Everything else
 * is generated and left as is.
 *
 * This behaviour could be changed by simply not calling generateRestDocuments
 * for mainnet, which would ensure that the versioned_docs folder is untouched
 * after a version is tagged.
 */

/**
 * Generates the config object for each spec for OpenApi plugin
 * Recreates what was hardcoded, without questioning why it was
 * done that way.
 *
 * Note that while PaloAltoNetworks/docusaurus-openapi-doc has support for Versions,
 * which could potentially tidy up the data-v1 / data-v2 dichotomy, v1 is expected to
 * be deprecated soon so this hasn't been done. If it hangs around, take a look at that
 *
 * @return Object id: {
 *    id for the plugin
 *    filename: folder for the output, changes the URL
 * }
 */
function getIdsFromFilename (version, filename) {
  const ver = version.split('.')[1]
  if (filename.indexOf('trading_data_v1') !== -1) {
    return { id: `tradingv1v${ver}`, filename: 'data-v1' }
  } else if (filename.indexOf('trading_data_v2') !== -1) {
    return { id: `tradingv2v${ver}`, filename: 'data-v2' }
  } else if (filename.indexOf('trading_data') !== -1) {
    // Special case: remove after v0.53 is no longer built
    return { id: `tradingv1v${ver}`, filename: 'data-v1' }
  } else if (filename.indexOf('corestate') !== -1) {
    return { id: `statev${ver}`, filename: 'state' }
  } else if (filename.indexOf('core') !== -1) {
    return { id: `corev${ver}`, filename: 'core' }
  } else if (filename.indexOf('blockexplorer') !== -1) {
    return { id: `explorerv${ver}`, filename: 'explorer' }
  } else if (filename.indexOf('wallet') !== -1) {
    return { id: `walletv${ver}`, filename: 'wallet' }
  } else {
    throw new Error(`Unknown file: ${filename}, add config in docusaurus.config.js`)
  }
}

/**
 * See https://github.com/PaloAltoNetworks/docusaurus-openapi-docs#config for available
 * options
 */
function generateRestDocument (version, specPath, isMainnet) {
  const shortVersion = shortenVersion(version)
  const baseDir = isMainnet ? `versioned_docs/version-v${shortVersion}` : 'docs'

  const ids = getIdsFromFilename (version, specPath)
  const outputDir = `${baseDir}/api/rest/${ids.filename}`

  const obj = {}
  obj[ids.id] = {
    specPath,
    outputDir,
    downloadUrl: `https://raw.githubusercontent.com/vegaprotocol/documentation/main/specs/v${version}/${ids.filename}`,
    template: 'rest-template.mustache',
    sidebarOptions: {
      groupPathsBy: 'tag'
    }

  }
  return obj
}

/**
 * The plugin configuration takes a single object with an ID per file. This function
 * does the grunt work of generating and returning that.
 *
 * To disable cleaning/regenerating mainnet docs, remove the mainnet parts of this function
 **/
function generateRestDocuments (testnetVersion, mainnetVersion) {
  const testnetFiles = glob.sync(`./specs/v${testnetVersion}/*.openapi.json`)
  const mainnetFiles = glob.sync(`./specs/v${mainnetVersion}/*.openapi.json`)

  const main = mainnetFiles.map(f => generateRestDocument(mainnetVersion, f, true))
  const test = testnetFiles.map(f => generateRestDocument(testnetVersion, f, false))

  return [...test, ...main]
}

const openApiConfig = generateRestDocuments(version, mainnetVersion).reduce((result, current) => {
  return Object.assign(result, current)
}, {})

module.exports = {
  generateRestDocuments,
  shortenVersion,
  openApiConfig,
  version,
  mainnetVersion
}
