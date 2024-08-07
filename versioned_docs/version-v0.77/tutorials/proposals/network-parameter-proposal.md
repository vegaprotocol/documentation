---
sidebar_position: 4
title: Change network parameter
vega_network: MAINNET
hide_title: true
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
import Batch from './_batch-sample.md';

# Propose a network parameter change

Network parameters are a constant (or an array of constants) in the system, the values of which can be changed by on-chain governance.

This page describes what you need to propose a change to a network parameter, and provides proposal templates that you will need to edit before submitting.

<!--You should also share your proposal idea in the [_Governance_ forum section ↗](https://community.vega.xyz/c/governance) before submitting it to the network.-->

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [governance on Vega](../../concepts/governance/network-parameter.md)

## Anatomy of a network parameter proposal
Read on for the key inputs to a network parameter proposal.

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the asset proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

**Key** is the name of the network parameter that you are proposing a change to.

**Value** is the new value you're proposing that the network parameter should have.

Some network parameters include multiple pieces of information in one value. Changes to one of those network parameters needs to include the correct formatting. You can see how the existing value is formatted on [Explorer ↗](https://explorer.vega.xyz/network-parameters).

For example, a proposal to change the `rewards.activityStreak.benefitTiers` network parameter would include a value that looks like the following, using escaped JSON:

```json title="Code sample for multiple values"
"value": 
" { \"tiers\": [ 
    { \"minimum_activity_streak\": 1, 
      \"reward_multiplier\": \"1.05\", 
      \"vesting_multiplier\": \"1.05\" }, 
    { \"minimum_activity_streak\": 2, 
      \"reward_multiplier\": \"1.10\", 
      \"vesting_multiplier\": \"1.10\" }, 
    { \"minimum_activity_streak\": 3, 
      \"reward_multiplier\": \"1.20\", 
      \"vesting_multiplier\": \"1.20\" } 
  ]
}"
```

## Submitting proposals in a batch

<Batch />


## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

The governance dApp has a [tool ↗](https://governance.fairground.wtf/proposals/propose/network-parameter) to help you build a network parameter proposal. 

**Replace the example data with the relevant details before submitting.**

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

## Voting
All proposals are voted on by the community. 

<!--
Building support is down to you. Share your proposal in the [_Governance_ section ↗](https://community.vega.xyz/c/governance) on the Vega community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).
-->

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key. 

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-a-proposals-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.