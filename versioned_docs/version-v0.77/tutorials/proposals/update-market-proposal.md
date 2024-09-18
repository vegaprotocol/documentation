---
sidebar_position: 2
title: Change a futures market
hide_title: true
vega_network: TESTNET
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
import Batch from './_batch-sample.md';

# Propose changes to futures market
Propose changes to an existing futures market.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: based on the network parameter values for <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />
* A minimum equity-like share in the market, to the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" />
* Familiarity with [market governance](../../concepts/governance/market.md)

## Anatomy of an update market proposal

The update futures market proposal requires the same fields as a new futures market proposal. See the descriptions in the [new market proposal tutorial](new-market-proposal.md#anatomy-of-a-market-proposal) for more on each field.

In addition to the parameters you want to change, you must include all existing parameters from the original new market proposal, even if they are not being changed.

### Locked fields

The following fields, which you might recognise from new market proposals, are immutable and cannot be changed. They are not included in the [proposal templates](#templates-and-submitting).

- `decimalPlaces`
- `positionDecimalPlaces`
- `name`
- `settlementAsset`

### Thresholds

Note that some network parameters may differ, such as the limits on how long the voting period can last, as follows.

| Field                 | Description           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closingTimestamp`    | Timestamp (Unix time in seconds) when voting closes for this proposal. The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when proposal gets enacted (if passed). The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string)         |

## Submitting proposals in a batch

<Batch />

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="updateMarket">
  <TabItem value="annotated" label="Annotated example">
    <UpdateMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON">
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

## Voting
All proposals are voted on by the community. 

To vote, community members need, at a minimum, the larger of the values of the following network parameters <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minVoterBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-the-outcome-is-calculated) determined by the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredParticipation" /> and a majority to the value of the parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredMajority" />.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.