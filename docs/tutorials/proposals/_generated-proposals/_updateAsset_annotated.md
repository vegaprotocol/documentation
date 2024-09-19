
  ```javascript
{
 proposalSubmission: {
  rationale: {
   title: "Update asset",
   description: "Proposal to change withdrawal threshold for asset"
  },
  terms: {
   updateAsset: {
    // Asset ID the update is for. (string)
    assetId: "ebcd94151ae1f0d39a4bde3b21a9c7ae81a80ea4352fb075a92e07608d9c953d",
    changes: {
     // Minimum economically meaningful amount in the asset. (string)
     quantum: "1",
     erc20: {
      // Maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay.
      // There’s no limit on the size of a withdrawal (string)
      withdrawThreshold: "10",

      // Lifetime limits deposit per address.
      // This will be interpreted against the asset decimals. (string)
      lifetimeLimit: "10",
     }
    }
   },

   // Timestamp as Unix time in seconds when voting closes for this proposal,
   // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
   closingTimestamp: 1728389738,

   // Timestamp as Unix time in seconds when proposal gets enacted if passed,
   // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
   enactmentTimestamp: 1728476138,
  }
 }
}
```