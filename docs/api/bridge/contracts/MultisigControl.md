---
id: MultisigControl
title: MultisigControl
original_id: MultisigControl
---

# MultisigControl (MultisigControl.sol)

View Source: [contracts/MultisigControl.sol](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol)

**↗ Extends: [IMultisigControl](../interfaces/IMultisigControl)**

**MultisigControl**

This contract enables validators, through a multisignature process, to run functions on contracts by consensus

## Contract Members
**Constants & Variables**

```js
uint16 internal threshold;
```
---

```js
uint8 internal signer_count;
```
---

```js
mapping(address => bool) internal signers;
```
---

```js
mapping(uint256 => bool) internal used_nonces;
```
---

```js
mapping(bytes32 => mapping(address => bool)) internal has_signed;
```
---

## Functions

- [MultisigControl (MultisigControl.sol)](#multisigcontrol-multisigcontrolsol)
  - [Contract Members](#contract-members)
  - [Functions](#functions)
    - [](#)
    - [set_threshold](#set_threshold)
    - [add_signer](#add_signer)
    - [remove_signer](#remove_signer)
    - [verify_signatures](#verify_signatures)
    - [get_valid_signer_count](#get_valid_signer_count)
    - [get_current_threshold](#get_current_threshold)
    - [is_valid_signer](#is_valid_signer)
    - [is_nonce_used](#is_nonce_used)

### 

```js
function () public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### set_threshold

Sets threshold of signatures that must be met before function is executed.Emits ThresholdSet event

```js
function set_threshold(uint16 new_threshold, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_threshold | uint16 | New threshold value | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### add_signer

Adds new valid signer and adjusts signer count.Emits 'SignerAdded' event

```js
function add_signer(address new_signer, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| new_signer | address | New signer address | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### remove_signer

Removes currently valid signer and adjusts signer count.Emits 'SignerRemoved' event

```js
function remove_signer(address old_signer, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| old_signer | address | Address of signer to be removed. | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### verify_signatures

Verifies a signature bundle and returns true only if the threshold of valid signers is met,

```js
function verify_signatures(bytes signatures, bytes message, uint256 nonce) public nonpayable
returns(bool)
```

**Returns**

Returns true if valid signatures are over the threshold

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| signatures | bytes |  | 
| message | bytes |  | 
| nonce | uint256 |  | 

### get_valid_signer_count

```js
function get_valid_signer_count() public view
returns(uint8)
```

**Returns**

Number of valid signers

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### get_current_threshold

```js
function get_current_threshold() public view
returns(uint16)
```

**Returns**

Current threshold

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### is_valid_signer

```js
function is_valid_signer(address signer_address) public view
returns(bool)
```

**Returns**

true if address provided is valid signer

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| signer_address | address | target potential signer address | 

### is_nonce_used

```js
function is_nonce_used(uint256 nonce) public view
returns(bool)
```

**Returns**

true if nonce has been used

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| nonce | uint256 | Nonce to lookup | 

