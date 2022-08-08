```javascript
 {
  // Specified as a unitless number that represents the amount of settlement asset of the market (string) 
  commitmentAmount: "6686591",
  // Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per seeting fees and rewarding liquidity providers (undefined as string) 
  fee: 0.74,
  // A set of liquidity buy orders to meet the liquidity provision obligation
  buys: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "54",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 6,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "24",
    proportion: 10,
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "38",
    proportion: 9,
    reference: "PEGGED_REFERENCE_BEST_BID",
   }
  ],
  // A set of liquidity buy orders to meet the liquidity provision obligation
  sells: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "21",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 8,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "42",
    proportion: 3,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "88",
    proportion: 1,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   }
  ],
 }
}
```