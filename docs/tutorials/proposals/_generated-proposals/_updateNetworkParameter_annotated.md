
  ```javascript
{
 rationale: {
  title: "Update market.fee.factors.infrastructureFee",
  description: "Proposal to update market.fee.factors.infrastructureFee to 300}"
 },
 terms: {
  updateNetworkParameter: {
   changes: {
    // Unique key of the network parameter. (string) 
    key: "market.fee.factors.infrastructureFee",

    // Value for the network parameter. (string) 
    value: "300"
   }
  },

  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1697478239,

  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1697564639,
 }
}
```