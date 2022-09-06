---
sidebar_position: 3
title: Propose a network parameter change
vega_network: TESTNET
hide_title: false
keywords:
- proposal
- governance
- updateNetworkParameter
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import UpdateNetworkParameterAnnotated from './_generated-proposals/_updateNetworkParameter_annotated.md';
import UpdateNetworkParameterJSON from './_generated-proposals/_updateNetworkParameter_json.md';
import UpdateNetworkParameterCMD from './_generated-proposals/_updateNetworkParameter_cmd.md';
import UpdateNetworkParameterWin from './_generated-proposals/_updateNetworkParameter_win.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Network parameters are a constant (or an array of constants) in the system, the values of which can be changed by on-chain governance.

This page describes what you need to propose a change to a network parameter, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:

- A connected [Vega wallet](/docs/tools/vega-wallet/index.md), with your wallet name and public key to hand
- A minimum of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" hideName={true} suffix="token"/> associated with that public key
- Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance), particularly [network parameter governance](../../concepts/vega-protocol#network-parameter-governance)

### Submit using command line
1. To create your own proposal and submit it using the command line, copy the command line example into a text editor and include the values you want for the market.
2. Use the command line to submit your proposal.
3. You can see your proposal on the [Fairground block explorer](https://explorer.fairground.wtf/governance).
4. Your proposal will need enough voting weight to pass, so having community support of your proposal is essential.

### Submit using token dApp
1. To create your own proposal and submit with the token dApp, copy the JSON example into a text editor and include the values you want for the market.
2. Use the token dApp's [Governance page](https://token.fairground.wtf/governance) to submit your proposal. 
3. You can see your proposal on the token dApp governance page.
4. Your proposal will need enough voting weight to pass, so having community support of your proposal is essential.

## Full proposal examples
In the tabs below you'll see an annotated example, which describes what each field is for, a JSON example that can be used to submit on the token dApp, and command line examples for different operating systems. **You'll need to replace the example data with the relevant details before submitting.**

<Tabs groupId="updateNetworkParameter">
  <TabItem value="annotated" label="Annotated example">
    <UpdateNetworkParameterAnnotated />
  </TabItem>
  <TabItem value="json" label="JSON example">
    <UpdateNetworkParameterJSON />
  </TabItem>
  <TabItem value="cmd" label="Linux / OSX command line">
    <UpdateNetworkParameterCMD />
  </TabItem>
  <TabItem value="win" label="Windows command line">
    <UpdateNetworkParameterWin />
  </TabItem>
</Tabs>

## Voting and enactment

All proposals are voted on by the community. Community members need a minimum of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minVoterBalance" suffix="tokens" hideName={true} /> to vote. Your proposal will need participation of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Building support is down to you. Share your proposal in [the _Network Parameter Proposals_ forum](https://community.vega.xyz/c/fairground-testnet-governance/network-parameter-proposals-testnet/34) on Vega community, being sure to follow the [post guide](https://community.vega.xyz/t/guide-to-network-governance-on-fairground-testnet/4018). You may also wish to share on [Discord](https://vega.xyz/discord) and [Telegram](https://t.me/vegacommunity).

Proposal owners who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.