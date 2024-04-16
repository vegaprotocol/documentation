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
    // Liquidation strategy for this market.
    liquidationStrategy: {
     // Interval, in seconds, at which the network will attempt to close its position. (int64 as string)
     disposalTimeStep: 500,
     // Fraction of the open position the market will try to close in a single attempt; range 0 through 1. (string)
     disposalFraction: "1",
     // Size of the position that the network will try to close in a single attempt. (uint64 as string)
     fullDisposalSize: "18446744073709551615",
     // Max fraction of the total volume of the orderbook, within liquidity bounds, that the network can use to close its position; range 0 through 1. (string)
     maxFractionConsumed: "1",
    },
    // Specifies how the liquidity fee for the market will be calculated.
    liquidityFeeSettings: {
     // Method used to calculate the market's liquidity fee.
     method: "METHOD_CONSTANT",
     // Constant liquidity fee used when using the constant fee method. (string)
     feeConstant: "0.00005",
    },
    // Liquidity monitoring parameters.
    liquidityMonitoringParameters: {
     // Specifies parameters related to target stake calculation.
     targetStakeParameters: {
      timeWindow: "3600",
      scalingFactor: "0.05"
     },
    },
    /* Mark price configuration. */
    markPriceConfiguration: {
     // Decay weight used for calculation of mark price.
     decayWeight: "1",
     // Decay power used for the calculation of mark price. (string)
     decayPower: "1",
     // Cash amount, in asset decimals, used for the calculation of the mark price from the order book. (string)
     cashAmount: "5000000",
     // Weights for each composite price data source. (array)
     sourceWeights: [
      "0",
      "1",
      "0"
     ],
     // For how long a price source is considered valid. One entry for each data source
     // such that the first is for the trade based mark price, the second is for the book based price
     // the third is for the first oracle, followed by more oracle data source staleness tolerance. (array)
     sourceStalenessTolerance: [
      "1m0s",
      "1m0s",
      "1m0s"
     ],
     // Which method is used for the calculation of the composite price for the market. (string)
     compositePriceType: "COMPOSITE_PRICE_TYPE_WEIGHTED",
     // Additional price sources to be used for internal composite price calculation. (array)
     dataSourcesSpec: [],
     // List of each price source and its corresponding binding (array)
     dataSourcesSpecBinding: []
    },
    // The market tick size defines the minimum change in quote price for the market
    tickSize: "1"
   },
   // Timestamp as Unix time in seconds when voting closes for this proposal,
   // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
   closingTimestamp: 1714901113,
   // Timestamp as Unix time in seconds when proposal gets enacted if passed,
   // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
   enactmentTimestamp: 1714987513,
  }
 }
```