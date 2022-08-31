---
sidebar_position: 2
title: Propose an update to a market
hide_title: false
vega_network: TESTNET
toc: true
keywords:
- proposal
- governance
- updateMarket
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import UpdateMarketAnnotated from './_generated-proposals/_updateMarket_annotated.md';
import UpdateMarketJSON from './_generated-proposals/_updateMarket_json.md';
import UpdateMarketCMD from './_generated-proposals/_updateMarket_cmd.md';
import UpdateMarketWin from './_generated-proposals/_updateMarket_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Update an existing market
Participants with enough equity-like share of a market can propose changes to some market properties via governance using the `updateMarket` proposal. This is similar to the `newMarket` proposal, but most fields are not required.

:::info
Only participants with the minimum equity-like share of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" hideName={true} formatter="percent"/> can propose a change to a market. The minimum is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" hideValue={true} />.
:::

See the descriptions in the [propose a new market](#propose-a-new-market) for more on each field.

<Tabs groupId="updateMarket">
  <TabItem value="annotated" label="Annotated example">
    <UpdateMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <UpdateMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Linux / OSX command line">
    <UpdateMarketCMD />
  </TabItem>
  <TabItem value="win" label="Windows command line">
    <UpdateMarketWin />
  </TabItem>
</Tabs>
