const assert = require('assert').strict;
const sample = require('lodash/sample');
const { inspect } = require('util');

// Seed data: Some asset names
const assetNames = [
    { name: 'tEuro', symbol: 'tEURO', contractAddress: '0x0158031158Bb4dF2AD02eAA31e8963E84EA978a4' },
    { name: 'tDAI TEST', symbol: 'tDAI', contractAddress: '0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b' },
    { name: 'tUSDC TEST', symbol: 'tUSDC', contractAddress: '0xB404c51BBC10dcBE948077F18a4B8E553D160084' },
];

function newAsset(skeleton) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.name);
  assert.ok(skeleton.properties.changes.properties.symbol);
  assert.ok(skeleton.properties.changes.properties.decimals);
  assert.ok(skeleton.properties.changes.properties.quantum);
  assert.ok(skeleton.properties.changes.properties.erc20);
  assert.ok(skeleton.properties.changes.properties.erc20.properties.withdrawThreshold);
  assert.ok(skeleton.properties.changes.properties.erc20.properties.lifetimeLimit);

  const asset = sample(assetNames);
  const result = {
    rationale: {
      title: `Add ${asset.name} (${asset.symbol})`,
      description: `Proposal to add ${asset.name} (${asset.symbol}) as an asset`
    },
    terms: {
      newAsset: {
        changes: {
          name: asset.name,
          symbol: asset.symbol,
          decimals: '18',
          quantum: '1',
          erc20: {
            contractAddress: asset.contractAddress,
            withdrawThreshold: '10',
            lifetimeLimit: '10'
          }
      }
    }
  }
  };

 
 result.terms.newAsset[inspect.custom]= () => {
      const withdrawThresholdSplit = skeleton.properties.changes.properties.erc20.properties.withdrawThreshold.title.split('\n')
      const lifetimeLimitSplit = skeleton.properties.changes.properties.erc20.properties.lifetimeLimit.title.split('\n')
      return `{
          changes: {
            // ${skeleton.properties.changes.properties.name.title} (${skeleton.properties.changes.properties.name.type}) 
            name: "${result.terms.newAsset.changes.name}",
            // ${skeleton.properties.changes.properties.symbol.title} (${skeleton.properties.changes.properties.symbol.type}) 
            symbol: "${result.terms.newAsset.changes.symbol}",
            // ${skeleton.properties.changes.properties.decimals.title} (${skeleton.properties.changes.properties.decimals.type}) 
            decimals: "${result.terms.newAsset.changes.decimals}",
            // ${skeleton.properties.changes.properties.quantum.title} (${skeleton.properties.changes.properties.quantum.type}) 
            quantum: "${result.terms.newAsset.changes.quantum}",
            // ${skeleton.properties.changes.properties.erc20.title}
            erc20: {
              // ${skeleton.properties.changes.properties.erc20.properties.contractAddress.title} (${skeleton.properties.changes.properties.erc20.properties.contractAddress.type})
              contractAddress: "${result.terms.newAsset.changes.erc20.contractAddress}",
              // ${withdrawThresholdSplit[0]}
              // ${withdrawThresholdSplit[1]} (${skeleton.properties.changes.properties.erc20.properties.withdrawThreshold.type})
              withdrawThreshold: "${result.terms.newAsset.changes.erc20.withdrawThreshold}",
              // ${lifetimeLimitSplit[0]}
              // ${lifetimeLimitSplit[1]} (${skeleton.properties.changes.properties.erc20.properties.lifetimeLimit.type})
              lifetimeLimit: "${result.terms.newAsset.changes.erc20.lifetimeLimit}",
              }
        }
    }`
 } 
 return result
}

module.exports = { newAsset }