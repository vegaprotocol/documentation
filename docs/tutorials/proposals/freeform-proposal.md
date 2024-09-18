---
sidebar_position: 12
title: Request a freeform change
hide_title: true
vega_network: TESTNET
keywords:
- proposal
- governance
- newFreeform
- newAsset
- newMarket
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import NewFreeformAnnotated from './_generated-proposals/_newFreeform_annotated.md';
import NewFreeformJSON from './_generated-proposals/_newFreeform_json.md';
import NewFreeformCMD from './_generated-proposals/_newFreeform_cmd.md';
import NewFreeformWin from './_generated-proposals/_newFreeform_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Batch from './_batch-sample.md';

# Create a freeform proposal
Freeform proposals allow the community to propose and vote on matters which don't change any network behaviour.

At enactment time, no changes are effected on the system, but the record of how token holders voted will be stored on chain. 

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key, taken from the values of the network parameters <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />
* Familiarity with [governance on Vega](../../concepts/governance/index.md)

## Submitting proposals in a batch
<Batch />

## Templates and submitting

In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example
* Command line examples for different operating systems

**Replace the example data with the relevant details.**

<Tabs groupId="newFreeform">
  <TabItem value="annotated" label="Annotated example">
    <NewFreeformAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON">
    <JSONInstructions />
    <NewFreeformJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
    <TerminalInstructions />
    <NewFreeformCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <TerminalInstructions />
    <NewFreeformWin />
  </TabItem>
</Tabs>

## Voting
Proposals are voted on by the community. 

To vote, community members need, at a minimum, the larger of the following network parameters <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> or <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minVoterBalance" />, associated to their Vega key. 

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-a-proposals-outcome-is-calculated) of the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredParticipation" /> and a voting majority based on the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredMajority" />, so having community support is essential.