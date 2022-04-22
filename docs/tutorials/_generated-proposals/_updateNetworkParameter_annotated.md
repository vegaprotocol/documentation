
  ```javascript
  {
    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
    closingTimestamp: 1652272406226,
    // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
    // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
    enactmentTimestamp: 1652358806226,
    updateNetworkParameter:  {
      changes: {
        // The unique key (string) 
        key: "governance.proposal.freeform.minVoterBalance",
        // The value for the network parameter (string) 
        value: "0.19135469573891184"
      }
    }
 }
  ```