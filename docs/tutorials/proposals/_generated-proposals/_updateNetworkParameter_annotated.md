
  ```javascript
{
 rationale: {
  title: "Update market.fee.factors.infrastructureFee",
  description: "Proposal to update market.fee.factors.infrastructureFee to 300}"
 },
 terms: {
  updateNetworkParameter: {
   changes: {
    // The unique key (string) 
    key: "market.fee.factors.infrastructureFee",

    // The value for the network parameter (string) 
    value: "300"
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1672246528,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1672332928,
 }
}
```