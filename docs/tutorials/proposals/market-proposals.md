---
title: Market proposals
hide_title: false
toc: true
keywords:
- proposal
- governance
- newMarket
---

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
   * 1 (ropsten) Vega token to submit the proposal 
   * enough of the settlement asset (testnet) available to place the liquidity commitment that you have built in the proposal.
5. Copy the command shown in the 'command line' tab, edit the fields for your wallet name and pub key, and replace the sample market proposal details with yours
6. Use the command line to submit your proposal.
7. You can see your proposal on the [Fairground block explorer](https://explorer.fairground.wtf/governance).

## Propose a new market

### Overview
There are a lot of details required for proposing a market. The general shape is as follows:
<NewMarketJSONOverview/>

### Oracle bindings
Oracle feeds can be used to terminate trading and settle markets. An oracle spec binding looks like this:
<NewMarketJSONOracle/>

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

