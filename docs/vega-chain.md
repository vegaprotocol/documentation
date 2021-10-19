# Vega Chain
## Limited network life for restricted mainnet (WIP)
Vega networks will at least initially and perhaps always run for a limited time only. 

Networks will have a finite lifetime because:

- It is efficient to upgrade the protocol by starting again as it avoids the need to deal with multiple versions of the code (upgrades to a running chain need to respect and be able to recalculate the pre-upgrade deterministic state for earlier blocks, so all versions of criticial code must remain in the system).
This is especially important early on when rapid iteration is desirable, as the assumption that new chains can be started for new features simplifies things considerably.

- Trading at 1000s of tx/sec generates a lot of data. Given that most instruments are non-perpetual (they expire), this gives the ability to create new markets on a new chain and naturally let the old one come to an end rather than dragging around its history forever.

- Bugs, security breaches, or other issues during alpha could either take out the chain OR make it desirable to halt block production. It's important to consider what happens next if this occurs.

There are four main features:
1. Create checkpoints with relevant (but minimal) information at regular intervals, and on every deposit and every withdrawal request.
2. Ability to specify a checkpoint hash as part of genesis.
3. A new 'Restore' transaction that contains the full checkpoint file and triggers state restoration
4. A new 'checkpoint hash' transaction is broadcast by all validators

Point two requires that at load time, each node calculates the hash of the checkpoint file. It then sends this through consensus to make sure that all the nodes in the new network agree on the state. 
## Staking
Vega runs on a delegated proof of stake blockchain. Participants who hold a balance of VEGA, the governance asset, can stake that asset on the network by nominating their tokens to one or more validators that they trust to help secure the network.

### Simple staking (restricted mainnet)
Validators and stakers both receive incentives from the network, depending on various factors, including how much stake is nominated.

Staking requires the combined action of: associating VEGA tokens (or fractions of a token) to the Vega staking bridge contract; and using the token(s) to nominate one or more validators.

A VEGA token (or a fraction thereof) is either unassociated or associated to a validator:

- Unassociated: The tokenholder is free to do with the token as they want, but cannot delegate it (the default)
- Associated: The token is locked in the smart contract, and can be used inside the delegation system, but must be unassociated to withdraw it

Both unassociated and associated tokens can be used to vote on governance actions.

<< tip: VEGA tokenholders can associate their tokens and then nominate validators to receive rewards, using token.vega.xyz, or CoinList, depending on how they acquired their tokens. All tokens, whether locked in the vesting contract or unlocked, can be used for staking. >>

#### Smart contract & staking bridge interactions

All actions regarding staking are initiated by the Vega staking bridge contract (not by the Vega protocol).

Vega will be made aware of how many tokens a given party has associated through bridge events, and when those same tokens are unassociated, a corresponding event is emitted (below). Vega uses this information to keep track of total nominatable stake, unnominated stake, stake per validator, stake per validator marked for nomination in the next epoch, and total stake.

```
event Stake_Deposited(address indexed user, uint256 amount, bytes32 vega_public_key)
event Stake_Removed(address indexed user, uint256 amount)
```

Staked assets will appear in a user's staking account once the Vega network sees the relevant `Stake_Deposited` event(s) with enough confirmations (defined by network parameter `blockchains.ethereumConfig`). Vega will listen for `Stake_Deposited` events from the staking bridge and ERC20 vesting contracts (link) and increase the balance in the appropriate party's stake account by the amount deposited each time new stake is deposited.

The majority of the logic for staking VEGA tokens exists on the Ethereum network as Solidity contracts. They conform to specific interfaces, defined below, and emit certain events, This ensures staking for both normal ERC20 tokens and tokens locked in the vesting contract is possible.

The staking bridge contracts live in [vegaprotocol/staking_bridge](https://github.com/vegaprotocol/Staking_Bridge)

**Staking interface (IStake.sol)**

The staking interface defines the events that track all Ethereum-side transactions using the CQRS design pattern.

These events are:
* `event Stake_Deposited(address indexed user, uint256 amount, bytes32 indexed vega_public_key)` - This event is emitted when a stake deposit is made and credited to provided vega_public_key's stake account
* `event Stake_Removed(address indexed user, uint256 amount, bytes32 indexed vega_public_key)` - This event is emitted when a user removes stake and triggers the targeted vega_public_key's stake account to be decremented

**Staking bridge**

The staking bridge contains functions enabling users to deposit, remove, and transfer stake by moving the governance tokens from their wallet to the staking bridge. This contract is used for all staking of tokens, except where the tokens to be staked reside in the ERC20 vesting contract (link).

Functions:
* `Stake(uint256 amount, bytes32 vega_public_key)` - stakes the given amount of governance tokens to the target vega_public_key
	* Requires that the sender address calling the function holds at least `amount` governance tokens that are able to be transferred to the staking bridge, (Note: tokens held by the vesting contract on behalf of an address do not count here)
	* Emits the `Stake_Deposited` event
* `Remove_Stake(uint256 amount, bytes32 vega_public_key)`- removes the given amount of governance tokens stake from the target vega_public_key
	* Requires that at least `amount` tokens are staked by the sender with the staking bridge (not the vesting or any other contract implementing IStake) to the specified Vega public key
	* Must not unstake tokens staked to another Vega key or from another contract (i.e. vesting)
	* Emits the `Stake_Removed` event
* `Transfer_Stake(uint256 amount, address new_address, bytes32 vega_public_key)` - Transfers staked governance from the sender to the target address
	* This changes the address that can unstake the tokens, and that will receive the tokens from the staking bridge when unstaked
	* This does not change the Vega public key to which the tokens are staked and will therefore not intterupt delegation
	* Requires that at least `amount` tokens are staked by the sender with the staking bridge (not the vesting or any other contract implementing IStake) to the specified Vega public key
	* Emits the `Stake_Transferred` event



#### Validator and Staking POS Rewards (WIP)
This describes the Alpha Mainnet requirements for calculation and distribution of rewards to delegators and validators. For more information on the overall approach, please see the relevant research document.

## Calculation  (WIP)

At the end of an epoch, payments are calculated. This is done per active validator:

* First, `score_val(stake_val)` calculates the relative weight of the validator given the stake it represents.
* For each delegator that delegated to that validator, `score_del` is computed: `score_del(stake_del, stake_val)` where `stake_del` is the stake of that delegator, delegated to the validator, and `stake_val` is the stake that validator represents.
* The fraction of the total available reward a validator gets is then `score_val(stake_val) / total_score` where `total_score` is the sum of all scores achieved by the validators. The fraction a delegator gets is calculated accordingly.
* Finally, the total reward for a validator is computed, and their delegator fee subtracted and divided among the delegators


Variables used:

- `min_val`: minimum validators we need (for now, 5)
- `compLevel`: competitition level we want between validators (1.1)
- `num_val`: actual number of active validators
- `a`: The scaling factor; which will be `max(min_val, num_val/compLevel)`. So with `min_val` being 5, if we have 6 validators, `a` will be `max(5, 5.4545...)` or `5.4545...`
- `delegator_share`: propotion of the validator reward that goes to the delegators.

Functions:

- `score_val(stake_val)`: `sqrt(a*stake_val/3)-(sqrt(a*stake_val/3)^3)`. To avoid issues with floating point computation, the sqrt function is
  computed to exactly four digits after the point. An example how this can be done using only integer calculations is in the example code.
  Also, this function assumes that the stake is normalized, i.e., the sum of stake_val for all validators equals 1. If this is not the case, 
  stake_val needs to be replaced by stake_val/total_stake, where total_stake is the sum of stake_val over all validators.
- `score_del(stake_del, stake_val)`: for now, this will just return `stake_del`, but will be replaced with a more complex formula later on, which deserves independent testing.
- The scoring function can give negative values if a validator has too much stake, which can upset subsequent computations. Thus, an additional
  correction is required: if (score_val) < 0 then score_val = 0. This point should never be reached in a real run though, as validators should to be able to 
  obtain enough delegation.
- `delegator_reward(stake_val)`: `stake_val * delegator_share`. Long term, there will be bonuses in addition to the reward.



## Distribution of Rewards (WIP)

A component of the trading fees that are collected from price takers of a market are reserved for rewarding validators and stakers. These fees are denominated in the settlement currencies of the markets and are collected into an infrastructure fee account for that asset. These fees are "held" in this pool account for a length of time, determined by a network parameter (`infra-fee-hold-time`). 

They are then distributed to the general accounts of eligible recipients; that is, the validators and delegators, in amounts as per above calculation.

Once the reward for all delegators has been calculated, we end up with a slice of `Transfer`s, transferring an amount from the infrastructure fee account (see fees LINK) into the corresponding general balances for all of the delegators. For example:

```go
rewards := make([]*types.Transfer, 0, len(delegators))
for _, d := range delegators {
	rewards = append(rewards, &types.Transfer{
		Owner: d.PartyID,
		TransferType: types.TransferType_TRANSFER_TYPE_STAKE_REWARD,
		Amount: &types.FinancialAmount{
			Amount: reward,
			Asset:  market.Asset,
		},
		MinAmount: reward,
	})
}

```


The transfer type informs the collateral engine that the `FromAccount` ought to be the infrastructure fee account, and the `ToAccount` is the general account for the party for the given asset. The delegator can then withdraw the amount much like they would any other asset/balance. Note, the transfers should only be made when the `infra-fee-hold-time` has elapsed. 


## Network Parameters (WIP)

`infra-fee-hold-time` - the length of time between when a price taker infrastructure fee is incurred and when it is paid out to validators.
`delegator_share` - The proportion of the total validator reward that go to its delegators. Likely to be lower than 0.1.

## Payment of rewards (WIP)
- Infrastructure fees are collected into an infrastructure fee account for the asset
- These fees are distributed to the general accounts of the validators and delegators after `infra-fee-hold-time` in amounts calculated according to the above calculation.
- There may also be additional rewards for participating in stake delegation from the rewards function. These are accumulated and distributed separately.








**ERC20 vesting contract**

The ERC20 vesting contract supports staking the tokens it holds.

Attempts to redeem vested tokens will fail if there are not sufficient tokens held on behalf of the sender address that are not staked. The sender must first unstake tokens before they can be redeemed.

This contract does not interact in any way with the staking bridge contract. They are effectively completely separate staking mechanisms, so to unstake all an address's tokens when some are staked on each contract will require calls to both contracts.

Functions:
* `stake_tokens(uint256 amount, bytes32 vega_public_key)` allows staking of tokens held by the contract on behalf of an address
	* Requires that the vesting contract holds at least `amount` (HOW IS THIS AMOUNT DEFINED?) governance tokens, that are currently not staked, on behalf of the sender address (they will be redeemable by sender once vested)
	* Allows staking of both unvested (locked) tokens and vested tokens that are not yet redeemed
* `remove_stake(uint256 amount, bytes32 vega_public_key)`
	* Requires that the vesting contract holds at least `amount` governance tokens, that are currently staked to the specified Vega public key, on behalf of the sender address (i.e. they will be redeemable by sender once vested)
	* 	* Emits `Stake_Deposited` events
	* Emits `Stake_Removed` events

#### Delegating and undelegating  (WIP)
Any locked and undelegated stake can be delegated at any time by putting a delegation-message on the chain. However, the delegation only becomes valid towards the next epoch, though it can be undone through undelegate.

Once Vega is aware of locked tokens, the users will have an account with the balance reflecting how many tokens were locked. At this point, the user can submit a transaction to use their tokens to nominate validators.

```proto
message Delegate {
	uint256   Amount = 1;
	Validator Val = 2;
}

message Undelegate {
	uint256   Amount = 1;
	Validator Val = 2;
}
```

Where `Delegate` adds the `Amount` to the delegation of validator `Val` at the beginning of the next epoch (if still available to them), and `Undelegate` subtracts the amount from the delegation of `Val` by the next epoch if available.

To avoid fragmentation or spam, there is a system parameter `minimum delegateable stake` that defines the smallest unit (fractions of) tokens that can be used for delegation.

To delegate stake, a delegator simply puts a command "delegate x stake to y" on the chain. It is verified at the beginning (when the command is issued and before it is put on the chain) that the delegator has sufficient unlocked stake, as well as in the beginning of the next epoch just before the command takes effect. The amount of delegatable stake is reduced right away once the command is put into a block.

Each validator will have a maximum amount of stake that they can accept as delegation (initially this will be the same for all validators, governed by a network parameter `maxStakePerValidator`). If a participant is delegating such that the size of their stake would cause this amount to be exceeded, then they are only staked up to this maximum amount. The remaining of their stake is therefore eligible to stake to another validator.

### Undelegating (WIP)
Users can remove stake by submitting an `undelegate` transaction. The tokens will then be restored back to their token balance.

At the top level, `Stake_Deposited` simply adds `amount` of tokens to the account of the user associated with the `user`. Likewise, the `Stake_Removed` event subtracts the `amount` of tokens from their account.

- If the `Stake_Removed` amount of tokens is higher than the balance of said user, something went seriously wrong somewhere. This is a good time to panic.
- If the amount is higher than the amount of undelegated stake, the missing amount must be freed using the undelegate function (see section above about bridge contract interaction). There is currently no rule how to choose this;

*Option-1*
A first heuristic would be to take from the highest delegation first and then go down, e.g.
	* If the delegation is 100, 90, 80, 70, and we need to free 30 stake, we first take from the richest ones until they are no longer the richest:
	* Free 10, delegation is 90, 90, 80, 70
	* Free 30, delegation is 80, 80, 80, 70
This has the benefit of lowering the probability that a single withdrawal will leave any one validator with zero delegated stake.

*Option-2*
Another option would be to withdraw stake proportionally from the validators.
	* If the delegation is 100, 90, 80, 70, and we need to free 30 stake, we split the withdrawal across all validators proportionately:
	* Free from delegator-1 (to whom the participant has delegated 100) an amount equal to 30 * (100/(100+90+80+70)) etc. Not sure how to deal with rounding.


#### Types of undelegations (WIP)

_Undelegate towards the end of the epoch_
- The action is announced in the next available block, but the delegator keeps the delegation alive till the last block of the epoch. The delegator can then re-delegate the stake, which then be valid once the next epoch starts. The delegator cannot move the tokens before the epoch ends, they remain locked.


_Undelegate Now_
`UndelegateNow`
The action can be announced at any time and is executed immediately following the block it is announced in.
The user is marked to not receive any reward from the validator in that epoch. The reward should instead go into the `on-chain treasury account for that asset` (TODO: add link). The stake is marked as free for the delegator, but is not yet removed from the validator stake (this happens at the end of the epoch).

### Auto [Un]delegation (WIP)
- A party become eligible to participate in auto delegation once they have manually delegated (nominated) 95%+ of the association.
- Once entering auto delegation mode, any un-nominated associated tokens will be automatically distributed according to the current validator nomination of the party maintaining the same proportion.
- Edge cases:
  - If a party has entered auto delegation mode, and their association has increased it should be automatically distributed for the epoch following the increase of association. However, if during the same epoch the party requests to execute manual delegation, no automatic delegation will be done in that epoch. If there is still un-nominated association in the next epoch, it will be automatically distributed.
  - If a party qualifies for auto delegation and has un-nominated association, however the party requests to undelegate (either during the epoch or at the end of the epoch) - they exit auto delegation mode. The rationale here is that they probably want to do some rearrangement of their nomination and we give them a chance to do so. Once the party reached more than x% of nomination again, they would enter auto delegation mode again and any future un-nominated association will be automatically distributed.
  - When distributing the newly available association according to the current validators nomination of the party, if validator A should get X but can only accept X - e (due to max per validator constraint), Vega will not try to distribute e between the other validators and will try to distribute it again in the next round.
- Auto undelegation - whenever the party dissociates tokens, their nomination must be updated such that their maximum nomination reflects the association.

### ERC20 governance and staking token (restricted mainnet)

Vega uses an ERC20 token called VEGA for governance. This includes nominating validators, and creating and voting on governance proposals.

<< tip >> A party's VEGA tokens must first be recognised against a Vega public key before they can be used on the Vega network for governance and staking. << tip >>

The VEGA token system *(better word?)* and contract allows VEGA to be staked to a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network.

Using this approach means:
- Locked (unvested) tokens can be staked. Both staking and unstaking are controlled entirely on the Ethereum side, and staked balances are recognised on the Vega network by listening for `Stake_*` events that can be emitted by any contract that's recognised by the network. This makes it possible to implement staking (nomination and denomination) functionality into the token vesting contract in addition to the ERC20 staking contract.
- Any attacker who gains control of, or is able to exploit, the Vega network will be unable to steal staked VEGA tokens. Even if an attacker was able to take over the network, the tokenholders would remain unaffected and could fix the issue and relaunch the network by delegating to new validators.

## Validators
## Tendermint consensus
 ### Transaction and sequencing
 ### Transaction ordering
## Fast syncing
## Fairness (Wendy)
