const sample = require("lodash/sample");
const random = require("lodash/random");
const assert = require("assert").strict;
const { inspect } = require("util");
const { format } = require("date-fns");

// Shortcut for deeply nested stuff
const p = 'properties'

// Seed data: Some inspirational instrument names and corresponding codes
const instruments = [
  { name: "Apples Yearly (2022)", code: "APPLES.22" },
  { name: "Oranges Daily", code: "ORANGES.24h" },
];

// TODO more type assertions
function generateSettlementDataSourceSpec(skeleton) {
  assert.equal(
    skeleton.type,
    "object",
    "This is an object with some properties"
  )
  assert.equal(
    skeleton[p].external.type,
    "object",
    "External is an object containing data sources"
  );
  assert.equal(
    skeleton[p].internal.type,
    "object",
    "Internal is an object containing data sources"
  );
  assert.equal(
    skeleton[p].internal[p].time.type,
    "object",
    "Time is a valid internal data source"
  );
  assert.equal(
    skeleton[p].external[p].oracle.type,
    "object",
    "Oracle is a valid external data source"
  );
  assert.equal(
    skeleton[p].external[p].oracle[p].filters.type,
    "array",
    "Data Source spec filters"
  );
  assert.equal(
    skeleton[p].external[p].oracle[p].filters.items.properties.key.properties.numberDecimalPlaces.format,
    "uint64",
    "numberDecimalPlaces is a uint"
  );


  const spec = {
    external: {
      oracle: {
        signers: [
          { ethAddress: { address: "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC" } }
        ],
        filters: [
          {
            key: {
              name: "prices.BTC.value",
              type: "TYPE_INTEGER",
              numberDecimalPlaces: "5"
            },
            conditions: [
              {
                operator: "OPERATOR_GREATER_THAN",
                value: "0",
              },
            ],
          },
          {
            key: {
              name: "prices.BTC.timestamp",
              type: "TYPE_TIMESTAMP",
            },
            conditions: [
              {
                operator: "OPERATOR_GREATER_THAN",
                value: "1648684800000000000",
              },
            ],
          },
        ]
      }
    }
  };

  spec[inspect.custom] = () => {
    const splitFilters = skeleton[p].external[p].oracle[p].filters.description.split("\n")
    const splitDescription =
      skeleton[p].external[p].oracle[p].filters.items[p].conditions.description.split(
        "\n"
      );
    const splitPubkeys = skeleton[p].external[p].oracle[p].signers.description.split("\n");
    const splitDP = skeleton.properties.external.properties.oracle.properties.filters.items.properties.key.properties.numberDecimalPlaces.title.split("\n")
    return `{
      external: {
        oracle: {
            // ${splitPubkeys[0]}
            // ${splitPubkeys[1]} (${skeleton[p].external[p].oracle[p].signers.type} of ${skeleton.properties.external.properties.oracle.properties.signers.items.type}s)
            signers: ${JSON.stringify(spec.external.oracle.signers)},

            // ${splitFilters[0]}
            // ${splitFilters[1]}
            filters: [
                key: {
                  // ${skeleton.properties.external.properties.oracle.properties.filters.items.properties.key
        .properties.name.description
      } (${skeleton.properties.external.properties.oracle.properties.filters.items.properties.key.properties.name.type
      })
                  name: "${spec.external.oracle.filters[0].key.name}",
                  // ${skeleton.properties.external.properties.oracle.properties.filters.items.properties.key
        .properties.type.description
      } (${skeleton.properties.external.properties.oracle.properties.filters.items.properties.key.properties.type.type
      })
                  type: "${spec.external.oracle.filters[0].key.type}",

                  // ${splitDP[0]}
                  // ${splitDP[1]}
                  numberDecimalPlaces: "${spec.external.oracle.filters[0].key.numberDecimalPlaces}",
                },
                // ${splitDescription[0]}
                // ${splitDescription[1]}
                conditions: [
                  {
                    // ${skeleton[p].external[p].oracle[p].filters.items[p].conditions.items.properties.operator.description
      } (${skeleton[p].external[p].oracle[p].filters.items[p].conditions.items[p].operator.type
      })
                    operator: "${spec.external.oracle.filters[0].conditions[0].operator}",
                    // ${skeleton[p].external[p].oracle[p].filters.items[p].conditions.items[p].value.description
      } (${skeleton[p].external[p].oracle[p].filters.items[p].conditions.items[p].value.type
      })
                    value: "${spec.external.oracle.filters[0].conditions[0].value}",
                  }
                ]
              },
              {
                  key: {
                    name: "${spec.external.oracle.filters[1].key.name}",
                    type: "${spec.external.oracle.filters[1].key.type}",
                  },
                  conditions: [
                    {
                      operator: "${spec.external.oracle.filters[1].conditions[0].operator}",
                      value: "${spec.external.oracle.filters[1].conditions[0].value}",
                    }
                  ]
              }
          ]
        }
    }`;
  };

  return spec;
}

// TODO more type assertions
function generateTerminationDataSourceSpec(skeleton) {
  assert.equal(
    skeleton.type,
    "object",
    "This is an object with some properties"
  )
  assert.equal(
    skeleton.properties.external.type,
    "object",
    "External is an object containing data sources"
  );
  assert.equal(
    skeleton.properties.internal.type,
    "object",
    "Internal is an object containing data sources"
  );
  assert.equal(
    skeleton.properties.internal.properties.time.type,
    "object",
    "Time is a valid internal data source"
  );
  assert.equal(
    skeleton.properties.internal.properties.time.properties.conditions.type,
    "array",
    "Time oracles requires conditions"
  );
  assert.equal(
    skeleton.properties.internal.properties.time.properties.conditions.items.type,
    "object",
    "Time oracle conditions are objects"
  );
  assert.equal(
    skeleton.properties.external.properties.oracle.type,
    "object",
    "Oracle is a valid external data source"
  );
  assert.equal(
    skeleton.properties.external.properties.oracle.properties.filters.type,
    "array",
    "Data Source spec filters"
  );

  const spec = {
    internal: {
      time: {
        conditions: [
          {
            operator: "OPERATOR_GREATER_THAN_OR_EQUAL",
            value: "1648684800000000000",
          },
        ],
      }
    }
  };

  const sip = skeleton.properties.internal.properties.time.properties

  spec[inspect.custom] = () => {
    const splitDescription =
      skeleton.description.split(
        "\n"
      );
    return `{
        // ${splitDescription[0]}
        // ${splitDescription[1]}
        internal {
            // ${skeleton[p].internal[p].time.description}
            time: {
              // ${skeleton[p].internal[p].time[p].conditions.description}
                conditions: [{
                    // ${sip.conditions.items[p].operator.description
      } (${sip.conditions.items[p].operator.type
      })
                    operator: "${spec.internal.time.conditions[0].operator}",
                    // ${sip.conditions.items[p].value.description
      } (${sip.conditions.items[p].value.type
      })
                    value: "${spec.internal.time.conditions[0].value}",
                  }
               ]
            }
        }`;
  };

  return spec;
}

function generateDataSourceSpecBinding(skeleton) {
  assert.equal(
    skeleton.properties.settlementDataProperty.type,
    "string",
    "Oracle spec binding: settlement data property changed format"
  );
  assert.equal(
    skeleton.properties.tradingTerminationProperty.type,
    "string",
    "Oracle spec binding: trading termination property changed format"
  );

  const binding = {
    settlementDataProperty: "prices.BTC.value",
    tradingTerminationProperty: "vega.builtin.timestamp",
  };

  binding[inspect.custom] = () => {
    // Brittle
    const splitSettle =
      skeleton.properties.settlementDataProperty.description.split("\n");
    return `{
            // ${splitSettle[0]}
            // ${splitSettle[1]}
            // ${splitSettle[2]}
            // ${splitSettle[3]} (${skeleton.properties.settlementDataProperty.type})
            settlementDataProperty: "${binding.settlementDataProperty}",
            // ${skeleton.properties.tradingTerminationProperty.title} (${skeleton.properties.tradingTerminationProperty.type})
            tradingTerminationProperty: "${binding.tradingTerminationProperty}"
          }`;
  };

  return binding;
}

function generateInstrument(skeleton) {
  const randomInstrument = sample(instruments);
  // This is tEuro
  const idForAnExistingVegaAsset =
    "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4";

  // The properties of an instrument
  assert.ok(skeleton.properties.name, "Instrument property name used to exist");
  assert.ok(skeleton.properties.code, "Instrument property code used to exist");
  assert.ok(
    skeleton.properties.future.properties.settlementAsset,
    "Instrument property settlementAsset used to exist"
  );
  assert.ok(
    skeleton.properties.future.properties.quoteName,
    "Instrument property quoteName used to exist"
  );

  assert.ok(
    skeleton.properties.future.properties.dataSourceSpecForSettlementData,
    "DataSourceSpecForSettlementData used to exist"
  );
  assert.ok(
    skeleton.properties.future.properties.dataSourceSpecForTradingTermination,
    "DataSourceSpecForTradingTermination used to exist"
  );
  assert.ok(
    skeleton.properties.future.properties.dataSourceSpecBinding,
    "DataSourceSpecBinding used to exist on a future"
  );


  const instrument = {
    name: randomInstrument.name,
    code: randomInstrument.code,
    future: {
      settlementAsset: idForAnExistingVegaAsset,
      quoteName: "tEuro",
      dataSourceSpecForSettlementData: generateSettlementDataSourceSpec(
        skeleton.properties.future.properties.dataSourceSpecForSettlementData
      ),
      dataSourceSpecForTradingTermination: generateTerminationDataSourceSpec(
        skeleton.properties.future.properties.dataSourceSpecForTradingTermination
      ),
      dataSourceSpecBinding: generateDataSourceSpecBinding(
        skeleton.properties.future.properties.dataSourceSpecBinding
      ),
    },
  };

  instrument[inspect.custom] = () => {
    return `{
        // ${skeleton.properties.name.title}
        name: "${instrument.name}",
        // ${skeleton.properties.code.title}
        code: "${instrument.code}",
        // ${skeleton.properties.future.title}
        future: {
          // ${skeleton.properties.future.properties.settlementAsset.title} (${skeleton.properties.future.properties.settlementAsset.type
      })
          settlementAsset: "${instrument.future.settlementAsset}",
          // ${skeleton.properties.future.properties.quoteName.title} (${skeleton.properties.future.properties.quoteName.type
      })
          quoteName: "${instrument.future.quoteName}",
          // ${skeleton.properties.future.properties.dataSourceSpecForSettlementData
        .title
      } (${skeleton.properties.future.properties.dataSourceSpecForSettlementData.type
      })
          dataSourceSpecForSettlementData: ${inspect(
        instrument.future.dataSourceSpecForSettlementData,
        { depth: 5 }
      )},
          // ${skeleton.properties.future.properties
        .dataSourceSpecForTradingTermination.title
      } (${skeleton.properties.future.properties.dataSourceSpecForTradingTermination.type
      })
          dataSourceSpecForTradingTermination: ${inspect(
        instrument.future.dataSourceSpecForTradingTermination,
        { depth: 5 }
      )},
          // ${skeleton.properties.future.properties.dataSourceSpecBinding.title
      } (${skeleton.properties.future.properties.dataSourceSpecBinding.type})
          dataSourceSpecBinding: ${inspect(instrument.future.dataSourceSpecBinding, {
        depth: 5,
      })}
      }`;
  };

  return instrument;
}

function generatePeggedOrder(skeleton, side, customInspect = false) {
  const order = {
    offset: random(1, 100).toString(),
    proportion: random(1, 10),
    reference:
      side === "sell"
        ? "PEGGED_REFERENCE_BEST_ASK"
        : "PEGGED_REFERENCE_BEST_BID",
  };

  // This switch is used so we only output the docs strings on the first order to save some space
  if (customInspect) {
    order[inspect.custom] = () => {
      return `  {
      // ${skeleton.offset.title} (${skeleton.offset.type})
      offset: "${order.offset}",
      // ${skeleton.proportion.title} (${skeleton.proportion.format} as ${skeleton.proportion.type})
      proportion: ${order.proportion},
      // ${skeleton.reference.title} (${skeleton.reference.type})
      reference: "${order.reference}",
    }`;
    };
  } else {
    order[inspect.custom] = () => {
      return `   {
      offset: "${order.offset}",
      proportion: ${order.proportion},
      reference: "${order.reference}",
    }`;
    };
  }

  return order;
}

function generatePeggedOrders(skeleton, side) {
  assert.equal(skeleton.type, "array", "Pegged orders used to be an array");
  assert.equal(
    skeleton.items.type,
    "object",
    "Pegged orders array items used to be an object"
  );
  assert.equal(
    skeleton.items.properties.reference.type,
    "string",
    "Pegged orders reference used to be a string/enum"
  );
  assert.equal(
    skeleton.items.properties.proportion.type,
    "integer",
    "Pegged orders proportion used to be an integer"
  );
  assert.equal(
    skeleton.items.properties.offset.type,
    "string",
    "Pegged orders offset used to be a string"
  );

  let orders = [
    generatePeggedOrder(skeleton.items.properties, side, true),
    generatePeggedOrder(skeleton.items.properties, side),
    generatePeggedOrder(skeleton.items.properties, side),
  ];

  return orders;
}

function generateNewMarketCommitment(skeleton) {
  assert.equal(
    skeleton.properties.commitmentAmount.type,
    "string",
    "Market commitment amount changed format"
  );
  assert.equal(
    skeleton.properties.fee.type,
    "string",
    "Market commitment fee changed format"
  );

  assert.equal(
    skeleton.properties.sells.type,
    "array",
    "Market commitment buys used to be be an array"
  );
  assert.equal(
    skeleton.properties.sells.items.type,
    "object",
    "Market commitment buys used to be an objects"
  );

  assert.equal(
    skeleton.properties.buys.type,
    "array",
    "Market commitment sells used to be an array of objects"
  );
  assert.equal(
    skeleton.properties.buys.items.type,
    "object",
    "Market commitment sells used to be an array of objects"
  );

  assert.equal(
    skeleton.properties.buys.items.properties.reference.type,
    "string",
    "Market commitment used to be a string"
  );
  assert.equal(
    skeleton.properties.buys.items.properties.proportion.format,
    "int64",
    "Market proportion used to be an int64"
  );
  assert.equal(
    skeleton.properties.buys.items.properties.offset.type,
    "string",
    "Market offset used to be a string"
  );
  assert.deepEqual(
    skeleton.properties.buys.items.properties.reference.enum,
    [
      "PEGGED_REFERENCE_UNSPECIFIED",
      "PEGGED_REFERENCE_MID",
      "PEGGED_REFERENCE_BEST_BID",
      "PEGGED_REFERENCE_BEST_ASK",
    ],
    "Market commitment types changed"
  );

  const commitment = {
    commitmentAmount: random(100000, 10000000).toString(),
    fee: random(0.01, 0.9).toPrecision(2).toString(),
    buys: generatePeggedOrders(skeleton.properties.buys, "buy"),
    sells: generatePeggedOrders(skeleton.properties.sells, "sell"),
  };

  commitment[inspect.custom] = () => {
    return `{
          // ${skeleton.properties.commitmentAmount.title} (${skeleton.properties.commitmentAmount.type
      })
          commitmentAmount: "${commitment.commitmentAmount}",
          // ${skeleton.properties.fee.title} (${skeleton.properties.fee.format
      } as ${skeleton.properties.fee.type})
          fee: ${commitment.fee},
          // ${skeleton.properties.buys.title}
          buys: ${inspect(commitment.buys, { depth: 20 })},
          // ${skeleton.properties.buys.title}
          sells: ${inspect(commitment.sells, { depth: 20 })},
        }
      }`;
  };

  return commitment;
}

function generatePriceMonitoringParameters(skeleton) {
  assert.ok(skeleton.properties.triggers);
  assert.equal(skeleton.properties.triggers.type, "array");
  assert.equal(
    skeleton.properties.triggers.items.properties.horizon.format,
    "int64"
  );
  assert.equal(
    skeleton.properties.triggers.items.properties.probability.type,
    "string"
  );
  assert.equal(
    skeleton.properties.triggers.items.properties.auctionExtension.format,
    "int64"
  );

  const params = {
    triggers: [
      {
        horizon: "43200",
        probability: "0.9999999",
        auctionExtension: "600",
      },
    ],
  };

  params[inspect.custom] = () => {
    const splitTitle =
      skeleton.properties.triggers.items.properties.auctionExtension.title.split(
        "\n"
      );
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
      }`;
  };

  return params;
}

function generateLiquidityMonitoringParameters(skeleton) {
  assert.ok(skeleton.properties.targetStakeParameters);
  assert.equal(
    skeleton.properties.targetStakeParameters.properties.timeWindow.type,
    "string"
  );
  assert.equal(
    skeleton.properties.targetStakeParameters.properties.scalingFactor.type,
    "number"
  );

  assert.equal(skeleton.properties.triggeringRatio.type, "string");
  assert.equal(skeleton.properties.auctionExtension.type, "string");

  const params = {
    targetStakeParameters: {
      timeWindow: "3600",
      scalingFactor: 10,
    },
    triggeringRatio: "0.7",
    auctionExtension: "1",
  };

  params[inspect.custom] = () => {
    return `{
        // ${skeleton.properties.targetStakeParameters.title}
        targetStakeParameters: {
          // ${skeleton.properties.targetStakeParameters.properties.timeWindow.title} (${skeleton.properties.targetStakeParameters.properties.timeWindow.type})
          timeWindow: "${params.targetStakeParameters.timeWindow}",
          // ${skeleton.properties.targetStakeParameters.properties.scalingFactor.title} (${skeleton.properties.targetStakeParameters.properties.scalingFactor.type})
          scalingFactor: ${params.targetStakeParameters.scalingFactor}
        },
        // ${skeleton.properties.triggeringRatio.title} (${skeleton.properties.triggeringRatio.format} as ${skeleton.properties.triggeringRatio.type})
        triggeringRatio: "${params.triggeringRatio}",
        // ${skeleton.properties.auctionExtension.title} (${skeleton.properties.auctionExtension.format} as ${skeleton.properties.auctionExtension.type})
        auctionExtension: "${params.auctionExtension}",
      }}`;
  };

  return params;
}

function generateMetadata(skeleton, proposalSoFar) {
  const dateFormat = "yyyy-MM-dd\'T\'HH:mm:ss"
  const settlement = format(proposalSoFar.terms.closingTimestamp, dateFormat)
  const enactment = format(proposalSoFar.terms.enactmentTimestamp, dateFormat)

  assert.equal(
    skeleton.type,
    "array",
    "Market metadata type used to be an array"
  );
  assert.equal(
    skeleton.items.type,
    "string",
    "Market metadata type used to be an array of strings"
  );
  return [
    `enactment:${enactment}Z`,
    `settlement:${settlement}Z`,
    "source:docs.vega.xyz"
  ];
}

function generateRiskModel(skeleton, riskModelType) {
  if (riskModelType !== "logNormal") {
    throw "Not implemented";
  }

  assert.ok(skeleton.properties.riskAversionParameter);
  assert.ok(skeleton.properties.tau);
  assert.equal(skeleton.properties.tau.format, "double");
  assert.ok(skeleton.properties.params.properties.r);
  assert.equal(skeleton.properties.params.properties.r.format, "double");
  assert.ok(skeleton.properties.params.properties.mu);
  assert.equal(skeleton.properties.params.properties.mu.format, "double");
  assert.ok(skeleton.properties.params.properties.sigma);
  assert.equal(skeleton.properties.params.properties.sigma.format, "double");

  const riskModel = {
    // This was what all the markets on fairground were set to
    tau: 0.0001140771161,
    // This is a random array based on what was live on Fairground at the time
    riskAversionParameter: 0.01,
    params: {
      // This was what all the markets on fairground were set to
      mu: 0,
      // Ditto
      r: 0.016,
      // This is a random array based on what was live on Fairground at the time
      sigma: 0.5,
    },
  };

  riskModel[inspect.custom] = () => {
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
      }`;
  };

  return riskModel;
}

function newMarket(skeleton, proposalSoFar) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.decimalPlaces);
  assert.ok(skeleton.properties.changes.properties.quadraticSlippageFactor);
  assert.ok(skeleton.properties.changes.properties.linearSlippageFactor);
  assert.ok(skeleton.properties.changes.properties.positionDecimalPlaces);
  assert.ok(skeleton.properties.changes.properties.instrument);
  assert.ok(skeleton.properties.changes.properties.lpPriceRange);
  assert.equal(skeleton.properties.changes.properties.metadata.type, "array");
  assert.ok(skeleton.properties.changes.properties.priceMonitoringParameters);
  assert.ok(
    skeleton.properties.changes.properties.liquidityMonitoringParameters
  );
  assert.ok(skeleton.properties.changes.properties.logNormal);

  const result = {
    rationale: {
      title: `Add Lorem Ipsum market`,
      description: `An example proposal to add Lorem Ipsum market`,
    },
    terms: {
      newMarket: {
        changes: {
          lpPriceRange: "10",
          linearSlippageFactor: "0.001",
          quadraticSlippageFactor: "0",
          decimalPlaces: "5",
          positionDecimalPlaces: "5",
          instrument: generateInstrument(
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
  const lbLabel = skeleton.properties.changes.properties.lpPriceRange.title.split('\n')

  result.terms.newMarket[inspect.custom] = () => {
    return `{
        changes: {
          // ${lbLabel[0]}
          // ${lbLabel[1]}
          lpPriceRange: "${result.terms.newMarket.changes.lpPriceRange}",

          // ${skeleton.properties.changes.properties.linearSlippageFactor.title}
          linearSlippageFactor: ${result.terms.newMarket.changes.linearSlippageFactor},
          // ${skeleton.properties.changes.properties.quadraticSlippageFactor.title}
          quadraticSlippageFactor: ${result.terms.newMarket.changes.quadraticSlippageFactor},

          // ${skeleton.properties.changes.properties.decimalPlaces.title} (${skeleton.properties.changes.properties.decimalPlaces.format
      } as ${skeleton.properties.changes.properties.decimalPlaces.type})
          decimalPlaces: "${result.terms.newMarket.changes.decimalPlaces}",
          // ${skeleton.properties.changes.properties.positionDecimalPlaces.title
      } (${skeleton.properties.changes.properties.positionDecimalPlaces.format
      } as ${skeleton.properties.changes.properties.positionDecimalPlaces.type})
          positionDecimalPlaces: "${result.terms.newMarket.changes.positionDecimalPlaces
      }",
          // ${skeleton.properties.changes.properties.instrument.title}
          instrument: ${inspect(result.terms.newMarket.changes.instrument, {
        depth: 19,
      })},
          // ${skeleton.properties.changes.properties.metadata.title}
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

// Produces a very basic object 'overview', i.e. a lot of the details removed
function produceOverview(p) {
  const proposal = Object.assign({}, p);
  proposal.terms.newMarket.changes.instrument = {};
  proposal.terms.newMarket.changes.metadata = [];
  proposal.terms.newMarket.changes.priceMonitoringParameters = [];
  proposal.terms.newMarket.changes.liquidityMonitoringParameters = {};
  proposal.terms.newMarket.changes.logNormal = {};
  proposal.terms.newMarket.liquidityCommitment = {};
  return proposal;
}

// Produces a very basic object 'overview' of an instrument
function produceInstrument(i) {
  const instrument = Object.assign({}, i);
  instrument.future.dataSourceSpecForSettlementPrice = {};
  instrument.future.dataSourceSpecForTradingTermination = {};
  return instrument;
}

module.exports = {
  newMarket,
  generateDataSourceSpecBinding,
  generateTerminationDataSourceSpec,
  generateSettlementDataSourceSpec,
  produceOverview,
  produceInstrument,
};
