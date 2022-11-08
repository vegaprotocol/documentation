
  ```javascript
{
 rationale: {
  title: "Update asset",
  description: "Proposal to change withdrawal threshold for asset"
 },
 terms: {
  updateAsset: {
   // The ID of the asset to be updated (string)
   assetId: "ebcd94151ae1f0d39a4bde3b21a9c7ae81a80ea4352fb075a92e07608d9c953d",
   changes: {
    // The minimum economically meaningful amount in the asset (string)
    quantum: "1",
    erc20: {
     // The maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay.
     // There’s no limit on the size of a withdrawal (string)
     withdrawThreshold: "10",

     // The lifetime limits deposit per address.
     // This is will be interpreted against the asset decimals. (string)
     lifetimeLimit: "10",
    }
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1669048765,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1669135165,
 }
}
```