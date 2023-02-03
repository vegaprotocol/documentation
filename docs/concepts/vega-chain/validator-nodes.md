---
sidebar_position: 4
title: Validator nodes
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-staking.mdx'

# Validator nodes
The Vega network is operated by a number of independent validators, who each run a validator node, and may also run data nodes. 

There are three types of validating nodes: consensus validators, standby validators, and candidate validators. 

Consensus validators are responsible for keeping the network and transactions running. Standby validating nodes are ready to step in if a consensus validator node does not fulfil its requirements or the community votes to expand the set of consensus validators. Candidate validator nodes are one level below standby, and should be equipped to move up and replace a standby validating node if a spot opens up.

Tokenholders keep the network fair by controlling the voting power of validators. The tokenholders use their tokens to choose the validators for the network, thus managing who validates the network (and its transactions). By nominating credible validators that are running reliable nodes, tokenholders improve the stability and robustness of the network. Tokenholders who nominate validators receive a share of the rewards and fee revenue that validators receive.

:::note Read more
[Rewards for validators and their nominators](validator-scores-and-rewards.md#reward-allocation): How validators, and their nominators, are compensated for keeping the network running.
:::

## Consensus validator nodes
Consensus validator nodes are responsible for proposing new blocks so that all nodes can reach consensus on the order and content of transactions in that block and define the state of the network. 

Assuming they have a minimum amount of self-staked tokens, they receive rewards based on the total tokens nominated to their node, including from tokenholders. The tokenholders delegating to consensus validators receive a share of the rewards and fee revenue.

If a consensus validator node stops taking part in consensus, or performs poorly, then a standby validator can replace it.

### How consensus validators are chosen
Consensus validators are chosen based their [validator scores](validator-scores-and-rewards.md). The maximum number of consensus validators is set by a network parameter: <NetworkParameter frontMatter={frontMatter} param="network.validators.tendermint.number" />. The validators with the top scores are consensus validators. 

## Standby validators
Standby (also called ersatz) validators do not contribute to the chain, but are set up to join the consensus validator set if there are free slots for consensus validators, created by a consensus validator leaving the network, or more slots being made available through governance. As standby validators don’t participate in consensus, they don’t need to be registered with the multisig contract.

Standby validators, and the tokenholders who stake them, receive a share of rewards. The rewards for standby validators are calculated and penalised in the same way as consensus validators, except scaled down based on the scaling factor <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.rewardFactor" />.

### How standby can be promoted to consensus

:::info 
The network is set to not allow any standby validators before alpha mainnet, and the number of validators will be increased via governance as early alpha mainnet progresses.
:::

A standby validator can be promoted to take a consensus validator spot, if there is a standby validator with a better validator score than an existing consensus validator. 

Consensus validators have their validator scores scaled to recognise their incumbent status: (1 + <NetworkParameter frontMatter={frontMatter} param="network.validators.incumbentBonus" hideName={true} />), therefore a standby validator must surpass this boosted score to become consensus. This bonus is applied to avoid cases where validators with very similar stake could flip back and forth in status each epoch. 

If a node is eligible for promotion, it must forward a defined number of ethereum events and be added to the multisig contract to complete the process.

At most one validator can be replaced by a higher-scoring standby validator per epoch. However if the minimum number of consensus validators was increased by governance, multiple standby validators can be promoted to fill the available slots. That number can be changed by proposing a change to the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.tendermint.number" hideValue={true} />

### How standby validators are chosen
The number of standby validators on the network is set as a multiple of the number of consensus validators and is managed by the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" />. 

To become a standby validator, a candidate (described as 'Pending' in the APIs) validator must:

1. Have enough self-stake: <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> 
2. Submit a transaction using their keys, announcing they want to validate, and receive a response that the network has verified key ownership

If there are free slots for one or more standby validators, they are added as standby validators in the next epoch. If a node that submits the transaction to join has a higher validator score than the lowest scoring standby validator, then it will become a standby validator and the lowest scoring standby validator is removed from the standby set. As with consensus validators, if there are no free slots then only one node can replace a standby validator per epoch.

## Candidate validators
Any other nodes on the network are known as candidate (pending) validators. Nodes could be in this status for three reasons:

1. The node has not sent the necessary transaction to announce itself to the network
2. The node has sent the transaction, but does not have enough total stake to make become a standby or consensus validator
3. The node has not yet seen and then reported on enough Ethereum bridge transactions

When assessing which nodes will be promoted to standby, and potentially later consensus status, if two validators have the same performance score then the network places higher the one that has been validator for longer. Similarly if two validators who joined at the same time have the same score, the priority goes to the one who submitted the transaction to become validator first.

## Becoming a validator
A node operator that wants to express interest in running a validator node for Vega needs to do the following: 

1. Start a Vega node, including the [associated infrastructure](../../node-operators/index.md) and replay the chain
2. Submit a transaction using their keys, announcing they want to validate, and receive a response that the network has verified key ownership
3. Self-stake to their validator Vega key at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} />
4. Send heartbeat transactions to show that the node is online and connected to the network - this is done automatically if the node is set up correctly
5. Wait for others to nominate them. Validators are advised to introduce themselves to the Vega community on [Discord ↗](https://vega.xyz/discord), and create a profile on the [forums ↗](https://community.vega.xyz/c/mainnet-validator-candidates/23)

:::note Read more
[Node operator guides](../../node-operators/index.md): See the full set of instructions for setting up and running a node.
:::
