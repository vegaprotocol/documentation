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

import NewMarketJSONInstrument from './_generated-proposals/_newMarket_json_instrument.md';
import NewMarketJSONLiquidityMonitoring from './_generated-proposals/_newMarket_json_liqparams.md';
import NewMarketJSONPriceMonitoring from './_generated-proposals/_newMarket_json_priceparams.md';
import NewMarketJSONOracle from './_generated-proposals/_newMarket_json_oracle.md';
import NewMarketJSONOverview from './_generated-proposals/_newMarket_json_overview.md';
import NewMarketJSONLiquidityCommitment from './_generated-proposals/_newMarket_json_liquidity.md';
import NewMarketAnnotated from './_generated-proposals/_newMarket_annotated.md';
import NewMarketJSON from './_generated-proposals/_newMarket_json.md';
import NewMarketCMD from './_generated-proposals/_newMarket_cmd.md';
import NewMarketWin from './_generated-proposals/_newMarket_win.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page provides a tutorial for submitting a proposal for a new market. 

Below you'll find:
* Descriptions of the market proposal fields and requirements
* What you need to submit a governance proposal
* Full annotated proposal for guidance
* Command line proposal you can copy and amend to propose using a CLI
* JSON proposal you can copy and amend to propose via the token dApp

<!--[Update an existing market](#update-an-existing-market): change the details of a market that is already enacted.-->

## Anatomy of a market proposal
The proposal for creating a new market has been divided up into sections to provide more details on what you need to submit.

There are a number of fields required for proposing a market, to ensure that it has all the necessary details and research behind it to be a well-functioning market. 

The general shape is as follows:
<NewMarketJSONOverview />

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new market.

Instrument, liquidity monitoring parameters, price monitoring parameters, oracles, and liquidity commitment are all described in more detail below.

Rationale requires a description, which is a free-text field that describes the purpose of the proposal. Include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the market.

Decimal places need to be defined for both order sizes and the market.
* `decimalPlaces` - sets the smallest price increment on the book
* `positionDecimalPlaces` - sets how big the smallest order / position on the market can be

Timestamps are required for ending the voting period, as well as enacting the market. The time between closing and enactment also defines how long an opening auction will be, which must be smaller than/equal to the difference between `maxClose` and `maxEnact`.
* `closingTimestamp` - Time when voting closes for the proposal. It must be expressed in Unix time in seconds, and must be constrained by `minClose` and `maxClose` network parameters.
* `enactmentTimestamp` - Time and date when the market will be enacted (ready for trading). It must be expressed in Unix time in seconds, and must be between the  `minEnact` and `maxEnact` network parameters.

### Instrument
The instrument shape is as follows, see below for a description of each property:
<NewMarketJSONInstrument />

An instrument contains the following properties:
* Name: a string for the  market name. Best practice is to include a full and fairly descriptive name for the instrument. Example: BTC/USD DEC18
* Instrument code: This is a shortcode used to easily describe the instrument (e.g: FX:BTCUSD/DEC18). The more information you add, the easier it is for people to know what the market offers 
* Future is an object that provides details about the futures market to be proposed
* Settlement asset: This requires the ID of the asset that the market will be margined in and settle in. You can get a list of supported assets by querying REST, GraphQL, or gRPC, and then selecting the asset ID
* Quote name: The quote name is the human-readable name/abbreviation of the settlement asset. Example: In BTCUSD, USD is the quote
* Settlement price decimals: The number of decimal places implied by the settlement price, emitted by the settlement oracle
* Oracle spec for settlement price: This defines the data source that will be used to identify the settlement price when the market expires
* Oracle spec for trading termination: The fields that define the oracle used for terminating trading on the market
* Oracle spec binding: The fields describe how specific information provided by the oracle data is used. For example, they can identify the specific name of the settlement price output, or the specific name of the trading termination property
*  
For easy reading, the oracle filters are separated out - see [Oracle bindings](#oracle-bindings) below to see the fields for specifying oracle data.

### Oracle bindings
Oracle feeds can be used to terminate trading and settle markets. See below for a full description of each field. An oracle spec binding looks like this:

<NewMarketJSONOracle/>

Oracle bindings require the following properties: 
* Pub keys: Public key(s) that can sign and submit values for this oracle
* Filters: Filters define which oracle data is of importance for the purposes of the type of governance proposal
* Key: Defines the specific type of information the oracle provides that are is relevant to the proposed market. Example: If an oracle provides a list of prices for various markets, focus only on the specific relevant price for the market
* Name: Specific name of the information that the filter provides. For example, prices.ETH.value
* Type: Specifies the data type that is emitted. For example, for the prices.ETH.value, the type is an integer, as it is output as a non-fractional number
* Conditions: A filter for the oracle data. The conditions that should to be matched by the data to be considered. This is an optional set of fields. For example you could use an operator and a value to denote that a price should be greater than zero
* Operator: This adds a constraint to the value, such as LESS_THAN, GREATER_THAN. For example if you wanted to ensure that the price would always be above zero, you would set the operator to ‘GREATER_THAN’ and the Value to be ‘0’
* Value: A number that is constrained by the operator

:::info Submitting oracle data
Learn how to find and submit oracle data in the [submitting oracles tutorial](../using-oracle-data.md).
:::

### Liquidity monitoring
The liquidity monitoring settings detect when the market's liquidity drops below the safe level, and as such when to launch a 'liquidity seeking' auction. See below for more details on each field.

<NewMarketJSONLiquidityMonitoring />

Liquidity monitoring uses the following properties: 
* Target stake parameters: Target stake parameters are derived from open interest history over a time window to calculate the maximum open interest. 
* Time window: Defines the length of time over which open interest is measured. If empty, this field defaults to the network parameter `market.stake.target.timeWindow` Example: 1h0m0s
* Scaling factor: This must be set within the range defined by the network parameter `market.stake.target.scalingFactor`, and defines the scaling between the liquidity demand estimate, based on open interest and target stake. The scaling factor must be a number greater than zero and finite
* Triggering ratio: Specifies the triggering ratio for entering liquidity auction. If empty, the network will default to the network parameter `market.liquidity.targetstake.triggering.ratio`
* Auction extension: Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction. If empty, the network will default to the network parameter `market.monitor.price.defaultParameters`

### Price monitoring
Price monitoring parameters are optional, and configure the acceptable price movement bounds for price monitoring. <!--If you leave these blank, they will default to whatever the network-wide parameters are set as.--> See below for more details on each field.

<NewMarketJSONPriceMonitoring />

Price monitoring uses the following properties: 
* Horizon: Price monitoring projection horizon τ in seconds (set as >0)
* Probability: Price monitoring probability level p (set as >0 and <1)
* Auction extension in seconds: Price monitoring auction extension duration in seconds should the price breach its theoretical level over the specified horizon at the specified probability level (set as >0)

## Proposing: What you need to know
1. The full annotated example is there to guide you through what is needed for each field in the proposal.
2. Be sure to have your Vega wallet name and public key ready, and have your wallet connected when you submit.
3. To submit a proposal you will need:
   * At least <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideName={true} suffix="tokens" />, associated with the public key you're using to propose the market. Note, this amount is set through the network parameter `governance.proposal.market.minProposerBalance`.
4. Before proposing, read about:
   * [Governance lifecycle](../../concepts/vega-protocol#lifecycle-of-a-governance-proposal): Learn about the off-chain and on-chain steps for crafting, sharing, and submitting proposals.
   * [Market governance](../../concepts/vega-protocol#market-governance): More details about market governance and the fields required.
:::info
Learn about the full governance lifecycle, includng how to get voter support for your proposal, in the [governance concepts](../../concepts/vega-protocol#governance).
:::

### Submit using command line
1. To create your own proposal and submit it using the command line, copy the command line example into a text editor and include the values you want for the market.
2. Use the command line to submit your proposal.
3. You can see your proposal on the [Fairground block explorer](https://explorer.fairground.wtf/governance).
4. Your proposal will need enough voting weight to pass, so having community support of your proposal is essential.

### Submit using token dApp
1. To create your own proposal and submit with the token dApp, copy the JSON example into a text editor and include the values you want for the market.
2. Use the token dApp's [Governance page](https://token.fairground.wtf/governance) to submit your proposal. 
3. You can see your proposal on the token dApp governance page.
4. Your proposal will need enough voting weight to pass, so having community support of your proposal is essential.


## Full proposal examples
In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example that can be used to submit on the token dApp, and command line examples for different operating systems. **You'll need to replace the example data with the relevant details before submitting.**

<Tabs groupId="newMarket">
  <TabItem value="annotated" label="Annotated example">
    <NewMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <NewMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Linux / OSX command line">
    <NewMarketCMD />
  </TabItem>
  <TabItem value="win" label="Windows command line">
    <NewMarketWin />
  </TabItem>
</Tabs>
