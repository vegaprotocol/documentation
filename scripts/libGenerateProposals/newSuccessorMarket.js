const assert = require("assert").strict;
const { inspect } = require("util");
const {
  generateLiquiditySlaParameters,
  generateFutureInstrument,
  generateMetadata,
  generatePriceMonitoringParameters,
  generateRiskModel
} = require('./newMarket')

// Shortcut for deeply nested stuff
const p = 'properties'

function newSuccessorMarket(skeleton, proposalSoFar) {
  assert.ok(skeleton.properties.changes);
  assert.ok(skeleton.properties.changes.properties.decimalPlaces);
  assert.ok(skeleton.properties.changes.properties.quadraticSlippageFactor);
  assert.ok(skeleton.properties.changes.properties.linearSlippageFactor);
  assert.ok(skeleton.properties.changes.properties.positionDecimalPlaces);
  assert.ok(skeleton.properties.changes.properties.instrument);
  assert.equal(skeleton.properties.changes.properties.metadata.type, "array");
  assert.ok(skeleton.properties.changes.properties.priceMonitoringParameters);
  assert.ok(skeleton.properties.changes.properties.logNormal);

  const result = {
    rationale: {
      title: `Lorem Ipsum successor`,
      description: `A successor market`,
    },
    terms: {
      newMarket: {
        changes: {
          successor: {
            parentMarketId: "marketid",
            insurancePoolFraction: "1"
          },
          linearSlippageFactor: "0.001",
          quadraticSlippageFactor: "0",
          decimalPlaces: "5",
          positionDecimalPlaces: "5",

          instrument: generateFutureInstrument(
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
        },
      },
    },
  };

  /*------- Liquidity Commitment required */

  result.terms.newMarket[inspect.custom] = () => {
    return `{
        changes: {
          // ${skeleton.properties.changes.properties.successor.description}
          successor: {
            // ${skeleton.properties.changes.properties.successor.properties.parentMarketId.description}
            parentMarketId: "${result.terms.newMarket.changes.successor.parentMarketId}",
            // ${skeleton.properties.changes.properties.successor.properties.insurancePoolFraction.description}
            insurancePoolFraction: "${result.terms.newMarket.changes.successor.insurancePoolFraction}"
          },
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
          // ${skeleton.properties.changes.properties.logNormal.title}
          logNormal: ${inspect(result.terms.newMarket.changes.logNormal, {
        depth: 19,
      })},
      // ${skeleton.properties.changes.properties.liquiditySlaParameters.title}
      liquiditySlaParameters: ${inspect(result.terms.newMarket.changes.liquiditySlaParameters, {
   depth: 19,
 })},
        }
    }`;
  };

  return result;
}

module.exports = {
  newSuccessorMarket,
};
