---
sidebar_position: 3
title: Propose a network parameter change
vega_network: MAINNET
hide_title: false
keywords:
- proposal
- governance
- updateNetworkParameter
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import UpdateNetworkParameterAnnotated from './_generated-proposals/_updateNetworkParameter_annotated.md';
import UpdateNetworkParameterJSON from './_generated-proposals/_updateNetworkParameter_json.md';
import UpdateNetworkParameterCMD from './_generated-proposals/_updateNetworkParameter_cmd.md';
import UpdateNetworkParameterWin from './_generated-proposals/_updateNetworkParameter_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Network parameters are a constant (or an array of constants) in the system, the values of which can be changed by on-chain governance.

This page describes what you need to propose a change to a network parameter, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" formatter="governanceToken" hideName={true} suffix="tokens"/> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" formatter="governanceToken" hideName={true} suffix="tokens"/>
* Familiarity with [governance on Vega](../../concepts/governance.md), particularly [network parameter governance](../../concepts/governance.md#network-parameter-governance)

## Anatomy of a network parameter proposal
The key inputs on a network parameter proposal are as follows.

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the asset proposal.

**Key** is the name of the network parameter that you are proposing a change to.

**Value** is the new value you're proposing that the network parameter should have.

## Templates and submitting
In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example, and command line examples for different operating systems. The Governance dApp has a [tool to help you put together a Network Parameter update proposal](https://governance.fairground.wtf/proposals/propose/network-parameter). When you have your proposal ready you can [submit it on the governance dApp](https://governance.vega.xyz/proposals/propose/raw). 

<Tabs groupId="updateNetworkParameter">
  <TabItem value="annotated" label="Annotated example">
    <UpdateNetworkParameterAnnotated />
  </TabItem>
  <TabItem value="json" label="Governance dApp (JSON)">
		<JSONInstructions />
		<UpdateNetworkParameterJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
		<TerminalInstructions />
		<UpdateNetworkParameterCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
		<TerminalInstructions />
		<UpdateNetworkParameterWin />
  </TabItem>
</Tabs>

## Voting and enactment
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key. 

Your proposal will need [participation](../../concepts/governance.md#how-a-proposals-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.

Building support is down to you. Share your proposal in [the _Network Parameter Proposals_ forum ↗](https://community.vega.xyz). You may also wish to share on [Discord ↗](https://vega.xyz/discord).

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.