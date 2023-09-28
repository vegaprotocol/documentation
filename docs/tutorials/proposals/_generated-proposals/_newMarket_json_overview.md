```javascript
{
 rationale: {
  title: "Add Lorem Ipsum market",
  description: "An example proposal to add Lorem Ipsum market"
 },
 terms: {
  newMarket: {
   changes: {
    // DEPRECATED: Use liquidity SLA parameters instead.
    // Percentage move up and down from the mid price which specifies the range of
    lpPriceRange: "10",
    // Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
    linearSlippageFactor: 0.001,
    // Quadratic slippage factor is used to cap the slippage component of maintenance margin - it is applied to the square of the slippage volume.
    quadraticSlippageFactor: 0,
    // Decimal places used for the new futures market, sets the smallest price increment on the book. (uint64 as string)
    decimalPlaces: "5",
    // Decimal places for order sizes, sets what size the smallest order / position on the futures market can be. (int64 as string)
    positionDecimalPlaces: "5",
    // Instrument configuration
    instrument: {},
    // Optional new futures market metadata, tags.
    metadata: [],
    // PriceMonitoringParameters contains a collection of triggers to be used for a given market
    priceMonitoringParameters: [],
    // LiquidityMonitoringParameters contains settings used for liquidity monitoring
    liquidityMonitoringParameters: {},
    // Risk model for log normal
    logNormal: {},
   }
  },
  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1696941757,
  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1697028157,
 }
}
```