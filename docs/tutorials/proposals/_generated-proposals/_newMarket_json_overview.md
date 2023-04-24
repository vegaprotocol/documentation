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
    // price levels over which automated liquidity provision orders will be deployed.
    lpPriceRange: "10",
    // undefined
    linearSlippageFactor: 0.001,
    // undefined
    quadraticSlippageFactor: 0,
    // undefined (uint64 as string)
    decimalPlaces: "5",
    // undefined (int64 as string)
    positionDecimalPlaces: "5",
    // Instrument configuration
    instrument: {},
    // undefined
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
  closingTimestamp: 1683999913000,
  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1684086313000,
 }
}
```