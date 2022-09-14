---
sidebar_position: 4
title: Propose new asset
hide_title: false
vega_network: TESTNET
keywords:
- proposal
- governance
- newAsset
---
import NetworkParameter from '@site/src/components/NetworkParameter';

import NewAssetAnnotated from './_generated-proposals/_newAsset_annotated.md';
import NewAssetJSON from './_generated-proposals/_newAsset_json.md';
import NewAssetCMD from './_generated-proposals/_newAsset_cmd.md';
import NewAssetWin from './_generated-proposals/_newAsset_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose a new asset
This page provides a tutorial for submitting a proposal for a new ERC-20 asset to be used as collateral. It describes what can be proposed, what you need to propose a new asset, and provides proposal templates that you will need to edit before submitting.

## Overview
Vega currently supports adding [ERC-20 assets ↗](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#top). ERC-20 assets that pass a governance vote can be enabled [via the Vega bridge](../../api/bridge/index.md) - which is to say that they are deposited from and withdrawn to Ethereum. More token standards and chains are on the roadmap.

:::tip Query for data
You can see all of the currently supported assets [using the REST endpoint](../../api/rest/data-v2/trading-data-service-list-assets) or [the 'assets' GraphQL query](../../graphql/queries/assets).
:::

If an asset that you would like to see on the network is not already available, a governance proposal can be made to list the asset. 

If the vote passes, the network validators will then enable the asset on the [bridge contract](../../api/bridge/contracts/ERC20_Bridge_Logic#tag/TradingDataService/operation/TradingDataService_ERC20WithdrawalApproval) which will enable deposits and withdrawals for that token.

## ERC-20 asset validation
When adding an ERC-20 asset to the bridge, the key details are compared to the smart contract on Ethereum. Specifically:
- The **name** and **symbol** must match
- The contract **must** be an ERC-20 asset
- There cannot be multiple assets on a Vega network for the same ERC-20 asset

Validation happens according to the `validationTimestamp` parameter. In most situations, this should be early on in the voting period so that any validation errors are caught before token holders start voting. However you could push the validation later if the contract is not yet deployed.

## Proposing: What you need to know
1. The full annotated example is there to guide you through what is needed for each field in the proposal.
2. Be sure to have your Vega wallet name and public key ready, and have your wallet connected when you submit.
3. To submit a proposal you will need at least <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minProposerBalance" hideName={true} suffix="tokens" />, associated with the public key you're using to propose the asset. Note, this amount is set through the network parameter `governance.proposal.asset.minProposerBalance`.
4. Before proposing, read about:
   * [Governance lifecycle](../../concepts/vega-protocol#lifecycle-of-a-governance-proposal): Learn about the off-chain and on-chain steps for crafting, sharing, and submitting proposals.
   * [Assets at a protocol level](../../concepts/vega-protocol#assettoken-management)

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
