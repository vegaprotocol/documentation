
  ```javascript
{
 rationale: {
  title: "Add Lorem Ipsum market",
  description: "An example proposal to add Lorem Ipsum market"
 },
 terms: {
  newMarket: {
   changes: {
    // Decimal places used for the new market, sets the smallest price increment on the book (uint64 as string)
    decimalPlaces: "5",

    // Decimal places for order sizes, sets what size the smallest order / position on the market can be (int64 as string)
    positionDecimalPlaces: "5",

    // New market instrument configuration
    instrument: {
     // Instrument name
     name: "Oranges Daily",

     // Instrument code, human-readable shortcode used to describe the instrument
     code: "ORANGES.24h",

     // Future
     future: {
      // Asset ID for the product's settlement asset (string)
      settlementAsset: "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",

      // Product quote name (string)
      quoteName: "tEuro",

      // The number of decimal places implied by the settlement data (such as price) emitted by the settlement data source (int64 as integer)
      settlementDataDecimals: 5,

      // The data source spec describing the data source for settlement (object)
      dataSourceSpecForSettlementData: {
       // signers is the list of authorized signatures that signed the data for this
       // source. All the signatures in the data source data should be contained in this (array of objects)
       signers: [
        {
         ethAddress: {
          address: "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"
         }
        }
       ],

       // filters describes which source data are considered of interest or not for
       // the product (or the risk model).
       filters: [
        {
         // $
         skeleton[p].external[p].oracle[p].filters.items[p].key.description
        }
        key: {
         // name is the name of the property. (string)
         name: "prices.BTC.value",

         // type is the type of the property. (string)
         type: "TYPE_INTEGER",
        },

        // conditions are the conditions that should be matched by the data to be
        // considered of interest.
        conditions: [
         {
          // comparator is the type of comparison to make on the value. (string)
          operator: "OPERATOR_GREATER_THAN",

          // value is used by the comparator. (string)
          value: "0",
         }
        ]
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
         }
        ]
       }
      ]
     },

     // The external data source spec describing the data source of trading termination (object)
     dataSourceSpecForTradingTermination: {
      // DataSourceDefinition represents the top level object that deals with data sources.
      // DataSourceDefinition can be external or internal, with whatever number of data sources are defined
      internal {
       // DataSourceSpecConfigurationTime is the internal data source used for emitting timestamps.
       time: {
        // Conditions that the timestamps should meet in order to be considered.
        conditions: [
         {
          // comparator is the type of comparison to make on the value. (string)
          operator: "OPERATOR_GREATER_THAN_OR_EQUAL",

          // value is used by the comparator. (string)
          value: "1648684800000000000",
         }
        ]
       }
      },

      // The binding between the data source spec and the settlement data (object)
      dataSourceSpecBinding: {
       // settlement_data_property holds the name of the property in the source data
       // that should be used as settlement data.
       // If it is set to "prices.BTC.value", then the Future will use the value of
       // this property as settlement data. (string) 
       settlementDataProperty: "prices.BTC.value",

       // the name of the property in the data source data that signals termination of trading (string) 
       tradingTerminationProperty: "vega.builtin.timestamp"
      }
     },

     // Optional new market meta data, tags
     metadata: [
      "sector:energy",
      "sector:tech",
      "sector:food",
      "source:docs.vega.xyz"
     ],

     // Price monitoring parameters
     priceMonitoringParameters: {
      // PriceMonitoringTrigger holds together price projection horizon τ, probability level p, and auction extension duration
      triggers: [
       {
        // Price monitoring projection horizon τ in seconds (int64 as string)
        horizon: "43200",

        // Price monitoring probability level p (string)
        probability: "0.9999999",

        // Price monitoring auction extension duration in seconds should the price
        // breach it's theoretical level over the specified horizon at the specified
        // probability level (int64 as string)
        auctionExtension: "600",
       }
      ]
     },

     // Liquidity monitoring parameters
     liquidityMonitoringParameters: {
      // Specifies parameters related to target stake calculation
      targetStakeParameters: {
       // Specifies length of time window expressed in seconds for target stake calculation (string)
       timeWindow: "3600",

       // Specifies scaling factors used in target stake calculation (number)
       scalingFactor: 10
      },

      // Specifies the triggering ratio for entering liquidity auction (double as number) 
      triggeringRatio: "0.7",

      // Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction (int64 as string) 
      auctionExtension: "1",
     }
    },

    // Log normal risk model parameters, valid only if MODEL_LOG_NORMAL is selected
    logNormal: {
     // Tau (number) 
     tau: 0.0001140771161,

     // Risk Aversion Parameter (double as number) 
     riskAversionParameter: "0.01",

     // Risk model parameters for log normal
     params: {
      // Mu param (double as number) 
      mu: 0,

      // R param (double as number) 
      r: 0.016,

      // Sigma param (double as number) 
      sigma: 0.8,
     }
    },
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1669926049,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1670012449,
 }
}
```