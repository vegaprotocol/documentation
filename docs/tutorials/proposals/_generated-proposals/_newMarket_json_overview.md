```javascript
{
 rationale: {
  description: "Add Lorem Ipsum market"
 },
 terms: {
  newMarket: {
   changes: {
    // Decimal places used for the new market (uint64 as string)
    decimalPlaces: "18",
    // Decimal places for order sizes (uint64 as string)
    positionDecimalPlaces: "5",
    // New market instrument configuration
    instrument: {},
    // Optional new market meta data, tags
    metadata: [],
    // Price monitoring parameters
    priceMonitoringParameters: [],
    // Liquidity monitoring parameters
    liquidityMonitoringParameters: {},
    // Log normal risk model parameters, valid only if MODEL_LOG_NORMAL is selected
    logNormal: {},
   },
   // The commitment from the party creating the NewMarket proposal
   liquidityCommitment: {},
  },
  // Timestamp (Unix time in seconds) when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
  closingTimestamp: 1657714005,
  // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
  // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
  enactmentTimestamp: 1657800405,
 }
}
```