---
id: ETH_Bridge_Logic
title: ETH_Bridge_Logic
original_id: ETH_Bridge_Logic
---

# ETH Bridge Logic (ETH_Bridge_Logic.sol)

View Source: [contracts/ETH_Bridge_Logic.sol](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ETH_Bridge_Logic.sol)

**↗ Extends: [IETH_Bridge_Logic](../interfaces/IETH_Bridge_Logic)**

**ETH_Bridge_Logic**

This contract is used by Vega network users to deposit and withdraw ETH to/from Vega.

## Contract Members
**Constants & Variables**

```js
address payable internal ETH_asset_pool_address;
```
---

```js
uint256 internal minimum_deposit;
```
---

```js
uint256 internal maximum_deposit;
```
---

```js
bytes32 internal vega_asset_id;
```
---

## Functions

- [ETH Bridge Logic (ETH_Bridge_Logic.sol)](#eth-bridge-logic-eth_bridge_logicsol)
  - [Contract Members](#contract-members)
  - [Functions](#functions)
    - [](#)
    - [multisig_control_address](#multisig_control_address)
    - [set_deposit_minimum](#set_deposit_minimum)
    - [set_deposit_maximum](#set_deposit_maximum)
    - [withdraw_asset](#withdraw_asset)
    - [deposit_asset](#deposit_asset)
    - [get_deposit_minimum](#get_deposit_minimum)
    - [get_deposit_maximum](#get_deposit_maximum)
    - [get_multisig_control_address](#get_multisig_control_address)
    - [get_vega_asset_id](#get_vega_asset_id)

### 

```js
function (address payable ETH_asset_pool) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| ETH_asset_pool | address payable | Initial Asset Pool contract address | 

### multisig_control_address

```js
function multisig_control_address() internal view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### set_deposit_minimum

This function sets the minimum allowable deposit for ETH. Emits ETH_Deposit_Minimum_Set if successful

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

This function sets the maximum allowable deposit for ETH. Emits ETH_Deposit_Maximum_Set if successful

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

This function allows the withdrawal of ETH. Emits ETH_Withdrawn if successful

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

This function allows a user to deposit ETH into Vega. Emits ETH_Deposited if successful

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

The assigned Vega Asset Id

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

