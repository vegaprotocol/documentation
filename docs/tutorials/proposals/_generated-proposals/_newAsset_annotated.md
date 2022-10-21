
  ```javascript
{
 rationale: {
  title: "Add tUSDC TEST (tUSDC)",
  description: "Proposal to add tUSDC TEST (tUSDC) as an asset"
 },
 terms: {
  newAsset: {
   changes: {
    // Name of the asset (e.g: Great British Pound) (string) 
    name: "tUSDC TEST",

    // Symbol of the asset (e.g: GBP) (string) 
    symbol: "tUSDC",

    // Number of decimal / precision handled by this asset (string) 
    decimals: "18",

    // The minimum economically meaningful amount in the asset (string) 
    quantum: "1",

    // An Ethereum ERC20 asset
    erc20: {
     // The address of the contract for the token, on the ethereum network (string)
     contractAddress: "0xB404c51BBC10dcBE948077F18a4B8E553D160084",

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
  closingTimestamp: 1667843647,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1667930047,

  // Validation timestamp (Unix time in seconds) (int64 as string)
  validationTimestamp: 1667757247
 }
}
```