
  ```javascript
 {
  rationale: {
   title: "Terminate market X",
   description: "Market X should be terminated as it is no longer relevant. Termination price set in proposal."
  }
 },
  terms: {
  updateMarketState: {
   changes: {
    // ID of the market (string)
    marketId: "0f2f8d077a53835ca802808d1eaae090de06328e5a0fb21e55de2f8ea8faa389",

    // Type of the market update (string)
    updateType: "MARKET_STATE_UPDATE_TYPE_TERMINATE",

    // Settlement price, relevant only for market termination for futures markets (string)
    price: "123456",
   }
  },

  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1709058309,

  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1709144709,
 }
}
```