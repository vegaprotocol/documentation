---
sidebar_position: 4
title: Network 
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-staking.mdx'

## Network life
Vega networks will, at least initially, run for a limited time only, and chain restarts will pick up from the most recent valid state. A network restart will be driven by situations including Vega protocol and Tendermint software upgrades.

Ensuring that the latest software versions are being used by all validators when the software is ready lessens the risk of incompatible or outdated code leading to a consensus failure, and removes the burden of supporting multiple versions. Upgrades to a running chain need to respect and be able to recalculate the deterministic state for earlier blocks, so all versions of critical code must remain in the system. 

## Network-wide limits
Some limits have been introduced to the protocol in an aim to keep the overall system performant and responsive, with low-latency. As the system relies on both a lean core and a data node that consumes and provides data, having limits allows the option to somewhat control how many computations and how much data is generated, while also allowing full use of the protocol's functionality. 

These limits are adjustable, so each network can be set up for maximum flexibility, and offer tokenholders the chance to change the values of those limits through network parameter governance.

These limits are not totally dissimilar to the spam controls that are also implemented, which aim to mitigate the possibility of malicious actors deliberately flooding the system with junk requests. 

### Maximum pegged orders and liquidity commitment shapes
Currently, two transaction types can be limited:
* Total number of pegged orders on all active markets: controlled by network parameter <NetworkParameter frontMatter={frontMatter} param="limits.markets.maxPeggedOrders" />
* Number of offsets in each liquidity commitment order shape (per side), controlled by <NetworkParameter frontMatter={frontMatter} param="market.liquidityProvision.shapes.maxSize" />

If either parameter's value is decreased (through a governance proposal and vote), then the change does not affect existing orders on the market, but only new orders/liquidity commitments placed after the change is enacted. 

## Spam protection [WIP]
On a decentralised and pseudonymous network, there's always a possibility that a malicious actor will attempt to spam blocks and fill them with meaningless transactions. To mitigate that risk, there are several spam protections enabled to protect the Vega network, in particular by enforcing minimums and maximums for transactions sent to the Vega network.

The values of all spam protection network parameters can be changed through a governance vote. If a parameter change passes governance, it takes effect in the epoch after it passes.

### Spam policy enforcement
Messages that don't follow the anti-spam rules are rejected, either pre- or post-block.

Pre-block rejection: A transaction is rejected before it enters the validators' mempool. This can only be done based on transactions that were in the previous block, and not on any other transactions received by a validator but not yet put into a block. Once a block is scheduled, all transactions in the mempool are verified. If a transaction fails the applicable spam rules set by the [parameters](#spam-protection-parameters) below, it's not processed and is removed.

Post-block rejection: A transaction makes it into the block, but is rejected before it's passed to the application layer. This allows for more fine-grained policies, but the offending transaction will take up space in the blockchain. If a transaction fails the spam rules set by the [parameters](#spam-protection-parameters) below, it is rejected and may trigger a spam threshold increase.

### Spam protection parameters

| Spam protection parameter           	| Definition 	        | Value
|-----------------------------------	|-------------------	|-------------------
| spam.protection.proposal.min.tokens  	| Minimum tokens needed to submit a governance proposal	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />
| spam.protection.voting.min.tokens    	| Minimum tokens needed to vote on a governance proposal	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />
| spam.protection.delegation.min.tokens | Minimum tokens needed to nominate a validator | <NetworkParameter frontMatter={frontMatter} param="spam.protection.delegation.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />
| spam.pow.difficulty               	| To prevent flooding the chain with transactions, wallets need to perform a proof-of-work (PoW) calculation to submit them. This defines the difficulty level	| <NetworkParameter frontMatter={frontMatter} param="spam.pow.difficulty" hideName={true} />
| spam.pow.hashFunction              	| Hash function used for proof-of-work	| <NetworkParameter frontMatter={frontMatter} param="spam.pow.hashFunction" hideName={true} />
| spam.pow.numberOfTxPerBlock       	| Maximum number of transactions a wallet can put in one block 	| <NetworkParameter frontMatter={frontMatter} param="spam.pow.numberOfTxPerBlock" hideName={true} suffix="tokens" formatter="governanceToken" />
| spam.pow.increaseDifficulty           | If a wallet exceeds the max transactions per block, the difficulty of the PoW increases by this factor | <NetworkParameter frontMatter={frontMatter} param="spam.pow.increaseDifficulty" hideName={true} />
| spam.pow.numberOfPastBlocks         	| To compute the wallet transaction quota, transactions can be assigned to past blocks; this parameter defines how far back that goes | <NetworkParameter frontMatter={frontMatter} param="spam.pow.numberOfPastBlocks" hideName={true} />
| spam.protection.max.batchSize         | Maximum number of transactions that can be in one batch | <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.batchSize" hideName={true} />
| spam.protection.max.delegations       | Maximum number of nomination (delegation) transactions a public key can submit per epoch.	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.delegations" hideName={true} />
| spam.protection.max.proposals         | Maximum number of governance transactions a public key can submit per epoch | <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.proposals" hideName={true} />
| spam.protection.max.votes             | Maximum number of governance votes a public key can submit per epoch 	| <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.votes" hideName={true} />
| spam.protection.maxUserTransfersPerEpoch | Max number of transactions a public key can submit per epoch | <NetworkParameter frontMatter={frontMatter} param="spam.protection.maxUserTransfersPerEpoch" hideName={true}" />

## Checkpoints for restarts
The network's validators periodically store checkpoints of all important state parameters such as balances and governance proposals. 

Checkpoints allow the chain to be restarted from a previously valid state in the event of consensus failure, a network restart, or a critical issue being discovered.

Those checkpoints happen at defined intervals, and on every deposit and withdrawal request. 

### How a checkpoint is created and used
1. Each validator node calculates the hash of the checkpoint file and then sends this through consensus to ensure all the nodes in the network agree on the state. A checkpoint file is then automatically produced and saved with a hash. 
2. When a network is taken down, the checkpoint file's hash is added to the genesis block. A node operator updates the genesis file in the networks repo with the network's new start date, the new network ID, and the hash of the checkpoint file to be used in the network restoration. Once the file is updated, the node operators manually approve the change, and then one validator submits the restore transaction with the relevant checkpoint file.
3. At network start-up, a validator submits a restore transaction with the checkpoint file. 
4. All other validators verify the checkpoint against their own. If the hash does not match, the transaction will have no effect. If the genesis file still has a previous state hash, all transactions will be rejected until the restore transaction arrives and is processed. If the hash matches, the network will be restored with the state and then allow other transactions on the network.

### Validator scores in a restart
The protocol needs a way to allow validators to continue initiating a restart, even before all information has been restored. 

Each checkpoint includes the node IDs of all consensus, standby, and candidate validator nodes and their scores. 

When initiating the restart all the nodes participating will temporarily be given the same Tendermint weight, which is used until the checkpoint has been fully processed. At that point, the weights are recalculated based on their state at the time the checkpoint was taken, and validators' scores are updated. 

If a validator with a Tendermint weight that was in the checkpoint and in the updated genesis is offline during the restart, then the network is stopped and the process will need to begin again with all validators available/any offline validators removed from the genesis list.

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

<!--
:::note Go deeper
See how a validator node can restore from a checkpoint.
-->

<!-- ### ***Further reading*** 
## Tendermint consensus
 ### Transaction and sequencing
 ### Transaction ordering
## Fast syncing (Snapshots) 
## Fairness (Wendy)
 -->





