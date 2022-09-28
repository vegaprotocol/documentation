
  ```javascript
{
 rationale: {
  title: "Add USDT Coin (USDT)",
  description: "Proposal to add USDT Coin (USDT) as an asset"
 },
 terms: {
  newAsset: {
   changes: {
    // Name of the asset (e.g: Great British Pound) (string) 
    name: "USDT Coin",

    // Symbol of the asset (e.g: GBP) (string) 
    symbol: "USDT",

    // Number of decimal / precision handled by this asset (string) 
    decimals: "18",

    // The minimum economically meaningful amount in the asset (string) 
    quantum: "1",

    // An Ethereum ERC20 asset
    erc20: {
     // The address of the contract for the token, on the ethereum network (string)
     contractAddress: "0xb404c51bbc10dcbe948077f18a4b8e553d160084",

     // The maximum allowed per withdraw
     // note: this is a temporary measure for restricted mainnet (string)
     withdrawThreshold: "10",

     // The lifetime limits deposit per address
     // note: this is a temporary measure for restricted mainnet (string)
     lifetimeLimit: "10",
    }
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1666044439,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1666130839,

  // Validation timestamp (Unix time in seconds) (int64 as string)
  validationTimestamp: 1665958039
 }
}
```