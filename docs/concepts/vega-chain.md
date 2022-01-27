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

### VEGA token
Vega uses the VEGA ERC20 token for governance, which includes nominating validators to run nodes, and creating and voting on governance proposals.

A VEGA token (or fraction) can be either unassociated or associated with a Vega key:

* **Unassociated**: The tokenholder is free to do what they want with the token, but cannot nominate a validator with it
* **Associated**: The token is locked in the staking smart contract and can be used to nominate a validator. It must be unassociated to withdraw it

**All tokens can be used for staking and voting** on [governance proposals](/docs/concepts/vega-protocol#governance). This includes tokens that are locked in the vesting contract. Tokens that are staked can be used to vote, and tokens used to vote can be staked.

:::info
A user's VEGA tokens must first be associated with a Vega key before they can be used for governance and staking.
:::

### Bridges used for staking
Because VEGA is an ERC20 token, all actions regarding staking are initiated on Ethereum, rather than on the Vega protocol. This allows VEGA to be staked to a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network.

* Staking **unlocked tokens** is done using the staking bridge contract. The staking bridge contains functions enabling users to deposit, remove, and transfer stake by moving the governance tokens from their wallet to the staking bridge. 

* When staking **locked tokens**, the Vega node interacts with the ERC20 vesting contract, which holds locked tokens and provides the same utility as the staking bridge smart contract. 

Whether tokens are unlocked or locked, the bridge events make the Vega network of how many tokens a given party has associated and/or unassociated.

All events (including the above, plus stake per validator and others) are only registered after a certain number of block confirmations, as defined by the network parameter `blockchains.ethereumConfig`. 

:::note Further reading
**[Staking Bridge contracts](https://github.com/vegaprotocol/Staking_Bridge)** - on Vega's staking bridge GitHub repository.
:::

### Spam protection
To avoid fragmentation or spam, there is a minimum delegateable stake that defines the smallest unit (fractions of) tokens that can be used for nomination, defined by the network parameter `validators.delegation.minAmount`. 

## Staking on Vega
Vega networks use the ERC20 token VEGA for staking. Staking requires the combined action of associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using those token(s) to nominate one or more validators. 

**Epochs**
An epoch is a time period during which staking changes can be announced and then implemented. Changes that are announced in one epoch will only be executed in the following epoch (excepting 'un-nominate now' - see below). The length of an epoch is set by the network parameter `validators.epoch.length`. 

### Nominating validators
Using tokens to nominate validators keeps the decentralised network functioning. 

Tokenholders can nominate validators to encourage a diverse set of reliable nodes running the network, and to give the community the opportunity to disincentivise and/or remove bad validators. Tokenholders who nominate validators are also eligible for rewards. [**Read more about rewards for staking.**](/docs/concepts/vega-chain#rewards)

When a tokenholder chooses a validator (or validators) to nominate with their tokens, the amount is immediately subtracted from their available balance, and is used at the start of the next epoch to actively nominate those validator(s). 

:::info
VEGA tokenholders can use **[token.vega.xyz](https://token.vega.xyz)** to associate their tokens and nominate validators. A Vega Wallet and Ethereum wallet are both required. CoinList custodial users should confirm with CoinList how staking works for them.
:::

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

## Staking rewards & penalties

### Rewards
Validators and nominators both receive incentives from the network, depending on factors including how much stake is nominated. 

**To be considered for staking rewards, a tokenholder must associate VEGA to a Vega key and nominate one or more validators.**

In each epoch, rewards are distributed among validators in proportion to the number of tokens they represent (i.e., their total stake)*. The total stake includes a validator's own stake and the tokens nominated to that validator. Of this reward, a fixed amount is distributed among the tokenholders the validator represents. Currently that value is 88.3%; though validators can vote to change that value.

*This is to a maximum number, after which their proportion no longer increases. 

The reward scheme uses a linear reward curve - the reward per staked token is independent of the behaviour of other tokenholders.  This holds for validators as well, with the exception of the a maximum amount of stake an individual validator can take on. [Read more about the risks of over-staked validators.](/docs/concepts/vega-chain#too-much-stake)

At the end of each epoch, reward payments are calculated per active validator, and then some of that reward is divided between their nominators. 
 
:::info
VEGA tokenholders can use **[token.vega.xyz](https://token.vega.xyz)** to associate their tokens and nominate validators to receive rewards. CoinList
custodial users should confirm with CoinList how staking works for them.
:::

#### Reward calculations [WIP]

== The proportion that goes to nominators is defined by the network parameter `reward.staking.delegation.delegatorShare`. 

Two parameters are relevant to the calculation of staking rewards, as well as two network properties.

`MinVal` is the minimum tolerable number of validators. If the number of validators goes below this value, the maximum size of a validator will shrink to the point that tokenholders are motivated to bring in more validators.

`CompetitionLevel` defines how large validators can get relative to each other. The current value (3.1) means that for all validators to reach their optimal revenue, a total of 310% of staked tokens would be required, leaving motivation for most validators to obtain more stake.

The other two parameters are the total amount of staked tokens, as well as the number of validators (currently 13).

```
func calcValidatorScore(normalisedValStake, minVal, compLevel, numVal float64) float64 {
a := math.Max(minVal, numVal/compLevel)
return math.Min(normalisedValStake, 1/a)
}
```

With the current parameters, the maximum delegation a validator can represent is 20% of the total number of delegated tokens, and this value will stay the same up to 15 validators - at which point the formula is no longer dominated by `minVal`, but by `numVal`/`complevel` - and then slowly decrease if more validators are added as the term `numVal`/`Complevel` increases.

:::note Further reading
**[Staking rewards spec](https://github.com/vegaprotocol/specs/blob/main/protocol/0058-REWS-simple_pos_rewards.md)** - more detail on how rewards are calculated and will be in future iterations. 
:::

### Penalties
Validator nodes that don't meet the requirements or prove to be bad actors will have rewards withheld, and a vaildator's nominators may also receive fewer (or no) rewards. 

There is no token slashing, i.e., a tokenholder cannot lose their tokens through any actions of the validator.

[Read more about how a validator node's performance is determined.](/docs/concepts/vega-chain#validator-node-performance)

## Validator nodes
The Vega network is operated by a number of independent validators, who each run a node. Validator nodes are responsible for agreeing on the order of transactions and creating new blocks so that all nodes can agree on the state of the network. 

If a validator's stake or performance is sub-par, their validator score (and eventually performance score) will be lowered, and that validator's node will be chosen less frequently to propose a block. Vega feeds the voting power of each validator node to the Tendermint consensus algorithm. 

Restricted mainnet validators will not lose stake or rewards if they have a temporary interruption of service.

### Validator node performance
A validator node's performance is measured by a validator score, and in the future, a performance score, as well. 

The validator score is calculated based on how much stake a validator has, with respect to several factors. 

If, at the end of an epoch, a validator does not have sufficient stake self-nominated or has overall too much stake, then their validator score will be lowered, which can impact the rewards they and their nominators receive. 

Below are the two factors that can lower a validator's score, and why. 

#### Not enough self-nominated stake
Self-nominated stake refers to the amount of VEGA a validator has staked to their own node.  The minimum stake amount required is set using the network parameter `reward.staking.delegation.minimumValidatorStake`.  Not having enough self-nominated stake can have an impact on rewards. 

* **Network risk**: A validator who has not committed enough stake to meet the minimum is a risk to the network because they may not be invested in keeping the network running.
* **Validator score**: If a validator does not meet the `reward.staking.delegation.minimumValidatorStake`, then the validator's score is set to zero
* **Reward impact**: A validator with too little self-stake forfeits their share of the rewards for each epoch they are below the threshold. However, tokenholders who nominated that validator will still receive rewards

#### Too much stake
An over-staked validator has more stake than is ideal for a healthy and functioning network. Staking to an over-staked node can affect your rewards. 

* **Network risk**: The risk of an over-staked node is that it could have too much consensus voting power
* **Validator score**: A node that is over-staked is given a lower validator score. 
* **Reward impact**: An over-staked validator and tokenholders who nominated that validator **will not receive rewards** for every epoch the node is over-staked

:::info 
As of version 0.47.5, the Vega network does not prevent tokenholders from nominating stake that would cause a node to be over-nominated. Tokenholders must actively manage their stake and keep track of the nodes they support.
:::

#### Validator score calculations [WIP]

Determining if a node is understaked or overstaked is calculated with respect to the 'optimal stake', which is how much stake a validator is expected to have, at most: 

```
Optimal stake = 
total delegation / max of (network parameter `reward.staking.delegation.minValidators`, 
actual number of validators / network parameter `reward.staking.delegation.competitionLevel`)
```

Validator score is calculated the following way:
let min_validators = the value of the network parameter defining what is the minimal number of validators for vega
let num_validator - the actual number of validators currently on vega
let comp_level - the value of the network parameter defining competition level
let total_stake - the sum of all stake across all validators and their delegations
then optimal_stake is defined as total_stake / max(num_validator/comp_level, min_validators)
the meaning of optimal_stake is how much stake we expect each validator to have at most.

Now come the penalties part:
let optimal_stake_multiplier - the value of the network parameter defining how many time the optimal stake you get penalised for if you are further than the optimal stake.
let validator_stake_i - the stake of the ith validator
flat_penalty = max(0, validator_stake - optimal_stake)
higher_penalty = max(0, validator_stake - optimal_stake_multiplier * optimal_stake)
validator_score = (validator_stake_i - flat_penalty - higher_penalty) / total_stake

**Example:**

Assuming the available reward pool is 1000, and there are 3 validators:
- Validator 1 is over-staked and they are given a validator score of 0
- Validator 2 is not over or under-staked and gets a validator score of 0.2
- Validator 3 is also good and gets a validator score of 0.2

Those scores are then normalised (divided by the sum of them):
- Validator 1 gets a normalised score of 0
- Validator 2 gets a normalised score of 0.5
- Validator 3 gets a normalised score of 0.5

The normalised validator score number directly affects how much each validator (and its nominators) would recieve of the 1000 reward. 

- Validator 1 (and its nominators) will receive 0 rewards. Validator 2 & 3 will split the 1000 equally.

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
