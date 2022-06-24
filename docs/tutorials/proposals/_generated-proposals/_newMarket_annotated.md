
  ```javascript
 {
  rationale: {
   description: "Add Lorem Ipsum market"
  },
  terms: {
   newMarket: {
    changes: {
     // Decimal places used for the new market (uint64 as string)
     decimalPlaces: "18",

     // Decimal places for order sizes (uint64 as string)
     positionDecimalPlaces: "5",

     // New market instrument configuration
     instrument: {
      // Instrument name
      name: "Oranges Daily",

      // Instrument code
      code: "ORANGES.24h",

      // Future
      future: {
       // Product settlement asset identifier (string)
       settlementAsset: "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",

       // Product quote name (string)
       quoteName: "tEuro",

       // the number of decimal places implied by the settlement price emitted by the settlement oracle (int64 as integer)
       settlementPriceDecimals: 18,

       // The oracle spec describing the oracle data of settlement price (object)
       oracleSpecForSettlementPrice: {
        // pubKeys is the list of authorized public keys that signed the data for this
        // oracle. All the public keys in the oracle data should be contained in these
        // public keys. (array of strings)
        pubKeys: [
         "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"
        ],

        // filters describes which oracle data are considered of interest or not for
        // the product (or the risk model).
        filters: [
         {
          // key is the oracle data property key targeted by the filter.
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
         }
        ]
       },

       // The oracle spec describing the oracle data of trading termination (object)
       oracleSpecForTradingTermination: {
        // pubKeys is the list of authorized public keys that signed the data for this
        // oracle. All the public keys in the oracle data should be contained in these
        // public keys. (array of strings)
        pubKeys: [],

        // filters describes which oracle data are considered of interest or not for
        // the product (or the risk model).
        filters: [
         {
          // key is the oracle data property key targeted by the filter.
          key: {
           // name is the name of the property. (string)
           name: "vegaprotocol.builtin.timestamp",

           // type is the type of the property. (string)
           type: "TYPE_TIMESTAMP",
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
        settlementPriceProperty: "prices.BTC.value",

        // the name of the property in the oracle data that signals termination of trading (string) 
        tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
       }
      },

      // Optional new market meta data, tags
      metadata: [
       "sector:energy",
       "sector:tech",
       "sector:health",
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
      riskAversionParameter: "0.0001",

      // Risk model parameters for log normal
      params: {
       // Mu param (double as number) 
       mu: 0,

       // R param (double as number) 
       r: 0.016,

       // Sigma param (double as number) 
       sigma: 0.3,
      }
     },
    },

    // The commitment from the party creating the NewMarket proposal
    liquidityCommitment: {
     // Specified as a unitless number that represents the amount of settlement asset of the market (string) 
     commitmentAmount: "2500460",

     // Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per seeting fees and rewarding liquidity providers (undefined as string) 
     fee: 0.10,

     // A set of liquidity buy orders to meet the liquidity provision obligation
     buys: [
      {
       // The offset/amount of units away for the order (string) 
       offset: "84",

       // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
       proportion: 8,

       // The pegged reference point for the order (string) 
       reference: "PEGGED_REFERENCE_BEST_BID",
      },
      {
       offset: "43",
       proportion: 9,
       reference: "PEGGED_REFERENCE_BEST_BID",
      },
      {
       offset: "1",
       proportion: 3,
       reference: "PEGGED_REFERENCE_BEST_BID",
      }
     ],

     // A set of liquidity buy orders to meet the liquidity provision obligation
     sells: [
      {
       // The offset/amount of units away for the order (string) 
       offset: "20",

       // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
       proportion: 9,

       // The pegged reference point for the order (string) 
       reference: "PEGGED_REFERENCE_BEST_ASK",
      },
      {
       offset: "65",
       proportion: 3,
       reference: "PEGGED_REFERENCE_BEST_ASK",
      },
      {
       offset: "69",
       proportion: 8,
       reference: "PEGGED_REFERENCE_BEST_ASK",
      }
     ],
    }
   },
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
  closingTimestamp: 1657721401,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
  enactmentTimestamp: 1657807801,
 }
}
```