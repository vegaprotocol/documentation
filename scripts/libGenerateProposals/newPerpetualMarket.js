const assert = require("assert").strict;
const sample = require("lodash/sample");
const { inspect } = require("util");
const {
  generateMetadata,
  generatePriceMonitoringParameters,
  generateRiskModel,
  generateLiquiditySlaParameters,
  generateLiquidationStrategy,
  generateLiquidityFeeSettings,
  generateMarkPriceConfiguration,
  generateLiquidityMonitoringParameters,
} = require('./newMarket')

const instruments = [
  { name: "Oranges Perpetual", code: "ORANGES.PERP" },
]

// Shortcut for deeply nested stuff
const p = 'properties'

function generatePerpetualSettlementDataSourceSpec(skeleton) {
  const spec = {
    "external": {
      "ethOracle": {
          "sourceChainId": "1",
          "address": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
          "abi": "[{\"inputs\":[],\"name\":\"latestRoundData\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"\",\"type\":\"int256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
          "method": "latestRoundData",
          "normalisers": [
              {
                  "name": "prices.ORANGES.value",
                  "expression": "$[0]"
              }
          ],
          "requiredConfirmations": 3,
          "trigger": {
              "timeTrigger": {
                  "every": 30
              }
          },
          "filters": [
              {
                  "key": {
                      "name": "prices.ORANGES.value",
                      "type": "TYPE_INTEGER",
                      "numberDecimalPlaces": 8
                  },
                  "conditions": [
                      {
                          "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
                          "value": "0"
                      }
                  ]
              }
          ]
      }
    }
  }

  const ex = skeleton[p].external.description.split('\n')

  spec[inspect.custom] = () => {
    return `{
          // ${ex[0]} 
          // ${ex[1]} 
          "external": {

            // ${skeleton[p].external[p].ethOracle.description}
            "ethOracle": {
               // ${skeleton[p].external[p].ethOracle[p].sourceChainId.description} (${skeleton[p].external[p].ethOracle[p].sourceChainId.format
      } as ${skeleton[p].external[p].ethOracle[p].sourceChainId.type})
               // ${skeleton[p].external[p].ethOracle[p].sourceChainId.description} 
               "sourceChainId": "${spec.external.ethOracle.sourceChainId}",
               // ${skeleton[p].external[p].ethOracle[p].address.description}
               "address": "${spec.external.ethOracle.address}",
               // ${skeleton[p].external[p].ethOracle[p].abi.description}
               "abi": "${spec.external.ethOracle.abi}",
               /* ${skeleton[p].external[p].ethOracle[p].method.description} */
               "method": "${spec.external.ethOracle.method}",
               /* ${skeleton[p].external[p].ethOracle[p].normalisers.description} */
               "normalisers": ${JSON.stringify(spec.external.ethOracle.normalisers)},

               // ${skeleton[p].external[p].ethOracle[p].requiredConfirmations.title}
               "requiredConfirmations": ${spec.external.ethOracle.requiredConfirmations},

               // ${skeleton[p].external[p].ethOracle[p].trigger.description}
               "trigger": {
                  /* ${skeleton[p].external[p].ethOracle[p].trigger[p].timeTrigger.description} */
                  "timeTrigger": {
                    /* ${skeleton[p].external[p].ethOracle[p].trigger[p].timeTrigger[p].every.description} */
                    "every": ${spec.external.ethOracle.trigger.timeTrigger.every}
                  }
               },

                // ${skeleton[p].external[p].ethOracle[p].filters.title}
                "filters": ${JSON.stringify(spec.external.ethOracle.filters)}
            }
          }
        }`;
  };

  return spec;
}

function generatePerpetualDataSourceSpecBinding(skeleton) {
  const binding = {
    settlementDataProperty: "prices.ORANGES.value",
    settlementScheduleProperty: "vegaprotocol.builtin.timetrigger"
  };

  binding[inspect.custom] = () => {
    return `{
            /* ${skeleton[p].settlementDataProperty.description} */
            settlementDataProperty: "${binding.settlementDataProperty}",

            settlementScheduleProperty: "${binding.settlementScheduleProperty}"
          }`;
  };

  return binding;
}

function generateSettlementSchedule(skeleton) {
  const schedule = {
    internal: {
      timeTrigger: {
          conditions: [
              {
                  operator: "OPERATOR_GREATER_THAN_OR_EQUAL",
                  value: "0"
              }
          ],
          triggers: [
              {
                  every: 28800
              }
          ]
      }
    }
  }

  return schedule;
}
function generateInternalCompositePriceConfiguration(skeleton) {
    assert.equal(skeleton.properties.decayWeight.type, "string");
    assert.equal(skeleton.properties.decayPower.type, "string");
    assert.equal(skeleton.properties.cashAmount.type, "string");
    assert.equal(skeleton.properties.sourceWeights.type, "array");
    assert.equal(skeleton.properties.sourceStalenessTolerance.type, "array");

    const s = skeleton.properties;

    const config = {
        decayWeight: "1",
        decayPower: "1",
        cashAmount: "5000000",
        sourceWeights: ["0", "1", "0", "1"],
        sourceStalenessTolerance: ["1m0s", "1m0s", "1m0s", "1m0s"],
        compositePriceType: "COMPOSITE_PRICE_TYPE_WEIGHTED",
        dataSourcesSpec: [
            {
                "external": {
                    "ethOracle": {
                        "address": "0x719abd606155442c21b7d561426d42bd0e40a776",
                        "abi": "[{\"inputs\": [{\"internalType\": \"bytes32\", \"name\": \"id\", \"type\": \"bytes32\"}], \"name\": \"getPrice\", \"outputs\": [{\"internalType\": \"int256\", \"name\": \"\", \"type\": \"int256\" }], \"stateMutability\": \"view\", \"type\": \"function\"}]",
                        "method": "getPrice",
                        "args": [
                            "elvB0rVq0CkEjNY5ZLOtJ3bq34Eu3BpDoxQGy1S/9ZI="
                        ],
                        "trigger": {
                            "timeTrigger": {
                                "every": "60"
                            }
                        },
                        "requiredConfirmations": "3",
                        "filters": [
                            {
                                "key": {
                                    "name": "inj.price",
                                    "type": "TYPE_INTEGER",
                                    "numberDecimalPlaces": "18"
                                },
                                "conditions": [
                                    {
                                        "operator": "OPERATOR_GREATER_THAN",
                                        "value": "0"
                                    }
                                ]
                            }
                        ],
                        "normalisers": [
                            {
                                "name": "inj.price",
                                "expression": "$[0]"
                            }
                        ],
                        "sourceChainId": "100"
                    }
                }
            }],
        dataSourcesSpecBinding: [{
            priceSourceProperty: "inj.price"
        }],
    };

    config[inspect.custom] = () => {
        return `{
        // ${s.decayWeight.description}
        decayWeight: "${config.decayWeight}",
        // ${s.decayPower.description} (${s.decayPower.type})
        decayPower: "${config.decayPower}",
        // ${s.cashAmount.description} (${s.cashAmount.type})
        cashAmount: "${config.cashAmount}",
        // ${s.sourceWeights.description} (${s.sourceWeights.type})
        sourceWeights: ${JSON.stringify(config.sourceWeights)},
        // ${s.sourceStalenessTolerance.description.replaceAll('\n', '\n// ')} (${s.sourceStalenessTolerance.type})
        sourceStalenessTolerance: ${JSON.stringify(config.sourceStalenessTolerance)},
        // ${s.compositePriceType.description} (${s.compositePriceType.type})
        compositePriceType: "${config.compositePriceType}",
        // ${s.dataSourcesSpec.description} (${s.dataSourcesSpec.type})
        dataSourcesSpec: ${JSON.stringify(config.dataSourcesSpec)},
        // ${s.dataSourcesSpecBinding.title} (${s.dataSourcesSpecBinding.type})
        dataSourcesSpecBinding: ${JSON.stringify(config.dataSourcesSpecBinding)}
      }`;
    };

    return config;
}
function generatePerpetualInstrument(skeleton) {
  const randomInstrument = sample(instruments);
  // This is tEuro
  const idForAnExistingVegaAsset =
    "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4";

  // The properties of an instrument
  assert.ok(skeleton.properties.name, "Instrument property name used to exist");
  assert.ok(skeleton.properties.code, "Instrument property code used to exist");
  assert.ok(
    skeleton.properties.future.properties.dataSourceSpecForSettlementData,
    "DataSourceSpecForSettlementData used to exist"
  );
  assert.ok(
    skeleton.properties.future.properties.dataSourceSpecBinding,
    "DataSourceSpecBinding used to exist on a future"
  );

  const instrument = {
    name: randomInstrument.name,
    code: randomInstrument.code,
    perpetual: {
      settlementAsset: idForAnExistingVegaAsset,
      quoteName: "tEuro",
      marginFundingFactor: "0.9",
      interestRate: "0",
      fundingRateScalingFactor: "1",
      fundingRateLowerBound: "-0.001",
      fundingRateUpperBound: "0.001",
      clampLowerBound: "0",
      clampUpperBound: "0",

      internalCompositePriceConfiguration: generateInternalCompositePriceConfiguration(
        skeleton.properties.perpetual.properties.internalCompositePriceConfiguration
      ),
      dataSourceSpecForSettlementData: generatePerpetualSettlementDataSourceSpec(
        skeleton.properties.perpetual.properties.dataSourceSpecForSettlementData
      ),
      dataSourceSpecForSettlementSchedule: generateSettlementSchedule(
        skeleton.properties.perpetual.properties.dataSourceSpecForSettlementSchedule
      ),
      dataSourceSpecBinding: generatePerpetualDataSourceSpecBinding(
        skeleton.properties.perpetual.properties.dataSourceSpecBinding
      ),
    },
  };

  instrument[inspect.custom] = () => {
    return `{
        // ${skeleton.properties.name.description}
        name: "${instrument.name}",
        // ${skeleton.properties.code.description}
        code: "${instrument.code}",
        // ${skeleton.properties.perpetual.title}
        perpetual: {
          // ${skeleton.properties.perpetual.properties.settlementAsset.description}
          settlementAsset: "c9fe6fc24fce121b2cc72680543a886055abb560043fda394ba5376203b7527d",
          // ${skeleton.properties.perpetual.properties.quoteName.description}
          quoteName: "USD",
          // ${skeleton.properties.perpetual.properties.marginFundingFactor.description}
          marginFundingFactor: "0.9",
          // ${skeleton.properties.perpetual.properties.interestRate.description}
          interestRate: "0",
          // ${skeleton.properties.perpetual.properties.fundingRateScalingFactor.description}
          fundingRateScalingFactor: "1",
          // ${skeleton.properties.perpetual.properties.fundingRateLowerBound.description}
          fundingRateLowerBound: "-0.001",
          // ${skeleton.properties.perpetual.properties.fundingRateUpperBound.description}
          fundingRateUpperBound: "0.001",
          // ${skeleton.properties.perpetual.properties.clampLowerBound.description}
          clampLowerBound: "0",
          // ${skeleton.properties.perpetual.properties.clampUpperBound.description}
          clampUpperBound: "0",

          internalCompositePriceConfiguration: ${inspect(
        instrument.perpetual.internalCompositePriceConfiguration,
        { depth: 9 }
    )},
          dataSourceSpecForSettlementData: ${inspect(
        instrument.perpetual.dataSourceSpecForSettlementData,
        { depth: 5 }
      )},
      dataSourceSpecForSettlementSchedule: ${inspect(
        instrument.perpetual.dataSourceSpecForSettlementSchedule,
        { depth: 5 }
      )},
          /* ${skeleton.properties.perpetual.properties.dataSourceSpecBinding.description} */
          dataSourceSpecBinding: ${inspect(instrument.perpetual.dataSourceSpecBinding, {
        depth: 10,
      })}
      }`;
  };

  return instrument;
}

function newPerpetualMarket(skeleton, proposalSoFar) {
  assert.ok(skeleton[p].changes);
  assert.ok(skeleton[p].changes[p].decimalPlaces);
  assert.ok(skeleton[p].changes[p].linearSlippageFactor);
  assert.ok(skeleton[p].changes[p].positionDecimalPlaces);
  assert.ok(skeleton[p].changes[p].instrument);
  assert.equal(skeleton[p].changes[p].metadata.type, "array");
  assert.ok(skeleton[p].changes[p].priceMonitoringParameters);
  assert.ok(skeleton[p].changes[p].logNormal);

  const result = {
    rationale: {
      title: `Lorem Ipsum perpetual`,
      description: `An orange perpetual market`,
    },
    terms: {
      newMarket: {
        changes: {
          linearSlippageFactor: "0.001",
          decimalPlaces: "5",
          positionDecimalPlaces: "5",

          instrument: generatePerpetualInstrument(
            skeleton.properties.changes.properties.instrument
          ),
          metadata: generateMetadata(
            skeleton.properties.changes.properties.metadata,
            proposalSoFar
          ),
          priceMonitoringParameters: generatePriceMonitoringParameters(
            skeleton.properties.changes.properties.priceMonitoringParameters
          ),
          logNormal: generateRiskModel(
            skeleton.properties.changes.properties.logNormal,
            "logNormal"
          ),
          liquiditySlaParameters: generateLiquiditySlaParameters(
            skeleton.properties.changes.properties.liquiditySlaParameters
          ),
          liquidationStrategy: generateLiquidationStrategy(
            skeleton.properties.changes.properties.liquidationStrategy
          ),
          liquidityFeeSettings: generateLiquidityFeeSettings(
            skeleton.properties.changes.properties.liquidityFeeSettings
          ),
          liquidityMonitoringParameters: generateLiquidityMonitoringParameters(
            skeleton.properties.changes.properties.liquidityMonitoringParameters
          ),
          markPriceConfiguration: generateMarkPriceConfiguration(
            skeleton.properties.changes.properties.markPriceConfiguration
          ),
          tickSize: "1"
        },
      },
    },
  };

  /*------- Liquidity Commitment required */
  result.terms.newMarket[inspect.custom] = () => {
    return `{
        changes: {
          // ${skeleton.properties.changes.properties.linearSlippageFactor.description}
          linearSlippageFactor: ${result.terms.newMarket.changes.linearSlippageFactor},

          // ${skeleton.properties.changes.properties.decimalPlaces.description} (${skeleton.properties.changes.properties.decimalPlaces.format
      } as ${skeleton.properties.changes.properties.decimalPlaces.type})
          decimalPlaces: "${result.terms.newMarket.changes.decimalPlaces}",
          // ${skeleton.properties.changes.properties.positionDecimalPlaces.description
      } (${skeleton.properties.changes.properties.positionDecimalPlaces.format
      } as ${skeleton.properties.changes.properties.positionDecimalPlaces.type})
          positionDecimalPlaces: "${result.terms.newMarket.changes.positionDecimalPlaces
      }",
          // ${skeleton.properties.changes.properties.instrument.title}
          instrument: ${inspect(result.terms.newMarket.changes.instrument, {
        depth: 19,
      })},
          // ${skeleton.properties.changes.properties.metadata.description}
          metadata: ${JSON.stringify(result.terms.newMarket.changes.metadata)},
          // ${skeleton.properties.changes.properties.priceMonitoringParameters
        .title
      }
          priceMonitoringParameters: ${inspect(
        result.terms.newMarket.changes.priceMonitoringParameters,
        { depth: 19 }
      )},
          // ${skeleton.properties.changes.properties.logNormal.title}
          logNormal: ${inspect(result.terms.newMarket.changes.logNormal, {
        depth: 19,
      })},

    // ${skeleton.properties.changes.properties.liquiditySlaParameters.title}
    liquiditySlaParameters: ${inspect(
      result.terms.newMarket.changes.liquiditySlaParameters,
      {
        depth: 19,
      }
    )},
 // ${
   skeleton.properties.changes.properties.liquidationStrategy.description
 }
    liquidationStrategy: ${inspect(
      result.terms.newMarket.changes.liquidationStrategy,
      {
        depth: 19,
      }
    )},
 // ${
   skeleton.properties.changes.properties.liquidityFeeSettings.description
 }
    liquidityFeeSettings: ${inspect(
      result.terms.newMarket.changes.liquidityFeeSettings,
      {
        depth: 19,
      }
    )},

 // ${ skeleton.properties.changes.properties.liquidityMonitoringParameters.description }
     liquidityMonitoringParameters: ${inspect(
       result.terms.newMarket.changes.liquidityMonitoringParameters,
       {
         depth: 19,
       }
     )},
    // ${
     skeleton.properties.changes.properties.markPriceConfiguration.description
   }
      markPriceConfiguration: ${inspect(
     result.terms.newMarket.changes.markPriceConfiguration,
     {
       depth: 19,
     }
   ),
      // ${
      skeleton.properties.changes.properties.tickSize.title
    }
    "tickSize": "1"
    }
}`;
};

return result;
}

module.exports = {
  newPerpetualMarket,
};
