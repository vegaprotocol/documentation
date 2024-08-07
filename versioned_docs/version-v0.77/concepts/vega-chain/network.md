---
sidebar_position: 3
title: Network
vega_network: MAINNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

The Vega mainnet network is operated by a number of independent validators, who each run a [validator node](validator-nodes.md), and may also run [data nodes](data-nodes.md). 

The Vega project team runs one testnet network, also known as Fairground (enabled with trading). The mainnet validators also run a testnet network, in addition to the mainnet network.

## Parameters
There are certain parameters that influence the behaviour of the system, such as how many tokens are required to make a particular governance proposal, or what percentage infrastructure fees should be.

Network parameters can be changed by on-chain governance, so that the community can define the optimal network configuration for each feature. They can only be added or removed with Vega core software releases.

Each network parameter has a 'key', or a name, and a 'value', which is what the parameter is set to.

Loosely, network parameters fall into several categories: 
* Governance proposals: `governance.proposal.asset.minVoterBalance`, `governance.proposal.updateMarket.minEnact`, for example
* Auctions: `market.auction.minimumDuration`, `market.monitor.price.defaultParameters`, for example
* Fees: `transfer.fee.factor`, `market.fee.factors.makerFee`, for example
* Margin: `market.margin.scalingFactors`
* Network checkpoints and snapshots: `network.checkpoint.timeElapsedBetweenCheckpoints`, `snapshot.interval.length`, for example
* Spam protection: `spam.pow.difficulty`, `spam.protection.max.proposals`, for example
* Liquidity: `market.liquidity.bondPenaltyParameter`, `market.liquidity.targetstake.triggering.ratio`, for example
* Validators: `network.validators.multisig.numberOfSigners`, `validators.delegation.minAmount`, for example 
* Rewards: `rewards.marketCreationQuantumMultiple`, `reward.staking.delegation.minimumValidatorStake`, for example
* Transfers: `transfer.minTransferQuantumMultiple`

These parameters can differ between networks. In other words, the same network parameter key could have different values on mainnet, Fairground, and the validator-run testnet.

:::note Go deeper
* [Network parameters: See full list on the block explorer  ↗](https://explorer.vega.xyz/network-parameters)
* [Tutorial: Propose a network parameter change](../../tutorials/proposals/network-parameter-proposal.md)
:::

## Epochs
An epoch is a time period during which network changes, such as changing validator nominations, [liquidity provisions](../liquidity/provision.md#amending-and-cancelling-a-liquidity-commitment), [recurring transfers](../assets/transfers.md#recurring-transfers), and community-funded rewards can be announced and then implemented. Changes that are announced in one epoch will only be executed in the following epoch, or in the epoch nominated for the change. There is one exception, ['un-nominate now'](./proof-of-stake#un-nominate-now).

The length of an epoch is <NetworkParameter frontMatter={frontMatter} param="validators.epoch.length" hideName={true} />, which is set by a network parameter.

## Network-wide limits
Some limits have been introduced to the protocol in an aim to keep the overall system performant and responsive, with low-latency. As the system relies on both a lean core and a data node that consumes and provides data, having limits allows the option to somewhat control how many computations and how much data is generated, while also allowing full use of the protocol's functionality. 

These limits are adjustable, so each network can be set up for maximum flexibility, and offer tokenholders the chance to change the values of those limits through network parameter governance.

These limits are not totally dissimilar to the spam controls that are also implemented, which aim to mitigate the possibility of malicious actors deliberately flooding the system with junk requests. 

### Maximum pegged orders
Currently, one transaction type can be limited:
* Total number of pegged orders on all active markets: controlled by network parameter <NetworkParameter frontMatter={frontMatter} param="limits.markets.maxPeggedOrders" />

If the parameter's value is decreased through a governance proposal and vote, then the change does not affect existing orders on the market, but only new orders placed after the change is enacted. 

## Spam protection
On a decentralised and pseudonymous network, there's always a possibility that a malicious actor or a misconfigured client will attempt to spam blocks and fill them with meaningless transactions. As Vega allows for some transactions to be issued without requiring gas cost, this issue requires special care. To mitigate that risk, there are spam protections enabled to protect the Vega network, in particular enforced minimums and maximums for certain transactions sent to the Vega network, and a client-side proof of work requirement to mitigate transaction spam.

The Vega Wallet software prevents you from sending in a transaction that will trigger a spam violation and cause your public key to be banned.

The values of all [spam protection network parameters](#spam-protection-parameters) can be changed through a governance vote. If a parameter change passes governance, it takes effect in the epoch after it passes.

:::tip Query for data
**[API: Spam statistics](../../api/rest/transaction/transaction-get-spam-statistics.api.mdx)**: Query for a public key's spam count. This could be useful if you're building wallet software for use with Vega, to stop accidental spamming.
:::

### Spam limits: Governance
Governance transactions have several limits in order to mitigate the potential spam risk of someone attempting to overload the network with inexpensive transactions.

**Votes on proposals** and **submitting governance proposals** are subject to minimum token requirements:
* To submit a vote, the minimum required number of governance tokens associated to the voting public key is determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />
* Minimum number of governance tokens associated to the proposing public key required to submit the proposal is determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" suffix="tokens" formatter="governanceToken" />

**Votes on proposals** and **submitting governance proposals** also have limitations on the max number of each per epoch: 
* Maximum number of votes per public key, on each proposal per epoch is determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.votes" />. Thus, this parameter limits how often you can change your mind on a proposal.
* Maximum number of proposals per public key, per epoch is determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.proposals" hideName={true} />

#### Mitigating spam attacks
If the network perceives it is under attack based on the amount of rejected governance votes coming after they're added to a block, or in spite of the spam limits, then the minimum required tokens to submit a vote is doubled automatically until the attack is over.

If three blocks in a row are filled with spam, for example if parties continue to send substantially more than three votes on one proposal, then the number of required tokens is doubled, up to a maximum of 1600 tokens.

### Spam limits: Transfers 
Each party (public key) has a limitation on how many transfer transactions it can submit per epoch, set by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.maxUserTransfersPerEpoch" hideValue={true} />.

Once that transfer limit is reached for a key, any subsequent transactions are rejected until the epoch switches over.

### Spam limits: Staking
Staking to any number validators is subject to minimum token requirements and a limit on the number of delegations per epoch:

* Minimum required number of governance tokens associated to the voting public key is determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.delegation.min.tokens" suffix="tokens" formatter="governanceToken" />. Nominations submitted without enough tokens are rejected.
* Maximum number of nominations per public key, per epoch is determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.delegations"/>. Once that nominations limit is reached for a key, any subsequent nominations are rejected until the epoch switches over.

#### Rejection policies
Relevant transactions (governance, transfers, and staking) that don't follow the anti-spam rules are rejected, either before the block is processed, or after, depending on the circumstances.

**Pre-block rejection:** Each governance transaction is checked to ensure the public key sending it meets the spam protection requirements before the transaction enters the validators' mempool. The remaining transactions that were not added to a block are rechecked after the original block's execution, to be added to the next block. If a transaction fails the applicable spam rules set by the [parameters](#spam-protection-and-pow-parameters) below, it's not processed and is removed.

**Post-block rejection:** When a transaction makes it into the block, it is still checked before the block is finalised, and can then be rejected before it's passed to the application layer. A transaction may be rejected post-block and passed the initial validation if, for example, it breaches the maximum allowed rule, but nodes aren't yet aware of how many of that party's transactions will eventually be included in a block. That can happen because a validator node doesn't know what's in the other validators' mempools until transactions reach them through gossip. When blocks are executed, the network has all the information from before the block, and all transactions already seen within the block, so any transactions that breach the spam rules are rejected and removed from the block before they can be executed.

If a party has 50% or more transactions rejected post-block, that party will be banned from sending that type of transaction for 30 seconds or 1/48th of an epoch, whichever is greater. 

### Spam limits: Withdrawals
As uncompleted withdrawals don't expire, it's possible to generate a large number of transactions and withdrawal request data by requesting many small transactions.

A minimum amount per withdrawal can lower the risk of transaction spam from tiny withdrawal and/or transfer requests.

The minimum amount per withdrawal is determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.minimumWithdrawalQuantumMultiple" hideValue={true} /> multiplied by the specific asset's quantum. An asset's quantum is defined as an approximation of the smallest 'meaningful' amount of that asset, generally expecting it to be the quantity of the asset valued at about 1 USD.

Any withdrawal request for a smaller amount is immediately rejected.

<!-- delay threshold will probably be zero. -->
<!-- (mention in withdrawals area) -->


### Spam limits: Batch order instructions 
Batch order instructions are limited by a maximum size per batch, determined by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.batchSize" />. A batch with a size higher than the limit is rejected.

### Proof of work
Although Vega is a proof-of-stake network, there is a client-side proof-of-work mechanism to prevent transaction spam from public keys trying to flood the network, or submitting a number of transactions that could slow down the network for all participants.

Every transaction must include a proof-of-work calculation derived from a recent block, proving the transaction was created recently. The proof-of-work is calculated by the Vega Wallet software. It does not incur gas fees and does not have any effect on a transaction's priority.

It's possible to submit a large volume of transactions at one time, as long as the proof-of-work is calculated by the wallet adequately.

The Vega Wallet apps generate the required proof-of-work for a public key's transaction based on any other transactions submitted by that key pair.

#### Policy enforcement
If a public key submits transactions for which the proof of work is based on a given block height, and the number of transactions is above the maximum set by the network parameter (<NetworkParameter frontMatter={frontMatter} param="spam.pow.numberOfTxPerBlock" hideValue={true} />), the difficulty of the PoW increases (if it's not set to 0) and the proof will take longer to calculate, i.e., transactions will take longer to be generated but can still be included in a block.

A transaction with a missing or incorrect proof is rejected, as is any transaction that uses an already-used PoW calculation. A public key that sends transactions with faulty proof-of-work calculations is banned for 30 seconds or 1/48th of an epoch, whichever is greater.

See a full list of the network parameters used for PoW in the [spam protection parameters table](#spam-protection-and-pow-parameters).

:::note Go deeper
**[Spec: Spam protection PoW ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0072-SPPW-spam-protection-PoW.md)**: Implementation details and how this mechanism works in particular circumstances.
:::

### Spam protection and PoW parameters

| Spam protection parameter           	| Definition 	        | Value
|-----------------------------------	|-------------------	|-------------------
| spam.protection.proposal.min.tokens  	| Minimum tokens needed to submit a governance proposal	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />
| spam.protection.voting.min.tokens    	| Minimum tokens needed to vote on a governance proposal	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />
| spam.protection.max.batchSize         | Maximum number of transactions that can be in one batch | <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.batchSize" hideName={true} />
| spam.protection.delegation.min.tokens | Minimum tokens needed to nominate a validator | <NetworkParameter frontMatter={frontMatter} param="spam.protection.delegation.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />
| spam.protection.max.delegations       | Maximum number of nomination (delegation) transactions a public key can submit per epoch.	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.delegations" hideName={true} />
| spam.protection.max.proposals         | Maximum number of governance transactions a public key can submit per epoch | <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.proposals" hideName={true} />
| spam.protection.max.votes             | Maximum number of governance votes a public key can submit per epoch 	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.votes" hideName={true} />
| spam.protection.minimumWithdrawalQuantumMultiple | Min amount allowed per withdrawal, dependent on asset's quantum value | <NetworkParameter frontMatter={frontMatter} param="spam.protection.minimumWithdrawalQuantumMultiple" hideName={true} />  | 
| spam.protection.maxUserTransfersPerEpoch | Max number of transactions a public key can submit per epoch | <NetworkParameter frontMatter={frontMatter} param="spam.protection.maxUserTransfersPerEpoch" hideName={true} />  | 
| **Proof of work parameters** | |
| spam.pow.numberOfTxPerBlock       	| Maximum number of transactions a wallet can put in one block 	| <NetworkParameter frontMatter={frontMatter} param="spam.pow.numberOfTxPerBlock" hideName={true} />
| spam.pow.difficulty               	| To prevent flooding the chain with transactions, wallets need to perform a proof-of-work (PoW) calculation to submit them. This defines the difficulty level	| <NetworkParameter frontMatter={frontMatter} param="spam.pow.difficulty" hideName={true} />
| spam.pow.hashFunction              	| Hash function used for proof-of-work	| <NetworkParameter frontMatter={frontMatter} param="spam.pow.hashFunction" hideName={true} />
| spam.pow.increaseDifficulty           | If a wallet exceeds the max transactions per block, the difficulty of the PoW increases by this factor | <NetworkParameter frontMatter={frontMatter} param="spam.pow.increaseDifficulty" hideName={true} />
| spam.pow.numberOfPastBlocks         	| To compute the wallet transaction quota, transactions can be assigned to past blocks; this parameter defines how far back that goes | <NetworkParameter frontMatter={frontMatter} param="spam.pow.numberOfPastBlocks" hideName={true} />


## Loading node state: Snapshots
To allow a Vega node to be restarted without the need to replay the whole blockchain, a Vega node can load an existing snapshot created by a different node, which will populate all the node state. The node then downloads and replays blocks from the height corresponding to the snapshot, until it gets to the live block height, at which point it will be able to contribute to the chain.

:::note Try it out
[How to use snapshots](../../node-operators/how-to/use-snapshots.md): A a step-by-step guide for node operators to load state with snapshots. 
:::

## Network restarts: LNL checkpoints
The network's validators periodically store checkpoints of all essential state parameters such as balances and governance proposals. LNL (limited network life) checkpoints allow the chain to be restarted from a previously valid state in the event of consensus failure, a full network restart, or a critical issue being discovered.

Limited network life checkpoints save a more limited set of information than snapshots, making them quicker to produce and easier to understand and restore from in case of emergency. This is at the cost of needing a synchronous network restore and losing traders' positions and orders. In the event of a restart using an LNL checkpoint, margin, bond and other balances are summed up and restored based on the last market to market cashflow.

LNL checkpoints happen at defined intervals, and on every deposit and withdrawal request.

### How a checkpoint is created and used
1. Each validator node generates a checkpoint file, which is saved with a hash. That hash is used as the consensus for the block - if there’s no consensus the network will not be able to run.
2. If a network is taken down, the checkpoint file’s hash, as well as all the checkpoint data, is added to the genesis block by a validator.
3. A node operator then updates the genesis file in the networks repo with the network’s new start date, the new network ID, and the hash of the checkpoint file to be used in the network restoration. Once the file is updated, the node operators need to approve and merge the change.
4. If the checkpoint file hash matches the expected hash from genesis, when validators restart their nodes, the network will be restored with the state and then allow other transactions on the network.

### Information restored with checkpoints
* **Network parameters** and their values
* **Account/asset balances per market**, including those for: insurance pools, reward accounts, committed liquidity, liquidity fee pools 
* **Account balances per party and per asset**: general, margin and liquidity bond accounts
* **Enacted market details**, including their balances along with the market creation proposal that initiated the market
* **Market creation and update proposals** that were accepted (and enacted), excluding those for terminated markets
* **Asset proposals** that were accepted (and enacted)
* **Token nominations** to validators
* On-chain **treasury balances and staking rewards**
* **Withdrawal** transaction bundles for all withdrawals, across all bridged chains
* **Deposits**: Event ID of the **last processed deposit** event for all bridged chains, last block height of any confirmed ERC-20 deposits on the Ethereum chain, including number of confirmations; all pending ERC-20 deposits (not confirmed before last block) on the ethereum bridge
* Hash of the **last block** 
* **Snapshot block number and transaction ID** of the block from which a snapshot is derived
* **Stake**: Last block of confirmed stake deposits on the staking bridge and vesting contracts, along with the number of confirmations, plus all completed and pending staking events on both contracts

:::note Try it out
[How to restart a network using a checkpoint](../../node-operators/how-to/restart-network.md)
:::

<!-- ### ***Further reading*** 
## Tendermint consensus
 ### Transaction and sequencing
 ### Transaction ordering
## Fairness (Wendy)
 -->
