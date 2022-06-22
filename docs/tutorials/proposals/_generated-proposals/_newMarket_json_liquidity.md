```javascript
 {
  // Specified as a unitless number that represents the amount of settlement asset of the market (string) 
  commitmentAmount: "645751",
  // Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per seeting fees and rewarding liquidity providers (undefined as string) 
  fee: 0.26,
  // A set of liquidity buy orders to meet the liquidity provision obligation
  buys: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "8",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 3,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "100",
    proportion: 10,
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "2",
    proportion: 3,
    reference: "PEGGED_REFERENCE_BEST_BID",
   }
  ],
  // A set of liquidity buy orders to meet the liquidity provision obligation
  sells: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "4",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 5,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "30",
    proportion: 3,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "84",
    proportion: 2,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   }
  ],
 }
}
```