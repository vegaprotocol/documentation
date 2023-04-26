---
sidebar_position: 1
title: Propose a new market
hide_title: false
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

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Propose a cash-settled futures market on any underlying with a settlement data source.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideName={true} suffix="tokens"/> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>
* Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance), particularly [market governance](../../concepts/vega-protocol#market-governance)

<!--[Update an existing market](#update-an-existing-market): change the details of a market that is already enacted.-->

## Anatomy of a market proposal
In this section, the [full proposal template](#templates-and-submitting) has been divided into sections to provide more details on what you need to submit.

There are a number of fields required for proposing a market to ensure that it has all the necessary details and research behind it to be a well-functioning market. 

The general shape is as follows:
<NewMarketJSONOverview />

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new market.

Instrument, liquidity monitoring parameters, price monitoring parameters, data sources, and liquidity commitment are all described in more detail below.

**Rationale** requires a description, which is a free-text field that describes the purpose of the proposal. Include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the market.

**LP price range** is a number that, when multiplied by 100, determines the percentage move up and down from the mid price, which determines the range of price levels over which automated [liquidity commitment orders](../../concepts/liquidity/provision.md) will be deployed. An accepted value is > 0 and <= 100.

**Decimal places** need to be defined for both order sizes and the market. A market cannot specify more decimal places than its settlement asset supports.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `decimalPlaces` | Sets the smallest price increment on the book. | 18 |
| `positionDecimalPlaces` | Sets how big the smallest order / position on the market can be. | 5 |

**Timestamps** are required for ending the voting period, as well as enacting the market. The time between closing and enactment also defines how long an opening auction will be, which must be smaller than/equal to the difference between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" />.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `closingTimestamp` | Timestamp (Unix time in seconds) when voting closes for this proposal. The chosen time must be between <NetworkParameter frontMatter={frontMatter}param="governance.proposal.market.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) | 1663517914 |
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
| `name` | A string for the market name. Best practice is to include a full and fairly descriptive name for the instrument. | BTC/USD DEC18. |
| `code`  (instrument) | This is a shortcode used to easily describe the instrument. The more information you add, the easier it is for people to know what the market offers. | FX:BTCUSD/DEC18 |
| `future` | An object that provides details about the futures market to be proposed. |
| `settlementAsset` | Settlement asset requires the ID of the asset that the market will be margined in and settle in. You can get a list of supported assets by querying REST, GraphQL, or gRPC, and then selecting the asset ID. |  |
| `quoteName` | The quote name is the human-readable name/abbreviation of the settlement asset. Example: In BTCUSD, USD is the quote. | tEuro |
| `dataSourceSpecForSettlementData` | This defines the data source that will be used to identify the settlement price when the market expires. | prices.BTC.value |
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
| `value` | A number that is constrained by the operator | 0 |

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
| `scalingFactor` | This must be set within the range defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.stake.target.scalingFactor" hideValue={true} />, and defines the scaling between the liquidity demand estimate, based on open interest and target stake. The scaling factor must be a number greater than zero and finite | 10 |
| `triggeringRatio` | Specifies the triggering ratio for entering liquidity auction. If empty, the network will default to <NetworkParameter frontMatter={frontMatter} param="market.liquidity.targetstake.triggering.ratio" hideName={true} /> | 0.7 |
| `auctionExtension` | Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction. If empty, the network will default to the network parameter <NetworkParameter frontMatter={frontMatter} param="market.monitor.price.defaultParameters" hideValue={true} /> | 1 |

### Price monitoring
Price monitoring parameters are optional, and configure the acceptable price movement bounds for price monitoring. <!--If you leave these blank, they will default to whatever the network-wide parameters are set as.--> See below for more details on each field.

<NewMarketJSONPriceMonitoring />

Price monitoring uses the following properties: 

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `horizon` | Price monitoring projection horizon τ in seconds (set as >0) | 43200 |
| `probability` | Price monitoring probability level p (set as >0 and <1) | 0.9999999 |
| `auctionExtension` | Price monitoring auction extension duration (in seconds) should the price breach its theoretical level over the specified horizon at the specified probability level (set as >0) | 600 |

### Risk model
Choose the individual parameters for the [log-normal risk model](../../concepts/vega-protocol.md#log-normal-risk-model). You should ensure the risk model parameters represent the dynamics of the underlying instrument, and that the resulting margins strike the right balance between prudence and capital efficiency. 

While you cannot define exactly how much margin (or leverage) is possible, you can influence the acceptable levels of market volatility.

Read about the [risk models and parameters](../../concepts/vega-protocol.md#risk-models-and-parameters) before choosing your values.

<NewMarketJSONRisk />
The risk model uses the following properties: 

| Field | Description | Suggested value |
| ----------- | ----------- | ----------- |
| `tau` | Projection horizon measured as a year fraction used in the expected shortfall calculation to obtain the maintenance margin. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: 0.000114077116130504 - corresponds to one hour expressed as year fraction | 0.000114077116130504 |
| `riskAversionParameter` | Probability confidence level used in expected shortfall calculation when obtaining the maintenance margin level. First, the value at risk, defined by confidence lambda is calculated. This is the cash amount that one would need to add to the position to make the probability of the value of the position and cash going negative after time tau to be less than lambda. The margin is then the expected loss of the position given that it incurred a loss bigger than the value at risk.<br/><br/> Accepted values: strictly greater than 0 and strictly smaller than 1 | 0.00001 |
| `param: mu` | Annualised growth rate of the underlying asset. <br/><br/>Accepted values: any real number | 0 |
| `param: r` | Annualised growth rate of the risk-free asset, it's used for discounting of future cash flows. <br/><br/> Accepted values: any real number | 0 |
| `param: sigma` | Annualised volatility of the underlying asset. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: asset dependent, should be derived from the historical time-series of prices. | 0.8 (converts to 80%) |

## Templates and submitting
In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example that can be used as the basis to [submit on the governance dApp ↗](https://governance.fairground.wtf/proposals/propose/new-market), and command line examples for different operating systems. **You'll need to replace the example data with the relevant details before submitting.**

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

## Voting and enactment
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key.

Your proposal will need [participation](../../concepts/vega-protocol#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.

Building support is down to you. Share your proposal in [the _New Market Proposals_ forum ↗](https://community.vega.xyz/c/fairground-testnet-governance/new-market-proposals-testnet/33) on Vega community, being sure to follow the [post guide ↗](https://community.vega.xyz/t/guide-to-new-market-proposals-on-fairground-testnet/4017). You may also wish to share on [Discord ↗](https://vega.xyz/discord).

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.
