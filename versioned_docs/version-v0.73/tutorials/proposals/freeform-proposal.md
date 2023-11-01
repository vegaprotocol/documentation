---
sidebar_position: 12
title: Request a freeform change
hide_title: true
vega_network: MAINNET
keywords:
- proposal
- governance
- newFreeform
- updateNetworkParameter
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

# Create a freeform proposal
Freeform proposals allow the community to propose and vote on matters which don't change any of the behaviour of the currently running Vega blockchain.

At enactment time, no changes are effected on the system, but the record of how token holders voted will be stored on chain. 

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [governance on Vega](../../concepts/governance.md)

## Templates and submitting

In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

**Replace the example data with the relevant details.**

<Tabs groupId="newFreeform">
  <TabItem value="annotated" label="Annotated example">
    <NewFreeformAnnotated />
  </TabItem>
  <TabItem value="json" label="Governance dApp (JSON)">
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
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minVoterBalance" suffix="tokens" hideName={true} />, associated to their Vega key. 

Your proposal will need [participation](../../concepts/governance.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredParticipation" formatter="percent" hideName={true} /> and a voting majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.
