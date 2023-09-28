
  ```javascript
 {
  rationale: {
   title: "Lorem Ipsum market successor",
   description: "A successor to nnnnn"
  },
  terms: {
   newMarket: {
    changes: {
     // DEPRECATED: Use liquidity SLA parameters instead.
     // Percentage move up and down from the mid price which specifies the range of
     lpPriceRange: "10",

     // Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
     linearSlippageFactor: 0.001,

     // Quadratic slippage factor is used to cap the slippage component of maintenance margin - it is applied to the square of the slippage volume.
     quadraticSlippageFactor: 0,

     // Decimal places used for the new futures market, sets the smallest price increment on the book. (uint64 as string)
     decimalPlaces: "5",

     // Decimal places for order sizes, sets what size the smallest order / position on the futures market can be. (int64 as string)
     positionDecimalPlaces: "5",

     // Instrument configuration
     instrument: {
      // Instrument name.
      name: "Oranges Perpetual",

      // Instrument code, human-readable shortcode used to describe the instrument.
      code: "ORANGES.PERP",

      // Perpetual product configuration
      dataSourceSpecForSettlementData: {
       external: {
        ethOracle: {
         address: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
         abi: "[{\"inputs\":[],\"name\":\"latestAnswer\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"\",\"type\":\"int256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
         method: "latestAnswer",
         normalisers: [
          {
           name: "btc.price",
           expression: "$[0]"
          }
         ],
         requiredConfirmations: 3,
         trigger: {
          timeTrigger: {
           every: 30
          }
         },
         filters: [
          {
           key: {
            name: "btc.price",
            type: "TYPE_INTEGER",
            numberDecimalPlaces: 8
           },
           conditions: [
            [
             Object
            ]
           ]
          }
         ]
        }
       }
      },

      // Describes which property of the data source data is to be
      used as settlement data and which to use as the trading terminated trigger(object) dataSourceSpecBinding: {
       // Name of the property in the source data that should be used as settlement data.
       // If it is set to "prices.BTC.value", then the perpetual market will use the value of
       // this property as settlement data. (string)
       settlementDataProperty: "prices.ORANGES.value",

       // Name of the property in the source data that should be used as settlement data.
       If it is set to "prices.BTC.value",
       then the perpetual market will use the value of this property as settlement data.(string) settlementScheduleProperty: "vegaprotocol.builtin.timetrigger"
      }
     },

     // Optional new futures market metadata, tags.
     metadata: [
      "enactment:2023-10-18T17:31:01Z",
      "settlement:2023-10-17T17:31:01Z",
      "source:docs.vega.xyz"
     ],

     // PriceMonitoringParameters contains a collection of triggers to be used for a given market
     priceMonitoringParameters: {
      // PriceMonitoringTrigger holds together price projection horizon τ, probability level p, and auction extension duration
      triggers: [
       {
        // Price monitoring projection horizon τ in seconds. (int64 as string)
        horizon: "43200",

        // Price monitoring probability level p. (string)
        probability: "0.9999999",

        // Price monitoring auction extension duration in seconds should the price
        // breach its theoretical level over the specified horizon at the specified
        // probability level. (int64 as string)
        auctionExtension: "600",
       }
      ]
     },

     // LiquidityMonitoringParameters contains settings used for liquidity monitoring
     liquidityMonitoringParameters: {
      // TargetStakeParameters contains parameters used in target stake calculation
      targetStakeParameters: {
       // Specifies length of time window expressed in seconds for target stake calculation. (string)
       timeWindow: "3600",

       // Specifies scaling factors used in target stake calculation. (number)
       scalingFactor: 10
      },

      // Specifies the triggering ratio for entering liquidity auction. (string)
      triggeringRatio: "0.7",

      // Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction. (int64 as string)
      auctionExtension: "1",
     }
    },

    // Risk model for log normal
    logNormal: {
     // Tau parameter of the risk model, projection horizon measured as a year fraction used in the expected shortfall
     calculation to obtain the maintenance margin,
     must be a strictly non - negative real number.(number) tau: 0.0001140771161,

     // Risk Aversion Parameter. (double as number)
     riskAversionParameter: "0.01",

     // Risk model parameters for log normal
     params: {
      // Mu parameter, annualised growth rate of the underlying asset. (double as number)
      mu: 0,

      // R parameter, annualised growth rate of the risk-free asset, used for discounting of future cash flows, can be any real number. (double as number)
      r: 0.016,

      // Sigma parameter, annualised volatility of the underlying asset, must be a strictly non-negative real number. (double as number)
      sigma: 0.15,
     }
    },
   }
  },

  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1697560261,

  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1697646661,
 }
}
```