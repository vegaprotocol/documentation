---
sidebar_position: 1
title: New perpetuals market
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
import NewPerpetualMarketAnnotated from './_generated-proposals/_newPerpetualMarket_annotated.md';
import NewPerpetualMarketJSON from './_generated-proposals/_newPerpetualMarket_json.md';
import NewPerpetualMarketCMD from './_generated-proposals/_newPerpetualMarket_cmd.md';
import NewPerpetualMarketWin from './_generated-proposals/_newPerpetualMarket_win.md';
import NewMarketJSONLiquidityMonitoring from './_generated-proposals/_newMarket_json_liqparams.md';
import NewMarketJSONPriceMonitoring from './_generated-proposals/_newMarket_json_priceparams.md';
import NewMarketJSONRisk from './_generated-proposals/_newMarket_json_risk.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose new perpetuals market

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideValue={true}/>   (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [governance](../../concepts/governance.md) on Vega
* Familiarity with using [Ethereum to provide data](../using-data-sources.md#ethereum-oracles)

You should also share your proposal idea in the [_Governance_ forum section ↗](https://community.vega.xyz/c/governance) before submitting it to the network.

## Anatomy of a proposal 

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new market.

Instrument, liquidity monitoring parameters, price monitoring parameters, and data sources are all described in more detail below.

**Rationale** requires a title and description, which is are free-text fields that describe the purpose of the proposal.  Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the market proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

**Decimal places** need to be defined for both order sizes and the market. A market cannot specify more decimal places than its settlement asset supports. The values for these fields cannot be changed, even through governance.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `decimalPlaces` | Sets the smallest price increment on the book. | 18 |
| `positionDecimalPlaces` | Sets the size that the smallest order / position on the market can be. Set the position decimal places such that the margin on the smallest order ends up being about 1 USD. This ensures that the market will not accept orders with very small margin minimums, protecting the network from being spammed with lots of financially insignificant orders. To figure out the ideal decimal place: Calculate the risk factor. Find the current price the asset is trading for, such as from the oracle you're using. The smallest order margin is `price x 10^{-pdp} x (risk factor)`. Convert to USD. If this is less than 0.5, then decrease the position decimal places (pdp) accordingly. Position decimal places (pdp) can also be negative integers. | 3 |

**Timestamps** are required for ending the voting period, as well as enacting the market. The time between closing and enactment also defines how long an [opening auction](../../concepts/trading-on-vega/trading-modes.md#auction-type-opening) will be, which must be smaller than/equal to the difference between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" />.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `closingTimestamp` | Timestamp (Unix time in seconds) when voting closes for this proposal. If it passes the vote, liquidity can be committed from this time. The chosen time must be between <NetworkParameter frontMatter={frontMatter}param="governance.proposal.market.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) | 1663517914 |
| `enactmentTimestamp` | Timestamp (Unix time in seconds) when the market will be enacted, ready for trading. The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string) | 1663604314 |

**Slippage factors** are parameters that determine by how much the margin slippage is affected by the liquidity component of margin in a low-volume scenario. If there is enough volume on the book, the slippage comes directly from the book and the liquidity component is not used. The suggested values are in the example column below. Margin slippage in a low-volume scenario is calculated as `slippageFromFactors = linear x position  + quadratic x position^2) x price`. I

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `linearSlippageFactor` | The linear slippage factor captures that for a bigger position there is proportionally bigger liquidity risk. | 0.001 |
| `quadraticSlippageFactor` | The quadratic slippage factor determines by what factor especially large positions can be penalised. When closing those out, the system will 'walk the book' and potentially end up with an execution price notably worse that the last mark price. | 0.0 |

### Instrument
An instrument contains the following properties:

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| `name` | A string for the market name. Best practice is to include a full and fairly descriptive name for the instrument. | Oranges DEC18. |
| `code`  (instrument) | This is a shortcode used to easily describe the instrument. The more information you add, the easier it is for people to know what the market offers. | FX:BTCUSD/DEC18 |
| `perpetual` | An object that provides details about the perpetual market to be proposed. |
| `settlementAsset` | Settlement asset requires the ID of the asset that the market will be margined in and settle in. You can get a list of supported assets by querying REST, GraphQL, or gRPC, and then selecting the asset ID. |  |
| `quoteName` | The quote name is the human-readable name/abbreviation of the settlement asset. Example: In BTCUSD, USD is the quote. | tEuro |
| `marginFundingFactor`| Determines how much a funding payment liability contributes to a trader's margin. Must be in the range [0, 1]. | 0.9 |
| `interestRate`| Sets the continuously compounded interest rate used in funding rate calculation. Must be in the range [-1, 1].| 0.1 |
| `clampLowerBound`| Lower bound for the clamp function used as part of the funding rate calculation. Must be in the range [-1, 1]. | 0 |
| `clampUpperBound`| Upper bound for the clamp function used as part of the funding rate calculation. Must be in the range [-1, 1]. | 0 |
| [`dataSourceSpecForSettlementData`](#data-source-for-settlement-data) | This defines the Ethereum data source, the method, normalisers, required confirmations, etc, that will be used to identify the settlement price when the market expires. | |
| [`dataSourceSpecForSettlementSchedule`](#data-source-for-settlement-schedule) | This defines how the market will source data for funding, and how often to source it. | |
| [`dataSourceSpecBinding`](#data-source-bindings) | The fields describe how specific information provided by the data source is used. For example, they are used to set the settlement data property and the settlement schedule property. |

### Data source for settlement schedule
The periodic settlements scheduled with the fields below determine how often the market's funding payments occur. It's recommended that funding payments are be less frequent than auction extensions for [price monitoring](#price-monitoring). Very frequent funding payments may lead to quick price changes in the market that participants may not have time to react to. Setting longer funding payment triggers allow for more time. 

The settlement schedule property contains the following fields:

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| internal: `timeTrigger` | Determines when the call should be repeated after the first call, in seconds. | 3300 |
| `conditions` | A filter for the data. The conditions that should to be matched by the data to be considered. This is an optional set of fields. For example you could use an operator and a value to denote that a price should be greater than zero |
| `operator` | This adds a constraint to the value, such as LESS_THAN, GREATER_THAN. For example if you wanted to ensure that the price would always be above zero, you would set the operator to ‘GREATER_THAN’ and the Value to be ‘0’ | GREATER_THAN_OR_EQUAL |
| `value` | A number that is constrained by the operator. If providing a timestamp, use the Unix time in seconds | 0 |
| triggers: `initial`; `every` | These fields set how often the call should be repeated after the initial call, in seconds. | 1699033027; 28800 |

### Data source for settlement data
Data feeds from an oracle can be used to determine when to read price data from an Ethereum contract.

Data source specs include the following properties under `ethOracle`: 

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| `address` | Ethereum address that can sign and submit values for this data source | Valid Ethereum address |
| `abi` | The abi tells the settlement spec how to interact with the oracle. | |
| `method` | Method is one field that describes what information to take from the oracle. | latestAnswer |
| `args` | Any extra information that is required from the contract. Can be left as an empty array if there is none. | |
| `normalisers`: `name`, `expression` | Normalisers are used to convert the data returned from the contract method into a standard format. The name identifies the specific piece of data. The value is where in the contract call result the required data is located. For example $[0] is the first result. |  |
| `requiredConfirmations` | Number of network confirmations before data can be considered verified | 3 |
| `timeTrigger`: `initial`; `every` | Determines the first call, and how often the call should be repeated, in seconds. | 1701193129, 3000 |
| `filters` | Filters define what data is of importance for the purposes of this market |
| `key` | Defines the specific type of information the data source provides that is relevant to the proposed market. Example: If a data source provides a list of prices for various markets, focus only on the specific relevant price for the market, and specifics on the data format. |
| `name` | Specific name of the information that the filter provides. | btc.price |
| `type` | Specifies the data type that is emitted. For example, for `btc.price`, the type is an integer, as it is output as a non-fractional number | TYPE_INTEGER |
| `numberDecimalPlaces` | Number of decimal places specifies the precision in which numerical data is emitted. Use when data is numerical | 8 |
| `conditions` | A filter for the data. The conditions that should to be matched by the data to be considered. This is an optional set of fields. For example you could use an operator and a value to denote that a price should be greater than zero |
| `operator` | This adds a constraint to the value, such as LESS_THAN, GREATER_THAN. For example if you wanted to ensure that the price would always be above zero, you would set the operator to ‘GREATER_THAN’ and the Value to be ‘0’ | GREATER_THAN |
| `value` | A number that is constrained by the operator. If providing a timestamp, use the Unix time in seconds | 0 |
| `dataSourceSpecBinding` | Describes which property of the data source data is to be used as settlement data and when. | |
| `settlementDataProperty` | Name of the property in the source data to be used as settlement data. | `btc.price` |
| `settlementScheduleProperty` | Describes what to use to determine when to run a settlement. | `vegaprotocol.builtin.timetrigger` |

:::info Submitting data
Learn how to find and submit data in the [submitting data sources tutorial](../using-data-sources.md).
:::

### Liquidity monitoring
The liquidity monitoring settings detect when the market's liquidity drops below the safe level, and as such when to launch a 'liquidity seeking' auction. See below for more details on each field.

<NewMarketJSONLiquidityMonitoring />

Liquidity monitoring uses the following properties:

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| `targetStakeParameters` | Target stake parameters are derived from open interest history over a time window to calculate the maximum open interest. |
| `timeWindow` | Defines the length of time (in seconds) over which open interest is measured. If empty, this field defaults to <NetworkParameter frontMatter={frontMatter} param="market.stake.target.timeWindow" hideName={true} />. | 3600 |
| `scalingFactor` | The target stake scaling factor scales the estimated required liquidity (based on the market's risk model and current market data) to yield the market's target stake. The scaling factor must be a number greater than zero and finite | 10 |
| `triggeringRatio` | Specifies the triggering ratio for entering liquidity auction. | 0.7 |
| `auctionExtension` | Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction. | 1 |

### Price monitoring
Price monitoring parameters are optional, and configure the acceptable price movement bounds for price monitoring. See below for more details on each field.

<NewMarketJSONPriceMonitoring />

Price monitoring uses the following properties: 

| Field | Description | Sample value |
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

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| `tau` | Projection horizon measured as a year fraction used in the expected shortfall calculation to obtain the maintenance margin. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: 0.000114077116130504 - corresponds to one hour expressed as year fraction | 0.000114077116130504 |
| `riskAversionParameter` | Probability confidence level used in expected shortfall calculation when obtaining the maintenance margin level. First, the value at risk, defined by confidence lambda is calculated. This is the cash amount that one would need to add to the position to make the probability of the value of the position and cash going negative after time tau to be less than lambda. The margin is then the expected loss of the position given that it incurred a loss bigger than the value at risk.<br/><br/> Accepted values: strictly greater than 0 and strictly smaller than 1 | 0.00001 |
| `param: mu` | Annualised growth rate of the underlying asset. <br/><br/>Accepted values: any real number | 0 |
| `param: r` | Annualised growth rate of the risk-free asset, it's used for discounting of future cash flows. Use 0.0 unless otherwise required. <br/><br/> Accepted values: any real number | 0.0 |
| `param: sigma` | Annualised historic volatility of the underlying asset. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: asset dependent, should be derived from the historical time-series of prices. | 0.8 (converts to 80%) |

### Liquidity SLA parameters 
The liquidity parameters set the requirements that liquidity providers on the market must meet in order to avoid being penalised and to earn fee revenue.

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| `liquiditySlaParameters` | Parameters for minimum requirements and measurements | |
| `priceRange` | Sets the percentage move up and down from the mid price that LPs must be within to count towards their commitment | 0.1 | 
| `commitmentMinTimeFraction` | The minimum fraction of time that LPs must spend on the book and within the price range | 0.1 | 
| `performanceHysteresisEpochs` | Sets the number of epochs over which past performance will continue to affect rewards. | 10 | 
| `slaCompetitionFactor` | Sets the maximum fraction of their accrued fees an LP that meets the SLA will lose to liquidity providers that achieved a higher SLA performance than them. | 0.2 | 

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.vega.xyz/proposals/propose/raw)
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="newPerpetualsMarket">
  <TabItem value="annotated" label="Annotated example">
    <NewPerpetualMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="Governance dApp (JSON)">
    <JSONInstructions />
    <NewPerpetualMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
    <TerminalInstructions />
    <NewPerpetualMarketCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <TerminalInstructions />
    <NewPerpetualMarketWin />
  </TabItem>
</Tabs>

## Voting
All proposals are voted on by the community. 

Building support is down to you. Share your proposal in the [_Governance_ section ↗](https://community.vega.xyz/c/governance) on the Vega community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minVoterBalance" formatter="governanceToken" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated to their Vega key.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.