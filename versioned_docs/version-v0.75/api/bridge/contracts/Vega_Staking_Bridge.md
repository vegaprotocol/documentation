---
id: Vega_Staking_Bridge
title: Vega_Staking_Bridge
original_id: Vega_Staking_Bridge
---

# ERC20 Staking Bridge (Vega_Staking_Bridge.sol)

View Source: [contracts/Vega_Staking_Bridge.sol](https://github.com/vegaprotocol/Staking_Bridge/blob/main/contracts/Vega_Staking_Bridge.sol)

**↗ Extends: [IStake](../interfaces/IStake)**

**Vega_Staking_Bridge**

This contract manages the vesting of the Vega V2 ERC20 token

## Contract Members
**Constants & Variables**

```js
address internal _staking_token;
```
---

user => amount staked
```js
mapping(address => mapping(bytes32 => uint256)) internal stakes;
```
---

## Functions

- [ERC20 Staking Bridge (Vega_Staking_Bridge.sol)](#erc20-staking-bridge-vega_staking_bridgesol)
  - [Contract Members](#contract-members)
  - [Functions](#functions)
    - [](#)
    - [stake](#stake)
    - [remove_stake](#remove_stake)
    - [transfer_stake](#transfer_stake)
    - [staking_token](#staking_token)
    - [stake_balance](#stake_balance)
    - [total_staked](#total_staked)

### 

```js
function (address token) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token | address |  | 

### stake

This stakes the given amount of tokens and credits them to the provided Vega public keyEmits Stake_Deposited event

```js
function stake(uint256 amount, bytes32 vega_public_key) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Token amount to stake | 
| vega_public_key | bytes32 | Target Vega public key to be credited with the stake | 

### remove_stake

This removes specified amount of stake of available to userEmits Stake_Removed event if successful

```js
function remove_stake(uint256 amount, bytes32 vega_public_key) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Amount of tokens to remove from staking | 
| vega_public_key | bytes32 | Target Vega public key from which to deduct stake | 

### transfer_stake

This transfers all stake from the sender's address to the "new_address"Emits Stake_Transfered event if successful

```js
function transfer_stake(uint256 amount, address new_address, bytes32 vega_public_key) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Stake amount to transfer | 
| new_address | address | Target ETH address to recieve the stake | 
| vega_public_key | bytes32 | Target Vega public key to be credited with the transfer | 

### staking_token

This is IStake.staking_token

```js
function staking_token() external view
returns(address)
```

**Returns**

the address of the token that is able to be staked

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### stake_balance

This is IStake.stake_balance

```js
function stake_balance(address target, bytes32 vega_public_key) external view
returns(uint256)
```

**Returns**

the number of tokens staked for that address->vega_public_key pair

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| target | address | Target address to check | 
| vega_public_key | bytes32 | Target vega public key to check | 

### total_staked

This is IStake.total_staked

```js
function total_staked() external view
returns(uint256)
```

**Returns**

total tokens staked on contract

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

