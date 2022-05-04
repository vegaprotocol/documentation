const { inspect } = require('util');
const assert = require('assert').strict;
const { addDays } = require('date-fns');
const omit = require('lodash/omit');
const SwaggerParser = require("@apidevtools/swagger-parser");
const { newMarket } = require('./libGenerateProposals/newMarket')
const { newFreeform } = require('./libGenerateProposals/newFreeform')
const { newAsset } = require('./libGenerateProposals/newAsset')
const { updateNetworkParameter } = require('./libGenerateProposals/updateNetworkParameter');
const { writeFileSync } = require('fs');

if (!process.env.VEGA_VERSION) {
  console.error('Please set an environment variable VEGA_VERSION (e.g. VEGA_VERSION=v0.50.1')
  process.exit(1)
}

const version = process.env.VEGA_VERSION 

// Config
const url = `https://raw.githubusercontent.com/vegaprotocol/protos/${version}/swagger/vega/api/v1/corestate.swagger.json`;

// Input: Fields to remove from a specific place in the Swagger file
const notProposalTypes = ['closingTimestamp', 'enactmentTimestamp', 'validationTimestamp', 'title', 'type']
const excludeUnimplementedTypes = ['updateMarket'];

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

function newProposal(p, skeleton, type) {
  assert.ok(skeleton.properties.closingTimestamp);
  assert.ok(skeleton.properties.enactmentTimestamp);

  const proposal = {
    terms: {
      closingTimestamp: daysInTheFuture(19),
    }
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
/*    proposal[inspect.custom]= () => {
    const splitTitle = skeleton.properties.closingTimestamp.title.split('\n')
    return `{
    // ${splitTitle[0]}
    // ${splitTitle[1]} (${skeleton.properties.closingTimestamp.format} as ${skeleton.properties.closingTimestamp.type}}) 
    closingTimestamp: ${proposal.closingTimestamp},
    ${type}:  ${inspect(proposal[type], { depth: 20 })}
}`
 } */
  }

  proposal.terms = { ...proposal.terms, ...p.terms }
  proposal.rationale = p.rationale

  const annotated = `
  ${'```javascript'}
  ${annotator(proposal)}
  ${'```'}`

  const json = `
  ${'```json'}
  ${JSON.stringify(proposal, null, 2)}
  ${'```'}
  `
  const cmd = `
  ${'```bash'}
  vegawallet command send --wallet your_username --pubkey your_key --network mainnet '${JSON.stringify({"proposalSubmission": proposal })}'
  ${'```'}
  `

  return {
    annotated,
    json,
    cmd
  }

}

const ProposalGenerator = new Map([
  ['newFreeform', newFreeform],
  ['updateNetworkParameter', updateNetworkParameter],
  ['newAsset', newAsset],
  ['newMarket', newMarket]
])

function parse(api) {
  const proposalTypes = omit(api.definitions.vegaProposalTerms.properties, notProposalTypes )

  const partials = Object.keys(proposalTypes).map(type => {
      if ( excludeUnimplementedTypes.indexOf(type) === -1) {
        if (ProposalGenerator.has(type)) {
            if (type === 'newFreeform') {
              const changes = ProposalGenerator.get(type)(proposalTypes[type])
              output(newProposal(changes, api.definitions.vegaProposalTerms, type), type)
            }
        } else {
            assert.fail('Unknown proposal type: ' + type)
        }
     }
  })

  return partials
}

function output(partial, title) {
  const path = './docs/tutorials/_generated-proposals'

  if (process.argv[2]) {
    writeFileSync(`${path}/_${title}_annotated.md`, partial.annotated)
    writeFileSync(`${path}/_${title}_json.md`, partial.json)
    writeFileSync(`${path}/_${title}_cmd.md`, partial.cmd)
  } else {
    console.dir(partial);
  }
}

SwaggerParser.dereference(url).then(parse);
