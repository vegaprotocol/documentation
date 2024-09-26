---
sidebar_position: 1
title: New futures market
hide_title: true
vega_network: TESTNET
keywords:
- proposal
- governance
- newMarket
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import NewMarketJSONInstrument from './_generated-proposals/_newMarket_json_instrument.md';
import NewMarketJSONRisk from './_generated-proposals/_newMarket_json_risk.md';
import NewMarketJSONLiquidityMonitoring from './_generated-proposals/_newMarket_json_liqparams.md';
import NewMarketJSONPriceMonitoring from './_generated-proposals/_newMarket_json_priceparams.md';
import NewMarketJSONOracle from './_generated-proposals/_newMarket_json_oracle.md';
import NewMarketJSONOverview from './_generated-proposals/_newMarket_json_overview.md';
import NewMarketAnnotated from './_generated-proposals/_newMarket_annotated.md';
import NewMarketJSON from './_generated-proposals/_newMarket_json.md';
import NewMarketCMD from './_generated-proposals/_newMarket_cmd.md';
import NewMarketWin from './_generated-proposals/_newMarket_win.md';
import Batch from './_batch-sample.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose new futures market

Propose a cash-settled futures market on any underlying with a settlement data source.

:::tip Propose a perpetuals market
Looking to propose a perpetuals market? See the [perpetual futures tutorial](./new-perpetuals-market.md).
:::

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* Enough VEGA associated with your public key. Have at least whichever is larger of the values of the following network parameters: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />.

## Anatomy of a market proposal
In this section, the [full proposal template](#templates-and-submitting) has been divided into sections to provide more details on what you need to submit.

The general shape is as follows:
<NewMarketJSONOverview />

**Rationale** requires a title and description. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the market proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

**Decimal places** need to be defined for both order sizes and the market. A market cannot specify more decimal places than its settlement asset supports. The values for these fields cannot be changed, even through governance.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `decimalPlaces` | Sets the smallest price increment on the book that can be stored by Vega. Use with `tickSize` to get bigger price increments that are currently financially meaningful. Though `decimalPlaces` can't be changed via governance, `tickSize` can. | 18 |
| `positionDecimalPlaces` | Sets the size that the smallest order / position on the market can be. Set the position decimal places such that the margin on the smallest order ends up being about 1 USD. This ensures that the market will not accept orders with very small margin minimums, protecting the network from being spammed with lots of financially insignificant orders. To figure out the ideal decimal place: Calculate the risk factor. Find the current price the asset is trading for, such as from the oracle you're using. The smallest order margin is `price x 10^{-pdp} x (risk factor)`. Convert to USD. If this is less than 0.5, then decrease the position decimal places (pdp) accordingly. Position decimal places (pdp) can also be negative integers. | 3 |

**Timestamps** are required for ending the voting period, as well as enacting the market. The time between closing and enactment also defines how long an [opening auction](../../concepts/trading-framework/trading-modes.md#auction-type-opening) will be, which must be smaller than/equal to the difference between the values of the network parameters <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" />.

| Field                 | Description           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closingTimestamp`    | Timestamp (Unix time in seconds) when voting closes for this proposal. The chosen time must be between the values of the network parameters `governance.proposal.updateMarket.minClose` and `governance.proposal.updateMarket.maxClose`" hideName={true} />` after the proposal submission time. (int64 as string) |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when proposal gets enacted (if passed). The chosen time must be between the values of the parameters `governance.proposal.updateMarket.minEnact` and `governance.proposal.updateMarket.maxEnact` after `closingTimestamp`. (int64 as string)         |

The **lineage slippage factor** is a parameter that caps the margin level in low-volume situations for cross margin trades so that traders aren't closed out unnecessarily.

Margin slippage in a low-volume scenario is calculated as `slippageFromFactors = linear factor x position x price`.

If there is enough volume on the book, the slippage value comes directly from the book and the slippage factor is not used.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `linearSlippageFactor` | The linear slippage factor captures that for a bigger position there is proportionally bigger liquidity risk in a low-liquidity market. | 0.001 |

### Instrument
The instrument shape is as follows, see below for a description of each property:
<NewMarketJSONInstrument />

An instrument contains the following properties:

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `name` | A string for the market name. Best practice is to include a full and fairly descriptive name for the instrument. | Oranges DEC18. |
| `code`  (instrument) | This is a shortcode used to easily describe the instrument. The more information you add, the easier it is for people to know what the market offers. | FX:BTCUSD/DEC18 |
| `future` | An object that provides details about the futures market to be proposed. |
| `settlementAsset` | Settlement asset requires the ID of the asset that the market will be margined and settled in. You can get a list of supported assets by querying REST, GraphQL, or gRPC, and then selecting the asset ID. |  |
| `quoteName` | The quote name is the human-readable name/abbreviation of the settlement asset. Example: In BTCUSD, USD is the quote. | tEuro |
| `dataSourceSpecForSettlementData` | This defines the data source that will be used to identify the settlement price when the market expires. | prices.ORANGES.value |
| `dataSourceSpecForTradingTermination` | The fields that define the data source used for terminating trading on the market. | vegaprotocol.builtin.timestamp |
| `dataSourceSpecBinding` | The fields describe how specific information provided by the data source is used. For example, they can identify the specific name of the settlement price output, or the specific name of the trading termination property. |
| `tickSize` | Sets the smallest possible change in the price in the market. Tick size is in relation to the market `decimalPlaces`, as an integer. If a BTCUSDT market is configured with 5 mdp, tick size 1 would make the smallest tick size 0.00001. Tick size can help manage a market with 'too many' decimal places, or an asset's value dropping dramatically. A value of 2000 with 5 `decimalPlaces` is a scaled tick size of 0.02. A minimum of 10 is recommended. | 10 |
| `enableTransactionReordering` | Sets whether or not aggressive orders sent to the market are delayed by the number of blocks configured by the network parameter `market.aggressiveOrderBlockDelay` | true / false |

For easy reading, the data source filters are separated out - see [Data source bindings](#data-source-bindings) below to see the fields for specifying data.

### Data source bindings
Data feeds from an oracle can be used to terminate trading and settle markets. See below for a full description of each field. A data source spec binding looks like this:

<NewMarketJSONOracle/>

Data source bindings include the following properties: 

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `pubKeys` | Public key(s) that can sign and submit values for this data source | 0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC |
| `filters` | Filters define what data is of importance for the purposes of the type of governance proposal |
| `key` | Defines the specific type of information the data source provides that is relevant to the proposed market. Example: If a data source provides a list of prices for various markets, focus only on the specific relevant price for the market |
| `name` | Specific name of the information that the filter provides. | prices.ETH.value |
| `type` | Specifies the data type that is emitted. For example, for the `prices.ETH.value`, the type is an integer, as it is output as a non-fractional number | TYPE_INTEGER |
| `numberDecimalPlaces` | Optional field to specify the precision in which numerical data is emitted. Use when data is numerical | 18 |
| `conditions` | A filter for the data. The conditions that need to be matched by the data to be considered. This is an optional set of fields. For example you could use an operator and a value to denote that a price should be greater than zero |
| `operator` | This adds a constraint to the value, such as LESS_THAN, GREATER_THAN. For example if you wanted to ensure that the price would always be above zero, you would set the operator to ‘GREATER_THAN’ and the Value to be ‘0’ | GREATER_THAN |
| `value` | A number that is constrained by the operator. If providing a timestamp, use the Unix time in seconds | 0 |
| `sourceChainId` | Describes the chain ID of the data source. This chain must already be enabled in network parameters and supported by validators. |

:::info Submitting data
Learn how to find and submit data in the [submitting data sources tutorial](../using-data-sources.md).
:::

### Liquidity monitoring
The liquidity monitoring settings detect when the market's liquidity drops below the ideal level. See below for more details on each field.

<NewMarketJSONLiquidityMonitoring />

Liquidity monitoring uses the following properties:

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `targetStakeParameters` | Target stake parameters are derived from open interest history over a time window to calculate the maximum open interest. |
| `timeWindow` | Defines the length of time (in seconds) over which open interest is measured. | 3600 |
| `scalingFactor` | The target stake scaling factor scales the estimated required liquidity (based on the market's risk model and current market data) to yield the market's target stake. The scaling factor must be a number greater than zero and finite | 10 |

### Mark price configuration

The mark price methodology can be fine-tuned per market. If left blank, the market will default to the [last price method](../../concepts/trading-framework/margin.md#last-traded-price). You can read further details about the flexible mark price fields in [concepts](../../concepts/trading-framework/margin.md#flexible-mark-price-methodology).

| Field | Description | Examples |
| ----------- | ----------- | --------- |
| `decayWeight` | Controls to what extent observation time impacts the weight in the mark price calculation. 0 implies uniform weights. | 1 |
| `decayPower` | Controls how quickly the weight assigned to older observations should drop. The higher the value, the more weight is assigned to recent observations. | 1 |
| `cashAmount` | Used in calculating the mark price from the order book, in asset decimals. Use the margin amount of the expected typical trade size, at maximum leverage. | A well-known highly liquid exchange uses 200 USDT on their most popular market. If you expect your market will be equally liquid, use the equivalent amount in the market's settlement asset. If you think it's likely to be 10x less liquid, use 10x less. |
| `sourceWeights` | Determines how much weight goes to each composite price component. The order of sources used is as follows: price by trades, price by book, oracle_1, ... oracle_n, median price. 0 means the input is always ignored.| 0.5, 0.5, 0 uses an average of trades as defined via the TWAP and decay, and book as defined by the cash amount.|
| `sourceStalenessTolerance` | How long a price source is considered valid. This uses one entry for each data source, such that the first is for the trade-based mark price, the second is for the order book-based price, and the third is for the first oracle, followed by any other data source staleness tolerance. | 1m0s |
| `compositePriceType` | Weighted, median or last trade. | Weighted: Composite price is calculated as a weighted average of the underlying mark prices. Median: Composite price is calculated as a median of the underlying mark prices. Last trade: Composite price is calculated as the last trade price. |

```
"markPriceConfiguration": {
          "decayWeight": "1",
          "decayPower": "1",
          "cashAmount": "2000000",
          "sourceWeights": [
            "0.5",
            "0.5",
            "0"
          ],
          "sourceStalenessTolerance": [
            "1m0s",
            "1m0s",
            "1m0s"
          ],
          "compositePriceType": "COMPOSITE_PRICE_TYPE_WEIGHTED",
```

### Price monitoring
Price monitoring parameters are optional, and configure the acceptable price movement bounds for price monitoring. See below for more details on each field.

<NewMarketJSONPriceMonitoring />

Price monitoring uses the following properties: 

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `horizon` | Price monitoring projection horizon τ in seconds (set as >0) | 43200 |
| `probability` | Price monitoring probability level p (set as >0 and <1) | 0.9999999 |
| `auctionExtension` | Price monitoring auction extension duration (in seconds) should the price breach its theoretical level over the specified horizon at the specified probability level (set as >0) | 600 |

You can use a maximum of 5 sets of price monitoring parameters for a market.

### Risk model
Choose the individual parameters for the [log-normal risk model](../../concepts/governance/market.md#log-normal-risk-model). You should ensure the risk model parameters represent the dynamics of the underlying instrument, and that the resulting margins strike the right balance between prudence and capital efficiency. 

While you cannot define exactly how much margin (or leverage) is possible, you can influence the acceptable levels of market volatility.

Read about the [risk models and parameters](../../concepts/governance/market.md#risk-models-and-parameters) before choosing your values.

<NewMarketJSONRisk />
The risk model uses the following properties: 

| Field | Description | Suggested value |
| ----------- | ----------- | ----------- |
| `tau` | Projection horizon measured as a year fraction used in the expected shortfall calculation to obtain the maintenance margin. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: 0.000114077116130504 - corresponds to one hour expressed as year fraction | 0.000114077116130504 |
| `riskAversionParameter` | Probability confidence level used in expected shortfall calculation when obtaining the maintenance margin level. First, the value at risk, defined by confidence lambda is calculated. This is the cash amount that one would need to add to the position to make the probability of the value of the position and cash going negative after time tau to be less than lambda. The margin is then the expected loss of the position given that it incurred a loss bigger than the value at risk.<br/><br/> Accepted values: strictly greater than 0 and strictly smaller than 1 | 0.00001 |
| `param: mu` | Annualised growth rate of the underlying asset. <br/><br/>Accepted values: any real number | 0 |
| `param: r` | Annualised growth rate of the risk-free asset, it's used for discounting of future cash flows. Use 0.0 unless otherwise required. <br/><br/> Accepted values: any real number | 0.0 |
| `param: sigma` | Annualised historic volatility of the underlying asset. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: asset dependent, should be derived from the historical time-series of prices. | 0.8 (converts to 80%) |

### Liquidity SLA parameters 
The liquidity parameters set the requirements that liquidity providers on the market must meet in order to avoid being penalised and to earn fee revenue. There is also an option to change how the liquidity fee is determined.

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| `liquiditySlaParameters` | Parameters for minimum requirements and measurements | |
| `priceRange` | Sets the percentage move up and down from the mid price that LPs must be within to count towards their commitment | 0.1 | 
| `commitmentMinTimeFraction` | The minimum fraction of time that LPs must spend on the book and within the price range | 0.1 | 
| `performanceHysteresisEpochs` | Sets the number of epochs over which past performance will continue to affect rewards. | 10 | 
| `slaCompetitionFactor` | Sets the maximum fraction of their accrued fees an LP that meets the SLA will lose to liquidity providers that achieved a higher SLA performance than them. | 0.2 |
| `liquidityFeeSettings` | Optional setting for how the liquidity fee factor is determined. See [liquidity fees](../../concepts/liquidity/rewards-penalties.md#determining-the-liquidity-fee-percentage) for more. | `METHOD_MARGINAL_COST` (default) `METHOD_CONSTANT`, `METHOD_WEIGHTED_AVERAGE` |
| `feeConstant` | For the fee setting `METHOD_CONSTANT`, a constant fee factor needs to be provided. | 0.00005 |

### Liquidation strategy
Set up the liquidation strategy to minimise the impact of distressed traders on the market. These parameters can balance between minimising the market impact of disposing of distressed positions and not holding a large open volume for a long time.

| Field | Description | Suggested value |
| ----------- | ----------- | ----------- |
| `disposalTimeStep` | Interval, in seconds, at which the network will attempt to close a position it's acquired from distressed traders. | 30 |
| `disposalFraction` | Fraction of the open position the market will try to close in a single attempt. Range 0 through 1 | 0.1 |
| `fullDisposalSize` | Size of the position that the network will try to close in a single attempt  | 1 |
| `maxFractionConsumed` | Maximum fraction of the order book's total volume, within the liquidity bounds, that the network can use to close its position. Range 0 through 1 | 0.05 |
| `disposalSlippageRange` | Decimal number greater than 0 specifying the range above and below the mid price within which the network will trade to dispose of its position. | 0.1 |

### Prediction market
Using the fields below, you can create a prediction market, or set a maximum settlement price, use binary settlement, require fully collateralised positions.

| Field | Description | Possible value |
| ----------- | ----------- | ----------- |
| `cap`| Fields in this optional section determine if a market has a max price, binary settlement, and if positions must be fully collateralised. | |
| `binarySettlement` | If set to true, the market's settlement price will be 0 or the max price. If set to false, any price up to max price can be considered for settlement. When a market settles, the final settlement cashflow is based on which side of the outcome a participant's position is on. | true or false |
| `maxPrice` | Sets the highest possible settlement price. Use market decimal places to set this value. For example, 2 market decimals with a price cap of 3 would be 300. Must be greater than 0, if used. | 10000 |
| `fullyCollateralised` | If set to true, the market will require participants' positions to be fully collateralised, and thus no market participants can be liquidated. | true or false |

## Submitting proposals in a batch

<Batch />

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example 
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="newMarket">
  <TabItem value="annotated" label="Annotated example">
    <NewMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON">
  	<JSONInstructions />
		<NewMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
		<TerminalInstructions />
		<NewMarketCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
  <TerminalInstructions />
		<NewMarketWin />
  </TabItem>
</Tabs>

## Voting
All proposals are voted on by the community. 

A vote can be submitted with a [transaction](../../api/grpc/vega/commands/v1/commands.proto.mdx#votesubmission) on the command line.

To vote, community members need, at a minimum, the larger of the value of the following network parameters <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minVoterBalance" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> associated with their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-a-proposals-outcome-is-calculated) at a minimum of the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredParticipation" /> and a majority of the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" />.

Learn more about voting on the [governance concepts](../../concepts/governance/lifecycle.md#voting) page.

## Enactment 
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field, or as soon as the [opening auction](../../concepts/trading-framework/trading-modes.md#auction-type-opening) has successfully concluded, whichever is later.