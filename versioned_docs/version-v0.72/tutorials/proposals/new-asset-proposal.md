---
sidebar_position: 4
title: Propose new asset
hide_title: false
vega_network: MAINNET
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
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [governance on Vega](../../concepts/governance.md), particularly [assets at a protocol level](../../concepts/governance.md#asset-governance)

You should also share your proposal idea in the [_Asset Proposals_ forum ↗](https://community.vega.xyz/c/governance/asset-proposals/29) before submitting it to the network.

After a new asset vote passes, the change has to be submitted to the asset bridge on Ethereum. Until it has been submitted, no one can start depositing that asset. See the [tutorial](./update-asset-bridge.md) for how to do that.

## Overview
Vega currently supports adding [ERC-20 assets ↗](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#top). ERC-20 assets that pass a governance vote can be enabled [via the Vega bridge](../../api/bridge/index.md) - which is to say that they are deposited from and withdrawn to Ethereum. More token standards and chains are on the roadmap.

:::tip Query for data
You can see all of the currently supported assets [using the REST endpoint](../../api/rest/data-v2/trading-data-service-list-assets).
:::

If an asset that you would like to see on the network is not already available, a governance proposal can be made to list the asset. 

If the vote passes, the network validators will then enable the asset on the [bridge contract](../../api/bridge/contracts/ERC20_Bridge_Logic#tag/TradingDataService/operation/TradingDataService1_ERC20WithdrawalApproval) which will enable deposits and withdrawals for that token.

## Anatomy of a new asset proposal
The key inputs on a new asset proposal are as follows.

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new market.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the asset proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `name` | Name of the asset (string) | Testnet DAI |
| `symbol` | Symbol of the asset (string)  | tDAI |
| `decimals` | Number of decimal / precision handled by this asset (string)  | 18 |
| `quantum` | The minimum economically meaningful amount of the asset (string). This should be the amount of the asset roughly equal to 1 USD. It is used in a number of ways by the protocol but only requires precision to an order of magnitude level.  For example, if one BTC = 26,583 USD, then in this case a quantum of 1 / 25,000 or 0.00004 is sufficient. Converted to asset decimals it would be 40000000000000. | 1000000000000000000 |
| `withdrawThreshold` | The maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay, which can be seen on the ERC-20 bridge per asset. Setting this to 1 means all withdrawals will be subject to the delay. It's measured in asset decimals, so 1 is the smallest increment of the market's asset. | 1 |
| `lifetimeLimit` | The lifetime deposit limit per public key, in asset decimals. Users are able to opt out of this functionality using the `exempt_depositor` write function on the ERC20 contract if they wish to. Suggested value: equivalent of 10,000 USD | 10000000000000000000000 |

## ERC-20 asset validation
When adding an ERC-20 asset to the bridge, the key details are compared to the smart contract on Ethereum. Specifically:
- The **name** and **symbol** must match
- The contract **must** be an ERC-20 asset
- There cannot be multiple assets on a Vega network for the same ERC-20 asset

Validation happens according to the `validationTimestamp` parameter.  The validation timestamp must be within the range between 1 second and 2 days from the time of submission. In most situations, this should be early on in the voting period so that any validation errors are caught before token holders start voting. However you could push the validation later in that range if the contract is not yet deployed. 

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be shared with the community and then submitted with the [governance dApp ↗](https://governance.vega.xyz/proposals/propose/raw)
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="newAssetProposal">
  <TabItem value="annotated" label="Annotated example">
    <NewAssetAnnotated />
  </TabItem>
  <TabItem value="json" label="Governance dApp (JSON)">
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

## Voting
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minVoterBalance" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key. 

Your proposal will need [participation](../../concepts/governance.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Building support is down to you. Share your proposal in [the _Asset Proposals_ section ↗](https://community.vega.xyz/c/governance/asset-proposals/29) on the community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment 
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.
