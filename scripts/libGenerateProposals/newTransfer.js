const assert = require('assert').strict;
const { inspect } = require('util');

function newTransfer(skeleton, proposalSoFar) {
  assert.ok(skeleton.description);


  const result = {
   rationale: {
      title: `An example transfer`,
      description: 'I propose that this transfer happens',
    },
    terms: {
      newTransfer: {
        changes: {
          sourceType: 'ACCOUNT_TYPE_NETWORK_TREASURY',
          transferType: 'GOVERNANCE_TRANSFER_TYPE_ALL_OR_NOTHING',
          amount: '10000000',
          asset: '12345',
          fractionOfBalance: '0.1',
          destinationType: 'ACCOUNT_TYPE_GENERAL',
          destination: '0x1234567890abcdef',
          oneOff: {
            deliverOn: "12345678"
          },
        }
      }
    }
   };

  const l = skeleton.properties.changes.properties
  const r = result.terms.newTransfer.changes

  result.terms.newTransfer[inspect.custom]= () => {
    return `{
      changes: {
        // ${l.sourceType.title}
        sourceType: ${JSON.stringify(r.sourceType)},
        // ${l.transferType.title.split('\n')[0]}
        transferType: ${JSON.stringify(r.transferType)},
        // ${l.amount.title}
        amount: ${JSON.stringify(r.amount)},
        // ${l.asset.title}
        asset: ${JSON.stringify(r.asset)},
        // ${l.fractionOfBalance.title}
        fractionOfBalance: ${JSON.stringify(r.fractionOfBalance)},
        // ${l.destinationType.title}
        destinationType: ${JSON.stringify(r.destinationType)},
        // Address of recipient
        destination: ${JSON.stringify(r.destination)},
        // ${l.oneOff.title}
        oneOff: {
          // ${l.oneOff.properties.deliverOn.description}
          deliverOn: ${JSON.stringify(r.oneOff.deliverOn)},
        }
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

module.exports = { newTransfer }