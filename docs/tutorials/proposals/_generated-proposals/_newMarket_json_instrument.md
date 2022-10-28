```javascript
{
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
  // The number of decimal places implied by the settlement data (such as price) emitted by the settlement oracle (int64 as integer)
  settlementDataDecimals: 5,
  // The oracle spec describing the oracle data for settlement (object)
  oracleSpecForSettlementData: {
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
  oracleSpecForTradingTermination: {},
  // The binding between the oracle spec and the settlement data (object)
  oracleSpecBinding: {
   // settlement_data_property holds the name of the property in the oracle data
   // that should be used as settlement data.
   // If it is set to "prices.BTC.value", then the Future will use the value of
   // this property as settlement data. (string) 
   settlementDataProperty: "prices.BTC.value",
   // the name of the property in the oracle data that signals termination of trading (string) 
   tradingTerminationProperty: "vegaprotocol.builtin.timestamp"
  }
 }
```