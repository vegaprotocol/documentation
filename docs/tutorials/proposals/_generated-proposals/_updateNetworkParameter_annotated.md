
  ```javascript
{
 rationale: {
  description: "Update market.fee.factors.infrastructureFee"
 },
 terms: {
  updateNetworkParameter: {
   changes: {
    // The unique key (string) 
    key: "market.fee.factors.infrastructureFee",

    // The value for the network parameter (string) 
    value: "0.43600230480170277"
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
  closingTimestamp: 1657714005,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
  enactmentTimestamp: 1657800405,
 }
}
```