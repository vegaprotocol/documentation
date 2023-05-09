---
id: version-undefined-ETH_Asset_Pool
title: ETH_Asset_Pool
original_id: ETH_Asset_Pool
---

# ETH Asset Pool (ETH_Asset_Pool.sol)

View Source: [contracts/ETH_Asset_Pool.sol](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ETH_Asset_Pool.sol)

**ETH_Asset_Pool**

This contract is the target for all deposits to the ETH Bridge via ETH_Bridge_Logic

## Contract Members
**Constants & Variables**

```js
address public multisig_control_address;
```
---

```js
address public ETH_bridge_address;
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

## Received

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| sender | address |  | 
| amount | uint256 |  | 

## Functions

- [ETH Asset Pool (ETH_Asset_Pool.sol)](#eth-asset-pool-eth_asset_poolsol)
  - [Contract Members](#contract-members)
  - [Multisig_Control_Set](#multisig_control_set)
  - [Bridge_Address_Set](#bridge_address_set)
  - [Received](#received)
  - [Functions](#functions)
    - [](#)
    - [set_multisig_control](#set_multisig_control)
    - [set_bridge_address](#set_bridge_address)
    - [withdraw](#withdraw)
    - [](#-1)

### 

Emits Multisig_Control_Set event

```js
function (address multisig_control) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| multisig_control | address | The initial MultisigControl contract address | 

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
| new_address | address | The new ETH_Bridge_Logic contract address. | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed set_bridge_address order | 

### withdraw

This function can only be run by the current "multisig_control_address" and, if available, will send the target eth to the targetamount is in wei, 1 wei == 0.000000000000000001 ETH

```js
function withdraw(address payable target, uint256 amount) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| target | address payable | Target Ethereum address that the ETH will be sent to | 
| amount | uint256 | Amount of ETH to withdraw | 

### 

A contract can have at most one receive function,
 declared using receive() external payable { ... }
 (without the function keyword). This function cannot have arguments,
 cannot return anything and must have external visibility and payable state
 mutability. It is executed on a call to the contract with empty calldata.
 This is the function that is executed on plain Ether transfers (e.g. via .send()
 or .transfer()). If no such function exists, but a payable fallback
 function exists, the fallback function will be called on a plain Ether
 transfer. If neither a receive Ether nor a payable fallback function is
 present, the contract cannot receive Ether through regular transactions
 and throws an exception.

```js
function () external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

