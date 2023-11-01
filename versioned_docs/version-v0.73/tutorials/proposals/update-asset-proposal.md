---
sidebar_position: 5
title: Update an asset
hide_title: true
vega_network: MAINNET
keywords:
  - proposal
  - governance
  - updateAsset
tags:
  - governance
  - asset
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import UpdateAssetAnnotated from './_generated-proposals/_updateAsset_annotated.md';
import UpdateAssetJSON from './_generated-proposals/_updateAsset_json.md';
import UpdateAssetCMD from './_generated-proposals/_updateAsset_cmd.md';
import UpdateAssetWin from './_generated-proposals/_updateAsset_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose an update to an asset

Some of the properties of an asset can be changed through governance. Those fields are: withdrawal and deposit limits, and the asset's quantum.

The underlying contract, asset name and symbol cannot be changed.

## Requirements

You will need:

* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)- Familiarity with [governance on Vega](../../concepts/governance.md), particularly [assets at a protocol level](../../concepts/governance.md#asset-governance)

After a new asset vote passes, the change has to be submitted to the asset bridge on Ethereum. See the [tutorial](./update-asset-bridge.md) for how to do that.

## Anatomy of an update asset proposal
The key inputs on an update asset proposal are as follows.

In addition to the parameters you want to change, you must include the existing parameters from the original new asset proposal, even if they are not being changed.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the asset proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `asset ID` | Unique Vega ID for the asset (string) | |
| `quantum` | The minimum economically meaningful amount of the asset (string). This should be the amount of the asset roughly equal to 1 USD. It is used in a number of ways by the protocol but only requires precision to an order of magnitude level.  For example, if one BTC = 26,583 USD, then in this case a quantum of 1 / 25,000 or 0.00004 is sufficient. Converted to asset decimals it would be 40000000000000. | 1000000000000000000 |
| `withdrawThreshold` | The maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay, which can be seen on the ERC-20 bridge per asset. Setting this to 1 means all withdrawals will be subject to the delay. It's measured in asset decimals, so 1 is the smallest increment of the market's asset. | 1 |
| `lifetimeLimit` | The lifetime deposit limit per public key, in asset decimals. Users are able to opt out of this functionality using the `exempt_depositor` write function on the ERC20 contract if they wish to. Suggested value: equivalent of 10,000 USD | 10000000000000000000000 |


## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="updateAssetProposal">
  <TabItem value="annotated" label="Annotated example">
    <UpdateAssetAnnotated />
  </TabItem>
  <TabItem value="json" label="Governance dApp (JSON)">
    <JSONInstructions />
    <UpdateAssetJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
    <TerminalInstructions />
    <UpdateAssetCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <TerminalInstructions />
    <UpdateAssetWin />
  </TabItem>
</Tabs>

## Voting

All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key.

Your proposal will need [participation](../../concepts/governance.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.