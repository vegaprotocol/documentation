---
sidebar_position: 1
title: Delegated proof of stake
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-staking.mdx'

Vega runs on a delegated proof of stake blockchain. 

Validator nodes run the Vega network, and they decide on the validity of the blocks containing the network's transactions and thus execute those transactions. The validators who run validator nodes are required to own a minimum amount of <NetworkParameter frontMatter={frontMatter} param="validators.delegation.minAmount" hideName={true} suffix="tokens" formatter="governanceToken" /> that they stake to themselves.

Read more: [Validator nodes](#validating-nodes)

**Participants who hold a balance of VEGA, the governance asset, can use their tokens to nominate validator nodes.** This is done by associating those tokens to a Vega key to use as stake, and then nominating one or more validators they trust to help secure the network. Nominating validators loans the consensus voting weight of the VEGA tokens to endorse a validator's trustworthiness. 

Tokens, in addition to their use for nominating validators, also grant tokenholder voting rights on governance actions. If a token is delegated, its governance voting rights stay with the tokenholder and are not transferred to any validators that the tokenholder nominates.

Everyone participating in keeping the network secure, robust and reliable, including nominators, is **rewarded** for keeping the network running. Not meeting the requirements of running the network can lead to penalties, such as **rewards being withheld**.

Read more: [Rewards](#rewards)

Vega is non-slashing -- there is no mechanism through which a tokenholder can lose a staked token through a validator being punished. Any measures to that end use different mechanisms that will affect a bad validator's (and potentially their delegators') revenue, but does not affect the delegated tokens themselves.

Read more: [Penalties](#penalties)

## VEGA token
Vega uses the VEGA ERC20 token for governance, which includes nominating validators to run nodes, and creating and voting on governance proposals.

A VEGA token (or fraction) can be either dissociated or associated with a Vega key:

* **Dissociated**: A tokenholder is free to do what they want with the token, but cannot nominate a validator with it
* **Associated**: The token is locked in the staking smart contract and can be used to nominate a validator. It must be dissociated to withdraw it

**All tokens can be used for staking and voting** on governance proposals. This includes tokens that are locked in the vesting contract. Tokens that are staked can be used to vote, and tokens used to vote can be staked.

Read more: [Governance of Vega](#governance)

:::tip
A user's VEGA tokens must first be associated with a Vega key before they can be used for governance and staking.
:::

## Bridges used for staking
Both associating and dissociating VEGA tokens to a Vega key are initiated on Ethereum, rather than on the Vega protocol. This allows VEGA to be staked with a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network.

All governance voting and validator nominations happen exclusively on the Vega chain. 

:::info
Ethereum gas fees are only incurred in the process of associating tokens to a Vega key and transferring rewards from a Vega key to an Ethereum address. Nominating validators and changing nominations does not incur gas fees.
:::

The Vega protocol listens for stake events from staking bridges. Currently there are two bridges: one for staking unlocked, freely tradeable tokens, and one that connects to the vesting contract for locked, untradeable tokens. 

* Staking **unlocked tokens** uses the staking bridge contract. The staking bridge contains functions enabling users to deposit, remove, and transfer stake by notifying the staking bridge what tokens are associated to which Vega key. 

* When staking **locked tokens**, the Vega node interacts with the ERC20 vesting contract, which holds tokens that are locked per a vesting schedule, and provides the same utility as the staking bridge smart contract. This allows locked tokens to be used for staking and governance while not being freely tradeable. 

Whether tokens are unlocked or locked, the bridge events let the Vega network know how many tokens a given party has associated and/or dissociated.

All events (including the above, plus stake per validator and others) are only registered after a certain number of block confirmations, as defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="blockchains.ethereumConfig" hideValue={true} />. 

:::note Go deeper
**[Staking Bridge contracts](https://github.com/vegaprotocol/Staking_Bridge)** - on Vega's staking bridge GitHub repository.
:::

## Spam protection
There are several spam protections enabled to protect the Vega network, some of which are relevant to staking.

* A participant who wants to submit a delegation (nomination) transaction, needs to have a balance of at least  <NetworkParameter frontMatter={frontMatter} param="spam.protection.delegation.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />  to be able to submit the transaction
* A participant cannot send more than  <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.delegations" hideName={true} /> delegation transactions per day.

## Staking on Vega

<Topic />

Vega networks use the ERC20 token VEGA for staking. Staking requires the combined action of associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using those token(s) to nominate one or more validators. 

### Epochs
An epoch is a time period during which staking changes can be announced and then implemented. Changes that are announced in one epoch will only be executed in the following epoch (excepting ['un-nominate now'](#un-nominate-now)). The length of an epoch is <NetworkParameter frontMatter={frontMatter} param="validators.epoch.length" hideName={true} />.

## Nominating validators
Using tokens to nominate validators keeps the decentralised network functioning. 

Tokenholders can nominate validators to encourage a diverse set of reliable nodes running the network, and to give the community the opportunity to disincentivise and/or remove bad validators. Tokenholders who nominate validators are also eligible for rewards. 

When a tokenholder chooses a validator (or validators) to nominate with their tokens, the amount is immediately subtracted from their available balance, and is used at the start of the next epoch to actively nominate those validator(s).

Read more: [Rewards for staking](#rewards)

:::info Try it out
VEGA tokenholders can use **[token.fairground.wtf](https://token.fairground.wtf)** to associate their tokens and nominate validators. A Vega Wallet and Ethereum wallet are both required. CoinList custodial users should confirm with CoinList how staking works for them.
:::

## Automatic nomination
Automatic nomination is triggered when an individual tokenholder has manually nominated 95%+ of their associated tokens. At that point, any newly associated tokens will automatically be nominated to the same validators, in the same proportion.

Exceptions to automatic nomination: 
* If, ahead of the next epoch a participant uses their available tokens to nominate validators manually, that takes precedence over automatic nomination. 
* For the epoch after un-nominating validators (see below), tokens are not auto-nominated, to provide time to change the delegation / remove tokens.  

## Un-nominating validators
Participants can remove their nomination at the end of an epoch, or immediately. The un-nominated tokens will be restored back to the participant's associated token balance. 

If nominated tokens are moved to a different Ethereum address, they are un-nominated immediately, (equivalent to ['un-nominate now'](#un-nominate-now)) and rewards are forfeited for that epoch. In this case, or any case in which you dissociate tokens without first removing the nomination from a particular validator, the tokens are un-nominated from each validator you've nominated, in proportion to the nomination. 

### Un-nominate towards the end of the epoch
A participant can un-nominate towards the end of the current epoch, which means the stake is not used for the validator from the following epoch. The participant, and their nominated validator, is entitled to the rewards from that epoch (unlike when un-nominating now). 

The action is announced in the next available block of the same epoch, but the nominator keeps their nomination active until the last block of that epoch. At that point, the tokens are returned. The nominator cannot move those tokens before the epoch ends.

### Un-nominate now
A participant can choose to un-nominate at any time, and the action is executed immediately following the block it is announced in (within the same epoch). 

The participant will not receive any rewards from the validator in that epoch. The tokens are marked as available to the participant.

## Staking rewards & penalties

### Rewards
Validators and nominators both receive incentives for securing the network. The amount of those incentives, rewarded as VEGA, depends on factors including how much stake is nominated. 

**To be considered for staking rewards, a tokenholder must associate VEGA to a Vega key and nominate one or more validators.**

:::info Try it out
Try out staking on **[token.fairground.wtf](https://token.fairground.wtf)** to try out associating testnet tokens and nominating validators. Staking rewards are paid into your Vega wallet after each epoch ends. 

Staking rewards must be withdrawn to an Ethereum wallet, and then associated to a Vega wallet, before they can be staked.
:::

In each epoch, rewards are distributed among validators in proportion to the number of tokens they represent (i.e., their total stake). The total stake includes a validator's own stake and the tokens nominated to that validator. Of this reward, a fixed amount is distributed among the tokenholders the validator represents.

The reward scheme uses a linear reward curve - the reward per staked token is independent of the behaviour of other tokenholders. 

This holds for validators as well, with the exception that there is a maximum amount of stake an individual validator can take on. To avoid validators getting too big, the rewards a validator gets, and thus can distribute to its nominators, is capped. In other words, the reward per token is decreases if a validator exceeds a maximum size.

At the end of each epoch, reward payments are calculated per active validator, and then some of that reward is divided between their nominators. 

Read more: [Risks of over-staked validators](#too-much-stake)
 
:::note Go deeper
**[Staking rewards spec](https://github.com/vegaprotocol/specs/blob/master/protocol/0061-REWP-pos_rewards.md)** - more detail on how rewards are calculated and will be in future iterations. 
:::

### Penalties
Validator nodes that don't meet the requirements or prove to be bad actors will have rewards withheld, and a vaildator's nominators may also receive fewer (or no) rewards. 

There is no token slashing, i.e., a tokenholder cannot lose their tokens through any actions of a validator.

Read more: [How a validator node's performance is determined](#validator-node-performance)
