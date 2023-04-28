
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

    // Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
    linearSlippageFactor: 0.001,

    // Quadratic slippage factor is used to cap the slippage component of maintenance margin - it is applied to the square of the slippage volume.
    quadraticSlippageFactor: 0,

    // Decimal places used for the new market, sets the smallest price increment on the book. (uint64 as string)
    decimalPlaces: "5",

    // Decimal places for order sizes, sets what size the smallest order / position on the market can be. (int64 as string)
    positionDecimalPlaces: "5",

    // Instrument configuration
    instrument: {
     // Instrument name.
     name: "Apples Yearly (2022)",

     // Instrument code, human-readable shortcode used to describe the instrument.
     code: "APPLES.22",

     // Future product configuration
     future: {
      // Asset ID for the product's settlement asset. (string)
      settlementAsset: "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",

      // Product quote name. (string)
      quoteName: "tEuro",

      // Data source spec describing the data source for settlement. (object)
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

      // The external data source spec describing the data source of trading termination. (object)
      dataSourceSpecForTradingTermination: {
       // The external data source spec describing the data source of trading termination.
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
        // this property as settlement data. (string)
        settlementDataProperty: "prices.BTC.value",

        // Name of the property in the data source data that signals termination of trading. (string)
        tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
       }
      },

      // Optional new market metadata, tags.
      metadata: [
       "enactment:2023-05-18T16:19:17Z",
       "settlement:2023-05-17T16:19:17Z",
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
       sigma: 0.5,
      }
     },
    }
   },

   // Timestamp as Unix time in seconds when voting closes for this proposal,
   // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
   closingTimestamp: 1684336757000,

   // Timestamp as Unix time in seconds when proposal gets enacted if passed,
   // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
   enactmentTimestamp: 1684423157000,
  }
 }
```