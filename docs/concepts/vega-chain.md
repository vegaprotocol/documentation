---
sidebar_position: 2
title: Vega Chain
hide_title: false
---

Vega uses Tendermint as a consensus layer to form a blockchain. The rest of the information here informs on how that blockchain and its relevant components is comprised. [Read more about how Vega bridges to Ethereum](/docs/concepts/vega-chain/#bridges-used-for-staking). 

## Delegated proof of stake
Vega runs on a delegated proof of stake blockchain. Participants -- validators and token-holders -- use their VEGA tokens to nominate the validator nodes that run the network. Non-validator participants assign the voting rights of their VEGA tokens to endorse a validator's trustworthiness. 

**Participants who hold a balance of VEGA, the governance asset, can stake that asset on the network.** This is done by associating those tokens to a Vega key to use as stake, and then nominating one or more validators they trust to help secure the network. 

Everyone participating in keeping the network secure, robust and reliable, including nominators, is rewarded for keeping the network running. Not meeting the requirements of running the network can lead to penalties. 

### Penalties 
Validators that don't meet the requirements or prove to be bad actors will have rewards withheld. Nominators of a validator that doesn't meet the requirements will also receive fewer (or no) rewards. A validator's performance is calculated based on their **validator score**, and in the future their **performance score**. 

### Validator score
The validator score is calculated based on how much stake a validator has. If, at the end of an epoch, a validator does not have sufficient self-stake or has overall too much stake, then their validator score will be lowered. 

<!--
### ***Further reading***
Link to spec for staking and validator rewards when publicly available. (valpol)
-->

### VEGA token
Vega uses the VEGA ERC20 token for governance, which includes nominating validators, and creating and voting on governance proposals.

A VEGA token (or fraction) can be either unassociated or associated with a Vega key:

* **Unassociated**: The tokenholder is free to do what they want with the token, but cannot nominate a validator with it
* **Associated**: The token is locked in the staking smart contract and can be used to nominate a validator. It must be unassociated to withdraw it

**All tokens can be used for staking and voting** on [governance proposals](/docs/concepts/vega-protocol#governance). This includes tokens that are locked in the vesting contract. Tokens that are staked can be used to vote, and tokens used to vote can be staked.

:::info
A user's VEGA tokens must first be associated with a Vega key before they can be used for governance and staking.
:::

### Staking on Vega 
Vega networks use the ERC20 token VEGA for staking. Staking requires the combined action of associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using those token(s) to nominate one or more validators. 

**Epochs** 
An epoch is a time period during which staking changes can be announced and then implemented. Changes that are announced in one epoch will only be executed in the following epoch (excepting 'un-nominate now' - see below). The length of an epoch is set by the network parameter `validators.epoch.length`. 

### Nominating validators
Using tokens to nominate validators keeps the decentralised network functioning. 

Tokenholders can nominate validators to encourage a diverse set of reliable nodes running the network, and to give the community the opportunity to disincentivise and/or remove bad validators.

When a tokenholder chooses a validator (or validators) to nominate with their tokens, the amount is immediately subtracted from their available balance, and is used at the start of the next epoch to actively nominate those validator(s). 

:::info
VEGA tokenholders can use [token.vega.xyz](https://token.vega.xyz) to associate their tokens and nominate validators. A Vega Wallet and Ethereum wallet are both required. CoinList custodial users should confirm with CoinList how staking works for them.
:::

### Maximum stake per validator
Each validator has a maximum amount of stake that they can accept. During restricted mainnet, this will be the same amount for all validators. 

The max stake per validator equation includes all nominations and un-nominations requested in the next epoch, and the current epoch's active nominations, divided by the optimal number of validators. The optimal number of validators is defined using network parameters. 

It is calculated as: 

```
max stake per validator = (
current total stake across all validators 
   - total requested un-nominated stake 
   + total requested nominated stake) 
/ 
(max(
    reward.staking.delegation.minValidators, 
    (number of validators 
        / reward.staking.delegation.competitionLevel
    )
)
```

### Automatic nomination
Automatic nomination is triggered when an individual tokenholder has manually nominated 95%+ of their associated tokens. At that point, any newly associated tokens will automatically be nominated to the same validators, in the same proportion.

Exceptions to automatic nomination: 
* If, ahead of the next epoch a participant uses their available tokens to nominate validators manually, that takes precedence over automatic nomination. 
* For the epoch after un-nominating validators (see below), tokens are not auto-nominated, to provide time to change the delegation / remove tokens.  

### Un-nominating validators
Participants can remove their nomination at the end of an epoch, or immediately. The un-nominated tokens will be restored back to the participant's associated token balance.

**Un-nominate towards the end of the epoch** 

A participant can un-nominate towards the end of the current epoch, which means the stake is not used for the validator from the following epoch. 

The action is announced in the next available block of the same epoch, but the nominator keeps their nomination active until the last block of that epoch. At that point, the tokens are returned. The nominator cannot move those tokens before the epoch ends.

**Un-nominate now**

A participant can choose to un-nominate at any time, and the action is executed immediately following the block it is announced in (within the same epoch). 

The participant will not receive any rewards from the validator in that epoch. The tokens are marked as available to the participant.

### Staking rewards
Validators and nominators both receive incentives from the network, depending on factors including how much stake is nominated. 

**To be considered for staking rewards, a participant must associate VEGA to a Vega key and nominate one or more validators.**

For restricted mainnet, rewards are distributed among validators in proportion to their total stake. The total stake includes a validator's own stake and the tokens nominated to that validator. 

At the end of each epoch, reward payments are calculated per active validator, and then some of that reward is divided between their nominators. The proportion that goes to nominators is defined by the network parameter `reward.staking.delegation.delegatorShare`. 

:::note Further reading
Read the [staking rewards](https://github.com/vegaprotocol/specs/blob/main/protocol/0058-simple-POS-rewards.md) spec for full details for how rewards are calculated and will be in future iterations. 
:::
 
:::info
VEGA tokenholders can use [token.vega.xyz](https://token.vega.xyz) to associate their tokens and nominate validators to receive rewards. CoinList
custodial users should confirm with CoinList how staking works for them.
:::


### Bridges used for staking
Because VEGA is an ERC20 token, all actions regarding staking are initiated on Ethereum, rather than on the Vega protocol. This allows VEGA to be staked to a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network.

* Staking **unlocked tokens** is done using the staking bridge contract. The staking bridge contains functions enabling users to deposit, remove, and transfer stake by moving the governance tokens from their wallet to the staking bridge. 

* When staking **locked tokens**, the Vega node interacts with the ERC20 vesting contract, which holds locked tokens and provides the same utility as the staking bridge smart contract. 

Whether tokens are unlocked or locked, the bridge events make the Vega network of how many tokens a given party has associated and/or unassociated.

All events (including the above, plus stake per validator and others) are only registered after a certain number of block confirmations, as defined by the network parameter `blockchains.ethereumConfig`. 

:::note Further reading
The staking bridge contracts can be found on the [Staking Bridge repository](https://github.com/vegaprotocol/Staking_Bridge) on GitHub.
:::

### Spam protection
To avoid fragmentation or spam, there is minimum delegateable stake that defines the smallest unit (fractions of) tokens that can be used for delegation, defined by the network parameter `validators.delegation.minAmount`. 

## Validators
The Vega network is operated by a number of independent validators. Validators are responsible for agreeing on the order of transactions and creating new blocks so that all nodes can agree on the state of the network. 

In restricted mainnet, all validators effectively have the same stake, so all are selected an equal number of times to validate a block. Thus rewards will be equal between them, assuming they all continue to function. 

Restricted mainnet validators will not lose stake or rewards if they have a temporary interruption of service.

## Network life
Vega networks will, at least initially, run for a limited time only. 

There are several reasons for this decision, including: 

- Limited network life makes it efficient to upgrade the protocol by starting again, as it avoids the need to deal with multiple versions of the code. Upgrades to a running chain need to respect and be able to recalculate the deterministic state for earlier blocks, so all versions of criticial code must remain in the system. 
- It allows for rapid iteration, as the ability to start new chains for new features is simpler.
- Once there is a network with trading, the thousands of transactions per second will generate a lot of data. Given that most instruments expire, this allows for new markets to be created on a new chain, allowing an old market/chain to come to an end rather than keeping the history and data forever.

### Network checkpoints 
The network's validators periodically store checkpoints of all important state parameters such as balances and governance proposals. 

Checkpoints allow the chain to be restarted from a previously valid state in the event of consensus failure, or a critical issue being discovered. 

Those checkpoints happen at defined intervals, and on every deposit and withdrawal request. 

1. Each validator node calculates the hash of the checkpoint file and then sends this through consensus to ensure all the nodes in the network agree on the state. 
2. If/when a network is taken down, the checkpoint file's hash is added to the genesis block. 
3. At network start-up, a validator submits a restore transaction with the checkpoint file. 
4. All other validators verify the checkpoint against their own, restore the state and then allow other transactions on the network. 

<!-- ### ***Further reading*** 
For a full list of data stored in a checkpoint, see SPECS LINK.
## Tendermint consensus
 ### Transaction and sequencing
 ### Transaction ordering
## Fast syncing (Snapshots) 
## Fairness (Wendy)
 -->
