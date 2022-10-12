
  ```javascript
{
 rationale: {
  title: "Update asset",
  description: "Proposal to change withdrawal threshold for asset"
 },
 terms: {
  updateAsset: {
   changes: {
    // The minimum economically meaningful amount in the asset (string)
    quantum: "1",
    erc20: {
     // The maximum allowed per withdraw.
     // This is will be interpreted against the asset decimals. (string)
     withdrawThreshold: "10",

     // The lifetime limits deposit per address.
     // This is will be interpreted against the asset decimals. (string)
     lifetimeLimit: "10",
    }
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1667220730,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1667307130,
 }
}
```