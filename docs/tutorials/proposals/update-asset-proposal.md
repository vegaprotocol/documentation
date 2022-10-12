---
sidebar_position: 4
title: Propose updates to an asset
hide_title: false
vega_network: TESTNET
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

- A connected [Vega wallet](/docs/tools/vega-wallet/index.md), with your wallet name and public key to hand
- A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minProposerBalance" hideName={true} suffix="tokens"/> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true}  formatter="governanceToken" suffix="tokens"/>
- Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance), particularly [assets at a protocol level](../../concepts/vega-protocol#assettoken-management)
- After an asset update vote passes, the change has to be submitted to the [asset bridge](../../concepts/vega-protocol#assettoken-management) on Ethereum.

## Overview

## Templates and submitting

In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example that can be used to submit on the token dApp, and command line examples for different operating systems. **You'll need to replace the example data with the relevant details before submitting.**

<Tabs groupId="updateAssetProposal">
  <TabItem value="annotated" label="Annotated example">
    <UpdateAssetAnnotated />
  </TabItem>
  <TabItem value="json" label="Token dApp (JSON)">
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

## Voting and enactment

All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key.

Your proposal will need [participation](../../concepts/vega-protocol#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.asset.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.

Building support is down to you. Share your proposal in [the Fairground governance forum](https://community.vega.xyz/c/fairground-testnet-governance/32) on Vega community. You may also wish to share on [Discord](https://vega.xyz/discord).

Proposal owners who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.
