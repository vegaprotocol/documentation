---
id: ERC20_Asset_Pool
title: ERC20_Asset_Pool
original_id: ERC20_Asset_Pool
---

# ERC20 Asset Pool (ERC20_Asset_Pool.sol)

View Source: [contracts/ERC20_Asset_Pool.sol](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Asset_Pool.sol)

**ERC20_Asset_Pool**

This contract is the target for all deposits to the ERC20 Bridge via ERC20_Bridge_Logic

## Contract Members
**Constants & Variables**

```js
address public multisig_control_address;
```
---

```js
address public erc20_bridge_address;
```
---

## Multisig_Control_Set

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_address | address |  | 

## Bridge_Address_Set

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_address | address |  | 

## Functions

- [ERC20 Asset Pool (ERC20_Asset_Pool.sol)](#erc20-asset-pool-erc20_asset_poolsol)
  - [Contract Members](#contract-members)
  - [Multisig_Control_Set](#multisig_control_set)
  - [Bridge_Address_Set](#bridge_address_set)
  - [Functions](#functions)
    - [](#)
    - [](#-1)
    - [set_multisig_control](#set_multisig_control)
    - [set_bridge_address](#set_bridge_address)
    - [withdraw](#withdraw)

### 

Emits Multisig_Control_Set event

```js
function (address multisig_control) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| multisig_control | address | The initial MultisigControl contract address | 

### 

this contract is not intended to accept ether directly

```js
function () external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### set_multisig_control

See MultisigControl for more about signatures

```js
function set_multisig_control(address new_address, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_address | address | The new MultisigControl contract address. | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed set_multisig_control order | 

### set_bridge_address

See MultisigControl for more about signatures

```js
function set_bridge_address(address new_address, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_address | address | The new ERC20_Bridge_Logic contract address. | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed set_bridge_address order | 

### withdraw

This function can only be run by the current "multisig_control_address" and, if available, will send the target tokens to the targetamount is in whatever the lowest decimal value the ERC20 token has. For instance, an 18 decimal ERC20 token, 1 "amount" == 0.000000000000000001

```js
function withdraw(address token_address, address target, uint256 amount) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| token_address | address | Contract address of the ERC20 token to be withdrawn | 
| target | address | Target Ethereum address that the ERC20 tokens will be sent to | 
| amount | uint256 | Amount of ERC20 tokens to withdraw | 

