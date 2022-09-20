
  ```javascript
{
 rationale: {
  title: "Update governance.proposal.asset.requiredMajority",
  description: "Proposal to update governance.proposal.asset.requiredMajority to 300}"
 },
 terms: {
  updateNetworkParameter: {
   changes: {
    // The unique key (string) 
    key: "governance.proposal.asset.requiredMajority",

    // The value for the network parameter (string) 
    value: "300"
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1665310783,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1665397183,
 }
}
```