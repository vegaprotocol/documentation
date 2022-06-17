const assert = require('assert').strict;
const { inspect } = require('util');

function newFreeform(skeleton) {
  assert.ok(skeleton.title);

  const result = {
   rationale: {
      url: 'https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si',
      hash: 'bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si',
      description: `Lorem ipsum dolor sit amet`,
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
    url: "${result.rationale.url}",

    hash: "${result.rationale.hash}",
    
    description: "${result.rationale.description}"
  }
}`
 } 

  return result;
}

module.exports = { newFreeform }