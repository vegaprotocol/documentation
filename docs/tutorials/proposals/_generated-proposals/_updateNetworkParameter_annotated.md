
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
    value: "0.8968196144347058"
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
  closingTimestamp: 1656261847247,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
  enactmentTimestamp: 1656348247247,
 }
}
  ```