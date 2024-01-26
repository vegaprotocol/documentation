
  ```javascript
{
 rationale: {
  title: "Lorem Ipsum successor",
  description: "A successor market"
 },
 terms: {
  newMarket: {
   changes: {
    // Successor configuration. If this proposal is meant to succeed a given market, then this should be set.
    successor: {
     // ID of the market that the successor should take over from.
     parentMarketId: "marketid",

     // A decimal value between or equal to 0 and 1, specifying the fraction of the insurance pool balance that is carried over from the parent market to the successor.
     insurancePoolFraction: "1"
    },

    // Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
    linearSlippageFactor: 0.001,

    // Decimal places used for the new futures market, sets the smallest price increment on the book. (uint64 as string)
    decimalPlaces: "5",

    // Decimal places for order sizes, sets what size the smallest order / position on the futures market can be. (int64 as string)
    positionDecimalPlaces: "5",

    // Instrument configuration
    instrument: {
     // Instrument name.
     name: "Oranges Daily",

     // Instrument code, human-readable shortcode used to describe the instrument.
     code: "ORANGES.24h",

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
         // source. All the signatures in the data source data should be contained in (array of objects)
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
           name: "prices.ORANGES.value",

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
           name: "prices.ORANGES.timestamp",
           type: "TYPE_INTEGER",
          },
          conditions: [
           {
            operator: "OPERATOR_GREATER_THAN",
            value: "1648684800",
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
        // Internal data source used for emitting timestamps.
        time: {
         // Conditions that the timestamps should meet in order to be considered.
         conditions: [
          {
           // Type of comparison to make on the value. (string)
           operator: "OPERATOR_GREATER_THAN_OR_EQUAL",

           // Value to be compared with by the operator. (string)
           value: "1648684800",
          }
         ]
        }
       },

       // DataSourceSpecToFutureBinding describes which property of the data source data is to be
       used as settlement data and which to use as the trading terminated trigger(object) dataSourceSpecBinding: {
        // Name of the property in the source data that should be used as settlement data.
        // If it is set to "prices.BTC.value", then the Future will use the value of
        // this property as settlement data. (string)
        settlementDataProperty: "prices.ORANGES.value",

        // Name of the property in the data source data that signals termination of trading. (string)
        tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
       }
      },

      // Optional new futures market metadata, tags.
      metadata: [
       "enactment:2024-02-15T16:20:13Z",
       "settlement:2024-02-14T16:20:13Z",
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

      // Liquidity SLA parameters
      liquiditySlaParameters: {
       // (string)
       priceRange: 0.1,

       // Specifies the minimum fraction of time LPs must spend "on the book" providing their committed liquidity. (string)
       commitmentMinTimeFraction: "0.1",

       // Specifies the number of liquidity epochs over which past performance will continue to affect rewards. (uint64 as string)
       performanceHysteresisEpochs: "10",

       // Specifies the maximum fraction of their accrued fees an LP that meets the SLA implied by market.liquidity.commitmentMinTimeFraction will lose to liquidity providers
       // that achieved a higher SLA performance than them. (string)
       slaCompetitionFactor: "0.2",
      },
     }
    },

    // Timestamp as Unix time in seconds when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
    closingTimestamp: 1707927613,

    // Timestamp as Unix time in seconds when proposal gets enacted if passed,
    // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
    enactmentTimestamp: 1708014013,
   }
  }
```