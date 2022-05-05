const sample = require('lodash/sample');
const assert = require('assert').strict;
const { inspect } = require('util');

// Seed data: Some valid network parameters
const networkParameters = ['market.fee.factors.infrastructureFee', 'governance.proposal.asset.requiredMajority', 'governance.proposal.freeform.minVoterBalance']

function updateNetworkParameter(skeleton) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.key);
  assert.ok(skeleton.properties.changes.properties.value);

  const keyToUpdate = sample(networkParameters)
  const result = {
    rationale: {
      description: `Update ${keyToUpdate}`
    },
    terms: {
      updateNetworkParameter: {
        changes: {
          key: keyToUpdate,
          value: Math.random().toString()
        }
      }
    }
  };
 result.terms.updateNetworkParameter[inspect.custom]= () => {
   return `{
      changes: {
        // ${skeleton.properties.changes.properties.key.title} (${skeleton.properties.changes.properties.key.type}) 
        key: "${result.terms.updateNetworkParameter.changes.key}",
        // ${skeleton.properties.changes.properties.value.title} (${skeleton.properties.changes.properties.value.type}) 
        value: "${result.terms.updateNetworkParameter.changes.value}"
      }
    }`
 }

  return result
}

module.exports = { updateNetworkParameter }