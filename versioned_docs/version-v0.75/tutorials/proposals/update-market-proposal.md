---
sidebar_position: 2
title: Change a futures market
hide_title: true
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
import Batch from './_batch-sample.md';

# Propose changes to futures market
Propose changes to an existing futures market.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* A minimum equity-like share in the market of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" hideName={true} />
* Familiarity with [market governance](../../concepts/governance/market.md) on Vega

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

## Submitting a verified settlement price
If a market proposal was submitted to accept a [community-verified price](new-market-proposal.md#submitting-a-verified-settlement-price), once that market has reached its termination time, you can submit an update to the market using the verified price.

Under `dataSourceSpecForSettlementData`:
* Set the `conditions` to `OPERATOR_EQUALS`, and set the verified price under `value` with the correct decimal precision based on the data source's decimal precision, which should also match `numberDecimalPlaces`
* Set the `time` to be the same as this proposal's `enactmentTimestamp`

Once the proposal passes the governance vote, the nominated Vega key (`dataSourceSpecForSettlementData` -> `signers` -> `pubkey`) will need to [submit the price to the network](../using-data-sources.md#submitting-JSON-data).

<Batch />

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.vega.xyz/proposals/propose/raw)
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

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

## Voting
All proposals are voted on by the community. 

Building support is down to you. Share your proposal in the [_Governance_ section ↗](https://community.vega.xyz/c/governance) on the Vega community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minVoterBalance" formatter="governanceToken" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. 

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.