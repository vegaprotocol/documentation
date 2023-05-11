---
sidebar_position: 6
title: Freeform proposal
hide_title: false
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
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" formatter="governanceToken" hideName={true} suffix="tokens"/>
* Familiarity with [governance on Vega](../../concepts/governance.md)

## Templates and submitting

In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example, and command line examples for different operating systems. The Governance dApp has a [tool to help you put together a Freeform proposal](https://governance.fairground.wtf/proposals/propose/network-parameter). When you have your proposal ready you can [submit it on the governance dApp](https://governance.vega.xyz/proposals/propose/raw).

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

## Voting and enactment
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minVoterBalance" suffix="tokens" hideName={true} />, associated to their Vega key. 

Your proposal will need [participation](../../concepts/governance.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredParticipation" formatter="percent" hideName={true} /> and a voting majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Building support is down to you. Share your proposal in [the _Free Form Proposals_ forum ↗](https://community.vega.xyz/c/governance/25) on Vega community. You may also wish to share on [Discord ↗](https://vega.xyz/discord).

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.
