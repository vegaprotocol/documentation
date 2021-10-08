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

**Smart Contract / Staking Bridge Interaction**

All actions regarding staking are initiated by the Vega staking bridge contract (not by the Vega protocol). 

Vega will be made aware of how many tokens a given party has associated through bridge events, and when those same tokens are unassociated, a corresponding event is emitted (below). Vega uses this information to keep track of total nominatable stake, unnominated stake, stake per validator, stake per validator marked for nomination in the next epoch, and total stake. 

```  
event Stake_Deposited(address indexed user, uint256 amount, bytes32 vega_public_key)
event Stake_Removed(address indexed user, uint256 amount)
```  
**Delegation Transaction**

**Network Parameters related to staking**

 ### ERC20 governance and staking token (restricted mainnet)

Vega uses an ERC20 token called VEGA for governance. This includes nominating validators, and creating and voting on governance proposals. 

<< tip >> A party's VEGA tokens must first be recognised against a Vega public key before they can be used on the Vega network for governance and staking. << tip >>

The VEGA token uses its own system *(better word?)* and contract that allows only VEGA to be staked to a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network. 

Using this approach means: 
- Any attacker who gains control of, or is able to exploit, the Vega network will be unable to steal staked VEGA tokens. Even if an attacker was able to take over the network, tokenholders would remain unchanged and could fix the issue and relaunch the network by delegating to new validators.
- Locked (unvested) tokens can be staked. Both staking and unstaking are controlled entirely on the Ethereum side, and staked balances are recognised on the Vega network by listening for `Stake_*` events that can be emitted by any contract that's recognised by the network. This makes it possible to implement staking (nomination and denomination) functionality into the token vesting contract in addition to the ERC20 staking contract.

**Components of staking**

**Ethereum network (Solidity contracts)** 

 ## Validators
 ## Tendermint consensus
  ### Transaction and sequencing
  ### Transaction ordering
 ## Fast syncing
 ## Fairness (Wendy) 
