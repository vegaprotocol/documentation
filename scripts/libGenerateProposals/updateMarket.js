const sample = require('lodash/sample');
const { generateSettlementOracleSpec, generateTerminationOracleSpec, generateOracleSpecBinding } = require('./newMarket')
const assert = require('assert').strict;
const { inspect } = require('util');

// Seed data: Some inspirational instrument names and corresponding codes
const instruments = [
    { name: 'Apples Yearly (2022)', code: 'APPLES.22' },
    { name: 'Oranges Daily', code: 'ORANGES.24h' }
];

// This is slightly smaller than the one in newMarket
function generateInstrument(skeleton) {
  const randomInstrument = sample(instruments)

  // The properties of an instrument
  assert.ok(skeleton.properties.code, 'Instrument property code used to exist');
  assert.ok(skeleton.properties.future.properties.quoteName, 'Instrument property quoteName used to exist');
  
  assert.ok(skeleton.properties.future.properties.settlementPriceDecimals, 'Instrument property settlementPriceDecimals used to exist');
  assert.equal(skeleton.properties.future.properties.settlementPriceDecimals.type, 'integer', 'Instrument property settlementPriceDecimals used to be an integer');
  assert.ok(skeleton.properties.future.properties.oracleSpecForSettlementPrice, 'OracleSpecForSettlementPrice used to exist');
  assert.ok(skeleton.properties.future.properties.oracleSpecForTradingTermination, 'OracleSpecForTradingTermination used to exist');
  assert.ok(skeleton.properties.future.properties.oracleSpecBinding, 'OracleSpecBinding used to exist on a future');

  const instrument = {
    code: randomInstrument.code,
    future: {
      quoteName: 'tEuro',
      settlementPriceDecimals: 5,
      oracleSpecForSettlementPrice: generateSettlementOracleSpec(skeleton.properties.future.properties.oracleSpecForSettlementPrice),
      oracleSpecForTradingTermination: generateTerminationOracleSpec(skeleton.properties.future.properties.oracleSpecForTradingTermination),
      oracleSpecBinding: generateOracleSpecBinding(skeleton.properties.future.properties.oracleSpecBinding)
    }
  }

  instrument[inspect.custom]= () => {
   return `{
        // ${skeleton.properties.code.title}
        code: "${instrument.code}",
        // ${skeleton.properties.future.title}
        future: {
          // ${skeleton.properties.future.properties.quoteName.title} (${skeleton.properties.future.properties.quoteName.type})
          quoteName: "${instrument.future.quoteName}",
          // ${skeleton.properties.future.properties.settlementPriceDecimals.title} (${skeleton.properties.future.properties.settlementPriceDecimals.format} as ${skeleton.properties.future.properties.settlementPriceDecimals.type})
          settlementPriceDecimals: ${instrument.future.settlementPriceDecimals},
          // ${skeleton.properties.future.properties.oracleSpecForSettlementPrice.title} (${skeleton.properties.future.properties.oracleSpecForSettlementPrice.type})
          oracleSpecForSettlementPrice: ${inspect(instrument.future.oracleSpecForSettlementPrice, {depth: 5})},
          // ${skeleton.properties.future.properties.oracleSpecForTradingTermination.title} (${skeleton.properties.future.properties.oracleSpecForTradingTermination.type})
          oracleSpecForTradingTermination: ${inspect(instrument.future.oracleSpecForTradingTermination, {depth: 5})},
          // ${skeleton.properties.future.properties.oracleSpecBinding.title} (${skeleton.properties.future.properties.oracleSpecBinding.type})
          oracleSpecBinding: ${inspect(instrument.future.oracleSpecBinding, {depth: 5})}
      }`
    }

  return instrument
}


function generatePriceMonitoringParameters(skeleton) {
  assert.ok(skeleton.properties.triggers)
  assert.equal(skeleton.properties.triggers.type, 'array')
  assert.equal(skeleton.properties.triggers.items.properties.horizon.format, 'int64')
  assert.equal(skeleton.properties.triggers.items.properties.probability.type, 'string')
  assert.equal(skeleton.properties.triggers.items.properties.auctionExtension.format, 'int64')

  const params = {
    triggers: [
      {
        horizon: "43200",
        probability: "0.9999999",
        auctionExtension: "600"
      }
    ]
  }

  params[inspect.custom]= () => {
   const splitTitle = skeleton.properties.triggers.items.properties.auctionExtension.title.split('\n') 
   return `{
          // ${skeleton.properties.triggers.items.title}
          triggers: [
            {
              // ${skeleton.properties.triggers.items.properties.horizon.title} (${skeleton.properties.triggers.items.properties.horizon.format} as ${skeleton.properties.triggers.items.properties.horizon.type})
              horizon: "${params.triggers[0].horizon}",
              // ${skeleton.properties.triggers.items.properties.probability.title} (${skeleton.properties.triggers.items.properties.probability.type})
              probability: "${params.triggers[0].probability}",
              // ${splitTitle[0]}
              // ${splitTitle[1]}
              // ${splitTitle[2]} (${skeleton.properties.triggers.items.properties.auctionExtension.format} as ${skeleton.properties.triggers.items.properties.auctionExtension.type})
              auctionExtension: "${params.triggers[0].auctionExtension}",
              }
          ]
      }`
  }

  return params

}

function generateRiskModel(skeleton, riskModelType) {
  if (riskModelType !== 'logNormal') {
    throw 'Not implemented'
  }

  assert.ok(skeleton.properties.riskAversionParameter);
  assert.ok(skeleton.properties.tau);
  assert.equal(skeleton.properties.tau.format, 'double');
  assert.ok(skeleton.properties.params.properties.r);
  assert.equal(skeleton.properties.params.properties.r.format, 'double');
  assert.ok(skeleton.properties.params.properties.mu);
  assert.equal(skeleton.properties.params.properties.mu.format, 'double');
  assert.ok(skeleton.properties.params.properties.sigma);
  assert.equal(skeleton.properties.params.properties.sigma.format, 'double');

  const riskModel = {
    // This was what all the markets on fairground were set to
    tau: 0.0001140771161,
    // This is a random array based on what was live on Fairground at the time
    riskAversionParameter: sample([0.001, 0.01, 0.0001]),
    params: {
      // This was what all the markets on fairground were set to
      mu: 0,
      // Ditto
      r: 0.016,
      // This is a random array based on what was live on Fairground at the time
      sigma: sample([0.5, 0.3, 1.25, 0.8])
    }
  }

 riskModel[inspect.custom]= () => {
   return `{
        // ${skeleton.properties.tau.title} (${skeleton.properties.tau.type}) 
        tau: ${riskModel.tau},
        // ${skeleton.properties.riskAversionParameter.title} (${skeleton.properties.riskAversionParameter.format} as ${skeleton.properties.riskAversionParameter.type}) 
        riskAversionParameter: "${riskModel.riskAversionParameter}",
        // ${skeleton.properties.params.title}
        params: {
          // ${skeleton.properties.params.properties.mu.title} (${skeleton.properties.params.properties.mu.format} as ${skeleton.properties.params.properties.mu.type}) 
          mu: ${riskModel.params.mu},     
          // ${skeleton.properties.params.properties.r.title} (${skeleton.properties.params.properties.r.format} as ${skeleton.properties.params.properties.r.type}) 
          r: ${riskModel.params.r},     
          // ${skeleton.properties.params.properties.sigma.title} (${skeleton.properties.params.properties.sigma.format} as ${skeleton.properties.params.properties.sigma.type}) 
          sigma: ${riskModel.params.sigma},     
        }
      }`
 }

 return riskModel

}

function updateMarket(skeleton) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.instrument);
  assert.equal(skeleton.properties.changes.properties.metadata.type, 'array');
  assert.ok(skeleton.properties.changes.properties.priceMonitoringParameters);
  assert.ok(skeleton.properties.changes.properties.liquidityMonitoringParameters);
  assert.ok(skeleton.properties.changes.properties.logNormal);

  const result = {
    rationale: {
      description: `Update Lorem Ipsum market`
    },
    terms: {
      updateMarket: {
        marketId: '123',
        changes: {
          instrument: generateInstrument(skeleton.properties.changes.properties.instrument),
          priceMonitoringParameters: generatePriceMonitoringParameters(skeleton.properties.changes.properties.priceMonitoringParameters),
          logNormal: generateRiskModel(skeleton.properties.changes.properties.logNormal, 'logNormal')
        },
      }
    }
  };

  /*------- Liquidity Commitment required */

  result.terms.updateMarket[inspect.custom]= () => {
   return `{
        // ${skeleton.properties.marketId.title}
        marketId: '123',
        changes: {
          // ${skeleton.properties.changes.properties.instrument.title}
          instrument: ${inspect(result.terms.updateMarket.changes.instrument, { depth: 19 })},
          // ${skeleton.properties.changes.properties.priceMonitoringParameters.title}
          priceMonitoringParameters: ${inspect(result.terms.updateMarket.changes.priceMonitoringParameters, { depth: 19 })},
          // ${skeleton.properties.changes.properties.logNormal.title}
          logNormal: ${inspect(result.terms.updateMarket.changes.logNormal, { depth: 19 })},
        },
    }`
  }

  
  return result
}

module.exports = { updateMarket }