---
title: API endpoints
sidebar_position: 4
hide_title: false
description: Building blocks of data and their APIs.
---

While there are hundreds of [available endpoints](../api/rest/overview.md), the categories below cover the basics to get you started. 

## Submit transactions
You can submit a transaction with `POST /transaction`. You'll need a [Vega Wallet app](../tools/index.md) or [signer library](../tutorials/community-created.md#signer-libraries) to prepare your transaction before sending. 

If you use Go, you can import Vega as a dependency, and use the code under [wallet/pkg ↗](https://github.com/vegaprotocol/vega/blob/develop/wallet/pkg/send_transaction.go) to sign and send your transaction.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| Submit a transaction | [Submit transaction](../api/rest/data-v2/trading-data-service-list-parties.api.mdx) |  `POST /transaction` |
| Get blockchain height | [Get height](../api/rest/transaction/transaction-last-block-height.api.mdx) |  `GET /blockchain/height` |
| Get the current Vega time | [Get Vega time](../api/rest/data-v2/trading-data-service-get-vega-time.api.mdx) |  `GET /time` |
| Check your spam statistics | [Get spam statistics](../api/rest/transaction/transaction-get-spam-statistics.api.mdx) |  `GET /spam/statistics` |

### Transaction samples
Follow the [guide to sending transactions](../tutorials/build-send-transactions.md) to sign and send using the command line wallet.

#### Submit order

This is a _partial_ example of an order submission.

```json
{
  "orderSubmission": {
    "marketId": "1234", 
    "price": "42", 
    "size":10, 
    "side": "SIDE_BUY", 
    "timeInForce": "TIME_IN_FORCE_FOK",
    "type": "TYPE_LIMIT"
  }
}
```

See the [commands API](../api/grpc/vega/commands/v1/commands.proto.mdx#ordersubmission) for all fields, including optionals.

#### Amend order
Change an existing order. If you leave a field unset - if it was used on your original order - or with a default value, the field's value will not change.

```json
{
  "orderAmendment": {
    "marketId": "1234", 
    "price": "42", 
    "sizeDelta":10, 
    "side": "SIDE_BUY", 
    "timeInForce": "TIME_IN_FORCE_FOK",
    "type": "TYPE_LIMIT"
  }
}
```
See the [commands API](../api/grpc/vega/commands/v1/commands.proto.mdx#orderamendment) for all fields, including optionals.


#### Cancel order
Cancel an existing order, or all orders on a market. If you use the market ID, it will cancel all orders on that market.

```json
{
  "orderCancellation": {
    "orderId": "42", 
  }
}
```

#### Submit stop orders
Submit a stop order - a normal order that remains off the order book and is only submitted if a given trigger is breached from a particular direction. If both rises-above and falls-below are configured, then if one is triggered the other will be cancelled (OCO).

```json
{
  "stopOrdersSubmission": {
    "OrderSubmission": {
    "marketId": "1234", 
    "price": "42", 
    "size":10, 
    "side": "SIDE_BUY", 
    "timeInForce": "TIME_IN_FORCE_FOK",
    "type": "TYPE_LIMIT"
    }
    "expiresAt": "42", 
    "expiryStrategy":10, 
    "sizeOverrideSetting": "SIDE_BUY", 
    "sizeOverrideValue": "TIME_IN_FORCE_FOK",
    "trailingPercentOffset": "TYPE_LIMIT",
    "price": "TYPE_LIMIT"
    }
}
```

#### Cancel stop order
Cancel untriggered stop orders by specifing which stop order using its ID, or cancel all your stop orders on a given market using the market ID. If any cancelled stop order is part of an OCO, both stop orders will be cancelled.

```json
{
  "stopOrdersCancellation": {
    "orderId": "42", 
  }
}
```

#### Switch between cross and isolated margin
Change the margin mode you're using on a market by including the mode to switch to. When changing to isolated margin mode, include the margin amount you want as a decimal amount where 1 = 100%.

```json
{
  "updateMarginMode": {
    "marketId" "1234"
    "mode": "MODE_ISOLATED_MARGIN",
    "marginFactor": "0.2"
  }
}
```

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
Assets can be deposited using a web3 wallet:
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

## Governance proposals and voting
Governance proposals used to add new assets and markets, as well as to suggest changes to assets, markets, and network parameters, as well as off-chain suggestions. 

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
|  View all governance proposals with their current state, paginated |[List proposals](../api/rest/data-v2/trading-data-service-list-governance-data.api.mdx) | `GET /api/v2/governances`
| Get detailed information about a specific governance proposal using its ID | [Proposal](../api/rest/data-v2/trading-data-service-get-governance-data.api.mdx) | `GET /api/v2/governance`
|||
| How to submit proposals using command line | [Submitting proposals](../tutorials/proposals/index.md) | |
| Understanding the concepts | [Governance](../concepts/governance/index.md) | 

### Governance token
Governance tokens are used for taking part in network, market, asset and freeform governance, and to secure the network by nominating validators that run the network.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| See a list of votes | [List votes](../api/rest/data-v2/trading-data-service-list-votes.api.mdx) | `GET /api/v2/votes` |
|||
| How to nominate validators using the smart contracts | [Stake tokens](../tutorials/assets-tokens/staking-tokens.md) | 
| Understand the concepts | [Governance](../concepts/governance/index.md) | 
