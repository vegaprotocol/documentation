
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

     // The maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay.
     // There’s no limit on the size of a withdrawal (string)
     withdrawThreshold: "10",

     // The lifetime limits deposit per address
     // note: this is a temporary measure that can be changed by governance (string)
     lifetimeLimit: "10",
    }
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1674663903,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1674750303,

  // Validation timestamp (Unix time in seconds) (int64 as string)
  validationTimestamp: 1674577503
 }
}
```