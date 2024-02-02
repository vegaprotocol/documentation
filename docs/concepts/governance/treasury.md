---
sidebar_position: 3
title: Vega treasury
vega_network: TESTNET
hide_title: false
description: How you can allocate treasury funds.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

The network treasury holds assets that can be used by the community to fund initiatives. You can take part in decision-making around building and growing Vega.

Treasury assets can be used to fund trading rewards, team competitions, grants, or other opportunities.

Anyone with VEGA tokens can vote on or raise proposals to use treasury assets.

## Treasury basics
The network treasury is funded with VEGA tokens, to be used by community members to grow and support the Vega network. 

### Token details
Contract address: `0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e`

Vega asset ID: `d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2`

See more details on the [block explorer ↗](https://explorer.vega.xyz/assets/d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2).

### Treasury value
You can see how much is in the network treasury at any point with the `list accounts API`.

* Use the [REST endpoint](../../api/rest/data-v2/trading-data-service-list-accounts.api.mdx)
* Filter by:
    * Asset ID for the VEGA token, and 
    * Account type: `ACCOUNT_TYPE_NETWORK_TREASURY`
* Don't forget to account for the token's 18 decimal places

## What the treasury can fund [WIP]

**Rewards**: Rewards can incentivise trading, liquidity provision, and proposing successful markets.
- Recognise *active traders* by targeting those who pay maker fees, or have large or profitable positions
- Incentivise *liquidity provision* by funding rewards for participants who receive liquidity and/or maker fees
- Support market success by rewarding proposers who create markets that attract high trading volumes

Read in detail on the [rewards page](../trading-on-vega/discounts-rewards.md#trading-rewards) about the trading rewards you can choose from.

**Team games**: Rewards that are targeted to a team entity scope let teams compete against each other for a share of the winnings. You can propose a team game for any type of trading reward.

Read more about how these work in the [teams and games](../trading-on-vega/discounts-rewards.md#teams-and-games) section.

**Grants** - raise as a freeform proposal? A transfer can send to any Vega key, even if it's an individual and not a reward account.

## How to allocate the treasury
The most direct way to propose spending the assets is by submitting a **[proposal to transfer assets](../assets/transfers.md#governance-initiated-transfers)**. 

The proposal includes details about the specific account(s) or key(s) that you want to send assets to, as well as when to send, and how often. The transfer can be set to happen once or repeatedly.

Include a description of what you're intending to do with the treasury funds in your proposal's rationale so that the community can understand why and engage with your proposal.

See the [tutorial](../../tutorials/proposals/asset-transfer-proposal.md) for a template and description of each field.

Another option is to submit a [freeform proposal](../../tutorials/proposals/freeform-proposal.md) to suggest a non-binding idea to the community and gauge their sentiment.

<!--
Wondering what the experience is for someone who wants to spend Vega on-chain, what tools to have, what kinds of competitions can they make?
-->




