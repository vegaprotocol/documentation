---
sidebar_position: 4
title: Transactions
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

A transaction is an instruction issued the network, bundled with a signature, the submitter’s public key, a small proof-of-work calculation, and the target block height.

:::tip Viewing transactions
Use the [Vega block explorer](https://explorer.fairground.wtf) to see transactions and their status, plus lots more data about the network.
:::

When a transaction is submitted, it goes to the validators’ mempool - which is is an organised queue where the transactions are stored, sorted, and verified before being added to a newly started block. A validated transaction enters a block based on the priority assigned to the transaction type, and the order in which it arrived.

Each transaction has a Tendermint gas cost assigned to it, which goes into determining how many transactions enter each block.

Transaction gas costs are based on market factors for the market into which the order is heading, for example what orders there are on the book, what LP commitments, what positions people have. [WIP]



The consensus layer, Tendermint, takes transactions from the mempool of each validator and puts them into a block until the block reaches a maximum total cost of <NetworkParameter frontMatter={frontMatter} param="network.transactions.maxgasperblock" hideName={true} />, which is set through a network parameter. Most transactions will have a gas value of <NetworkParameter frontMatter={frontMatter} param="network.transaction.defaultgas" hideName={true} />, also set through a network parameter - though there are some exceptions. 

:::note Go deeper
See the full list of gas cost calculations and exceptions in the [transaction gas and priority spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0079-TGAP-transaction_gas_and_priority.md#dynamic-transactions-costs).
:::

### Commands [WIP]
Commands make up part of a transaction. The command is the specific instruction issued to the network, which is bundled with the other information needed to form a transaction.

There are commands submitted by users, and those that can only be submitted by validators.

Commands fall into high-level categories:
* Protocol transactions that interact with Ethereum - withdrawals, deposits
* Governance transactions - Submitting a proposal, voting
* Staking transactions - Nominating and unnominating validators with tokens
* Orders - Submitting, amending, cancelling, batch market instructions, LP commitments
* etc - Transfers, announce node, node vote, key rotation, propose protocol upgrade
 
Orders, Governance, Withdrawals, LP, Nominate/Unnominate, Transfers, Protocol Upgrade

https://docs.vega.xyz/testnet/api/grpc/vega/commands/v1/transaction.proto#messages 

### Transaction ordering
At a high level, transactions are added to a block at a first-come-first-serve basis, though there is a hierarchy of transaction types. Two of the same type of transaction will be added based on when the transaction enters into the mempool.

Transactions in the mempool with higher priorities will get placed into a block before transactions with lower priority are considered. 

There are three priority categories:
1. High: Transactions of the following types are always prioritised first to be added to a block. All protocol transactions, such as ethereum events like withdrawals, validator heartbeats
2. Medium: Transactions of the following types are prioritised behind high, and ahead of low priority transactions when added to a block. All governance transactions including proposals and votes
3. Low: Transactions that are added to a block after other higher priority transactions are added. This covers all other transactions, such as orders

### Validation
Transactions are validated before they are added to the mempool, and then again once they’re in the mempool but before they are executed. 

A transaction may be rejected throughout the validation process for several reasons, including because it doesn’t pass the spam check, it is malformed or missing information, or conditions have made it irrelevant (such as not enough of an asset to fulfil an order). 

There are several levels of validation:

1. Vega Wallet ‘sanity check’ 
   If the transaction is sent using the Vega Wallet, the wallet software will ensure that a transaction with a bad payload doesn’t go to the mempool. It checks details including if the price  format is correct, if the public key formatted correctly (the right number of characters), the shape of the payload, and more. It also compares fields in the command to ensure they’re not conflicting, such as not specifying fields that are mutually exclusive, or that dependent fields match (like the time in force for the order type). If the wallet validation fails, the transaction is not sent to a block. A transaction that is validated by the wallet, with a success message, is successfully submitted to and ‘ingested’ by a validator node, but that does not necessarily mean the transaction will be added to a block, depending on the follow-on validation.

2. Node check: 
   Once a transaction is sent through a wallet, it’s given a basic validation check by the validator node that it’s sent to. This check is less thorough than the one performed by Vega Wallet software, but also provides the validation to determine if a transaction should be added to the mempool. A failed validation does not get added to a block.

3. Validator node consensus check: 
   Once the transaction is in the mempool, the validator nodes check if the request looks valid, and can be enacted/completed/etc based on the state of the network, and confirms that all the details in the transaction are valid. For example, for a proposal: ensuring the proposal is still live, that the key has enough tokens to vote. For an order, it confirms for example that the margin is available, the state of the market is relevant for the order, etc. 

::: tip query 
Once you receive your transaction hash, you can track your transaction’s progress on the Vega block explorer
:::
