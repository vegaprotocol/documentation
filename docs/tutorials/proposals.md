---
title: Proposals by example
hide_title: false
keywords:
- proposal
- governance
- newFreeform
- updateNetworkParameter
- newAsset
- newMarket
---

import NewAssetAnnotated from './_generated-proposals/_newAsset_annotated.md';
import NewAssetJSON from './_generated-proposals/_newAsset_json.md';
import NewAssetCMD from './_generated-proposals/_newAsset_cmd.md';
import NewFreeformAnnotated from './_generated-proposals/_newFreeform_annotated.md';
import NewFreeformJSON from './_generated-proposals/_newFreeform_json.md';
import NewFreeformCMD from './_generated-proposals/_newFreeform_cmd.md';
import UpdateNetworkParameterAnnotated from './_generated-proposals/_updateNetworkParameter_annotated.md';
import UpdateNetworkParameterJSON from './_generated-proposals/_updateNetworkParameter_json.md';
import UpdateNetworkParameterCMD from './_generated-proposals/_updateNetworkParameter_cmd.md';
import NewMarketAnnotated from './_generated-proposals/_newMarket_annotated.md';
import NewMarketJSON from './_generated-proposals/_newMarket_json.md';
import NewMarketCMD from './_generated-proposals/_newMarket_cmd.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Proposals by example
You can read more about the lifecycle of a governance proposal in [the Concepts section](../concepts/vega-protocol#governance)

## New Freeform Proposal
The aim of this is to allow community to provide votes on proposals which don't change any of the behaviour of the currently running Vega blockchain. That is to say, at enactment time, no changes are effected on the system, but the record of how token holders voted will be stored on chain. 

<Tabs groupId="newFreeform">
  <TabItem value="annotated" label="Annotated example">
    <NewFreeformAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <NewFreeformJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line">
    <NewFreeformCMD />
  </TabItem>
</Tabs>


## Update a network parameter
Network parameters are a constant (or an array of constants) in the system whose values are able to be changed by on-chain governance. Here's how to propose a change to one.

<Tabs groupId="updateNetworkParameter">
  <TabItem value="annotated" label="Annotated example">
    <UpdateNetworkParameterAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <UpdateNetworkParameterJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line">
    <UpdateNetworkParameterCMD />
  </TabItem>
</Tabs>

## New asset (ERC20)
New assets can be proposed through the governance system.

<Tabs groupId="newAsset">
  <TabItem value="annotated" label="Annotated example">
    <NewAssetAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <NewAssetJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line">
    <NewAssetCMD />
  </TabItem>
</Tabs>

## New market
<Tabs groupId="newFreeform">
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
