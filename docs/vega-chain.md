# Vega Chain 
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

Staked assets will appear in a user's staking account once the Vega network sees the relevant `Stake_Deposited` event(s) with enough confirmations (defined by network parameter XXXXX). Vega will listen for `Stake_Deposited` events from the staking bridge and ERC20 vesting contracts (link) and increase the balance in the appropriate party's stake account by the amount deposited each time new stake is deposited. 

The majority of the logic for staking VEGA tokens exists on the Ethereum network as Solidity contracts. They conform to specific interfaces, defined below, and emit certain events, This ensures staking for both normal ERC20 tokens and tokens locked in the vesting contract is possible.

The staking bridge contracts live in [vegaprotocol/staking_bridge](https://github.com/vegaprotocol/Staking_Bridge) (WILL THIS GO OS)

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

**Delegation Transaction**

**Network Parameters related to staking**

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
