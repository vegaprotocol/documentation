---
sidebar_position: 4
title: Change network parameter
vega_network: TESTNET
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

Network parameters are a constant (or an array of constants), the values of which can be changed by on-chain governance.

This page describes what you need to propose a change to a network parameter, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key, based on the network parameter values for <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />
* Familiarity with [governance on Vega](../../concepts/governance/network-parameter.md)

## Anatomy of a network parameter proposal
Read on for the key inputs to a network parameter proposal.

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the asset proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

**Key** is the name of the network parameter that you are proposing a change to.

**Value** is the new value you're proposing that the network parameter should have.

Some network parameters include multiple pieces of information in one value. Changes to one of those network parameters needs to include the correct formatting.

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
* JSON example
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="updateNetworkParameter">
  <TabItem value="annotated" label="Annotated example">
    <UpdateNetworkParameterAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON">
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

To vote, community members need, at a minimum, the larger of the values of the following network parameters: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minVoterBalance" />, or <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> associated with their Vega key. 

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-a-proposals-outcome-is-calculated) determined by the value of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredParticipation" /> and a majority determined by the value of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredMajority" />.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.