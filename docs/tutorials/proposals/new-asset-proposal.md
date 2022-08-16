---
title: Propose new asset
hide_title: false
keywords:
- proposal
- governance
- newFreeform
- updateNetworkParameter
---

import NewAssetAnnotated from './_generated-proposals/_newAsset_annotated.md';
import NewAssetJSON from './_generated-proposals/_newAsset_json.md';
import NewAssetCMD from './_generated-proposals/_newAsset_cmd.md';
import NewAssetWin from './_generated-proposals/_newAsset_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose a new asset

Vega currently supports 2 asset types - internal assets, which are used for testing purposes, and ERC20 assets. ERC20 assets are supported [via the Vega bridge](../../api/bridge/index.md) - which is to say that they are deposited from and withdrawn to [Ethereum ↗](https://ethereum.org/). More token standards and chains are on the roadmap.

You can see [using the REST endpoint](../../api/rest/data-node/data#tag/TradingDataService/operation/TradingDataService_Assets) or [the 'assets' GraphQL query](../../graphql/queries/assets). This will show you all of the currently supported assets. If an asset that you would like to see on the network is not listed, a governance proposal can be made to list the asset. If and when the vote passes, the network validators will then [enable the asset on the bridge contract](../../api/bridge/contracts/ERC20_Bridge_Logic#tag/TradingDataService/operation/TradingDataService_ERC20WithdrawalApproval) which will enable deposits and withdrawals for that token.

Read more:
* [Assets at a protocol level](../../concepts/vega-protocol#assettoken-management)
* [Governance lifecycle](../../concepts/vega-protocol#lifecycle-of-a-governance-proposal): Learn about the off-chain and on-chain steps for crafting, sharing, and submitting proposals.

In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example, and command line examples for different operating systems, that you'll need to update with the relevant details before submitting.

<Tabs groupId="newAssetProposal">
  <TabItem value="annotated" label="Annotated example">
    <NewAssetAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <NewAssetJSON />
  </TabItem>
  <TabItem value="cmd" label="Linux / OSX command line">
    <NewAssetCMD />
  </TabItem>
  <TabItem value="win" label="Windows command line">
    <NewAssetWin />
  </TabItem>
</Tabs>
