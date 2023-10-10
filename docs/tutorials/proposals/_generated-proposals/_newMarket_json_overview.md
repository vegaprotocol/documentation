```javascript
{
 rationale: {
  title: "Add Lorem Ipsum market",
  description: "An example proposal to add Lorem Ipsum market"
 },
 terms: {
  newMarket: {
   changes: {
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
    // Liquidity SLA parameters
    liquiditySlaParameters: {
     // (string)
     priceRange: 0.1,
     // Specifies the minimum fraction of time LPs must spend "on the book" providing their committed liquidity. (string)
     commitmentMinTimeFraction: "0.1",
     // Specifies the number of liquidity epochs over which past performance will continue to affect rewards. (uint64 as string)
     performanceHysteresisEpochs: "10",
     // Specifies the maximum fraction of their accrued fees an LP that meets the SLA implied by market.liquidity.commitmentMinTimeFraction will lose to liquidity providers
     // that achieved a higher SLA performance than them. (string)
     slaCompetitionFactor: "0.2",
    },
   }
  },
  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1698595571,
  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1698681971,
 }
}
```