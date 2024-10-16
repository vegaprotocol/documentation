---
sidebar_position: 1
title: New futures successor market
hide_title: true
vega_network: TESTNET
keywords:
- proposal
- governance
- newMarket
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import NewSuccessorMarketAnnotated from './_generated-proposals/_newSuccessorMarket_annotated.md';
import NewSuccessorMarketJSON from './_generated-proposals/_newSuccessorMarket_json.md';
import NewSuccessorMarketCMD from './_generated-proposals/_newSuccessorMarket_cmd.md';
import NewSuccessorMarketWin from './_generated-proposals/_newSuccessorMarket_win.md';
import Batch from './_batch-sample.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose new futures successor market

Propose a cash-settled futures market to succeed an existing market, taking along the equity-like share and a portion of the insurance pool.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key, based on the network parameter values for <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />
* Familiarity with [successor market governance](../../concepts/governance/market.md#propose-a-successor-market) on Vega

## Anatomy of a new successor market proposal
The new successor market proposal requires the same fields as a new market proposal, with the addition of two fields described below. 

See the [new market proposal tutorial](new-market-proposal.md#anatomy-of-a-market-proposal) for what each field accepts and needs to contain.

* Settlement asset must match that of the parent market.
* Instrument name and code should be different to the parent market.

### Successor market fields
The following `successor` parameters need to be used if you are proposing a market that will succeed an existing market. A successor market that passes governance and is enacted will take the LPs' equity-like share from the parent market, and whatever percentage of the insurance market you choose in the proposal.

* Parent market ID: Required to define the proposal as for a successor market
* Insurance pool fraction: Required percentage of the parent market's insurance pool, up to 100%, can be earmarked for transfer to the successor market. It is submitted as a number between and including 0 and 1, which represents the factor for the percentage.

## Submitting proposals in a batch

<Batch />

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="newSuccessorMarket">
  <TabItem value="annotated" label="Annotated example">
    <NewSuccessorMarketAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON">
    <JSONInstructions />
    <NewSuccessorMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
    <TerminalInstructions />
    <NewSuccessorMarketCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <TerminalInstructions />
    <NewSuccessorMarketWin />
  </TabItem>
</Tabs>

## Voting
All proposals are voted on by the community.

To vote, community members need, at a minimum, the larger of the values of the following network parameters <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minVoterBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-a-proposals-outcome-is-calculated) determined by the value of the parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredParticipation" /> and a majority of the value of the parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" />.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field, depending on the [status of other successor market proposals](../../concepts/governance/lifecycle.md#proposal-outcome-successor-market).