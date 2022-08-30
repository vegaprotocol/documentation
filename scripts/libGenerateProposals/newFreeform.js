const assert = require('assert').strict;
const { inspect } = require('util');

function newFreeform(skeleton) {
  assert.ok(skeleton.title);

  const result = {
   rationale: {
      title: `An example freeform proposal`,
      description: 'I propose that everyone evaluate the following IPFS document and vote Yes if they agree. [bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si](https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si)',
    },
    terms: {
      newFreeform: {
      }
    }
   };


  result.terms.newFreeform[inspect.custom]= () => {
    return `{
      // This object remains empty, but is required 
    }`
  }
  result.rationale[inspect.custom]= () => {
      return `{
    title: "${result.rationale.title}",
    description: "${result.rationale.description}"
  }
}`
 } 

  return result;
}

module.exports = { newFreeform }