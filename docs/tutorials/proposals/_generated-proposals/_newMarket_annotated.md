
  ```javascript
{
 rationale: {
  title: "Add Lorem Ipsum market",
  description: "An example proposal to add Lorem Ipsum market"
 },
 terms: {
  newMarket: {
   changes: {
    // Percentage move up and down from the mid price which specifies the range of
    // price levels over which automated liquidity provision orders will be deployed.
    lpPriceRange: "10",

    // undefined
    linearSlippageFactor: 0.001,

    // undefined
    quadraticSlippageFactor: 0,

    // undefined (uint64 as string)
    decimalPlaces: "5",

    // undefined (int64 as string)
    positionDecimalPlaces: "5",

    // Instrument configuration
    instrument: {
     // undefined
     name: "Apples Yearly (2022)",

     // undefined
     code: "APPLES.22",

     // Future product configuration
     future: {
      // undefined (string)
      settlementAsset: "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",

      // undefined (string)
      quoteName: "tEuro",

      // undefined (object)
      dataSourceSpecForSettlementData: {
       external: {
        oracle: {
         // Signers is the list of authorized signatures that signed the data for this
         // source. All the signatures in the data source data should be contained in this (array of objects)
         signers: [
          {
           ethAddress: {
            address: "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"
           }
          }
         ],

         // Filters describes which source data are considered of interest or not for
         // the product (or the risk model).
         filters: [
          key: {
           // Name of the property. (string)
           name: "prices.BTC.value",

           // Data type of the property. (string)
           type: "TYPE_INTEGER",

           // Optional decimal place to be be applied on the provided value
           // valid only for PropertyType of type DECIMAL and INTEGER
           numberDecimalPlaces: "5",
          },

          // Conditions that should be matched by the data to be
          // considered of interest.
          conditions: [
           {
            // Type of comparison to make on the value. (string)
            operator: "OPERATOR_GREATER_THAN",

            // Value to be compared with by the operator. (string)
            value: "0",
           }
          ]
         },
         {
          key: {
           name: "prices.BTC.timestamp",
           type: "TYPE_INTEGER",
          },
          conditions: [
           {
            operator: "OPERATOR_GREATER_THAN",
            value: "1648684800000000000",
           }
          ]
         }
        ]
       }
      },

      // undefined (object)
      dataSourceSpecForTradingTermination: {
       // The external data source spec describing the data source of trading termination.
       // undefined
       internal {
        // DataSourceSpecConfigurationTime is the internal data source used for emitting timestamps.
        time: {
         // Conditions that the timestamps should meet in order to be considered.
         conditions: [
          {
           // Type of comparison to make on the value. (string)
           operator: "OPERATOR_GREATER_THAN_OR_EQUAL",

           // Value to be compared with by the operator. (string)
           value: "1648684800000000000",
          }
         ]
        }
       },

       // DataSourceSpecToFutureBinding describes which property of the data source data is to be
       used as settlement data and which to use as the trading terminated trigger(object) dataSourceSpecBinding: {
        // Name of the property in the source data that should be used as settlement data.
        // If it is set to "prices.BTC.value", then the Future will use the value of
        // this property as settlement data.
        // undefined (string)
        settlementDataProperty: "prices.BTC.value",

        // undefined (string)
        tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
       }
      },

      // undefined
      metadata: [
       "enactment:2023-05-16T16:51:30Z",
       "settlement:2023-05-15T16:51:30Z",
       "source:docs.vega.xyz"
      ],

      // PriceMonitoringParameters contains a collection of triggers to be used for a given market
      priceMonitoringParameters: {
       // PriceMonitoringTrigger holds together price projection horizon τ, probability level p, and auction extension duration
       triggers: [
        {
         // undefined (int64 as string)
         horizon: "43200",

         // undefined (string)
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
        // undefined (string)
        timeWindow: "3600",

        // undefined (number)
        scalingFactor: 10
       },

       // undefined (undefined as string)
       triggeringRatio: "0.7",

       // undefined (int64 as string)
       auctionExtension: "1",
      }
     },

     // Risk model for log normal
     logNormal: {
      // undefined (number)
      tau: 0.0001140771161,

      // undefined (double as number)
      riskAversionParameter: "0.01",

      // Risk model parameters for log normal
      params: {
       // undefined (double as number)
       mu: 0,

       // undefined (double as number)
       r: 0.016,

       // undefined (double as number)
       sigma: 0.5,
      }
     },
    }
   },

   // Timestamp as Unix time in seconds when voting closes for this proposal,
   // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
   closingTimestamp: 1684165890000,

   // Timestamp as Unix time in seconds when proposal gets enacted if passed,
   // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
   enactmentTimestamp: 1684252290000,
  }
 }
```