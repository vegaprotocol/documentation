# Vega Chain 
 ## Staking
Vega runs on a delegated proof of stake blockchain. Participants who hold a balance of the configured governance asset can stake that asset on the network by nominating their tokens to one or more validators that they trust to help secure the network. Note: The governance asset is defined by a network parameter. (Link)


 ### Simple staking (restricted mainnet) 
 Validators and stakers both receive incentives from the network, depending on various factors, including how much stake is nominated. Staking requires the combined action of: associating tokens (or fractions of a token) to the Vega staking bridge contract; and using the token(s) to nominate one or more validators. 

A Vega token (or a fraction thereof) can be:

- Unassociated: The tokenholder is free to do with the token as they want, but cannot delegate it
- Associated: The token is locked in the smart contract, and can be used inside the delegation system, but must be unassociated to withdraw it

Both unassociated and associated tokens can be used to vote on governance actions. 

**Smart Contract / Staking Bridge Interaction**

All actions regarding associating and unassociating stake are initiated by the Vega staking bridge contract (not by the Vega protocol). 

Vega will be made aware of how many tokens a given party has associated through bridge events, and when those same tokens are unassociated, a corresponding event is emitted (below). Vega uses this information to keep track of total nominatable stake, unnominated stake, stake per validator, stake marked for nomination in the next epoch (per validator), and total stake. 

```  
event Stake_Deposited(address indexed user, uint256 amount, bytes32 vega_public_key)
event Stake_Removed(address indexed user, uint256 amount)
```  
**Delegation Transaction**

**Network Parameters related to staking**

 ### ERC20 governance and staking token (restricted mainnet)

Vega uses an ERC20 token for governance. This includes nominating validators, and creating and voting on governance proposals. 

<< tip >> A party's governance tokens must first be recognised against a Vega public key before they can be used on the Vega network for governance and staking.<< tip >>

The governance asset uses its own system *(better word?)* and contract that allows only governance tokens to be staked to a Vega public key without any action on the Vega network, and without putting the tokens under the control of the Vega network. 

Using this approach means: 
- Any attacker who gains control of, or is able to exploit, the Vega network will be unable to steal staked Vega tokens. Even if an attacker was able to take over the network, tokenholders would remain unchanged and could fix the issue and relaunch the network by delegating to new validators.
- Locked (unvested) tokens can be staked. Both staking and unstaking are controlled entirely on the Ethereum side, and staked balances are recognised on the Vega network by listening for `Stake_*` events that can be emitted by any contract that's recognised by the network. This makes it possible to implement staking (nomination and denomination) functionality into the token vesting contract in addition to the ERC20 staking contract.

**Components of staking**

**Ethereum network (Solidity contracts)** 

 ## Validators
 ## Tendermint consensus
  ### Transaction and sequencing
  ### Transaction ordering
 ## Fast syncing
 ## Fairness (Wendy) 
