const { inspect } = require('util');
const assert = require('assert').strict;
const { addDays } = require('date-fns');
const omit = require('lodash/omit');
const SwaggerParser = require("@apidevtools/swagger-parser");
const { newMarket } = require('./libGenerateProposals/newMarket')
const { newFreeform } = require('./libGenerateProposals/newFreeform')
const { newAsset } = require('./libGenerateProposals/newAsset')
const { updateNetworkParameter } = require('./libGenerateProposals/updateNetworkParameter');


if (!process.env.VEGA_VERSION) {
  console.error('Please set an environment variable VEGA_VERSION (e.g. VEGA_VERSION=v0.50.1')
  process.exit(1)
}

const version = process.env.VEGA_VERSION 

// Config
const url = `https://raw.githubusercontent.com/vegaprotocol/protos/${version}/swagger/vega/api/v1/corestate.swagger.json`;

// Input: Fields to remove from a specific place in the Swagger file
const notProposalTypes = ['closingTimestamp', 'enactmentTimestamp', 'validationTimestamp', 'title', 'type']
// Input: Ignore these types as they are not finished. And a hack to make newMarket go to the bottom
const excludeUnimplementedTypes = ['updateMarket', 'newMarket'];

// Output: Used to put a nice title on the output
const nameByType = {
  newFreeform: 'New Freeform Proposal',
  updateNetworkParameter: 'Update a network parameter',
  newAsset: 'New asset (ERC20)',
  newMarket: 'New market'
}

function annotator(proposal) {
   const res = inspect(proposal, { depth: null})
   
   return res;
}

/**
 * Convenience function to return now + a certain number of days
 * @param {number} daysToAdd 
 * @returns 
 */
function daysInTheFuture(daysToAdd) {
  return new addDays(Date.now(), daysToAdd).getTime()
}

function newProposal(changesAndDocs, skeleton, type) {
  assert.ok(skeleton.properties.closingTimestamp);
  assert.ok(skeleton.properties.enactmentTimestamp);

  const proposal = {
    closingTimestamp: daysInTheFuture(19),
  }

  // Freeform proposals don't get enacted, so they can't have this
  if (type !== 'newFreeform'){
    proposal.enactmentTimestamp = daysInTheFuture(20)
 proposal[inspect.custom]= () => {
   const splitClosingTitle = skeleton.properties.closingTimestamp.title.split('\n')
   const splitEnactmentTitle = skeleton.properties.enactmentTimestamp.title.split('\n')
   return `{
    // ${splitClosingTitle[0]}
    // ${splitClosingTitle[1]} (${skeleton.properties.closingTimestamp.format} as ${skeleton.properties.closingTimestamp.type}) 
    closingTimestamp: ${proposal.closingTimestamp},
    // ${splitEnactmentTitle[0]}
    // ${splitEnactmentTitle[1]} (${skeleton.properties.enactmentTimestamp.format} as ${skeleton.properties.enactmentTimestamp.type}) 
    enactmentTimestamp: ${proposal.enactmentTimestamp},
    ${type}:  ${inspect(proposal[type], { depth: 20 })}
 }`
 }
  } else {
    proposal[inspect.custom]= () => {
    const splitTitle = skeleton.properties.closingTimestamp.title.split('\n')
    return `{
    // ${splitTitle[0]}
    // ${splitTitle[1]} (${skeleton.properties.closingTimestamp.format} as ${skeleton.properties.closingTimestamp.type}}) 
    closingTimestamp: ${proposal.closingTimestamp},
    ${type}:  ${inspect(proposal[type], { depth: 20 })}
}`
 }
 
  }

  proposal[type] = changesAndDocs.result

  console.log(`\r\n## ${nameByType[type]}`);
  console.log(`<Tabs groupId="${type}">`)
  console.log(`<TabItem value="annotated" label="Annotated example">`)
  console.log()
  console.log('```javascript');
  console.log(annotator(proposal))
  console.log('```');
  console.log(`</TabItem>`)
  console.log(`<TabItem value="json" label="JSON example">`)
  console.log()
  console.log('```json');
  console.log(JSON.stringify(proposal, null, 2))
  console.log('```');
  console.log(`</TabItem>`)
  console.log(`<TabItem value="cmd" label="Command line example">`)
  console.log()
  console.log('```bash');
  console.log(`vegawallet command send --wallet your_username --pubkey your_key --network mainnet '${JSON.stringify({"proposalSubmission": { reference: `test-${type}`, terms: proposal }})}'`);
  console.log('```');
  console.log(`</TabItem>`)
  console.log(`</Tabs>`)
  console.groupEnd();
}

const ProposalGenerator = new Map([
  ['newFreeform', newFreeform],
  ['updateNetworkParameter', updateNetworkParameter],
  ['newAsset', newAsset],
  ['newMarket', newMarket]
])


function parse(api) {
  console.log(`import Tabs from '@theme/Tabs';`)
  console.log(`import TabItem from '@theme/TabItem';`)
  console.log()

  const proposalTypes = omit(api.definitions.vegaProposalTerms.properties, notProposalTypes )

  Object.keys(proposalTypes).forEach(type => {
      if ( excludeUnimplementedTypes.indexOf(type) === -1) {
        if (ProposalGenerator.has(type)) {
            const changes = ProposalGenerator.get(type)(proposalTypes[type])
            newProposal(changes, api.definitions.vegaProposalTerms, type) 
        } else {
            assert.fail('Unknown proposal type: ' + type)
        }
     }
  })
  const changes = ProposalGenerator.get('newMarket')(proposalTypes['newMarket'])
  newProposal(changes, api.definitions.vegaProposalTerms, 'newMarket') 
}

SwaggerParser.dereference(url).then(parse);
