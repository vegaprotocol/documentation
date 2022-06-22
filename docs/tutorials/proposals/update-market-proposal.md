---
title: Propose an update to a market
hide_title: false
toc: true
keywords:
- proposal
- governance
- updateMarket
---

import UpdateMarketAnnotated from './_generated-proposals/_updateMarket_annotated.md';
import UpdateMarketJSON from './_generated-proposals/_updateMarket_json.md';
import UpdateMarketCMD from './_generated-proposals/_updateMarket_cmd.md';
import UpdateMarketWin from './_generated-proposals/_updateMarket_win.md';

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
  <TabItem value="cmd" label="Linux / OSX">
    <UpdateMarketCMD />
  </TabItem>
  <TabItem value="win" label="Windows">
    <UpdateMarketWin />
  </TabItem>
</Tabs>