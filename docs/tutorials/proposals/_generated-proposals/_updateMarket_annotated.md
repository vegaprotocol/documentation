
  ```javascript
{
 rationale: {
  title: "Update Lorem Ipsum market",
  description: "A proposal to update Lorem Ipsum market"
 },
 terms: {
  updateMarket: {
   // The identifier of the market to update
   marketId: "123",
   changes: {
    // Updated market instrument configuration
    instrument: {
     // Instrument code, human-readable shortcode used to describe the instrument
     code: "ORANGES.24h",

     // Future
     future: {
      // Human-readable name/abbreviation of the quote name (string)
      quoteName: "tEuro",

      // The number of decimal places implied by the settlement data (such as price) emitted by the settlement external data source (int64 as integer)
      settlementDataDecimals: 5,

      // The data source spec describing the data of settlement data (object)
      dataSourceSpecForSettlementData: {
       // signers is the list of authorized signatures that signed the data for this
       // source. All the signatures in the data source data should be contained in this
       // external source. All the signatures in the data should be contained in this list. (array of objects)
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
         // key is the data source data property key targeted by the filter.
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
        {}
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

     // The data source spec describing the data source for trading termination (object)
     dataSourceSpecForTradingTermination: {
      // signers is the list of authorized signatures that signed the data for this
      // source. All the signatures in the data source data should be contained in this
      // external source. All the signatures in the data should be contained in this list. (array of objects)
      signers: [],

      // filters describes which source data are considered of interest or not for
      // the product (or the risk model).
      filters: [
       {
        // key is the data source data property key targeted by the filter.
        key: {
         // name is the name of the property. (string)
         name: "vegaprotocol.builtin.timestamp",

         // type is the type of the property. (string)
         type: "TYPE_TIMESTAMP",
        },

        // conditions are the conditions that should be matched by the data to be
        // considered of interest.
        conditions: [
         {
          // comparator is the type of comparison to make on the value. (string)
          operator: "OPERATOR_GREATER_THAN_OR_EQUAL",

          // value is used by the comparator. (string)
          value: "1648684800000000000",
         }
        ]
       }
      ]
     },

     // The binding between the data source spec and the settlement data (object)
     dataSourceSpecBinding: {
      // settlement_data_property holds the name of the property in the source data
      // that should be used as settlement data.
      // If it is set to "prices.BTC.value", then the Future will use the value of
      // this property as settlement data. (string) 
      settlementDataProperty: "prices.BTC.value",

      // the name of the property in the data source data that signals termination of trading (string) 
      tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
     }
    },

    // Optional market metadata, tags
    metadata: [
     "sector:food",
     "sector:tech",
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

    // Log normal risk model parameters, valid only if MODEL_LOG_NORMAL is selected
    logNormal: {
     // Tau (number) 
     tau: 0.0001140771161,

     // Risk Aversion Parameter (double as number) 
     riskAversionParameter: "0.001",

     // Risk model parameters for log normal
     params: {
      // Mu param (double as number) 
      mu: 0,

      // R param (double as number) 
      r: 0.016,

      // Sigma param (double as number) 
      sigma: 0.5,
     }
    },
   },
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1668875777,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1668962177,
 }
}
```