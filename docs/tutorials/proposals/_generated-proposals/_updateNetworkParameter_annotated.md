
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
    value: "0.3105772339004276"
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
  closingTimestamp: 1656507550147,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
  enactmentTimestamp: 1656593950147,
 }
}
  ```