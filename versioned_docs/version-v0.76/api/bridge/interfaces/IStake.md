---
id: IStake
title: IStake
original_id: IStake
---

# IStake.sol

View Source: [contracts/tests/IStake.sol](https://github.com/vegaprotocol/Staking_Bridge/blob/main/contracts/IStake.sol)

**↘ Derived Contracts: [Vega_Staking_Bridge](../contracts/Vega_Staking_Bridge.md)**

**IStake**

Interface contains all of the events necessary for staking Vega token

## Stake_Deposited

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| user | address |  | 
| amount | uint256 |  | 
| vega_public_key | bytes32 |  | 

## Stake_Removed

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| user | address |  | 
| amount | uint256 |  | 
| vega_public_key | bytes32 |  | 

## Stake_Transferred

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| from | address |  | 
| amount | uint256 |  | 
| to | address |  | 
| vega_public_key | bytes32 |  | 

## Functions

- [IStake.sol](#istakesol)
  - [Stake_Deposited](#stake_deposited)
  - [Stake_Removed](#stake_removed)
  - [Stake_Transferred](#stake_transferred)
  - [Functions](#functions)
    - [staking_token](#staking_token)
    - [stake_balance](#stake_balance)
    - [total_staked](#total_staked)

### staking_token

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

```js
function total_staked() external view
returns(uint256)
```

**Returns**

total tokens staked on contract

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

