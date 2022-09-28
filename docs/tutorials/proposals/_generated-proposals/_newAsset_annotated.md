
  ```javascript
{
 rationale: {
  title: "Add Wrapped Ether (WETH)",
  description: "Proposal to add Wrapped Ether (WETH) as an asset"
 },
 terms: {
  newAsset: {
   changes: {
    // Name of the asset (e.g: Great British Pound) (string) 
    name: "Wrapped Ether",

    // Symbol of the asset (e.g: GBP) (string) 
    symbol: "WETH",

    // Number of decimal / precision handled by this asset (string) 
    decimals: "18",

    // The minimum economically meaningful amount in the asset (string) 
    quantum: "1",

    // An Ethereum ERC20 asset
    erc20: {
     // The address of the contract for the token, on the ethereum network (string)
     contractAddress: "0xc778417e063141139fce010982780140aa0cd5ab",

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
  closingTimestamp: 1666017896,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1666104296,

  // Validation timestamp (Unix time in seconds) (int64 as string)
  validationTimestamp: 1665931496
 }
}
```