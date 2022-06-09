```javascript
{
 changes: {
  // Decimal places used for the new market (uint64 as string)
  decimalPlaces: "5",
  // Decimal places for order sizes (uint64 as string)
  positionDecimalPlaces: "5",
  // New market instrument configuration
  instrument: {},
  // Optional new market meta data, tags
  metadata: [],
  // Price monitoring parameters
  priceMonitoringParameters: [],
  // Liquidity monitoring parameters
  liquidityMonitoringParameters: [],
  // Log normal risk model parameters, valid only if MODEL_LOG_NORMAL is selected
  logNormal: [],
 },
 // The commitment from the party creating the NewMarket proposal
 liquidityCommitment: {},
}
```