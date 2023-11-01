---
sidebar_position: 1
title: New futures market
hide_title: true
vega_network: MAINNET
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

## Anatomy of a market proposal
In this section, the [full proposal template](#templates-and-submitting) has been divided into sections to provide more details on what you need to submit.

There are a number of fields required for proposing a market to ensure that it has all the necessary details and research behind it to be a well-functioning market. 

The general shape is as follows:
<NewMarketJSONOverview />

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new market.

Instrument, liquidity monitoring parameters, price monitoring parameters, and data sources are all described in more detail below.

**Rationale** requires a title and description, which is are free-text fields that describe the purpose of the proposal.  Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the market proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

**Decimal places** need to be defined for both order sizes and the market. A market cannot specify more decimal places than its settlement asset supports.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `decimalPlaces` | Sets the smallest price increment on the book. | 18 |
| `positionDecimalPlaces` | Sets how big the smallest order / position on the market can be. | 5 |

**Timestamps** are required for ending the voting period, as well as enacting the market. The time between closing and enactment also defines how long an [opening auction](../../concepts/trading-on-vega/trading-modes.md#auction-type-opening) will be, which must be smaller than/equal to the difference between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" />.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `closingTimestamp` | Timestamp (Unix time in seconds) when voting closes for this proposal. If it passes the vote, liquidity can be committed from this time. The chosen time must be between <NetworkParameter frontMatter={frontMatter}param="governance.proposal.market.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) | 1663517914 |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when the market will be enacted, ready for trading. The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string) | 1663604314 |

**Slippage factors** are parameters that determine by how much the margin slippage is affected by the liquidity component of margin in a low-volume scenario. If there is enough volume on the book, the slippage comes directly from the book and the liquidity component is not used. The suggested values are in the example column below. Margin slippage in a low-volume scenario is calculated as `slippageFromFactors = linear x position  + quadratic x position^2) x price`. I

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `linearSlippageFactor` | The linear slippage factor captures that for a bigger position there is proportionally bigger liquidity risk. | 0.001 |
| `quadraticSlippageFactor` | The quadratic slippage factor determines by what factor especially large positions can be penalised. When closing those out, the system will 'walk the book' and potentially end up with an execution price notably worse that the last mark price. | 0.0 |

### Instrument
The instrument shape is as follows, see below for a description of each property:
<NewMarketJSONInstrument />

An instrument contains the following properties:

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `name` | A string for the market name. Best practice is to include a full and fairly descriptive name for the instrument. | Oranges DEC18. |
| `code`  (instrument) | This is a shortcode used to easily describe the instrument. The more information you add, the easier it is for people to know what the market offers. | FX:BTCUSD/DEC18 |
| `future` | An object that provides details about the futures market to be proposed. |
| `settlementAsset` | Settlement asset requires the ID of the asset that the market will be margined in and settle in. You can get a list of supported assets by querying REST, GraphQL, or gRPC, and then selecting the asset ID. |  |
| `quoteName` | The quote name is the human-readable name/abbreviation of the settlement asset. Example: In BTCUSD, USD is the quote. | tEuro |
| `dataSourceSpecForSettlementData` | This defines the data source that will be used to identify the settlement price when the market expires. | prices.ORANGES.value |
| `dataSourceSpecForTradingTermination` | The fields that define the data source used for terminating trading on the market. | vegaprotocol.builtin.timestamp |
| `dataSourceSpecBinding` | The fields describe how specific information provided by the data source is used. For example, they can identify the specific name of the settlement price output, or the specific name of the trading termination property. |


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
| `type` | Specifies the data type that is emitted. For example, for the `prices.ETH.value`, the type is an integer, as it is output as a non-fractional number | TYPE_TIMESTAMP |
| `numberDecimalPlaces` | Optional field to specify the precision in which numerical data is emitted. Use when data is numerical | 18 |
| `conditions` | A filter for the data. The conditions that should to be matched by the data to be considered. This is an optional set of fields. For example you could use an operator and a value to denote that a price should be greater than zero |
| `operator` | This adds a constraint to the value, such as LESS_THAN, GREATER_THAN. For example if you wanted to ensure that the price would always be above zero, you would set the operator to ‘GREATER_THAN’ and the Value to be ‘0’ | GREATER_THAN |
| `value` | A number that is constrained by the operator. If providing a timestamp, use the Unix time in seconds | 0 |

:::info Submitting data
Learn how to find and submit data in the [submitting data sources tutorial](../using-data-sources.md).
:::

### Liquidity monitoring
The liquidity monitoring settings detect when the market's liquidity drops below the safe level, and as such when to launch a 'liquidity seeking' auction. See below for more details on each field.

<NewMarketJSONLiquidityMonitoring />

Liquidity monitoring uses the following properties:

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `targetStakeParameters` | Target stake parameters are derived from open interest history over a time window to calculate the maximum open interest. |
| `timeWindow` | Defines the length of time (in seconds) over which open interest is measured. If empty, this field defaults to <NetworkParameter frontMatter={frontMatter} param="market.stake.target.timeWindow" hideName={true} />. | 3600 |
| `scalingFactor` | The target stake scaling factor scales the estimated required liquidity (based on the market's risk model and current market data) to yield the market's target stake. If not included, it defaults to the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="market.stake.target.scalingFactor" hideValue={true} />. The scaling factor must be a number greater than zero and finite | 10 |
| `triggeringRatio` | Specifies the triggering ratio for entering liquidity auction. If empty, the network will default to <NetworkParameter frontMatter={frontMatter} param="market.liquidity.targetstake.triggering.ratio" hideName={true} /> | 0.7 |
| `auctionExtension` | Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction. If empty, the network will default to the network parameter <NetworkParameter frontMatter={frontMatter} param="market.monitor.price.defaultParameters" hideValue={true} /> | 1 |

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
All proposals are voted on by the community. A vote can be submitted with a [transaction](../../api/grpc/vega/commands/v1/commands.proto.mdx#votesubmission) on the command line, or by using the [governance dApp](https://governance.fairground.wtf/proposals).

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key.

Your proposal will need [participation](../../concepts/governance.md#how-a-proposals-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

Learn more about voting on the [governance concepts](../../concepts/governance.md#voting-on-proposals) page.

## Enactment 
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field, or as soon as the [opening auction](../../concepts/trading-on-vega/trading-modes.md#auction-type-opening) has successfully concluded, whichever is later.