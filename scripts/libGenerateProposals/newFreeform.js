const assert = require('assert').strict;
const { inspect } = require('util');

function newFreeform(skeleton) {
  assert.ok(skeleton.title);
  assert.ok(skeleton.properties.changes);
  assert.equal(skeleton.type, 'object');
  assert.equal(skeleton.properties.changes.properties.url.type, 'string', 'New Freeform Proposal: url type changed');
  assert.equal(skeleton.properties.changes.properties.description.type, 'string', 'New Freeform Proposal: description type changed');
  assert.equal(skeleton.properties.changes.properties.hash.type, 'string', 'New Freeform Proposal: hash type changed');

  const result = {
    terms: {
      newFreeform: {
      }
    },
    rationale: {
      url: 'https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si',
      hash: 'bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si',
      description: `Lorem ipsum dolor sit amet`,
    },
  };


  result.rationale[inspect.custom]= () => {
      return `{
    // ${skeleton.properties.changes.properties.url.title} (${skeleton.properties.changes.properties.url.type}) 
    url: "${result.rationale.url}",
    // ${skeleton.properties.changes.properties.description.title} (${skeleton.properties.changes.properties.description.type})
    description: "${result.rationale.description}",
    // ${skeleton.properties.changes.properties.hash.title} (${skeleton.properties.changes.properties.hash.type})
    hash: "${result.rationale.hash}"
  }
}`
 } 

  return result;
}

module.exports = { newFreeform }