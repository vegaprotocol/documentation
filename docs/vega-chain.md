# Vega Chain
Vega uses Tendermint as a consensus layer to form a blockchain. The rest of the information here informs on how that blockchain and its relevant components is comprised. For more information on how Vega bridges to Ethereum, see (link). 

## Delegated proof of stake
Vega runs on a delegated proof of stake blockchain. Participants who hold a balance of VEGA, the governance asset, can stake that asset on the network by nominating their tokens to one or more validators that they trust to help secure the network. 

In a delegated proof of stake system, participants - validators and token-holders - use their VEGA tokens (or fractions of a token) to nominate a validator node. Validators (link) run the network, and non-validator participants assign the voting rights of their VEGA tokens to endorse a validator's trustworthiness. Everyone participating in staking is rewarded for keeping the network running (and penalised for not meeting the requirements of running the network). 

<!-- Penalties: 
- Validators can lose their VEGA to the network if they don't meet the requirements or prove to be bad actors. The tokens are sent to the insurance pool. (link to insurance pool section when available) 
- Nominators will lose future rewards

### ***Further reading***
Link to spec for staking and validator rewards when publicly available. (valpol)
-->

### Staking on Vega 
Vega networks use the ERC20 token VEGA for staking. Staking requires the combined action of associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using those token(s) to nominate one or more validators. 

#### Staking with the VEGA token
Vega uses the VEGA ERC20 token for governance, which includes nominating validators, and creating and voting on governance proposals.

A VEGA token (or fraction) can be either unassociated or associated:

- Unassociated: The tokenholder is free to do what they want with the token, but cannot nominate a validator with it
- Associated: The token is locked in the staking smart contract and can be used to nominate a validator. It must be unassociated to withdraw it

All tokens, whether unlocked or locked in the vesting contract can be used for staking.
All tokens, whether associated or unassociated, can be used to vote on governance actions. 

:::info
A user's VEGA tokens must first be associated with a Vega key before they can be used for governance and staking.
:::

#### Rewards (alpha mainnet)
Validators and nominators both receive incentives from the network, depending on factors including how much stake is nominated. 

For alpha mainnet, all rewards are evenly distributed among validators. 

At the end of each epoch, reward payments are calculated per active validator, and then some of that reward is divided between their nominators. The proportion that goes to nominators is defined by the network parameter `reward.staking.delegation.delegatorShare`. 
 
:::info
VEGA tokenholders can use [token.vega.xyz](https://token.vega.xyz) to associate their tokens and nominate validators to receive rewards. CoinList
custodial users should confirm with CoinList how staking works for them.
:::

### ***Further reading*** 
Read the [staking rewards](https://github.com/vegaprotocol/specs/blob/main/protocol/0058-simple-POS-rewards.md) spec for full details for how rewards are calculated. 

### Delegating and undelegating (WIP)

Epochs: Epochs are a time period during which changes can be announced, but will not be executed until the next epoch (with some rare exceptions). - The length of an epoch is set using the network parameter `validators.epoch.length`. 

Any tokens that are not already nominated can be nominated to a validator. However, the nomination only becomes valid at the start of the next epoch. Stake can be un-nominated at any time. See more below about the options for un-nominating a validator.  

Once the Vega network is aware of associated tokens, there will be a balance available that reflects how many tokens are ready for nominating a validator.

When a tokenholder nominates a validator with their stake, a command is sent onto the chain. It is verified at the start, when the command is issued and before it is put on the chain, that the tokenholder has sufficient unnominated stake, as well as at start of the next epoch, just before the command takes effect. The amount of a tokenholder's available stake is reduced immediately as soon as the command is put into a block.

Each validator will have a maximum amount of stake that they can accept as delegation. For alpha mainnet, this will be the same for all validators, governed by a network parameter `maxStakePerValidator`. If a participant tries to nominate a validator with an amount that would mean the size of their stake would cause max stake per validator to be exceeded, then they are only staked up to this maximum amount. The remaining amount is eligible to nominate another validator.

Users can remove stake by submitting an `undelegate` transaction. The tokens will then be restored back to their token balance.

#### Types of undelegations (unnominations) (WIP)

_Undelegate towards the end of the epoch_ 
- The action is announced in the next available block, but the delegator keeps the delegation alive till the last block of the epoch. The delegator can then re-delegate the stake, which then be valid once the next epoch starts. The delegator cannot move the tokens before the epoch ends, they remain locked.

_Undelegate Now_ 
`UndelegateNow`
The action can be announced at any time and is executed immediately following the block it is announced in.
The user is marked to not receive any reward from the validator in that epoch. The reward should instead go into the `on-chain treasury account for that asset`. The stake is marked as free for the delegator, but is not yet removed from the validator stake (this happens at the end of the epoch).

#### Automatic delegation (WIP)
- A party becomes eligible to participate in auto delegation once they have manually nominated 95%+ of the association.
- Once entering auto delegation mode, any un-nominated associated tokens will be automatically distributed according to the current validator nomination of the party maintaining the same proportion.

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

In alpha mainnet, all validators effectively have the same stake, so all are selected an equal number of times to validate a block. Thus rewards will be equal between them, assuming they all continue to function. Alpha mainnet validators will not lose stake or rewards if they have a temporary interruption of service. <!-- (What happens if a validator really messes up?) -->

## Network life (alpha mainnet)
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
