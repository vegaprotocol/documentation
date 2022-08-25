```javascript
 {
  // Specified as a unitless number that represents the amount of settlement asset of the market (string) 
  commitmentAmount: "2856241",
  // Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per seeting fees and rewarding liquidity providers (undefined as string) 
  fee: 0.28,
  // A set of liquidity buy orders to meet the liquidity provision obligation
  buys: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "2",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 6,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "69",
    proportion: 3,
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "4",
    proportion: 10,
    reference: "PEGGED_REFERENCE_BEST_BID",
   }
  ],
  // A set of liquidity buy orders to meet the liquidity provision obligation
  sells: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "16",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 4,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "2",
    proportion: 6,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "34",
    proportion: 7,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   }
  ],
 }
}
```