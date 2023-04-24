
  ```javascript
{
 rationale: {
  title: "Add tDAI TEST (tDAI)",
  description: "Proposal to add tDAI TEST (tDAI) as an asset"
 },
 terms: {
  newAsset: {
   changes: {
    // undefined (string) 
    name: "tDAI TEST",

    // undefined (string) 
    symbol: "tDAI",

    // undefined (string) 
    decimals: "18",

    // undefined (string) 
    quantum: "1",

    // ERC20 token based asset, living on the ethereum network
    erc20: {
     // undefined (string)
     contractAddress: "0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b",

     // Maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay.
     // There’s no limit on the size of a withdrawal (string)
     withdrawThreshold: "10",

     // Lifetime limits deposit per address
     // note: this is a temporary measure that can be changed by governance. (string)
     lifetimeLimit: "10",
    }
   }
  },

  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1683999913000,

  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1684086313000,

  // undefined (int64 as string)
  validationTimestamp: 1684086313000
 }
}
```