const assert = require('assert').strict;
const { inspect } = require('util');

// Seed data: Some asset names
const assetNames = [
    { name: 'tDAI TEST', symbol: 'tDAI', contractAddress: '0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b' }
];

function newAsset(skeleton, proposalSoFar) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.name);
  assert.ok(skeleton.properties.changes.properties.symbol);
  assert.ok(skeleton.properties.changes.properties.decimals);
  assert.ok(skeleton.properties.changes.properties.quantum);
  assert.ok(skeleton.properties.changes.properties.erc20);
  assert.ok(skeleton.properties.changes.properties.erc20.properties.withdrawThreshold);
  assert.ok(skeleton.properties.changes.properties.erc20.properties.lifetimeLimit);

  const asset = assetNames[0]
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
            chainId: "1",
            contractAddress: asset.contractAddress,
            withdrawThreshold: '10',
            lifetimeLimit: '10'
          }
      }
    }
  }
  };

 
 result.terms.newAsset[inspect.custom]= () => {
      const withdrawThresholdSplit = skeleton.properties.changes.properties.erc20.properties.withdrawThreshold.description.split('\n')
      const lifetimeLimitSplit = skeleton.properties.changes.properties.erc20.properties.lifetimeLimit.description.split('\n')
      return `{
          changes: {
            // ${skeleton.properties.changes.properties.name.description} (${skeleton.properties.changes.properties.name.type}) 
            name: "${result.terms.newAsset.changes.name}",
            // ${skeleton.properties.changes.properties.symbol.description} (${skeleton.properties.changes.properties.symbol.type}) 
            symbol: "${result.terms.newAsset.changes.symbol}",
            // ${skeleton.properties.changes.properties.decimals.description} (${skeleton.properties.changes.properties.decimals.type}) 
            decimals: "${result.terms.newAsset.changes.decimals}",
            // ${skeleton.properties.changes.properties.quantum.description} (${skeleton.properties.changes.properties.quantum.type}) 
            quantum: "${result.terms.newAsset.changes.quantum}",
            // ${skeleton.properties.changes.properties.erc20.title}
            erc20: {
              // ${skeleton.properties.changes.properties.erc20.properties.chainId.description} (${skeleton.properties.changes.properties.erc20.properties.chainId.type})
              chainId: "${result.terms.newAsset.changes.erc20.chainId}",
              // ${skeleton.properties.changes.properties.erc20.properties.contractAddress.description} (${skeleton.properties.changes.properties.erc20.properties.contractAddress.type})
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