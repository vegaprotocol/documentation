---
title: Propose an update to a market
hide_title: false
toc: true
keywords:
- proposal
- governance
- updateMarket
---

import NewMarketJSONInstrument from './_generated-proposals/_newMarket_json_instrument.md';
import NewMarketJSONLiquidityMonitoring from './_generated-proposals/_newMarket_json_liqparams.md';
import NewMarketJSONPriceMonitoring from './_generated-proposals/_newMarket_json_priceparams.md';
import NewMarketJSONOracle from './_generated-proposals/_newMarket_json_oracle.md';
import NewMarketJSONOverview from './_generated-proposals/_newMarket_json_overview.md';
import NewMarketJSONLiquidityCommitment from './_generated-proposals/_newMarket_json_liquidity.md';
import NewMarketAnnotated from './_generated-proposals/_newMarket_annotated.md';
import NewMarketJSON from './_generated-proposals/_newMarket_json.md';
import NewMarketCMD from './_generated-proposals/_newMarket_cmd.md';
import UpdateMarketAnnotated from './_generated-proposals/_updateMarket_annotated.md';
import UpdateMarketJSON from './_generated-proposals/_updateMarket_json.md';
import UpdateMarketCMD from './_generated-proposals/_updateMarket_cmd.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Update an existing market
Some parts of a market can be changed via governance using the `updateMarket` proposal. This is similar to the `newMarket` proposal, but most fields are not required.

See the descriptions in the [propose a new market](#propose-a-new-market) for 

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