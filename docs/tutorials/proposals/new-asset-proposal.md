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
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import NewAssetAnnotated from './_generated-proposals/_newAsset_annotated.md';
import NewAssetJSON from './_generated-proposals/_newAsset_json.md';
import NewAssetCMD from './_generated-proposals/_newAsset_cmd.md';
import NewAssetWin from './_generated-proposals/_newAsset_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose a new asset
This page provides a tutorial for submitting a proposal for a new ERC-20 asset to be used as collateral. It describes what can be proposed, what you need to propose a new asset, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minProposerBalance" hideName={true} suffix="tokens"/> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true}  formatter="governanceToken" suffix="tokens"/>
* Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance), particularly [assets at a protocol level](../../concepts/vega-protocol#assettoken-management)
- After a new asset vote passes, the change has to be submitted to the [asset bridge](../../concepts/vega-protocol#assettoken-management) on Ethereum. Until it has been submitted, no one can start depositing that asset.

## Overview
Vega currently supports adding [ERC-20 assets ↗](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#top). ERC-20 assets that pass a governance vote can be enabled [via the Vega bridge](../../api/bridge/index.md) - which is to say that they are deposited from and withdrawn to Ethereum. More token standards and chains are on the roadmap.

:::tip Query for data
You can see all of the currently supported assets [using the REST endpoint](../../api/rest/data-v2/trading-data-service-2-list-assets) or [the 'assets' GraphQL query](../../api/graphql/queries/assets).
:::

If an asset that you would like to see on the network is not already available, a governance proposal can be made to list the asset. 

If the vote passes, the network validators will then enable the asset on the [bridge contract](../../api/bridge/contracts/ERC20_Bridge_Logic#tag/TradingDataService/operation/TradingDataService1_ERC20WithdrawalApproval) which will enable deposits and withdrawals for that token.

## ERC-20 asset validation
When adding an ERC-20 asset to the bridge, the key details are compared to the smart contract on Ethereum. Specifically:
- The **name** and **symbol** must match
- The contract **must** be an ERC-20 asset
- There cannot be multiple assets on a Vega network for the same ERC-20 asset

Validation happens according to the `validationTimestamp` parameter. In most situations, this should be early on in the voting period so that any validation errors are caught before token holders start voting. However you could push the validation later if the contract is not yet deployed.

## Templates and submitting
In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example that can be used to submit on the token dApp, and command line examples for different operating systems. **You'll need to replace the example data with the relevant details before submitting.**

<Tabs groupId="newAssetProposal">
  <TabItem value="annotated" label="Annotated example">
    <NewAssetAnnotated />
  </TabItem>
  <TabItem value="json" label="Token dApp (JSON)">
		<JSONInstructions />
		<NewAssetJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
		<TerminalInstructions />
		<NewAssetCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
		<TerminalInstructions />
		<NewAssetWin />
  </TabItem>
</Tabs>

## Voting and enactment
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minVoterBalance" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key. 

Your proposal will need [participation](../../concepts/vega-protocol#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.

Building support is down to you. Share your proposal in [the Fairground governance forum](https://community.vega.xyz/c/fairground-testnet-governance/32) on Vega community. You may also wish to share on [Discord](https://vega.xyz/discord).

Proposal owners who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.
