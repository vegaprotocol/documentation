
  ```javascript
 {
  rationale: {
   // The URL containing content that describes the proposal (string) 
   url: "https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si",

   // The hash on the content of the URL (string)
   hash: "bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si",

   // A short description of what is being proposed (string)
   description: "Lorem ipsum dolor sit amet"
  }
 },
  terms: {
  newFreeform: {
   // This object remains empty, but is required 
  },

  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string}) 
  closingTimestamp: 1656261847249,
 }
}
  ```