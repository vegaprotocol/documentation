const sample = require('lodash/sample');
const assert = require('assert').strict;
const { inspect } = require('util');

// Seed data: Some valid network parameters
const networkParameters = ['market.fee.factors.infrastructureFee']

function updateNetworkParameter(skeleton, proposalSoFar) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.key);
  assert.ok(skeleton.properties.changes.properties.value);

  const keyToUpdate = sample(networkParameters)
  const result = {
    rationale: {
      title: `Update ${keyToUpdate}`,
      description: `Proposal to update ${keyToUpdate} to 300}`
    },
    terms: {
      updateNetworkParameter: {
        changes: {
          key: keyToUpdate,
          value: "300"
        }
      }
    }
  };
 result.terms.updateNetworkParameter[inspect.custom]= () => {
   return `{
      changes: {
        // ${skeleton.properties.changes.properties.key.description} (${skeleton.properties.changes.properties.key.type}) 
        key: "${result.terms.updateNetworkParameter.changes.key}",
        // ${skeleton.properties.changes.properties.value.description} (${skeleton.properties.changes.properties.value.type}) 
        value: "${result.terms.updateNetworkParameter.changes.value}"
      }
    }`
 }

  return result
}

module.exports = { updateNetworkParameter }