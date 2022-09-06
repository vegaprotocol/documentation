---
sidebar_position: 2
title: Propose an update to a market
hide_title: false
vega_network: TESTNET
toc: true
keywords:
- proposal
- governance
- updateMarket
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import UpdateMarketAnnotated from './_generated-proposals/_updateMarket_annotated.md';
import UpdateMarketJSON from './_generated-proposals/_updateMarket_json.md';
import UpdateMarketCMD from './_generated-proposals/_updateMarket_cmd.md';
import UpdateMarketWin from './_generated-proposals/_updateMarket_win.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Requirements

You will need:

- A connected [Vega wallet](/docs/tools/vega-wallet/index.md), with your wallet name and public key to hand
- A minimum of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" hideName={true} suffix="token"/> associated with that public key
- A minimum equity-like share of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" hideName={true} />
- Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance), particularly off-chain activities


## Templates
The `updateMarket` proposal is similar to the `newMarket` proposal, but most fields are not required. See the descriptions in the [propose a new market](new-market-proposal.md#fields) for more on each field.

You can submit your proposal via the command line, or via the token dApp in your web browser.

:::info
See this annotated example for descriptions of all the fields in the proposal.
<details><summary>Annotated example</summary>
  <UpdateMarketAnnotated />
</details>
:::

<Tabs groupId="updateMarket">
  <TabItem value="json" label="Token dApp (JSON)">

1. Copy the JSON example below into a text editor.
2. Replace the placeholder values with those you want for the market.
3. Submit your proposal from the [New Proposal area of the token dApp](https://token.fairground.wtf/governance/propose).
4. Check you can see your proposal on [Open Proposals area of the token dApp](https://token.fairground.wtf/governance).
  
<UpdateMarketJSON />
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">

1. Copy the command line example below into a text editor.
2. Replace the placeholder values with those you want for the market.
3. Use the command line to submit your proposal.
4. Check you can see your proposal on [Open Proposals area of the token dApp](https://token.fairground.wtf/governance).

<UpdateMarketCMD />
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">

1. Copy the command line example below into a text editor.
2. Replace the placeholder values with those you want for the market.
3. Use the command line to submit your proposal.
4. Check you can see your proposal on [Open Proposals area of the token dApp](https://token.fairground.wtf/governance).

<UpdateMarketWin />
  </TabItem>
</Tabs>

### Field descriptions
See this annotated example for descriptions of all the fields in the proposal.
<details><summary>Annotated example</summary>
  <UpdateMarketAnnotated />
</details>

#### Changes
Updated market instrument configuration.

| Field | Description |
| ----------- | ----------- |
| `marketId` | The identifier of the market to update. |
| `instrument` `code`  | Human-readable shortcode used to describe the instrument. |
| `future` `quoteName` | Human-readable name/abbreviation of the quote name (string) |
| `future` `settlementPriceDecimals` | The number of decimal places implied by the settlement price emitted by the settlement oracle |
| `oracleSpecForSettlementPrice` `pubKeys ` | The list of authorized public keys that signed the data for this oracle. All the public keys in the oracle data should be contained in these public keys. (array of strings) |

#### Filters
Filters describe which oracle data are considered of interest or not for the product (or the risk model).

| Field | Description |
| ----------- | ----------- |
| `key` `name` | The name of the oracle data property key targeted by the filter. (string) |
| `key` `type` | The type of the oracle data property key targeted by the filter. (string) |
| `conditions` `operator` | The type of comparison to make on the value. (string) |
| `conditions` `value` | Used by the comparator. (string) |

#### Oracle spec
The oracle spec describing the oracle data of trading termination (object).

| Field | Description |
| ----------- | ----------- |
| `oracleSpecForTradingTermination` `pubKeys` | the list of authorized public keys that signed the data for this oracle. All the public keys in the oracle data should be contained in these public keys. (array of strings) |

| Field | Description |
| ----------- | ----------- |
| `closingTimestamp` | Timestamp (Unix time in seconds) when voting closes for this proposal. The chosen time must be between <NetworkParameter frontMatter={frontMatter}param="governance.proposal.updateMarket.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when proposal gets enacted (if passed). The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string) |


## Voting and enactment

All proposals are voted on by the community. Community members need a minimum of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minVoterBalance" suffix="tokens" hideName={true} /> to vote. Your proposal will need participation of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Building support is down to you. Share your proposal in [the _Update Market Proposals_ forum](https://community.vega.xyz/c/fairground-testnet-governance/update-market-proposals-testnet/38) on Vega community, being sure to follow the [post guide](https://community.vega.xyz/t/guide-to-update-market-proposals/4178). You may also wish to share on [Discord](https://vega.xyz/discord) and [Telegram](https://t.me/vegacommunity).

Proposal owners who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.