---
sidebar_position: 2
title: Vega Chain
hide_title: false
---

Vega uses Tendermint as a consensus layer to form a blockchain. The rest of the information here informs on how that blockchain and its relevant components is comprised. For more information on how Vega bridges to Ethereum, see (link). 

## Delegated proof of stake
Vega runs on a delegated proof of stake blockchain. Participants who hold a balance of VEGA, the governance asset, can stake that asset on the network. This is done by associating those tokens to a Vega key to use as stake, and then nominating one or more validators they trust to help secure the network. 

In a delegated proof of stake system, participants - validators and token-holders - use their VEGA tokens (or fractions of a token) to nominate a validator node. Validators (link) run the network, and non-validator participants assign the voting rights of their VEGA tokens to endorse a validator's trustworthiness. Everyone participating in staking is rewarded for keeping the network running (and penalised for not meeting the requirements of running the network). 

<!-- Penalties: 
- Validators can lose their VEGA to the network if they don't meet the requirements or prove to be bad actors. The tokens are sent to the insurance pool. (link to insurance pool section when available) 
- Nominators will lose future rewards

### ***Further reading***
Link to spec for staking and validator rewards when publicly available. (valpol)
-->

### VEGA token
Vega uses the VEGA ERC20 token for governance, which includes nominating validators, and creating and voting on governance proposals.

A VEGA token (or fraction) can be either unassociated or associated with a Vega key:

- Unassociated: The tokenholder is free to do what they want with the token, but cannot nominate a validator with it
- Associated: The token is locked in the staking smart contract and can be used to nominate a validator. It must be unassociated to withdraw it

All tokens, whether unlocked or locked in the vesting contract can be used for staking.
All tokens, whether associated or unassociated, can be used to vote on governance actions. 

:::info
A user's VEGA tokens must first be associated with a Vega key before they can be used for governance and staking.
:::

### Staking on Vega 
Vega networks use the ERC20 token VEGA for staking. Staking requires the combined action of associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using those token(s) to nominate one or more validators. 

**Epochs** 

An epoch is a time period during which staking changes can be announced and then implemented. Changes that are announced in one epoch will only be executed in the following epoch (excepting 'un-nominate now' - see below). The length of an epoch is set using the network parameter `validators.epoch.length`. 

### Nominating validators
Using tokens to nominate validators keeps the decentralised network functioning. Tokenholders are given the opportunity to nominate validators to encourage a diverse set of reliable nodes running the network, and to give the community the opportunity to dis-incentivise/remove bad validators.

When someone has VEGA associated to a Vega key, those tokens need to be nominated to a validator in order to be considered for staking rewards. When a tokenholder chooses a validator (or validators) to nominate with their tokens, the amount is immediately subtracted from their available balance, and is used at the start of the next epoch to actively nominate those validator(s). 

:::info
VEGA tokenholders can use [token.vega.xyz](https://token.vega.xyz) to associate their tokens and nominate validators. A Vega Wallet and Ethereum wallet are both required. CoinList custodial users should confirm with CoinList how staking works for them.
:::

Each validator has a maximum amount of stake that they can accept. During restricted mainnet, this will be the same amount for all validators, and is governed by a network parameter `maxStakePerValidator`. 

When a validator's token limit is reached, and more nomination would cause a validator's maximum stake to be exceeded, any additional nominated tokens will not be used. The remaining amount will be available to use to nominate another validator after the next epoch has begun.

**Un-nominating validators** 
Participants can remove their nomination at the end of an epoch, or immediately. The un-nominated tokens will be restored back to the participant's associated token balance.

_Un-nominate towards the end of the epoch_ 
A participant can un-nominate towards the end of the current epoch, which means the stake is not used for the validator from the following epoch. The action is announced in the next available block of the same epoch, but the nominator keeps their nomination active until the last block of that epoch. At that point, the tokens are returned. The nominator cannot move those tokens before the epoch ends.

_Un-nominate Now_ 
A participant can choose to un-nominate at any time, and the action is executed immediately following the block it is announced in (within the same epoch). The participant will not receive any rewards from the validator in that epoch. The tokens are marked as available to the participant.

#### Automatic delegation (WIP)
- A party becomes eligible to participate in auto delegation once they have manually nominated 95%+ of the association.
- Once entering auto delegation mode, any un-nominated associated tokens will be automatically distributed according to the current validator nomination of the party maintaining the same proportion.

#### Rewards (restricted mainnet)
Validators and nominators both receive incentives from the network, depending on factors including how much stake is nominated. 

For restricted mainnet, all rewards are evenly distributed among validators. 

At the end of each epoch, reward payments are calculated per active validator, and then some of that reward is divided between their nominators. The proportion that goes to nominators is defined by the network parameter `reward.staking.delegation.delegatorShare`. 
 
:::info
VEGA tokenholders can use [token.vega.xyz](https://token.vega.xyz) to associate their tokens and nominate validators to receive rewards. CoinList
custodial users should confirm with CoinList how staking works for them.
:::

### ***Further reading*** 
Read the [staking rewards](https://github.com/vegaprotocol/specs/blob/main/protocol/0058-simple-POS-rewards.md) spec for full details for how rewards are calculated. 

#### Bridges used for staking
Because VEGA is an ERC20 token, all actions regarding staking are initiated on Ethereum, rather than on the Vega protocol. This is allows VEGA to be staked to a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network.

Staking **unlocked tokens** is done using the staking bridge contract. The staking bridge contains functions enabling users to deposit, remove, and transfer stake by moving the governance tokens from their wallet to the staking bridge. 

In the case of **locked tokens**, the Vega node interacts with the ERC20 vesting contract, which holds locked tokens and provides the same utility as the staking bridge smart contract. 

Whether tokens are unlocked or locked, the bridge events make the Vega network of how many tokens a given party has associated and/or unassociated.

All events (including the above, plus stake per validator and others) are only registered after a certain number of block confirmations, as defined by the network parameter `blockchains.ethereumConfig`. 

(Link to autogenerated API sections for how people can see their staking balance) 

#### ***Further reading*** 
The staking bridge contracts can be found on the [Staking Bridge repository](https://github.com/vegaprotocol/Staking_Bridge) on GitHub.

#### Spam protection
To avoid fragmentation or spam, there is minimum delegateable stake that defines the smallest unit (fractions of) tokens that can be used for delegation, defined by the network parameter `validators.delegation.minAmount`. 

## Validators
The Vega network is operated by a number of independent validators. Validators are responsible for agreeing on the order of transactions and creating new blocks so that all nodes can agree on the state of the network. 

In restricted mainnet, all validators effectively have the same stake, so all are selected an equal number of times to validate a block. Thus rewards will be equal between them, assuming they all continue to function. Restricted mainnet validators will not lose stake or rewards if they have a temporary interruption of service. <!-- (What happens if a validator really messes up?) -->

## Network life (restricted mainnet)
Vega networks will, at least initially, run for a limited time only. 

There are several reasons for this decision, including: 

- Limited network life makes it efficient to upgrade the protocol by starting again, as it avoids the need to deal with multiple versions of the code. Upgrades to a running chain need to respect and be able to recalculate the deterministic state for earlier blocks, so all versions of criticial code must remain in the system. 
- It allows for rapid iteration, as the ability to start new chains for new features is simpler.
- Once there is a network with trading, the thousands of transactions per second will generate a lot of data. Given that most instruments expire, this allows for new markets to be created on a new chain, allowing an old market/chain to come to an end rather than keeping the history and data forever.

### Network checkpoints 
The network's validators periodically store checkpoints of all important state parameters such as balances and governance proposals. 

Checkpoints allow the chain to be restarted from a previously valid state in the event of consensus failure, or a critical issue being discovered. Those checkpoints happen at defined intervals, and additionally on every deposit and withdrawal request. Each validator node calculates the hash of the checkpoint file and then sends this through consensus to ensure all the nodes in the network agree on the state. 

If/when a network is taken down, the checkpoint file's hash is added to the genesis block. At network start-up, a validator submits a restore transaction with the checkpoint file. All other validators verify the checkpoint against their own, restore the state and then allow other transactions on the network. 

<!-- ### ***Further reading*** 
For a full list of data stored in a checkpoint, see SPECS LINK.
## Tendermint consensus
 ### Transaction and sequencing
 ### Transaction ordering
## Fast syncing (Snapshots) 
## Fairness (Wendy)
 -->
