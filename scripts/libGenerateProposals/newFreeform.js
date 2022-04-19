const assert = require('assert').strict;
const { inspect } = require('util');

function newFreeform(skeleton) {
  const result = {};
  const docs = skeleton;

  assert.ok(skeleton.title);
  assert.ok(skeleton.properties.changes);
  assert.equal(skeleton.type, 'object');
  assert.equal(skeleton.properties.changes.properties.url.type, 'string', 'New Freeform Proposal: url type changed');
  assert.equal(skeleton.properties.changes.properties.description.type, 'string', 'New Freeform Proposal: description type changed');
  assert.equal(skeleton.properties.changes.properties.hash.type, 'string', 'New Freeform Proposal: hash type changed');

  const changes = {
    url: 'https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si',
    description: 'A proposal that demonstrates freeform proposals',
    hash: 'bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si',
  };
  result.changes = changes

 result[inspect.custom]= () => {
      return `{
        changes: {
          // ${skeleton.properties.changes.properties.url.title} (${skeleton.properties.changes.properties.url.type}) 
          url: "${changes.url}",
          // ${skeleton.properties.changes.properties.description.title} (${skeleton.properties.changes.properties.description.type})
          description: "${changes.description}",
          // ${skeleton.properties.changes.properties.hash.title} (${skeleton.properties.changes.properties.hash.type})
          hash: "${changes.hash}"
       }
    }`
 }

  return { result, docs };
}

module.exports = { newFreeform }