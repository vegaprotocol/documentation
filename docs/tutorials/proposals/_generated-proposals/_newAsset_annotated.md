
  ```javascript
{
 rationale: {
  description: "Add BNB (BNB)"
 },
 terms: {
  newAsset: {
   changes: {
    // Name of the asset (e.g: Great British Pound) (string) 
    name: "BNB",

    // Symbol of the asset (e.g: GBP) (string) 
    symbol: "BNB",

    // Total circulating supply for the asset (string) 
    totalSupply: "19010568",

    // Number of decimal / precision handled by this asset (string) 
    decimals: "5",

    // The minimum economically meaningful amount in the asset (string) 
    quantum: "1",

    // An Ethereum ERC20 asset
    erc20: {
     // The address of the contract for the token, on the ethereum network (string)
     contractAddress: "0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e",
    }
   }
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
  closingTimestamp: 1657557844,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
  enactmentTimestamp: 1657644244,
 }
}
```