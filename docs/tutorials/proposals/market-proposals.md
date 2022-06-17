---
title: Market proposals
hide_title: false
toc: true
keywords:
- proposal
- governance
- newMarket
---

import NewMarketJSONInstrument from './_generated-proposals/_newMarket_json_instrument.md';
import NewMarketJSONLiquidityMonitoring from './_generated-proposals/_newMarket_json_liqparams.md';
import NewMarketJSONPriceMonitoring from './_generated-proposals/_newMarket_json_priceparams.md';
import NewMarketJSONOracle from './_generated-proposals/_newMarket_json_oracle.md';
import NewMarketJSONOverview from './_generated-proposals/_newMarket_json_overview.md';
import NewMarketAnnotated from './_generated-proposals/_newMarket_annotated.md';
import NewMarketJSON from './_generated-proposals/_newMarket_json.md';
import NewMarketCMD from './_generated-proposals/_newMarket_cmd.md';
import UpdateMarketAnnotated from './_generated-proposals/_updateMarket_annotated.md';
import UpdateMarketJSON from './_generated-proposals/_updateMarket_json.md';
import UpdateMarketCMD from './_generated-proposals/_updateMarket_cmd.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Market proposals

Propose a new market on Fairground. 

1. The annotated example describes what is needed for each field in the proposal. 
2. To create your own proposal and submit it using the command line, you will need to copy the JSON example into a text editor, and edit it with the values you want for the market.
3. Connect to your Vega Wallet, and note your wallet name and public key.
4. To propose a market you will need:
   * 1 (ropsten) Vega token, staked to a validator, to submit the proposal 
   * enough of the settlement asset (testnet) available to place the liquidity commitment that you have built in the proposal.
5. Copy the command shown in the 'command line' tab, edit the fields for your wallet name and pub key, and replace the sample market proposal details with yours
6. Use the command line to submit your proposal.
7. You can see your proposal on the [Fairground block explorer](https://explorer.fairground.wtf/governance).

## Propose a new market

### Overview
There are a lot of details required for proposing a market. The contents of a changes object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new market.

The general shape is as follows:
<NewMarketJSONOverview />

### Decimal places
Decimal places need to be defined for both order sizes and the market.
  * The `decimalPlaces` field sets the smallest price increment on the book
  * The `positionDecimalPlaces` sets how big the smallest order / position on the market can be

### Instrument
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
For easy reading, the Oracle filters are separated out - see [Oracle bindings](#oracle-bindings) below to see the fields for specifying oracle data.

<NewMarketJSONInstrument />

#### Liquidity monitoring
<NewMarketJSONPriceMonitoring />

#### Price monitoring
<NewMarketJSONLiquidityMonitoring />

#### Oracle bindings
Oracle feeds can be used to terminate trading and settle markets. An oracle spec binding looks like this:
<NewMarketJSONOracle/>

* Pub keys: Public key(s) that can sign and submit values for this oracle
* Filters: Filters define which oracle data is of importance for the purposes of the type of governance proposal
* Key: Defines the specific type of information the oracle provides that are is relevant to the proposed market. Example: If an oracle provides a list of prices for various markets, focus only on the specific relevant price for the market
* Name: Specific name of the information that the filter provides. For example, prices.ETH.value
* Type: Specifies the data type that is emitted. For example, for the prices.ETH.value, the type is an integer, as it is output as a non-fractional number
* Conditions: A filter for the oracle data. The conditions that should to be matched by the data to be considered. This is an optional set of fields. For example you could use an operator and a value to denote that a price should be greater than zero
* Operator: This adds a constraint to the value, such as LESS_THAN, GREATER_THAN. For example if you wanted to ensure that the price would always be above zero, you would set the operator to ‘GREATER_THAN’ and the Value to be ‘0’
* Value: A number that is constrained by the operator

### Full example
<Tabs groupId="newMarket">
  <TabItem value="annotated" label="Annotated example">
    <NewMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <NewMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line">
    <NewMarketCMD />
  </TabItem>
</Tabs>

## Update an existing market
Some parts of a market can also be changed via governance using the `updateMarket` proposal. This is similar to the `newMarket` proposal, but (fortunately) most fields are not required if they are changed by the proposal.

<Tabs groupId="updateMarket">
  <TabItem value="annotated" label="Annotated example">
    <UpdateMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <UpdateMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line">
    <UpdateMarketCMD />
  </TabItem>
</Tabs>

