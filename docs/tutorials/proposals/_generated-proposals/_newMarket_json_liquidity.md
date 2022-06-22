```javascript
 {
  // Specified as a unitless number that represents the amount of settlement asset of the market (string) 
  commitmentAmount: "8450831",
  // Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per seeting fees and rewarding liquidity providers (undefined as string) 
  fee: 0.035,
  // A set of liquidity buy orders to meet the liquidity provision obligation
  buys: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "85",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 1,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "23",
    proportion: 4,
    reference: "PEGGED_REFERENCE_BEST_BID",
   },
   {
    offset: "27",
    proportion: 2,
    reference: "PEGGED_REFERENCE_BEST_BID",
   }
  ],
  // A set of liquidity buy orders to meet the liquidity provision obligation
  sells: [
   {
    // The offset/amount of units away for the order (string) 
    offset: "61",
    // The relative proportion of the commitment to be allocated at a price level (int64 as integer) 
    proportion: 5,
    // The pegged reference point for the order (string) 
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "83",
    proportion: 4,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   },
   {
    offset: "13",
    proportion: 6,
    reference: "PEGGED_REFERENCE_BEST_ASK",
   }
  ],
 }
}
```