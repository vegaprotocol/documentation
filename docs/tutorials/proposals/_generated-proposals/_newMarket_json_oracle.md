```javascript
{
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
    name: "vegaprotocol.builtin.timestamp",
    // type is the type of the property. (string)
    type: "TYPE_TIMESTAMP",
   },
   // conditions are the conditions that should be matched by the data to be
   // considered of interest.
   conditions: []
  }
 ]
}
```