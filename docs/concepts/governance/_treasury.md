---
sidebar_position: 3
title: Vega treasury
vega_network: TESTNET
hide_title: false
description: How you can allocate treasury funds.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

The network treasury holds assets that can be used by the community to fund initiatives. You can take part in decision-making around building and growing Vega.

Treasury assets can be used to fund trading rewards, team competitions, grants, Vega protocol software and/or product development, teams building on Vega, or other opportunities.

Anyone with enough tokens can vote and raise proposals to use treasury assets based on discussions in the community.

* To vote on a proposal, you usually need at least 1 VEGA, but the amount may vary per proposal type. Check the [block explorer](https://explorer.fairground.wtf/network-parameters) for each `minVoterBalance`.
* How many VEGA you need to submit a proposal depends on the proposal type. Check the [block explorer](https://explorer.fairground.wtf/network-parameters) for each `minProposerBalance`.

## Treasury basics
A network treasury can hold governance tokens and other assets, which can be used by the community via on-chain governance to grow and support the development of the Vega software and network. 

### VEGA token details
VEGA token contract address (Ethereum mainnet): `0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e` ([view on Etherscan ↗](https://etherscan.io/token/0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e))

Vega asset ID: `d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2`

### Treasury value
You can see how much is in the network treasury by using the `list accounts API`. For example, using the [REST endpoint](../../api/rest/data-v2/trading-data-service-list-accounts.api.mdx):
* Filter by:
    * Asset ID for the governance token, and 
    * Account type: `ACCOUNT_TYPE_NETWORK_TREASURY`
* Don't forget to account for the token's 18 decimal places

## What the treasury can fund

**Rewards**: Rewards can incentivise trading, liquidity provision, and proposing successful markets.
- Recognise *active traders* by targeting those who pay maker fees, or have large or profitable positions
- Incentivise *liquidity provision* by funding rewards for participants who receive liquidity and/or maker fees
- Support market success by rewarding proposers who create markets that attract high trading volumes

Read in detail on the [rewards page](../trading-on-vega/discounts-rewards.md#trading-rewards) about the trading rewards you can choose from.

**Team games**: Rewards that are targeted to a team entity scope let teams compete against each other for a share of the winnings. You can propose a team game for any type of trading reward.

Read more about how these work in the [teams and games](../trading-on-vega/discounts-rewards.md#teams-and-games) section.

**Grants and other initiatives**: A transfer can send to any Vega key, even if it's an individual and not a reward account. You can use a freeform proposal to gauge the community's interest and hone the plan before setting up the proposal for transferring assets.

## How to allocate the treasury
Allocating assets in the treasury requires using governance. There are a few options for moving those assets. 

Before submitting a proposal, make sure you understand the full [governance lifecycle](./lifecycle.md).

### Use governance to spend assets

Assets can only be spent from the on-chain treasury by governance, when a **[proposal to transfer assets](../assets/transfers.md#governance-initiated-transfers)** is enacted. 

The most direct way to propose spending the assets is by submitting one of these proposals. In practice, community members almost always **discuss proposals on the [Vega community forums ↗](https://community.vega.xyz/) before submitting**, in order to incorporate community feedback into the proposal and ensure there's broad support before going through the effort of putting it on-chain.

The proposal includes details about the specific account(s) or key(s) that you want to send assets to, as well as when to send, and how often. The transfer can be set to happen once or repeatedly.

Include a description of what you're intending to do with the treasury funds in your proposal's rationale so that the community can understand why and engage with your proposal.

See the [tutorial](../../tutorials/proposals/asset-transfer-proposal.md) for a template and description of each field.

### Suggest ideas with freeform proposals
Another option is to submit a [freeform proposal](../../tutorials/proposals/freeform-proposal.md) to suggest a non-binding idea to the community and gauge their sentiment. This would be a good option for grants or other initiatives, especially where opinions may be split on what to do.

Raise a freeform proposal with your plan. Include clear details about what you think the money should be spent on, and if there's an organisation or provider you'd like to suggest working with, details about who they are and why they -- and the initiative -- are a good choice. You could even raise two or three freeform proposals to help decide which of several competing ideas to take through to a final proposal.

Based on feedback and voting for your freeform proposal, you can then decide to raise a proposal to transfer assets accordingly.

### Batch up your proposals

For more complex sets of actions, you can use a [batch proposal](./lifecycle.md/#submitting-proposals-in-a-batch) to submit several actions to be coordinated to happen as the result of a single vote. These can be spread across time, and can even be used to make temporary changes by including both the changes and a later reversal in the same batch.

Examples of actions that can be coordinated together in a batch include:
- Funding multiple reward pools
- Paying for a service or action over a period of time
- Creating markets
- Changing fee rates
- Setting up or changing programmes like referral schemes, or activity streak or volume discount parameters

:::note Read more
[Batch proposals](./lifecycle.md/#submitting-proposals-in-a-batch)
:::
