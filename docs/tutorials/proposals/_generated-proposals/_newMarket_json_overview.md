```javascript
{
 rationale: {
  title: "Add Lorem Ipsum market",
  description: "An example proposal to add Lorem Ipsum market"
 },
 terms: {
  newMarket: {
   changes: {
    // Percentage move up and down from the mid price which specifies the range of 
    // price levels over which automated liquidity provision orders will be deployed
    lpPriceRange: "10",
    // Decimal places used for the new market, sets the smallest price increment on the book (uint64 as string)
    decimalPlaces: "5",
    // Decimal places for order sizes, sets what size the smallest order / position on the market can be (int64 as string)
    positionDecimalPlaces: "5",
    // New market instrument configuration
    instrument: {},
    // Optional new market metadata, tags
    metadata: [],
    // Price monitoring parameters
    priceMonitoringParameters: [],
    // Liquidity monitoring parameters
    liquidityMonitoringParameters: {},
    // Log normal risk model parameters, valid only if MODEL_LOG_NORMAL is selected
    logNormal: {},
   }
  },
  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string)
  closingTimestamp: 1678707737000,
  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string)
  enactmentTimestamp: 1678794137000,
 }
}
```