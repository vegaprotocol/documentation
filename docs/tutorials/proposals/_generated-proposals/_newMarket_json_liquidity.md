```javascript
 {
  // Specified as a unitless number that represents the amount of settlement asset of the market (string) 
  commitmentAmount: "5470444",
  // Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per seeting fees and rewarding liquidity providers (undefined as string) 
  fee: 0.74,
  // A set of liquidity buy orders to meet the liquidity provision obligation
  buys: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "43",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 4,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "8",
    proportion: 3,
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "77",
    proportion: 3,
    reference: "PEGGED_REFERENCE_BEST_BID",
   }
  ],
  // A set of liquidity buy orders to meet the liquidity provision obligation
  sells: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "31",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 2,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "25",
    proportion: 4,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "76",
    proportion: 7,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   }
  ],
 }
}
```