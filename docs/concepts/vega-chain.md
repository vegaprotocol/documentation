---
sidebar_position: 2
title: Vega Chain
hide_title: false
---

Vega uses Tendermint as a consensus layer to form a blockchain. The rest of the information here informs on how that blockchain and its relevant components is comprised. 

Read more: [How Vega bridges to Ethereum](/docs/concepts/vega-chain/#bridges-used-for-staking)

## Delegated proof of stake
Vega runs on a delegated proof of stake blockchain. 

Validating nodes run the Vega network, and they decide on the validity of the blocks containing the network's transactions and thus execute those transactions. The validators who run validating nodes are required to own a minimum amount of VEGA tokens that they delegate to themselves.

Read more: [Validating nodes](/docs/concepts/vega-chain#validating-nodes)

**Participants who hold a balance of VEGA, the governance asset, can use their tokens to nominate validating nodes.** This is done by associating those tokens to a Vega key to use as stake, and then nominating one or more validators they trust to help secure the network. Nominating validators loans the consensus voting weight of the VEGA tokens to endorse a validator's trustworthiness. 

Tokens, in addition to their use for nominating validators, also grant tokenholder voting rights on governance actions. If a token is delegated, its governance voting rights stay with the tokenholder and are not transferred to any validators that the tokenholder nominates.

Everyone participating in keeping the network secure, robust and reliable, including nominators, is **rewarded** for keeping the network running. Not meeting the requirements of running the network can lead to penalties, such as **rewards being withheld**.

Read more: [Rewards](/docs/concepts/vega-chain#rewards)

Vega is non-slashing -- there is no mechanism through which a tokenholder can lose a staked token through a validator being punished. Any measures to that end use different mechanisms that will affect a bad validator's (and potentially their delegators') revenue, but does not affect the delegated tokens themselves.

Read more: [Penalties](/docs/concepts/vega-chain#penalties)

### VEGA token
Vega uses the VEGA ERC20 token for governance, which includes nominating validators to run nodes, and creating and voting on governance proposals.

A VEGA token (or fraction) can be either dissociated or associated with a Vega key:

* **Dissociated**: A tokenholder is free to do what they want with the token, but cannot nominate a validator with it
* **Associated**: The token is locked in the staking smart contract and can be used to nominate a validator. It must be dissociated to withdraw it

**All tokens can be used for staking and voting** on governance proposals. This includes tokens that are locked in the vesting contract. Tokens that are staked can be used to vote, and tokens used to vote can be staked.

Read more: [Governance of Vega](/docs/concepts/vega-protocol#governance)

:::info
A user's VEGA tokens must first be associated with a Vega key before they can be used for governance and staking.
:::

### Bridges used for staking
Both associating and dissociating VEGA tokens to a Vega key are initiated on Ethereum, rather than on the Vega protocol. This allows VEGA to be staked with a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network.

All governance voting and validator nominations happen exclusively on the Vega chain. 

:::info
Ethereum gas fees are only incurred in the process of associating tokens to a Vega key and transferring rewards from a Vega key to an Ethereum address. Nominating validators and changing nominations does not incur gas fees.
:::

The Vega protocol listens for stake events from staking bridges. Currently there are two bridges: one for staking unlocked, freely tradeable tokens, and one that connects to the vesting contract for locked, untradeable tokens. 

* Staking **unlocked tokens** uses the staking bridge contract. The staking bridge contains functions enabling users to deposit, remove, and transfer stake by notifying the staking bridge what tokens are associated to which Vega key. 

* When staking **locked tokens**, the Vega node interacts with the ERC20 vesting contract, which holds tokens that are locked per a vesting schedule, and provides the same utility as the staking bridge smart contract. This allows locked tokens to be used for staking and governance while not being freely tradeable. 

Whether tokens are unlocked or locked, the bridge events let the Vega network know how many tokens a given party has associated and/or dissociated.

All events (including the above, plus stake per validator and others) are only registered after a certain number of block confirmations, as defined by the network parameter `blockchains.ethereumConfig`. 

:::note Further reading
**[Staking Bridge contracts](https://github.com/vegaprotocol/Staking_Bridge)** - on Vega's staking bridge GitHub repository.
:::

### Spam protection
There are several spam protections enabled to protect the Vega network. 

* A participant who wants to submit a delegation (nomination) transaction, needs to have a balance of at least the minimum defined by the network parameter `spam.protection.delegation.min.tokens` to be able to submit the transaction
* A participant cannot send more delegation transactions per day than the max set by the `spam.protection.max.delegations` network parameter

## Staking on Vega
Vega networks use the ERC20 token VEGA for staking. Staking requires the combined action of associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using those token(s) to nominate one or more validators. 

#### Epochs
An epoch is a time period during which staking changes can be announced and then implemented. Changes that are announced in one epoch will only be executed in the following epoch (excepting ['un-nominate now'](/docs/concepts/vega-chain#un-nominate-now)). The length of an epoch is set by the network parameter `validators.epoch.length`. 

### Nominating validators
Using tokens to nominate validators keeps the decentralised network functioning. 

Tokenholders can nominate validators to encourage a diverse set of reliable nodes running the network, and to give the community the opportunity to disincentivise and/or remove bad validators. Tokenholders who nominate validators are also eligible for rewards. 

When a tokenholder chooses a validator (or validators) to nominate with their tokens, the amount is immediately subtracted from their available balance, and is used at the start of the next epoch to actively nominate those validator(s).

Read more: [Rewards for staking](/docs/concepts/vega-chain#rewards)

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

If nominated tokens are moved to a different Ethereum address, they are un-nominated immediately, (equivalent to ['un-nominate now'](/docs/concepts/vega-chain#un-nominate-now)) and rewards are forfeited for that epoch. In this case, or any case in which you dissociate tokens without first removing the nomination from a particular validator, the tokens are un-nominated from each validator you've nominated, in proportion to the nomination. 

#### Un-nominate towards the end of the epoch
A participant can un-nominate towards the end of the current epoch, which means the stake is not used for the validator from the following epoch. The participant, and their nominated validator, is entitled to the rewards from that epoch (unlike when un-nominating now). 

The action is announced in the next available block of the same epoch, but the nominator keeps their nomination active until the last block of that epoch. At that point, the tokens are returned. The nominator cannot move those tokens before the epoch ends.

#### Un-nominate now
A participant can choose to un-nominate at any time, and the action is executed immediately following the block it is announced in (within the same epoch). 

The participant will not receive any rewards from the validator in that epoch. The tokens are marked as available to the participant.

## Staking rewards & penalties

### Rewards
Validators and nominators both receive incentives for securing the network. The amount of those incentives, rewarded as VEGA, depends on factors including how much stake is nominated. 

**To be considered for staking rewards, a tokenholder must associate VEGA to a Vega key and nominate one or more validators.**

:::info
VEGA tokenholders can use **[token.vega.xyz](https://token.vega.xyz)** to associate their tokens and nominate validators to receive rewards. Staking rewards are paid into your Vega wallet after each epoch ends. 

Staking rewards must be withdrawn to an Ethereum wallet, and then associated to a Vega wallet, before they can be staked.

CoinList custodial users should confirm with CoinList how staking works for them.
:::

In each epoch, rewards are distributed among validators in proportion to the number of tokens they represent (i.e., their total stake). The total stake includes a validator's own stake and the tokens nominated to that validator. Of this reward, a fixed amount is distributed among the tokenholders the validator represents.

The reward scheme uses a linear reward curve - the reward per staked token is independent of the behaviour of other tokenholders. 

This holds for validators as well, with the exception that there is a maximum amount of stake an individual validator can take on. To avoid validators getting too big, the rewards a validator gets, and thus can distribute to its nominators, is capped. In other words, the reward per token is decreases if a validator exceeds a maximum size.

At the end of each epoch, reward payments are calculated per active validator, and then some of that reward is divided between their nominators. 

Read more: [Risks of over-staked validators](/docs/concepts/vega-chain#too-much-stake)
 
:::note Further reading
**[Staking rewards spec](https://github.com/vegaprotocol/specs/blob/main/protocol/0058-REWS-simple_pos_rewards.md)** - more detail on how rewards are calculated and will be in future iterations. 
:::

### Penalties
Validating nodes that don't meet the requirements or prove to be bad actors will have rewards withheld, and a vaildator's nominators may also receive fewer (or no) rewards. 

There is no token slashing, i.e., a tokenholder cannot lose their tokens through any actions of a validator.

Read more: [How a validating node's performance is determined](/docs/concepts/vega-chain#validating-node-performance)

## Validating nodes
The Vega network is operated by a number of independent validators, who each run a node.

There are two types of validating nodes: consensus validators and standby validators.

## Consensus validating nodes
Consensus validating nodes are responsible for agreeing on the order of transactions and creating new blocks so that all nodes can agree on the state of the network.

They receive rewards based on having enough (but not too much) self-stake, as well as how many tokenholders nominate them. The tokenholders who nominate them also receive a cut of the rewards.

If a consensus validator's stake or performance is subpar, their validator score will be lowered, and that validator's node will be chosen less frequently to propose a block, because Vega feeds the voting power of each validating node to the Tendermint consensus algorithm.

This can also affect the rewards they and their nominators receive.
If a consensus validating node stops validating, or performs poorly, then a standby validator can replace it.

### How consensus validators are chosen
Consensus validators are chosen based on a range of variables, including the validator scores, and the number of available slots. If there are no empty slots, at most one validator can be changed per epoch.

If a standby validator has a better overall performance than an existing consensus validator, then a standby validator can be promoted to replace a consensus validator.

## Standby validators
Standby (also called ersatz) validators do not contribute to the chain, but are set up to join the consensus validator set if an existing validator drops off. As they don’t participate in consensus, they don’t need to be registered with a multisig contract.

As with the consensus validators, standby validators are defined based on how much self-stake and nominated stake they have.

Standby validators, and the tokenholders who stake them, receive a share of rewards. The rewards for standby validators are calculated and penalised in the same way as consensus validators, except scaled down. How much they are scaled is based on the network parameter `network.validators.ersatz.rewardFactor`.

### How standby validators are chosen
If there are free slots for one or more standby validators, and there are nodes that have submitted the transaction to join (and satisfy all joining conditions), they are added as standby validators in the next epoch. 

If a node that submits the transaction to join has a higher score than the lowest scoring standby validator (scaled up by the incumbent factor), then it will become a standby validator and the lowest scoring standby validator is removed from the standby set.

As the nodes vying for a standby spot will not have a performance record, their performance score is calculated as the average of the performance scores of all standby validators.

Note: An inactive node that's proposing to become a validator will have a performance score of 0 and will thus be automatically excluded, regardless of their stake.

Read more: [Becoming a validator](/docs/concepts/vega-chain#becoming-a-validator)

### Moving from standby to consensus validator
A standby validator that wants to be in line for promotion to become a consensus validator needs to do the following: 

1. Run a non-validating node
2. Have enough self-stake, (as defined by the network parameter `reward.staking.delegation.minimumValidatorStake`) 
3. Forward the relevant Ethereum events

## Validating node performance
A validating node’s performance is calculated based on three factors:

* Ranking, whether it is a consensus or standby validator
* Voting power based on the performance, which defines the performance score
* Stake, which defines the validator score

### Performance score: Consensus validators
For each block, the proposer is selected deterministically and the number of times each consensus validator is selected is roughly proportional to their voting power.

A validator’s performance is calculated as follows:

let `p` be the number of times the validator proposed blocks in the previous epoch 
let `b` be the number of blocks in the previous epoch 
let `v` be the voting power of the validator in the previous epoch 
let `t` be the total voting power in the previous epoch
let expected = `v*b/t` the number of blocks the validator is expected to propose. 
Then `validator_performance = max(0.05, min((p/expected, 1))`

### Performance score: Standby validators
The performance score for *new* standby validators is set to 0. The performance score of a standby validator is calculated based on them successfully submitting transactions.

Validator candidates that have submitted a transaction to become consensus validating nodes will need to send a hash of block number `b`, separately signed by the three required keys and submitted, during each epoch and every set number of blocks (`numBlocks`). 

`numBlocks` = the higher of (the lower of (50 and the epoch duration in seconds) and (epoch duration in seconds x 0.01)

The message with the signed block hash must be in blocks `b+numBlocks` to `b+numBlocks` to count as successfully delivered.

The network will verify this to confirm that the validator owns the keys. 

`b` is defined as: 
* The first time, it is the block number in which the joining transaction was included
* Subsequent times, it is incremented by `numBlocks`

The network will keep track of the last 10 times a standby validator was meant to submit the transactions, and the performance score is the number of times this has been verified, divided by 10.

### Validator score
The validator score is calculated for each epoch, based on how much stake a validator has as well as other factors including the total number of validators and the optimal stake. This is true for both consensus and standby validators. 

If, at the end of an epoch, a validator does not have sufficient stake self-nominated or has overall too much stake, then their validator score will be lowered. This can impact the rewards a validator and its nominators receive. 

Below are the two factors that can lower a validator's score, and why. 

#### Not enough self-nominated stake
Self-nominated stake refers to the amount of VEGA a validator has staked to their own node.  The minimum stake amount required is defined by the network parameter `reward.staking.delegation.minimumValidatorStake`. Not having enough self-nominated stake can have an impact on rewards. 

* **Network risk**: A validator who has not committed enough stake to meet the minimum is a risk to the network because they may not be invested in keeping the network running
* **Validator score**: If a validator does not meet the `reward.staking.delegation.minimumValidatorStake`, the validator is given a lower score
* **Reward impact**: A validator with too little self-stake forfeits their share of the rewards for each epoch they are below the threshold, and tokenholders who nominated that validator **will not receive rewards** for every epoch the node is below the minimum

#### Too much stake
An over-staked validator has more stake than is ideal for a healthy and functioning network. Staking to an over-staked node can affect the rewards a tokenholder receives. 

* **Network risk**: The risk of an over-staked node is that it could have too much consensus voting power
* **Validator score**: A node that is over-staked is given a lower validator score - the more over-staked it is, the lower the score 
* **Reward impact**: If a validator is too far from optimal stake, the validator and tokenholders who nominated that validator **will not receive rewards** for every epoch the node is heavily over-staked

:::info 
As of version 0.47.5, the Vega network does not prevent tokenholders from nominating stake that would cause a node to be over-nominated. Tokenholders must actively manage their stake and keep track of the nodes they support.
:::

#### Validator score calculations
The validator score takes into account a number of factors, including the total stake, optimal stake, minimum number of validators required, actual number of validators, and more. See below for how the validator score is calculated. 

Factors that affect the validator score:

`min_validators` = value of the network parameter that defines the minimum viable number of validators to run Vega
`num_validators` = actual number of validators running nodes on Vega
`comp_level` = value of the network parameter that defines the competition level
`total_stake` = sum of all stake across all validators and their delegations
`optimal_stake` = total delegation divided by the greater of `min_validators`, OR (`num_validators` / `comp_level`): Optimal stake is how much stake each validator is expected to have, at most
`optimal_stake_multiplier` = value defined by the network parameter, which indicates how many times the optimal stake a validator is penalised for, if they are further than the optimal stake

`validator_stake_i` = stake of the given validator whose score is being calculated
`flat_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake`)
`higher_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake_multiplier` * `optimal_stake`)

The validator score is calculated as follows:

`validator_score` = (`validator_stake_i` - `flat_penalty` - `higher_penalty`) / `total_stake`

**Example:**

Assuming the available reward pool is 1000, and there are 3 validators:
- Validator 1 is heavily over-staked and they are given a validator score of 0
- Validator 2 is not over or under-staked and gets a validator score of 0.2
- Validator 3 is also well-staked and gets a validator score of 0.2

Those scores are then normalised (divided by the sum of them):
- Validator 1 gets a normalised score of 0
- Validator 2 gets a normalised score of 0.5
- Validator 3 gets a normalised score of 0.5

The normalised validator score number directly affects how much each validator (and its nominators) would recieve of the 1000 reward. 

- Validator 1 (and its nominators) will receive 0 rewards. Validator 2 & 3 will split the 1000 equally.

## Becoming a validator

::info 
The network is set to not allow any standby validators for alpha mainnet, and the number of validators will be increased via governance as early alpha mainnet progresses.
:::

A node operator that wants to express interest in running a validating node for Vega needs to do the following: 

1. Start a Vega node as non-validating node, including the associated infrastructure: a system with a minimum of 4 cores, 16GB RAM, and 256GB SSD (subject  to increase in the future)
2. Submit a transaction using their keys, announcing they want to validate, and receive a response that the network has verified key ownership (see below)
3. Self-stake to their validator Vega key at least as much as the amount defined by the reward.staking.delegation.minimumValidatorStake network parameter
4. Wait for others to delegate to them. It would be worth announcing to the community that you have started a node and are looking for stake)

### How candidate validators are ranked
At the end of each epoch, the Vega network will calculate validator score. The consensus validators during that epoch will have their validator scores scaled by (1 + `network.validators.incumbentBonus`). This number combines self-stake and nominated stake with the performance score (which measures basic node performance).

Vega sorts all current consensus validators from the highest performance score to the lowest. All of those who submit a transaction expressing intent to be a validator are then sorted by their validator score, highest to lowest.

* If there are already empty consensus validator slots, then the non-consensus validators who have the top scores are moved in to be consensus validators, starting in the next epoch.
* If a potential validator has a higher score than the lowest incumbent consensus validator, then in the next epoch the higher-scoring validator becomes a consensus validator, and the lowest scoring incumbent becomes a standby validator.
* If two validators have the same performance score, then the network places higher the one who's been validator for longer, and if two validators who joined at the same time have the same score, the priority goes to the one who submitted the transaction to become validator first.

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

1. Each validating node calculates the hash of the checkpoint file and then sends this through consensus to ensure all the nodes in the network agree on the state. 
2. If/when a network is taken down, the checkpoint file's hash is added to the genesis block. 
3. At network start-up, a validator submits a restore transaction with the checkpoint file. 
4. All other validators verify the checkpoint against their own, restore the state and then allow other transactions on the network. 

<!-- ### ***Further reading*** 
DPOS - For a full list of data stored in a checkpoint, see SPECS LINK.
Non-validator participants keep the network fair by controlling the voting power of validators. When tokens are delegated, the tokenholders choose the validators for the network. it is the responsibility of tokenholders to manage who validates the network (and its transactions).
## Tendermint consensus
 ### Transaction and sequencing
 ### Transaction ordering
## Fast syncing (Snapshots) 
## Fairness (Wendy)
 -->
