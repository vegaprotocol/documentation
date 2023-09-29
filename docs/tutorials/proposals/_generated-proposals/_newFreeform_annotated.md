
  ```javascript
 {
  rationale: {
   title: "An example freeform proposal",
   description: "I propose that everyone evaluate the following IPFS document and vote Yes if they agree. [bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si](https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si)"
  }
 },
  terms: {
  newFreeform: {
   // This object remains empty, but is required 
  },

  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string})
  closingTimestamp: 1697652529,
 }
}
```