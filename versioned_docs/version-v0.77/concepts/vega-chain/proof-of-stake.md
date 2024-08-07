---
sidebar_position: 2
title: Delegated proof of stake
vega_network: MAINNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-staking.mdx'

<Topic />

Vega runs on a delegated proof of stake blockchain.

Validator nodes run the Vega network, and they decide on the validity of the blocks containing the network's transactions and thus execute those transactions. The validators who run validator nodes are required to own a minimum amount of <NetworkParameter frontMatter={frontMatter} param="validators.delegation.minAmount" hideName={true} suffix="tokens" formatter="governanceToken" /> that they stake to themselves.

:::note Read more
[Concept: Validator nodes](./validator-nodes.md)
:::

**Participants who hold a balance of VEGA, the governance asset, can use their tokens to nominate validator nodes.** This is done by associating those tokens to a Vega key to use as stake, and then nominating one or more validators they trust to help secure the network. Nominating validators loans the consensus voting weight of the VEGA tokens to endorse a validator's trustworthiness.

Tokens, in addition to their use for nominating validators, also grant tokenholder voting rights on governance actions. If a token is delegated, its governance voting rights stay with the tokenholder and are not transferred to any validators that the tokenholder nominates.

Everyone participating in keeping the network secure, robust and reliable, including nominators, is **rewarded** for keeping the network running. Not meeting the requirements of running the network can lead to penalties, such as **rewards being withheld**.

:::note Read more
[Concept: Rewards](./validator-scores-and-rewards.md)
:::

Vega is non-slashing -- there is no mechanism through which a tokenholder can lose a staked token through a validator being punished. Any measures to that end use different mechanisms that will affect a bad validator's and their nominators' rewards, but does not affect the delegated tokens themselves.

## VEGA token
Vega uses the VEGA ERC20 token for governance, which includes nominating validators to run nodes, and creating and voting on governance proposals.

:::info VEGA token details
Asset ID: `d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2`
Contract address: `0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e`

See more details on the [block explorer ↗](https://explorer.vega.xyz/assets/d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2).
:::

If a token is delegated, its governance voting rights stay with the tokenholder and are not transferred to any validators that the tokenholder nominates.

A VEGA token (or fraction) can be either dissociated or associated with a Vega key:

* **Dissociated**: A tokenholder is free to do what they want with the token, but cannot nominate a validator with it
* **Associated**: The token is locked in the staking smart contract and can be used to nominate a validator. It must be dissociated to withdraw it

**All tokens can be used for staking and voting** on governance proposals. This includes tokens that are locked in the vesting contract. Tokens that are staked can be used to vote, and tokens used to vote can be staked.

Read more: [Governance of Vega](../governance/index.md)

:::tip Associate tokens first
A user's VEGA tokens must first be associated with a Vega key before they can be used for governance and nominating validators.
:::

## Bridges used for staking
Both associating and dissociating VEGA tokens to a Vega key are initiated on Ethereum, rather than on the Vega protocol. This allows VEGA to be staked with a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network.

All governance voting and validator nominations happen exclusively on the Vega chain.

:::info Ethereum gas fees
Ethereum gas fees are only incurred in the process of associating tokens to a Vega key and transferring rewards from a Vega key to an Ethereum address. Nominating validators and changing nominations does not incur gas fees.
:::

The Vega protocol listens for stake events from staking bridges. Currently there are two bridges: one for staking unlocked, freely tradeable tokens, and one that connects to the vesting contract for locked, untradeable tokens.

* Staking **unlocked tokens** uses the staking bridge contract. The staking bridge contains functions enabling users to deposit, remove, and transfer stake by notifying the staking bridge what tokens are associated to which Vega key.

* When staking **locked tokens**, the Vega node interacts with the ERC20 vesting contract, which holds tokens that are locked per a vesting schedule, and provides the same utility as the staking bridge smart contract. This allows locked tokens to be used for staking and governance while not being freely tradeable.

Whether tokens are unlocked or locked, the bridge events let the Vega network know how many tokens a given party has associated and/or dissociated.

All events (including the above, plus stake per validator and others) are only registered after a certain number of block confirmations, as defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="blockchains.ethereumConfig" hideValue={true} />.

:::note Go deeper
**[Staking Bridge contracts ↗](https://github.com/vegaprotocol/Staking_Bridge)** - on Vega's staking bridge GitHub repository.
:::

## Staking on Vega

<Topic />

Vega networks use the ERC20 token VEGA for staking. Staking requires the combined action of associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using those token(s) to nominate one or more validators.

## Nominating validators
Using tokens to nominate validators keeps the decentralised network functioning.

Tokenholders can nominate validators to encourage a diverse set of reliable nodes running the network, and to give the community the opportunity to disincentivise and/or remove bad validators. Tokenholders who nominate validators are also eligible for rewards.

When a tokenholder chooses a validator (or validators) to nominate with their tokens, the amount is immediately subtracted from their available balance, and is used at the start of the next epoch to actively nominate those validator(s).

### Spam protection: nominations
There are two [spam protection](./network#spam-protection) measures related to nominating validators.
* A participant who wants to submit a nomination (delegation) transaction, needs to have a balance of at least  <NetworkParameter frontMatter={frontMatter} param="spam.protection.delegation.min.tokens" hideName={true} suffix="tokens" formatter="governanceToken" />  to be able to submit the transaction.
* A participant cannot send more than <NetworkParameter frontMatter={frontMatter} param="spam.protection.max.delegations" hideName={true} /> nomination (delegation) transactions per day.

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
