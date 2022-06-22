
  ```javascript
{
 rationale: {
  description: "Update governance.proposal.freeform.minVoterBalance"
 },
 terms: {
  updateNetworkParameter: {
   changes: {
    // The unique key (string) 
    key: "governance.proposal.freeform.minVoterBalance",

    // The value for the network parameter (string) 
    value: "0.11035329942508865"
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
  closingTimestamp: 1657557562,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
  enactmentTimestamp: 1657643962,
 }
}
```