
  ```javascript
{
 rationale: {
  title: "Add tEuro (tEURO)",
  description: "Proposal to add tEuro (tEURO) as an asset"
 },
 terms: {
  newAsset: {
   changes: {
    // Name of the asset (e.g: Great British Pound) (string) 
    name: "tEuro",

    // Symbol of the asset (e.g: GBP) (string) 
    symbol: "tEURO",

    // Number of decimal / precision handled by this asset (string) 
    decimals: "18",

    // The minimum economically meaningful amount in the asset (string) 
    quantum: "1",

    // An Ethereum ERC20 asset
    erc20: {
     // The address of the contract for the token, on the ethereum network (string)
     contractAddress: "0x0158031158Bb4dF2AD02eAA31e8963E84EA978a4",

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
  closingTimestamp: 1672095854,

  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1672182254,

  // Validation timestamp (Unix time in seconds) (int64 as string)
  validationTimestamp: 1672009454
 }
}
```