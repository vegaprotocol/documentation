---
id: Vega_Staking_Bridge
title: Vega_Staking_Bridge
original_id: Vega_Staking_Bridge
---
# Solidity API

## IStake

_Interface contains all of the events necessary for staking Vega token_

### Stake_Deposited

```solidity
event Stake_Deposited(address user, uint256 amount, bytes32 vega_public_key)
```

### Stake_Removed

```solidity
event Stake_Removed(address user, uint256 amount, bytes32 vega_public_key)
```

### Stake_Transferred

```solidity
event Stake_Transferred(address from, uint256 amount, address to, bytes32 vega_public_key)
```

### staking_token

```solidity
function staking_token() external view returns (address)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | the address of the token that is able to be staked |

### stake_balance

```solidity
function stake_balance(address target, bytes32 vega_public_key) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| target | address | Target address to check |
| vega_public_key | bytes32 | Target vega public key to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | the number of tokens staked for that address->vega_public_key pair |

### total_staked

```solidity
function total_staked() external view returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | total tokens staked on contract |

## Vega_Staking_Bridge

This contract manages the vesting of the Vega V2 ERC20 token

### _staking_token

```solidity
address _staking_token
```

### constructor

```solidity
constructor(address token) public
```

### stakes

```solidity
mapping(address => mapping(bytes32 => uint256)) stakes
```

_user => amount staked_

### stake

```solidity
function stake(uint256 amount, bytes32 vega_public_key) public
```

This stakes the given amount of tokens and credits them to the provided Vega public key

_Emits Stake_Deposited event
User MUST run "approve" on token prior to running Stake_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Token amount to stake |
| vega_public_key | bytes32 | Target Vega public key to be credited with the stake |

### remove_stake

```solidity
function remove_stake(uint256 amount, bytes32 vega_public_key) public
```

This removes specified amount of stake of available to user

_Emits Stake_Removed event if successful_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of tokens to remove from staking |
| vega_public_key | bytes32 | Target Vega public key from which to deduct stake |

### transfer_stake

```solidity
function transfer_stake(uint256 amount, address new_address, bytes32 vega_public_key) public
```

This transfers all stake from the sender's address to the "new_address"

_Emits Stake_Transfered event if successful_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Stake amount to transfer |
| new_address | address | Target ETH address to recieve the stake |
| vega_public_key | bytes32 | Target Vega public key to be credited with the transfer |

### staking_token

```solidity
function staking_token() external view returns (address)
```

_This is IStake.staking_token_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | the address of the token that is able to be staked |

### stake_balance

```solidity
function stake_balance(address target, bytes32 vega_public_key) external view returns (uint256)
```

_This is IStake.stake_balance_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| target | address | Target address to check |
| vega_public_key | bytes32 | Target vega public key to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | the number of tokens staked for that address->vega_public_key pair |

### total_staked

```solidity
function total_staked() external view returns (uint256)
```

_This is IStake.total_staked_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | total tokens staked on contract |

