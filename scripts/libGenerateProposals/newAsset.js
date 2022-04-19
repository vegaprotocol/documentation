const assert = require('assert').strict;
const sample = require('lodash/sample');
const { inspect } = require('util');

// Seed data: Some asset names
const assetNames = [
    { name: 'Ethereum', symbol: 'ETH' },
    { name: 'Bitcoin', symbol: 'Tether' },
    { name: 'BNB', symbol: 'BNB' },
    { name: 'XRP', symbol: 'XRP' },
    { name: 'Solana', symbol: 'SOL' }
];

function newAsset(skeleton) {
  const result = {};
  const docs = skeleton;

  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.name);
  assert.ok(skeleton.properties.changes.properties.symbol);
  assert.ok(skeleton.properties.changes.properties.totalSupply);
  assert.ok(skeleton.properties.changes.properties.decimals);
  assert.ok(skeleton.properties.changes.properties.quantum);
  assert.ok(skeleton.properties.changes.properties.erc20);

  const asset = sample(assetNames);

  result.changes = {
    name: asset.name,
    symbol: asset.symbol,
    totalSupply: '19010568',
    decimals: '5',
    quantum: '1',
    erc20: {
      contractAddress: '0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e'
    }
  };
 
 result[inspect.custom]= () => {
      return `{
        changes: {
          // ${skeleton.properties.changes.properties.name.title} (${skeleton.properties.changes.properties.name.type}) 
          name: "${result.changes.name}",
          // ${skeleton.properties.changes.properties.symbol.title} (${skeleton.properties.changes.properties.symbol.type}) 
          symbol: "${result.changes.symbol}",
          // ${skeleton.properties.changes.properties.totalSupply.title} (${skeleton.properties.changes.properties.totalSupply.type}) 
          totalSupply: "${result.changes.totalSupply}",
          // ${skeleton.properties.changes.properties.decimals.title} (${skeleton.properties.changes.properties.decimals.type}) 
          decimals: "${result.changes.decimals}",
          // ${skeleton.properties.changes.properties.quantum.title} (${skeleton.properties.changes.properties.quantum.type}) 
          quantum: "${result.changes.quantum}",
          // ${skeleton.properties.changes.properties.erc20.title}
          erc20: {
            // ${skeleton.properties.changes.properties.erc20.properties.contractAddress.title} (${skeleton.properties.changes.properties.erc20.properties.contractAddress.type})
            contractAddress: "${result.changes.erc20.contractAddress}",
          }
       }
    }`
 } 
 return { result, docs }
}

module.exports = { newAsset }