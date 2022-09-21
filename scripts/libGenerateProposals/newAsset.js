const assert = require('assert').strict;
const sample = require('lodash/sample');
const { inspect } = require('util');

// Seed data: Some asset names
const assetNames = [
    { name: 'Wrapped Ether', symbol: 'WETH', contractAddress: '0xc778417e063141139fce010982780140aa0cd5ab' },
    { name: 'Dai Stablecoin', symbol: 'DAI', contractAddress: '0x31f42841c2db5173425b5223809cf3a38fede360' },
    { name: 'USDT Coin', symbol: 'USDT', contractAddress: '0xb404c51bbc10dcbe948077f18a4b8e553d160084' },
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