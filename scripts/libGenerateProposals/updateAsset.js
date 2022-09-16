const assert = require('assert').strict
const { inspect } = require('util')

function updateAsset (skeleton) {
  assert.ok(skeleton.properties.changes)
  assert.ok(skeleton.properties.changes.properties.erc20)
  assert.ok(
    skeleton.properties.changes.properties.erc20.properties.withdrawThreshold
  )
  assert.ok(
    skeleton.properties.changes.properties.erc20.properties.lifetimeLimit
  )

  const result = {
    rationale: {
      title: 'Update asset',
      description: 'Proposal to change withdrawal threshold for asset'
    },
    terms: {
      updateAsset: {
        changes: {
          erc20: {
            withdrawThreshold: '10',
            lifetimeLimit: '10'
          }
        }
      }
    }
  }

  result.terms.updateAsset[inspect.custom] = () => {
    const withdrawThresholdSplit =
      skeleton.properties.changes.properties.erc20.properties.lifetimeLimit.title.split(
        '\n'
      )
    const lifetimeLimitSplit =
      skeleton.properties.changes.properties.erc20.properties.lifetimeLimit.title.split(
        '\n'
      )
    return `{
          changes: {
            erc20: {
              // ${withdrawThresholdSplit[0]}
              // ${withdrawThresholdSplit[1]} (${skeleton.properties.changes.properties.erc20.properties.withdrawThreshold.type})
              withdrawThreshold: "${result.terms.updateAsset.changes.erc20.withdrawThreshold}",
              // ${lifetimeLimitSplit[0]}
              // ${lifetimeLimitSplit[1]} (${skeleton.properties.changes.properties.erc20.properties.lifetimeLimit.type})
              lifetimeLimit: "${result.terms.updateAsset.changes.erc20.lifetimeLimit}",
              }
        }
    }`
  }
  return result
}

module.exports = { updateAsset }
