
  ```javascript
{
 rationale: {
  title: "Lorem Ipsum perpetual",
  description: "An orange perpetual market"
 },
 terms: {
  newMarket: {
   changes: {
    // Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
    linearSlippageFactor: 0.001,

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
     perpetual: {
      // Asset ID for the product's settlement asset.
      settlementAsset: "c9fe6fc24fce121b2cc72680543a886055abb560043fda394ba5376203b7527d",

      // Product quote name.
      quoteName: "USD",

      // Controls how much the upcoming funding payment liability contributes to party's margin, in the range [0, 1].
      marginFundingFactor: "0.9",

      // Continuously compounded interest rate used in funding rate calculation, in the range [-1, 1].
      interestRate: "0",

      // Lower bound for the clamp function used as part of the funding rate calculation, in the range [-1, 1].
      clampLowerBound: "0",

      // Upper bound for the clamp function used as part of the funding rate calculation, in the range [-1, 1].
      clampUpperBound: "0",
      dataSourceSpecForSettlementData: {
       // DataSourceDefinitionExternal is the top level object used for all external 
       // data sources. It contains one of any of the defined `SourceType` variants. 
       external: {
        // Contains the data specification that is received from Ethereum sources.
        ethOracle: {
         // The ID of the EVM based chain which is to be used to source the oracle data. (uint64 as string)
         // The ID of the EVM based chain which is to be used to source the oracle data. 
         sourceChainId: "1",

         // Ethereum address of the contract to call.
         address: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",

         // The ABI of that contract.
         abi: "[{" inputs ":[]," name ":" latestAnswer "," outputs ":[{" internalType ":" int256 "," name ":" "," type ":" int256 "}]," stateMutability ":" view "," type ":" function "}]",

         // Name of the method on the contract to call.
         method: "latestAnswer",


         /* Normalisers are used to convert the data returned from the contract method
          * into a standard format. The key of the map is the name of the property,
          * which identifies the specific piece of data to other parts of the data
          * sourcing framework, for example filters. The value is a JSONPath expression
          * for expressing where in the contract call result the required data is
          * located, for example $[0] indicates the first result. $[1].price would look
          * in the second result returned from the contract for a structure with a key
          * called 'price' and use that if it exists. */
         normalisers: [
          {
           name: "prices.ORANGES.value",
           expression: "$[0]"
          }
         ],

         // Number of confirmations required before the query is considered verified
         requiredConfirmations: 3,

         // Conditions for determining when to call the contract method.
         trigger: {
          /* Trigger for an Ethereum call based on the Ethereum block timestamp. Can be
           * one-off or repeating. */
          timeTrigger: {
           /* Repeat the call every n seconds after the initial call. If no time for
            * initial call was specified, begin repeating immediately. */
           every: 30
          }
         },

         // Filters the data returned from the contract method
         filters: [
          {
           key: {
            name: "prices.ORANGES.value",
            type: "TYPE_INTEGER",
            numberDecimalPlaces: 8
           },
           conditions: [
            {
             operator: "OPERATOR_GREATER_THAN_OR_EQUAL",
             value: "0"
            }
           ]
          }
         ]
        }
       }
      },
      dataSourceSpecForSettlementSchedule: {
       internal: {
        timeTrigger: {
         conditions: [
          {
           operator: "OPERATOR_GREATER_THAN_OR_EQUAL",
           value: "0"
          }
         ],
         triggers: [
          {
           every: 28800
          }
         ]
        }
       }
      },


      /* undefined */
      dataSourceSpecBinding: {
       /* Name of the property in the source data that should be used for settlement data.
        * If it is set to "prices.BTC.value" for example, then the perpetual market will use the value of
        * this property to get settlement data. */
       settlementDataProperty: "prices.ORANGES.value",
       settlementScheduleProperty: "vegaprotocol.builtin.timetrigger"
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