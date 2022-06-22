
  ```javascript
{
 rationale: {
  description: "Update Lorem Ipsum market"
 },
 terms: {
  updateMarket: {
   // The market to update
   marketId: "123",
   changes: {
    // Updated market instrument configuration
    instrument: {
     // Instrument code
     code: "ORANGES.24h",

     // Future
     future: {
      // Product quote name (string)
      quoteName: "tEuro",

      // the number of decimal places implied by the settlement price emitted by the settlement oracle (int64 as integer)
      settlementPriceDecimals: 5,

      // The oracle spec describing the oracle data of settlement price (object)
      oracleSpecForSettlementPrice: {
       // pubKeys is the list of authorized public keys that signed the data for this
       // oracle. All the public keys in the oracle data should be contained in these
       // public keys. (array of strings)
       pubKeys: [
        "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"
       ],

       // filters describes which oracle data are considered of interest or not for
       // the product (or the risk model).
       filters: [
        {
         // key is the oracle data property key targeted by the filter.
         key: {
          // name is the name of the property. (string)
          name: "prices.AAPL.value",

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
           value: "1",
          }
         ]
        }
       ]
      },

      // The oracle spec describing the oracle data of trading termination (object)
      oracleSpecForTradingTermination: {
       // pubKeys is the list of authorized public keys that signed the data for this
       // oracle. All the public keys in the oracle data should be contained in these
       // public keys. (array of strings)
       pubKeys: [
        "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"
       ],

       // filters describes which oracle data are considered of interest or not for
       // the product (or the risk model).
       filters: [
        {
         // key is the oracle data property key targeted by the filter.
         key: {
          // name is the name of the property. (string)
          name: "prices.AAPL.value",

          // type is the type of the property. (string)
          type: "TYPE_BOOLEAN",
         },

         // conditions are the conditions that should be matched by the data to be
         // considered of interest.
         conditions: []
        }
       ]
      },

      // The binding between the oracle spec and the settlement price (object)
      oracleSpecBinding: {
       // settlement_price_property holds the name of the property in the oracle data
       // that should be used as settlement price.
       // If it is set to "prices.BTC.value", then the Future will use the value of
       // this property as settlement price. (string) 
       settlementPriceProperty: "prices.AAPL.value",

       // the name of the property in the oracle data that signals termination of trading (string) 
       tradingTerminationProperty: "prices.AAPL.value"
      }
     },

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
       sigma: 1.25,
      }
     },
    },
   },

   // Timestamp (Unix time in seconds) when voting closes for this proposal,
   // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
   closingTimestamp: 1657556650,

   // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
   // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
   enactmentTimestamp: 1657643050,
  }
 }
  ```