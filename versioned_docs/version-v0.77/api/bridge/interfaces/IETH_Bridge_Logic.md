---
id: IETH_Bridge_Logic
title: IETH_Bridge_Logic
original_id: IETH_Bridge_Logic
---

# ETH Bridge Logic Interface (IETH_Bridge_Logic.sol)

View Source: [contracts/IETH_Bridge_Logic.sol](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ETH_Bridge_Logic.sol)

**↘ Derived Contracts: [ETH_Bridge_Logic](../contracts/ETH_Bridge_Logic.md)**

**IETH_Bridge_Logic**

Implementations of this interface are used to deposit and withdraw ETH.

## ETH_Withdrawn

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| user_address | address |  | 
| amount | uint256 |  | 
| nonce | uint256 |  | 

## ETH_Deposited

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| user_address | address |  | 
| amount | uint256 |  | 
| vega_public_key | bytes32 |  | 

## ETH_Deposit_Minimum_Set

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_minimum | uint256 |  | 
| nonce | uint256 |  | 

## ETH_Deposit_Maximum_Set

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_maximum | uint256 |  | 
| nonce | uint256 |  | 

## Functions

- [ETH Bridge Logic Interface (IETH_Bridge_Logic.sol)](#eth-bridge-logic-interface-ieth_bridge_logicsol)
  - [ETH_Withdrawn](#eth_withdrawn)
  - [ETH_Deposited](#eth_deposited)
  - [ETH_Deposit_Minimum_Set](#eth_deposit_minimum_set)
  - [ETH_Deposit_Maximum_Set](#eth_deposit_maximum_set)
  - [Functions](#functions)
    - [set_deposit_minimum](#set_deposit_minimum)
    - [set_deposit_maximum](#set_deposit_maximum)
    - [withdraw_asset](#withdraw_asset)
    - [deposit_asset](#deposit_asset)
    - [get_deposit_minimum](#get_deposit_minimum)
    - [get_deposit_maximum](#get_deposit_maximum)
    - [get_multisig_control_address](#get_multisig_control_address)
    - [get_vega_asset_id](#get_vega_asset_id)

### set_deposit_minimum

This function sets the minimum allowable deposit for ETHMUST emit Asset_Deposit_Minimum_Set if successful

```js
function set_deposit_minimum(uint256 minimum_amount, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| minimum_amount | uint256 | Minimum deposit amount | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### set_deposit_maximum

This function sets the maximum allowable deposit for ETHMUST emit Asset_Deposit_Maximum_Set if successful

```js
function set_deposit_maximum(uint256 maximum_amount, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| maximum_amount | uint256 | Maximum deposit amount | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### withdraw_asset

This function withdraws assets to the target Ethereum addressMUST emit Asset_Withdrawn if successful

```js
function withdraw_asset(uint256 amount, uint256 expiry, address payable target, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 | Amount of ETH to withdraw | 
| expiry | uint256 | Vega-assigned timestamp of withdrawal order expiration | 
| target | address payable | Target Ethereum address to receive withdrawn ETH | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### deposit_asset

This function allows a user to deposit ETH into VegaMUST emit Asset_Deposited if successful

```js
function deposit_asset(bytes32 vega_public_key) public payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| vega_public_key | bytes32 | Target vega public key to be credited with this deposit | 

### get_deposit_minimum

This view returns minimum valid deposit

```js
function get_deposit_minimum() public view
returns(uint256)
```

**Returns**

Minimum valid deposit of ETH

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### get_deposit_maximum

This view returns maximum valid deposit

```js
function get_deposit_maximum() public view
returns(uint256)
```

**Returns**

Maximum valid deposit of ETH

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### get_multisig_control_address

```js
function get_multisig_control_address() public view
returns(address)
```

**Returns**

current multisig_control_address

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### get_vega_asset_id

```js
function get_vega_asset_id() public view
returns(bytes32)
```

**Returns**

The assigned Vega Asset Id for ETH

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

