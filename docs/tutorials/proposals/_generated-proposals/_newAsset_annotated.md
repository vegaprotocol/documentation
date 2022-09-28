
  ```javascript
{
 rationale: {
  title: "Add Dai Stablecoin (DAI)",
  description: "Proposal to add Dai Stablecoin (DAI) as an asset"
 },
 terms: {
  newAsset: {
   changes: {
    // Name of the asset (e.g: Great British Pound) (string) 
    name: "Dai Stablecoin",

    // Symbol of the asset (e.g: GBP) (string) 
    symbol: "DAI",

    // Number of decimal / precision handled by this asset (string) 
    decimals: "18",

    // The minimum economically meaningful amount in the asset (string) 
    quantum: "1",

    // An Ethereum ERC20 asset
    erc20: {
     // The address of the contract for the token, on the ethereum network (string)
     contractAddress: "0x31f42841c2db5173425b5223809cf3a38fede360",

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
  closingTimestamp: 1666016251,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1666102651,

  // Validation timestamp (Unix time in seconds) (int64 as string)
  validationTimestamp: 1665929851
 }
}
```