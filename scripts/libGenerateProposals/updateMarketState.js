const assert = require('assert').strict;
const { inspect } = require('util');

function updateMarketState(skeleton, proposalSoFar) {
  assert.ok(skeleton.description);


  const result = {
   rationale: {
      title: `Terminate market X`,
      description: 'Market X should be terminated as it is no longer relevant. Termination price set in proposal.',
    },
    terms: {
      updateMarketState: {
        changes: {
          marketId: '0f2f8d077a53835ca802808d1eaae090de06328e5a0fb21e55de2f8ea8faa389',
          updateType: 'MARKET_STATE_UPDATE_TYPE_TERMINATE',
          price: '123456'
        }
      }
    }
   };

  const l = skeleton.properties.changes.properties
  const r = result.terms.updateMarketState.changes

  result.terms.updateMarketState[inspect.custom]= () => {
    return `{
      changes: {
          // ${l.marketId.title} (${l.marketId.type})
          marketId: ${JSON.stringify(r.marketId)},
          // ${l.updateType.title} (${l.updateType.type})
          updateType: ${JSON.stringify(r.updateType)},
          // ${l.price.title} (${l.price.type})
          price: ${JSON.stringify(r.price)},
        }
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

module.exports = { updateMarketState }