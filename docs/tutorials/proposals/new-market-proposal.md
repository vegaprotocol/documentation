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
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideValue={true}/>, (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [market governance](../../concepts/governance.md#market-governance) on Vega

<!--You should also share your proposal idea in the [_Governance_ forum section ↗](https://community.vega.xyz/c/governance) before submitting it to the network.-->

## Anatomy of a market proposal
In this section, the [full proposal template](#templates-and-submitting) has been divided into sections to provide more details on what you need to submit.

There are a number of fields required for proposing a market to ensure that it has all the necessary details and research behind it to be a well-functioning market. 

The general shape is as follows:
<NewMarketJSONOverview />

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new market.

Instrument, liquidity monitoring parameters, price monitoring parameters, and data sources are all described in more detail below.

**Rationale** requires a title and description, which are free-text fields that describe the purpose of the proposal.  Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the market proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

**Decimal places** need to be defined for both order sizes and the market. A market cannot specify more decimal places than its settlement asset supports. The values for these fields cannot be changed, even through governance.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `decimalPlaces` | Sets the smallest price increment on the book. | 18 |
| `positionDecimalPlaces` | Sets the size that the smallest order / position on the market can be. Set the position decimal places such that the margin on the smallest order ends up being about 1 USD. This ensures that the market will not accept orders with very small margin minimums, protecting the network from being spammed with lots of financially insignificant orders. To figure out the ideal decimal place: Calculate the risk factor. Find the current price the asset is trading for, such as from the oracle you're using. The smallest order margin is `price x 10^{-pdp} x (risk factor)`. Convert to USD. If this is less than 0.5, then decrease the position decimal places (pdp) accordingly. Position decimal places (pdp) can also be negative integers. | 3 |

**Timestamps** are required for ending the voting period, as well as enacting the market. The time between closing and enactment also defines how long an [opening auction](../../concepts/trading-on-vega/trading-modes.md#auction-type-opening) will be, which must be smaller than/equal to the difference between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" />.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `closingTimestamp` | Timestamp (Unix time in seconds) when voting closes for this proposal. If it passes the vote, liquidity can be committed from this time. The chosen time must be between <NetworkParameter frontMatter={frontMatter}param="governance.proposal.market.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) | 1663517914 |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when the market will be enacted, ready for trading. The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string) | 1663604314 |

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
| `sourceChainId` | Describes the chain ID of the data source. This chain must already be enabled in network parameters and supported by validators. |


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

### Price monitoring
Price monitoring parameters are optional, and configure the acceptable price movement bounds for price monitoring. If you leave these blank, they will default to the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="market.monitor.price.defaultParameters" hideValue={true} />). See below for more details on each field.

<NewMarketJSONPriceMonitoring />

Price monitoring uses the following properties: 

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `horizon` | Price monitoring projection horizon τ in seconds (set as >0) | 43200 |
| `probability` | Price monitoring probability level p (set as >0 and <1) | 0.9999999 |
| `auctionExtension` | Price monitoring auction extension duration (in seconds) should the price breach its theoretical level over the specified horizon at the specified probability level (set as >0) | 600 |

You can use a maximum of 5 sets of price monitoring parameters for a market.

### Risk model
Choose the individual parameters for the [log-normal risk model](../../concepts/governance.md#log-normal-risk-model). You should ensure the risk model parameters represent the dynamics of the underlying instrument, and that the resulting margins strike the right balance between prudence and capital efficiency. 

While you cannot define exactly how much margin (or leverage) is possible, you can influence the acceptable levels of market volatility.

Read about the [risk models and parameters](../../concepts/governance.md#risk-models-and-parameters) before choosing your values.

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

<Batch />

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems that can be submitted with a Vega Wallet app.

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="newMarket">
  <TabItem value="annotated" label="Annotated example">
    <NewMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="Governance dApp (JSON)">
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

<!--
Building support is down to you. Share your proposal in the [_Governance_ section ↗](https://community.vega.xyz/c/governance) on the Vega community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).
-->

A vote can be submitted with a [transaction](../../api/grpc/vega/commands/v1/commands.proto.mdx#votesubmission) on the command line, or by using the [governance dApp](https://governance.fairground.wtf/proposals).

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key.

Your proposal will need [participation](../../concepts/governance.md#how-a-proposals-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

Learn more about voting on the [governance concepts](../../concepts/governance.md#voting-on-proposals) page.

## Enactment 
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field, or as soon as the [opening auction](../../concepts/trading-on-vega/trading-modes.md#auction-type-opening) has successfully concluded, whichever is later.