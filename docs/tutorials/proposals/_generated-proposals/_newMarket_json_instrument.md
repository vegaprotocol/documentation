```javascript
{
 // Instrument name
 name: "Apples Yearly (2022)",
 // Instrument code, human-readable shortcode used to describe the instrument
 code: "APPLES.22",
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
 // The external data source spec describing the data source of trading termination (object)
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
}
```