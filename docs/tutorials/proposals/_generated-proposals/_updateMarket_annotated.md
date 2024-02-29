
  ```javascript
{
 rationale: {
  title: "Update Lorem Ipsum market",
  description: "A proposal to update Lorem Ipsum market"
 },
 terms: {
  updateMarket: {
   // Market ID the update is for.
   marketId: "123",
   changes: {
    // Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
    linearSlippageFactor: 0.001,

    // Instrument configuration
    instrument: {
     // Instrument code, human-readable shortcode used to describe the instrument.
     code: "APPLES.22",

     // Future product configuration
     future: {
      // Human-readable name/abbreviation of the quote name. (string)
      quoteName: "tEuro",

      // The data source spec describing the data of settlement data. (object)
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
         abi: "[{" inputs ":[]," name ":" latestRoundData "," outputs ":[{" internalType ":" int256 "," name ":" "," type ":" int256 "}]," stateMutability ":" view "," type ":" function "}]",

         // Name of the method on the contract to call.
         method: "latestRoundData",


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

      // The data source spec describing the data source for trading termination. (object)
      dataSourceSpecForTradingTermination: {
       // The data source spec describing the data source for trading termination.
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

      // Optional futures market metadata, tags.
      metadata: [
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
        }
       ]
      },

      // Risk model for log normal
      logNormal: {
       // Tau parameter of the risk model, projection horizon measured as a year fraction used in the expected shortfall
       calculation to obtain the maintenance margin,
       must be a strictly non - negative real number.(number) tau: 0.0001140771161,

       // Risk Aversion Parameter. (double as number)
       riskAversionParameter: "0.00001",

       // Risk model parameters for log normal
       params: {
        // Mu parameter, annualised growth rate of the underlying asset. (double as number)
        mu: 0,

        // R parameter, annualised growth rate of the risk-free asset, used for discounting of future cash flows, can be any real number. (double as number)
        r: 0.016,

        // Sigma parameter, annualised volatility of the underlying asset, must be a strictly non-negative real number. (double as number)
        sigma: 0.8,
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
     },
    },

    // Timestamp as Unix time in seconds when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
    closingTimestamp: 1710861026,

    // Timestamp as Unix time in seconds when proposal gets enacted if passed,
    // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
    enactmentTimestamp: 1710947426,
   }
  }
```