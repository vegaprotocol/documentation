const sample = require('lodash/sample');
const random = require('lodash/random');
const sampleSize = require('lodash/sampleSize');
const { generateSettlementDataSourceSpec, generateTerminationDataSourceSpec, generateDataSourceSpecBinding, generateLiquiditySlaParameters } = require('./newMarket')
const assert = require('assert').strict;
const { inspect } = require('util');

// Seed data: Some inspirational instrument names and corresponding codes
const instruments = [
  { name: 'Apples Yearly (2022)', code: 'APPLES.22' }
];

// This is slightly smaller than the one in newMarket
function generateFutureInstrument(skeleton) {
  const randomInstrument = sample(instruments)

  // The properties of an instrument
  assert.ok(skeleton.properties.code, 'Instrument property code used to exist');
  assert.ok(skeleton.properties.future.properties.quoteName, 'Instrument property quoteName used to exist');

  assert.ok(skeleton.properties.future.properties.dataSourceSpecForSettlementData, 'DataSourceSpecForSettlementPrice used to exist');
  assert.ok(skeleton.properties.future.properties.dataSourceSpecForTradingTermination, 'DataSourceSpecForTradingTermination used to exist');
  assert.ok(skeleton.properties.future.properties.dataSourceSpecBinding, 'DataSourceSpecBinding used to exist on a future');
  const instrument = {
    code: randomInstrument.code,
    future: {
      quoteName: 'tEuro',
      dataSourceSpecForSettlementData: generateSettlementDataSourceSpec(skeleton.properties.future.properties.dataSourceSpecForSettlementData),
      dataSourceSpecForTradingTermination: generateTerminationDataSourceSpec(skeleton.properties.future.properties.dataSourceSpecForTradingTermination),
      dataSourceSpecBinding: generateDataSourceSpecBinding(skeleton.properties.future.properties.dataSourceSpecBinding)
    }
  }

  instrument[inspect.custom] = () => {
    return `{
        // ${skeleton.properties.code.description}
        code: "${instrument.code}",
        // ${skeleton.properties.future.title}
        future: {
          // ${skeleton.properties.future.properties.quoteName.description} (${skeleton.properties.future.properties.quoteName.type})
          quoteName: "${instrument.future.quoteName}",
          // ${skeleton.properties.future.properties.dataSourceSpecForSettlementData.description} (${skeleton.properties.future.properties.dataSourceSpecForSettlementData.type})
          dataSourceSpecForSettlementData: ${inspect(instrument.future.dataSourceSpecForSettlementData, { depth: 5 })},
          // ${skeleton.properties.future.properties.dataSourceSpecForTradingTermination.description} (${skeleton.properties.future.properties.dataSourceSpecForTradingTermination.type})
          dataSourceSpecForTradingTermination: ${inspect(instrument.future.dataSourceSpecForTradingTermination, { depth: 5 })},
          // ${skeleton.properties.future.properties.dataSourceSpecBinding.title} (${skeleton.properties.future.properties.dataSourceSpecBinding.type})
          dataSourceSpecBinding: ${inspect(instrument.future.dataSourceSpecBinding, { depth: 5 })}
      }`
  }

  return instrument
}


function generatePriceMonitoringParameters(skeleton) {
  assert.ok(skeleton.properties.triggers)
  assert.equal(skeleton.properties.triggers.type, 'array')
  assert.equal(skeleton.properties.triggers.items.properties.horizon.format, 'int64')
  assert.equal(skeleton.properties.triggers.items.properties.probability.type, 'string')

  const params = {
    triggers: [
      {
        horizon: "43200",
        probability: "0.9999999",
        auctionExtension: "3600"
      }
    ]
  }

  params[inspect.custom] = () => {
    return `{
          // ${skeleton.properties.triggers.items.title}
          triggers: [
            {
              // ${skeleton.properties.triggers.items.properties.horizon.description} (${skeleton.properties.triggers.items.properties.horizon.format} as ${skeleton.properties.triggers.items.properties.horizon.type})
              horizon: "${params.triggers[0].horizon}",
              // ${skeleton.properties.triggers.items.properties.probability.description} (${skeleton.properties.triggers.items.properties.probability.type})
              probability: "${params.triggers[0].probability}",
              /* ${skeleton.properties.triggers.items.properties.auctionExtension.description} (${skeleton.properties.triggers.items.properties.auctionExtension.type}) */
              probability: "${params.triggers[0].auctionExtension}"
              }
          ]
      }`
  }

  return params

}

function generateMetadata(skeleton) {
  assert.equal(skeleton.type, 'array', 'Market metadata type used to be an array')
  assert.equal(skeleton.items.type, 'string', 'Market metadata type used to be an array of strings')
  return ['source:docs.vega.xyz']
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
    riskAversionParameter: 0.00001,
    params: {
      // This was what all the markets on fairground were set to
      mu: 0,
      // Ditto
      r: 0.016,
      // This is a random array based on what was live on Fairground at the time
      sigma: sample([0.5, 0.3, 1.25, 0.8])
    }
  }

  riskModel[inspect.custom] = () => {
    return `{
        // ${skeleton.properties.tau.description} (${skeleton.properties.tau.type})
        tau: ${riskModel.tau},
        // ${skeleton.properties.riskAversionParameter.description} (${skeleton.properties.riskAversionParameter.format} as ${skeleton.properties.riskAversionParameter.type})
        riskAversionParameter: "${riskModel.riskAversionParameter}",
        // ${skeleton.properties.params.title}
        params: {
          // ${skeleton.properties.params.properties.mu.description} (${skeleton.properties.params.properties.mu.format} as ${skeleton.properties.params.properties.mu.type})
          mu: ${riskModel.params.mu},
          // ${skeleton.properties.params.properties.r.description} (${skeleton.properties.params.properties.r.format} as ${skeleton.properties.params.properties.r.type})
          r: ${riskModel.params.r},
          // ${skeleton.properties.params.properties.sigma.description} (${skeleton.properties.params.properties.sigma.format} as ${skeleton.properties.params.properties.sigma.type})
          sigma: ${riskModel.params.sigma},
        }
      }`
  }

  return riskModel

}

function updateMarket(skeleton, proposalSoFar) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.instrument);
  assert.ok(skeleton.properties.changes.properties.linearSlippageFactor);
  assert.equal(skeleton.properties.changes.properties.metadata.type, 'array');
  assert.ok(skeleton.properties.changes.properties.priceMonitoringParameters);
  assert.ok(skeleton.properties.changes.properties.liquidityMonitoringParameters);
  assert.ok(skeleton.properties.changes.properties.logNormal);

  const result = {
    rationale: {
      title: `Update Lorem Ipsum market`,
      description: `A proposal to update Lorem Ipsum market`
    },
    terms: {
      updateMarket: {
        marketId: '123',
        changes: {
          linearSlippageFactor: "0.001",
          instrument: generateFutureInstrument(skeleton.properties.changes.properties.instrument),
          metadata: generateMetadata(skeleton.properties.changes.properties.metadata),
          priceMonitoringParameters: generatePriceMonitoringParameters(skeleton.properties.changes.properties.priceMonitoringParameters),
          logNormal: generateRiskModel(skeleton.properties.changes.properties.logNormal, 'logNormal'),
          liquiditySlaParameters: generateLiquiditySlaParameters(
            skeleton.properties.changes.properties.liquiditySlaParameters
          ),
          tickSize: "1"
        },
      }
    }
  };

  /*------- Liquidity Commitment required */
  result.terms.updateMarket[inspect.custom] = () => {
    return `{
        // ${skeleton.properties.marketId.description}
        marketId: '123',
        changes: {
          // ${skeleton.properties.changes.properties.linearSlippageFactor.description}
          linearSlippageFactor: ${result.terms.updateMarket.changes.linearSlippageFactor},
          // ${skeleton.properties.changes.properties.instrument.title}
          instrument: ${inspect(result.terms.updateMarket.changes.instrument, { depth: 19 })},
          // ${skeleton.properties.changes.properties.metadata.description}
          metadata: ${JSON.stringify(result.terms.updateMarket.changes.metadata)},
           // ${skeleton.properties.changes.properties.priceMonitoringParameters.title}
          priceMonitoringParameters: ${inspect(result.terms.updateMarket.changes.priceMonitoringParameters, { depth: 19 })},
          // ${skeleton.properties.changes.properties.logNormal.title}
          logNormal: ${inspect(result.terms.updateMarket.changes.logNormal, { depth: 19 })},
          // ${skeleton.properties.changes.properties.liquiditySlaParameters.title}
          liquiditySlaParameters: ${inspect(result.terms.updateMarket.changes.liquiditySlaParameters, {
       depth: 19,
     })},
     // ${
      skeleton.properties.changes.properties.tickSize.title
    }
    "tickSize": "1"
        },
    }`
  }


  return result
}

module.exports = { updateMarket }
