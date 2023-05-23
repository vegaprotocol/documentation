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
  dataSourceSpecForTradingTermination: {},
  // DataSourceSpecToFutureBinding describes which property of the data source data is to be
  used as settlement data and which to use as the trading terminated trigger(object) dataSourceSpecBinding: {
   // Name of the property in the source data that should be used as settlement data.
   // If it is set to "prices.ORANGES.value", then the Future will use the value of
   // this property as settlement data. (string)
   settlementDataProperty: "prices.ORANGES.value",
   // Name of the property in the data source data that signals termination of trading. (string)
   tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
  }
 }
```