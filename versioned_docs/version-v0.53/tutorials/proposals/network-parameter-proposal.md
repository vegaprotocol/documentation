---
title: Propose a network parameter change
vega_network: MAINNET
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

## Proposing: What you need to know
1. The full annotated example is there to guide you through what is needed for each field in the proposal.
2. Be sure to have your Vega wallet name and public key ready, and have your wallet connected when you submit.
3. To submit a proposal you will need at least <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" hideName={true} suffix="tokens" />, associated with the public key you're using to propose the asset. Note, this amount is set through the network parameter `governance.proposal.asset.minProposerBalance`.
4. Before proposing, read about:
   * [Governance lifecycle](../../concepts/vega-protocol#lifecycle-of-a-governance-proposal): Learn about the off-chain and on-chain steps for crafting, sharing, and submitting proposals.
   * [Network parameter governance](../../concepts/vega-protocol#network-parameter-governance): More details about network parameter governance and the thresholds for changes.

### Submit using command line
1. To create your own proposal and submit it using the command line, copy the command line example into a text editor and include the values you want for the market.
2. Use the command line to submit your proposal.
3. You can see your proposal on the [Fairground block explorer](https://explorer.vega.xyz/governance).
4. Your proposal will need enough voting weight to pass, so having community support of your proposal is essential.

### Submit using token dApp
1. To create your own proposal and submit with the token dApp, copy the JSON example into a text editor and include the values you want for the market.
2. Use the token dApp's [Governance page](https://token.vega.xyz/governance) to submit your proposal. 
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