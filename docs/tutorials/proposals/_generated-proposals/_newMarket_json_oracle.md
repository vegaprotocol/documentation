```javascript
{
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
}
```