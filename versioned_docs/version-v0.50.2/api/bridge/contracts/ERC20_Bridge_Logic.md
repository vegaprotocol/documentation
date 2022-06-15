---
id: ERC20_Bridge_Logic
title: ERC20_Bridge_Logic
original_id: ERC20_Bridge_Logic
---

# ERC20 Bridge Logic (ERC20_Bridge_Logic.sol)

View Source: [contracts/ERC20_Bridge_Logic.sol](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Bridge_Logic.sol)

**↗ Extends: [IERC20_Bridge_Logic](../interfaces/IERC20_Bridge_Logic.md)**

**ERC20_Bridge_Logic_Restricted**

This contract is used by Vega network users to deposit and withdraw ERC20 tokens to/from Vega.

## Contract Members
**Constants & Variables**

```js
address payable internal erc20_asset_pool_address;
```
---

```js
mapping(address => bool) internal listed_tokens;
```
---

```js
mapping(bytes32 => address) internal vega_asset_ids_to_source;
```
---

```js
mapping(address => bytes32) internal asset_source_to_vega_asset_id;
```
---

```js
mapping(address => mapping(address => uint256)) internal user_lifetime_deposits;
```
---

```js
mapping(address => uint256) internal asset_deposit_lifetime_limit;
```
---

```js
mapping(address => uint256) internal withdraw_thresholds;
```
---

```js
mapping(address => bool) internal exempt_depositors;
```
---

```js
uint256 public default_withdraw_delay;
```
---

```js
bool public is_stopped;
```
---

## Functions

- [ERC20 Bridge Logic (ERC20_Bridge_Logic.sol)](#erc20-bridge-logic-erc20_bridge_logicsol)
  - [Contract Members](#contract-members)
  - [Functions](#functions)
    - [](#)
    - [multisig_control_address](#multisig_control_address)
    - [list_asset](#list_asset)
    - [remove_asset](#remove_asset)
    - [set_asset_limits](#set_asset_limits)
    - [get_asset_deposit_lifetime_limit](#get_asset_deposit_lifetime_limit)
    - [get_withdraw_threshold](#get_withdraw_threshold)
    - [set_withdraw_delay](#set_withdraw_delay)
    - [global_stop](#global_stop)
    - [global_resume](#global_resume)
    - [exempt_depositor](#exempt_depositor)
    - [revoke_exempt_depositor](#revoke_exempt_depositor)
    - [is_exempt_depositor](#is_exempt_depositor)
    - [withdraw_asset](#withdraw_asset)
    - [deposit_asset](#deposit_asset)
    - [is_asset_listed](#is_asset_listed)
    - [get_multisig_control_address](#get_multisig_control_address)
    - [get_vega_asset_id](#get_vega_asset_id)
    - [get_asset_source](#get_asset_source)

### 

```js
function (address payable erc20_asset_pool) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| erc20_asset_pool | address payable | Initial Asset Pool contract address | 

### multisig_control_address

```js
function multisig_control_address() internal view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### list_asset

This function lists the given ERC20 token contract as valid for deposit to this bridgeEmits Asset_Listed if successful

```js
function list_asset(address asset_source, bytes32 vega_asset_id, uint256 lifetime_limit, uint256 withdraw_threshold, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 
| vega_asset_id | bytes32 | Vega-generated asset ID for internal use in Vega Core | 
| lifetime_limit | uint256 | Initial lifetime deposit limit *RESTRICTION FEATURE* | 
| withdraw_threshold | uint256 | Amount at which the withdraw delay goes into effect *RESTRICTION FEATURE* | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### remove_asset

This function removes from listing the given ERC20 token contract. This marks the token as invalid for deposit to this bridgeEmits Asset_Removed if successful

```js
function remove_asset(address asset_source, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### set_asset_limits

This function sets the lifetime maximum deposit for a given assetasset must first be listed

```js
function set_asset_limits(address asset_source, uint256 lifetime_limit, uint256 threshold, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 
| lifetime_limit | uint256 | Deposit limit for a given ethereum address | 
| threshold | uint256 | Withdraw size above which the withdraw delay goes into effect | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### get_asset_deposit_lifetime_limit

This view returns the lifetime deposit limit for the given asset

```js
function get_asset_deposit_lifetime_limit(address asset_source) public view
returns(uint256)
```

**Returns**

Lifetime limit for the given asset

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 

### get_withdraw_threshold

This view returns the given token's withdraw threshold above which the withdraw delay goes into effect

```js
function get_withdraw_threshold(address asset_source) public view
returns(uint256)
```

**Returns**

Withdraw threshold

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 

### set_withdraw_delay

This function sets the withdraw delay for withdrawals over the per-asset set thresholds

```js
function set_withdraw_delay(uint256 delay, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| delay | uint256 | Amount of time to delay a withdrawal | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### global_stop

This function triggers the global bridge stop that halts all withdrawals and deposits until it is resumedbridge must not be stopped already

```js
function global_stop(uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### global_resume

This function resumes bridge operations from the stopped statebridge must be stopped

```js
function global_resume(uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### exempt_depositor

this function allows the sender to exempt themselves from the deposit limitsemits Depositor_Exempted if successful

```js
function exempt_depositor() public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### revoke_exempt_depositor

this function allows the exemption_lister to revoke a depositor's exemption from deposit limitsemits Depositor_Exemption_Revoked if successful

```js
function revoke_exempt_depositor() public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### is_exempt_depositor

this view returns true if the given despoitor address has been exempted from deposit limits

```js
function is_exempt_depositor(address depositor) public view
returns(bool)
```

**Returns**

true if depositor is exempt

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| depositor | address | The depositor to check | 

### withdraw_asset

This function withdraws assets to the target Ethereum addressEmits Asset_Withdrawn if successful

```js
function withdraw_asset(address asset_source, uint256 amount, address target, uint256 creation, uint256 nonce, bytes signatures) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 
| amount | uint256 | Amount of ERC20 tokens to withdraw | 
| target | address | Target Ethereum address to receive withdrawn ERC20 tokens | 
| creation | uint256 | Timestamp of when requestion was created *RESTRICTION FEATURE* | 
| nonce | uint256 | Vega-assigned single-use number that provides replay attack protection | 
| signatures | bytes | Vega-supplied signature bundle of a validator-signed order | 

### deposit_asset

This function allows a user to deposit given ERC20 tokens into Vegaemits Asset_Deposited if successful

```js
function deposit_asset(address asset_source, uint256 amount, bytes32 vega_public_key) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 
| amount | uint256 | Amount of tokens to be deposited into Vega | 
| vega_public_key | bytes32 | Target Vega public key to be credited with this deposit | 

### is_asset_listed

This view returns true if the given ERC20 token contract has been listed valid for deposit

```js
function is_asset_listed(address asset_source) public view
returns(bool)
```

**Returns**

True if asset is listed

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 

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
function get_vega_asset_id(address asset_source) public view
returns(bytes32)
```

**Returns**

The assigned Vega Asset Id for given ERC20 token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset_source | address | Contract address for given ERC20 token | 

### get_asset_source

```js
function get_asset_source(bytes32 vega_asset_id) public view
returns(address)
```

**Returns**

The ERC20 token contract address for a given Vega Asset Id

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| vega_asset_id | bytes32 | Vega-assigned asset ID for which you want the ERC20 token address | 

