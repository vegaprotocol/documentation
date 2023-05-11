---
sidebar_position: 2
title: Propose updates to a market
hide_title: false
vega_network: MAINNET
toc: true
keywords:
  - proposal
  - governance
  - updateMarket
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import UpdateMarketAnnotated from './_generated-proposals/_updateMarket_annotated.md';
import UpdateMarketJSON from './_generated-proposals/_updateMarket_json.md';
import UpdateMarketCMD from './_generated-proposals/_updateMarket_cmd.md';
import UpdateMarketWin from './_generated-proposals/_updateMarket_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Make changes to an existing market.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>
* A minimum equity-like share in the market of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" hideName={true} />
* Familiarity with [governance on Vega](../../concepts/governance.md), particularly off-chain activities

## Anatomy of an update market proposal

The update market proposal requires the same fields as a new market proposal. See the descriptions in the [new market proposal tutorial](new-market-proposal.md#anatomy-of-a-market-proposal) for more on each field.

In addition to the parameters you want to change, you must include all existing parameters from the original new market proposal, even if they are not being changed.

### Locked fields

The following fields, which you might recognise from new market proposals, are immutable and cannot be changed. They are not included in the [proposal templates](#templates-and-submitting).

- `decimalPlaces`
- `positionDecimalPlaces`
- `name`
- `settlementAsset`

### Thresholds

Note that some network parameters may differ, such as the limits on how long the voting period can last, as follows.

| Field                 | Description                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closingTimestamp`    | Timestamp (Unix time in seconds) when voting closes for this proposal. The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when proposal gets enacted (if passed). The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string)         |

## Templates and submitting

In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example that can be used to [submit on the governance dApp ↗](https://governance.vega.xyz/proposals/propose/raw), and command line examples for different operating systems. **You'll need to replace the example data with the relevant details before submitting.**

<Tabs groupId="updateMarket">
  <TabItem value="annotated" label="Annotated example">
    <UpdateMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="Governance dApp (JSON)">
    <JSONInstructions />
    <UpdateMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
    <TerminalInstructions />
    <UpdateMarketCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <TerminalInstructions />
    <UpdateMarketWin />
  </TabItem>
</Tabs>

## Voting and enactment
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minVoterBalance" formatter="governanceToken" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.

Building support is down to you. Share your proposal in [the _Update Market Proposals_ forum ↗](https://community.vega.xyz/c/governance/25) on Vega community, being sure to follow the [post guide ↗](https://community.vega.xyz/t/guide-to-update-market-proposals/4178). You may also wish to share on [Discord ↗](https://vega.xyz/discord).

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.
