---
sidebar_position: 4
title: Transactions
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

A transaction is an instruction (command) issued the network, bundled with a signature, the submitter’s public key, a small proof-of-work calculation, and the target block height. A transaction that doesn't pass [validation](#validation) (for example, an order without enough assets to cover it) will be rejected.

:::tip Viewing transactions
Use the [Vega block explorer](https://explorer.fairground.wtf) to see transactions and their status, plus lots more data about the network.
:::

When a transaction is submitted, it goes to the validators’ mempool - which is is an organised queue where the transactions are stored, sorted, and verified before being added to a newly started block. A validated transaction enters a block based on the priority assigned to the transaction type, and the order in which it arrived. Vega does not have any gas-type charges that can boost priority or cause a transaction to be lower priority.

## Commands
A command is the specific instruction issued to the network within a transaction.

The commands that non-validator users can be submitted to the network include submitting, amending, and cancelling orders, liquidity provisions and transfers, associating tokens and nominating validators, governance proposals and voting on proposals, and depositing and withdrawing assets.

Validators can submit signatures, propose protocol upgrades, rotate their keys and more.

:::tip Query for data
See the gRPC docs for full lists of [user commands](../../api/grpc/vega/commands/v1/commands.proto) and [validator commands](../../api/grpc/vega/commands/v1/validator_commands.proto) supported by the protocol.
:::


## Validation
Transactions are validated before they are added to the mempool, and then again once they’re in the mempool but before they are executed. 

A transaction may be rejected throughout the validation process for several reasons, including because it doesn’t pass the spam check, it is malformed or missing information, or conditions have made it irrelevant (for example if a user's balance changes and they no longer have the balance to fulfil an order). 

There are several levels of validation:

1. Vega Wallet ‘sanity check’:
   If the transaction is sent using the Vega Wallet, the wallet software will ensure that a transaction with a bad payload doesn’t go to the mempool. It checks details including the price formatting, the public key formatting (the right number of characters), the shape of the payload, and more. It also compares fields in the command to ensure they’re not conflicting, such as not specifying fields that are mutually exclusive, or that dependent fields match (such as if the [time in force](../trading-on-vega/orders#times-in-force) is applicable to the order type). 
   
   If the wallet validation fails, the transaction is not sent to a node. A transaction that is validated by the wallet, with a success message, is successfully submitted to and ‘ingested’ by a validator node. However, that does not necessarily mean the transaction will be added to a block, which depends on the follow-on validation.

2. Node check: 
   Once a transaction is sent through a wallet, the validator node it's sent to provides a basic validation check. This check is less thorough than the one performed by Vega Wallet software, but also validates to determine if a transaction should be added to the mempool. A transaction that fails validation does not get added to a block.

3. Validator node consensus check: 
   Once the transaction is in the mempool, the validator nodes check if the request looks valid, and can be enacted/completed based on the state of the network, and confirms that all the details in the transaction are valid. For example, to vote on a proposal: ensuring the proposal is still live, and that the key has enough tokens to vote. For an order, it confirms, for example, that the assets to cover margin are available, the state of the market is relevant for the order, etc.

::: tip View your transaction
Once you receive your transaction hash, you can track your transaction’s progress on the [Vega block explorer](https://explorer.fairground.wtf).
:::

## Filling a block: Transaction gas value
The network's consensus layer, Tendermint, takes transactions from each validator's mempool and puts them into a block until the block reaches a maximum total gas amount. This value of <NetworkParameter frontMatter={frontMatter} param="network.transactions.maxgasperblock" hideName={true} /> is set through a network parameter.

Every transaction has a Tendermint gas value assigned to it, which goes into determining how many transactions enter each block.

Most transactions will have a set gas value of <NetworkParameter frontMatter={frontMatter} param="network.transaction.defaultgas" hideName={true} />, set through a network parameter - though the gas values of orders-related transactions can vary.

The gas for order-related transactions is calculated based on current market factors, such as existing orders, positions, and liquidity commmitment orders already on the market.

:::note Go deeper
See the full list of gas cost calculations and exceptions in the [transaction gas and priority spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0079-TGAP-transaction_gas_and_priority.md#dynamic-transactions-costs).
:::

## Transaction ordering
At a high level, transactions are added to a block at a first-come-first-serve basis, though there is a hierarchy of transaction types. Two of the same type of transaction will be added based on when the transaction enters into the mempool.

Transactions in the mempool with higher priority will get placed into a block before transactions with lower priority are considered.

### High priority transactions
Transactions with commands initiated by a validator node, or those that are originated on another chain, are always added to a block ahead of other waiting transactions:

* Chain events (includes those that have come from another chain) such as deposits, withdrawals; associating/disassociating tokens to a Vega key, adding or removing signers from the bridge; adding, amending or removing assets
* Validator signatures, node votes, heartbeats, key rotations, state variable proposals
 
### Medium priority transactions
Transactions with governance commands (governance proposals and votes) are added to a block after high-priority transactions that are waiting to be added to a block.

### Low priority transactions
Transactions with all other command types are added once all waiting high and medium priority transactions are added to a block.

These include:
* Orders - submit, amend cancel
* Liquidity provision - submit, amend, cancel
* Transfers - submit and cancel
* Batch market instructions
* Nominating validators with tokens
