const sample = require('lodash/sample');
const assert = require('assert').strict;
const { inspect } = require('util');

// Seed data: Some valid network parameters
const networkParameters = ['market.fee.factors.infrastructureFee', 'governance.proposal.asset.requiredMajority', 'governance.proposal.freeform.minVoterBalance']

function updateNetworkParameter(skeleton) {
  const result = {};
  const docs = skeleton 

  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.key);
  assert.ok(skeleton.properties.changes.properties.value);

  const changes = {
    key: sample(networkParameters),
    value: Math.random().toString()
  };
  result.changes = changes

 result[inspect.custom]= () => {
   return `{
      changes: {
        // ${skeleton.properties.changes.properties.key.title} (${skeleton.properties.changes.properties.key.type}) 
        key: "${changes.key}",
        // ${skeleton.properties.changes.properties.value.title} (${skeleton.properties.changes.properties.value.type}) 
        value: "${changes.value}"
      }
    }`
 }

  return { result, docs }
}

module.exports = { updateNetworkParameter }