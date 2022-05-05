
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
        value: "0.3904550326976013"
      }
    },

    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
    closingTimestamp: 1653392022033,

    // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
    // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
    enactmentTimestamp: 1653478422033,
  }
}
  ```