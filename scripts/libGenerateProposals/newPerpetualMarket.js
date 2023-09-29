const assert = require("assert").strict;
const sample = require("lodash/sample");
const { inspect } = require("util");
const {
  generateMetadata,
  generatePriceMonitoringParameters,
  generateLiquidityMonitoringParameters,
  generateRiskModel
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
          "address": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
          "abi": "[{\"inputs\":[],\"name\":\"latestAnswer\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"\",\"type\":\"int256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
          "method": "latestAnswer",
          "normalisers": [
              {
                  "name": "btc.price",
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
                      "name": "btc.price",
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
               // ${skeleton[p].external[p].ethOracle[p].address.description}
               "address": "${spec.external.ethOracle.address}",
               // ${skeleton[p].external[p].ethOracle[p].abi.description}
               "abi": "${spec.external.ethOracle.abi}",
               // ${skeleton[p].external[p].ethOracle[p].method.description}
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

            /* ${skeleton[p].settlementScheduleProperty.description} */
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
                  every: 1800
              }
          ]
      }
    }
  }

  return schedule;
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
      dataSourceSpecForSettlementData: generatePerpetualSettlementDataSourceSpec(
        skeleton.properties.perpetual.properties.dataSourceSpecForSettlementData
      ),
      settlementScheduleProperty: generateSettlementSchedule(
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

          dataSourceSpecForSettlementData: ${inspect(
        instrument.perpetual.dataSourceSpecForSettlementData,
        { depth: 5 }
      )},
          /* ${skeleton.properties.perpetual.properties.dataSourceSpecBinding.title} */
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
  assert.ok(skeleton[p].changes[p].quadraticSlippageFactor);
  assert.ok(skeleton[p].changes[p].linearSlippageFactor);
  assert.ok(skeleton[p].changes[p].positionDecimalPlaces);
  assert.ok(skeleton[p].changes[p].instrument);
  assert.equal(skeleton[p].changes[p].metadata.type, "array");
  assert.ok(skeleton[p].changes[p].priceMonitoringParameters);
  assert.ok(
    skeleton[p].changes[p].liquidityMonitoringParameters
  );
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
          quadraticSlippageFactor: "0",
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
          liquidityMonitoringParameters: generateLiquidityMonitoringParameters(
            skeleton.properties.changes.properties.liquidityMonitoringParameters
          ),
          logNormal: generateRiskModel(
            skeleton.properties.changes.properties.logNormal,
            "logNormal"
          ),
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
          // ${skeleton.properties.changes.properties.quadraticSlippageFactor.description}
          quadraticSlippageFactor: ${result.terms.newMarket.changes.quadraticSlippageFactor},

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
          // ${skeleton.properties.changes.properties.liquidityMonitoringParameters
        .title
      }
          liquidityMonitoringParameters: ${inspect(
        result.terms.newMarket.changes.liquidityMonitoringParameters,
        { depth: 19 }
      )},
          // ${skeleton.properties.changes.properties.logNormal.title}
          logNormal: ${inspect(result.terms.newMarket.changes.logNormal, {
        depth: 19,
      })},
        }
    }`;
  };

  return result;
}

module.exports = {
  newPerpetualMarket,
};
