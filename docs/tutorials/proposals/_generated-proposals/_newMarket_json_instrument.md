```javascript
{
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
  // The external data source spec describing the data source of trading termination. (object)
  dataSourceSpecForTradingTermination: {},
  // DataSourceSpecToFutureBinding describes which property of the data source data is to be
  used as settlement data and which to use as the trading terminated trigger(object) dataSourceSpecBinding: {
   // Name of the property in the source data that should be used as settlement data.
   // If it is set to "prices.BTC.value", then the Future will use the value of
   // this property as settlement data. (string)
   settlementDataProperty: "prices.ORANGES.value",
   // Name of the property in the data source data that signals termination of trading. (string)
   tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
  }
 }
```