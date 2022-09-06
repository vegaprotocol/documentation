---
sidebar_position: 6
title: Freeform proposal
hide_title: false
vega_network: TESTNET
keywords:
- proposal
- governance
- newFreeform
- updateNetworkParameter
- newAsset
- newMarket
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import NewFreeformAnnotated from './_generated-proposals/_newFreeform_annotated.md';
import NewFreeformJSON from './_generated-proposals/_newFreeform_json.md';
import NewFreeformCMD from './_generated-proposals/_newFreeform_cmd.md';
import NewFreeformWin from './_generated-proposals/_newFreeform_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a freeform proposal
Freeform proposals allow the community to vote on matters which don't change any of the behaviour of the currently running Vega blockchain.

At enactment time, no changes are effected on the system, but the record of how token holders voted will be stored on chain. 

## Requirements

You will need:

- A connected [Vega wallet](/docs/tools/vega-wallet/index.md), with your wallet name and public key to hand
- A minimum of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minProposerBalance" hideName={true} suffix="tokens"/> associated with that public key
- Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance)

## Templates

You can submit your proposal via the command line, or via the token dApp in your web browser.

<Tabs groupId="newFreeform">
  <TabItem value="annotated" label="Annotated example">
    <NewFreeformAnnotated />
  </TabItem>
  <TabItem value="json" label="Token dApp (JSON)">
    <NewFreeformJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
    <NewFreeformCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <NewFreeformWin />
  </TabItem>
</Tabs>

## Voting and enactment

All proposals are voted on by the community. Community members need a minimum of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.minVoterBalance" suffix="tokens" hideName={true} /> to vote. Your proposal will need participation of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.freeform.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Building support is down to you. Share your proposal in [the _Free Form Proposals_ forum](https://community.vega.xyz/c/fairground-testnet-governance/free-form-proposals-testnet/36) on Vega community. You may also wish to share on [Discord](https://vega.xyz/discord) and [Telegram](https://t.me/vegacommunity).

Proposal owners who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.