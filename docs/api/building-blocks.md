---
title: Building blocks
sidebar_position: 4
hide_title: false
description: Building blocks of data and their APIs.
vega_network: TESTNET
---

While there are hundreds of available endpoints, the categories below cover the basics to get you started with understanding what you need to interact with Vega. 

## Parties
A party is a single user, defined as a Vega public key. As one person or entity can have many public keys, this is a unique identifier as far as an individual key's actions.  Party ID and public key (pubkey) are all names for the same thing.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| See a paginated list of parties | [List parties](../api/rest/data-v2/trading-data-service-list-parties.api.mdx) |  `GET /api/v2/parties` |

## Assets
Assets used on Vega originate on external chains, not the Vega chain. 

Inter-chain asset interactions can be:
 - Between Vega and Ethereum, and facilitated through the Ethereum bridge. 
 - Between Vega and Arbitrum, faciliated through the Arbitrum bridge.

Assets can only be added to the network to be used as collateral through a successful governance proposal and enactment, and a follow-on update to the relevant [asset bridge](./using-the-apis.md#asset-bridges).

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| See all assets that can be used on the network | [List assets](../api/rest/data-v2/trading-data-service-list-assets.api.mdx)| `GET /api/v2/assets`
| Show a specific asset's details | [Asset](../api/rest/data-v2/trading-data-service-get-asset.api.mdx) | `GET /api/v2/asset/:assetId` |

## Deposits and withdrawals
Assets used on the Vega network can be deposited using a web3 wallet:
- Via the Ethereum bridge contract, for ERC-20 assets on Ethereum mainnet
- Via the Arbitrum bridge, for assets on the Arbitrum mainnet network

[Read more about the asset bridges](./using-the-apis.md#asset-bridges).

Assets can be withdrawn back into an external wallet if they are not being used for margin, positions, or liquidity bond.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| See all deposits for a specific public key | [List deposits](../api/rest/data-v2/trading-data-service-list-deposits.api.mdx) | `GET /api/v2/deposits`
|See a specific deposit using its ID |[Deposit](../api/rest/data-v2/trading-data-service-get-deposit.api.mdx)| `GET /api/v2/deposit/:id`
|||
| Understanding the concepts: accounts | [Accounts](../concepts/assets/accounts.md) | 
| Understanding the concepts: deposits and withdrawals | [Deposits and withdrawals](../concepts/assets/deposits-withdrawals.md) |

## Accounts
Vega relies on accounts to ensure funds are never lost or double spent. The amounts in each account, as well as the transactions that were added to and removed from those accounts, are all recorded and stored on-chain. Accounts are used either to hold assets that the public key holder is in control of using — such as deposited collateral, or for setting money aside that only the network can manage — to fulfil margin requirements, for example, or to store assets that are earmarked for rewards or paying out fees.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| List accounts based on chosen filters | [List accounts](../api/rest/data-v2/trading-data-service-list-accounts.api.mdx) | `GET /api/v2/accounts`
|||
| Understanding the concepts: accounts | [Accounts](../concepts/assets/accounts.md) | 

## Markets
Markets have accounts, are created with proposals, and allow parties to place orders with assets.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| See all markets on the network | [List markets](../api/rest/data-v2/trading-data-service-list-markets.api.mdx) | `GET /api/v2/markets`
| Get information about a single market using the market's ID |[Market](../api/rest/data-v2/trading-data-service-get-market.api.mdx) |  `GET /api/v2/market/:marketId`
| List the latest data for every market | [Markets data](../api/rest/data-v2/trading-data-service-list-latest-market-data.api.mdx) | `GET /api/v2/markets/data`
|||
| Understanding the concepts: market lifecycle | [Market lifecycle](../concepts/trading-on-vega/market-lifecycle.md) | 

## Orders and positions
An order is an instruction to buy or sell on a specific market, and it can go long or short on the market's price. Placing an order does not guarantee it gets filled, but if it is filled, it will result in a position, which will require collateral to use for margin to keep that position open.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| Get information about an order using its ID | [Order](../api/rest/data-v2/trading-data-service-get-order.api.mdx) | `GET /api/v2/order/:orderId` |
| Get a list of orders that have been filtered based on information you provide |[List orders](../api/rest/data-v2/trading-data-service-list-orders.api.mdx) | `GET /api/v2/orders`
| Get a list of all positions for a specific party ID | [List positions](../api/rest/data-v2/trading-data-service-list-all-positions.api.mdx) | `GET /api/v2/positions` 
| Get a paginated list of all trades, optionally filtered by party, market, or order | [List trades](/api/rest/data-v2/trading-data-service-list-trades.api.mdx) | `GET /api/v2/trades`
|||
| Understand the concepts: orders | [Orders](../concepts/trading-on-vega/orders.md) |

## Governance proposals and voting
Governance proposals used to add new assets and markets, as well as to suggest changes to assets, markets, and network parameters, as well as off-chain suggestions. VEGA tokens need to be associated to the Vega public key that wants to take part in governance.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
|  View all governance proposals with their current state, paginated |[List proposals](../api/rest/data-v2/trading-data-service-list-governance-data.api.mdx) | `GET /api/v2/governances`
| Get detailed information about a specific governance proposal using its ID | [Proposal](../api/rest/data-v2/trading-data-service-get-governance-data.api.mdx) | `GET /api/v2/governance`
|||
|How to submit proposals using command line | [Submitting proposals](../tutorials/proposals/index.md) | |
| Understanding the concepts: Governance | [Vega governance](../concepts/governance/index.md) | 

### Governance token
VEGA token are used for taking part in network, market, asset and freeform governance, and to secure the network by nominating validators that run the network.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| See a list of votes | [List votes](../api/rest/data-v2/trading-data-service-list-votes.api.mdx) | `GET /api/v2/votes` |
|||
| How to nominate validators using the smart contracts | [Stake tokens](../tutorials/assets-tokens/staking-tokens.md) | 
| Understand the concepts: Governance | [Vega governance](../concepts/governance/index.md) | 
