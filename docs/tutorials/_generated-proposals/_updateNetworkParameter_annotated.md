
  ```javascript
  {
    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
    closingTimestamp: 1653138543629,
    // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
    // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
    enactmentTimestamp: 1653224943629,
    updateNetworkParameter:  {
      changes: {
        // The unique key (string) 
        key: "governance.proposal.asset.requiredMajority",
        // The value for the network parameter (string) 
        value: "0.5630835734911792"
      }
    }
 }
  ```