# IERC20_Bridge_Logic
> 👤 Vega Protocol
```
ERC20 Bridge Logic Interface
```


### 📋 Notice

Implementations of this interface are used by Vega network users to deposit and withdraw ERC20 tokens to/from Vega.




### 🎟 Events


#### Asset_Deposit_Maximum_Set
| Name | Indexed | Type |
|:-:|:-:|:-:|
| asset_source | `true` | `address` |
| new_maximum | `false` | `uint256` |
| nonce | `false` | `uint256` |


#### Asset_Deposit_Minimum_Set
| Name | Indexed | Type |
|:-:|:-:|:-:|
| asset_source | `true` | `address` |
| new_minimum | `false` | `uint256` |
| nonce | `false` | `uint256` |


#### Asset_Deposited
| Name | Indexed | Type |
|:-:|:-:|:-:|
| user_address | `true` | `address` |
| asset_source | `true` | `address` |
| amount | `false` | `uint256` |
| vega_public_key | `false` | `bytes32` |


#### Asset_Listed
| Name | Indexed | Type |
|:-:|:-:|:-:|
| asset_source | `true` | `address` |
| vega_asset_id | `true` | `bytes32` |
| nonce | `false` | `uint256` |


#### Asset_Removed
| Name | Indexed | Type |
|:-:|:-:|:-:|
| asset_source | `true` | `address` |
| nonce | `false` | `uint256` |


#### Asset_Withdrawn
| Name | Indexed | Type |
|:-:|:-:|:-:|
| user_address | `true` | `address` |
| asset_source | `true` | `address` |
| amount | `false` | `uint256` |
| nonce | `false` | `uint256` |


#### Bridge_Resumed
| Name | Indexed | Type |
|:-:|:-:|:-:|


#### Bridge_Stopped
| Name | Indexed | Type |
|:-:|:-:|:-:|


#### Depositor_Exempted
| Name | Indexed | Type |
|:-:|:-:|:-:|
| depositor | `true` | `address` |


#### Depositor_Exemption_Revoked
| Name | Indexed | Type |
|:-:|:-:|:-:|
| depositor | `true` | `address` |


#### Exemption_Lister_Set
| Name | Indexed | Type |
|:-:|:-:|:-:|
| lister | `true` | `address` |



## `list_asset`

>👀 `nonpayable`

### 📋 Notice

This function lists the given ERC20 token contract as valid for deposit to this bridgeSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Listed if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| withdraw_threshold | `address` | Amount at which the withdraw delay goes into effect *RESTRICTION FEATURE* |



## `remove_asset`

>👀 `nonpayable`

### 📋 Notice

This function removes from listing the given ERC20 token contract. This marks the token as invalid for deposit to this bridgeSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Removed if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `address` | Vega-supplied signature bundle of a validator-signed order |



## `set_deposit_minimum`

>👀 `nonpayable`

### 📋 Notice

This function sets the minimum allowable deposit for the given ERC20 tokenSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Deposit_Minimum_Set if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `address` | Vega-supplied signature bundle of a validator-signed order |



## `set_deposit_maximum`

>👀 `nonpayable`

### 📋 Notice

This function sets the maximum allowable deposit for the given ERC20 tokenSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Deposit_Maximum_Set if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `address` | Vega-supplied signature bundle of a validator-signed order |



## `set_lifetime_deposit_max`

>👀 `nonpayable`

### 📋 Notice

This function sets the lifetime maximum deposit for a given asset


### 🔎 Details

asset must first be listed

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `address` | Vega-supplied signature bundle of a validator-signed order |



## `set_withdraw_delay`

>👀 `nonpayable`

### 📋 Notice

This function sets the withdraw delay for withdrawals over the per-asset set thresholds



### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `uint256` | Vega-supplied signature bundle of a validator-signed order |



## `set_withdraw_threshold`

>👀 `nonpayable`

### 📋 Notice

This function sets the withdraw threshold above which the withdraw delay goes into effect


### 🔎 Details

asset must first be listed

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| threshold | `address` | Withdraw size above which the withdraw delay goes into effect |



## `global_stop`

>👀 `nonpayable`

### 📋 Notice

This function triggers the global bridge stop that halts all withdrawals and deposits until it is resumed


### 🔎 Details

bridge must not be stopped alreadyMUST emit Bridge_Stopped if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `uint256` | Vega-supplied signature bundle of a validator-signed order |



## `global_resume`

>👀 `nonpayable`

### 📋 Notice

This function resumes bridge operations from the stopped state


### 🔎 Details

bridge must be stoppedMUST emit Bridge_Resumed if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `uint256` | Vega-supplied signature bundle of a validator-signed order |



## `set_exemption_lister`

>👀 `nonpayable`

### 📋 Notice

this function allows MultisigControl to set the address that can exempt depositors from the deposit limitsthis feature is specifically for liquidity and rewards providers


### 🔎 Details

MUST emit Exemption_Lister_Set if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `address` | Vega-supplied signature bundle of a validator-signed order |



## `exempt_depositor`

>👀 `nonpayable`

### 📋 Notice

this function allows the exemption_lister to exempt a depositor from the deposit limitsthis feature is specifically for liquidity and rewards providers


### 🔎 Details

MUST emit Depositor_Exempted if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| depositor | `address` | The depositor to exempt from limits |



## `revoke_exempt_depositor`

>👀 `nonpayable`

### 📋 Notice

this function allows the exemption_lister to revoke a depositor&#39;s exemption from deposit limitsthis feature is specifically for liquidity and rewards providers


### 🔎 Details

MUST emit Depositor_Exemption_Revoked if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| depositor | `address` | The depositor from which to revoke deposit exemptions |



## `withdraw_asset`

>👀 `nonpayable`

### 📋 Notice

This function withdrawals assets to the target Ethereum addressSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Withdrawn if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| asset_source | `address` | Contract address for given ERC20 token |
| target | `address` | Target Ethereum address to receive withdrawn ERC20 tokens |
| amount | `uint256` | Amount of ERC20 tokens to withdraw |
| nonce | `uint256` | Vega-assigned single-use number that provides replay attack protection |
| signatures | `memory` | Vega-supplied signature bundle of a validator-signed order |



## `deposit_asset`

>👀 `nonpayable`

### 📋 Notice

This function allows a user to deposit given ERC20 tokens into VegaERC20 approve function should be run before running this


### 🔎 Details

MUST emit Asset_Deposited if successfulERC20 approve function should be run before running this

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| vega_public_key | `address` | Target Vega public key to be credited with this deposit |



## `is_asset_listed`

>👀 `view`

### 📋 Notice

This view returns true if the given ERC20 token contract has been listed valid for deposit



### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| asset_source | `address` | Contract address for given ERC20 token |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `get_deposit_minimum`

>👀 `view`

### 📋 Notice

This view returns minimum valid deposit



### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| asset_source | `address` | Contract address for given ERC20 token |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `get_deposit_maximum`

>👀 `view`

### 📋 Notice

This view returns maximum valid deposit



### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| asset_source | `address` | Contract address for given ERC20 token |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `get_asset_deposit_limit`

>👀 `view`

### 📋 Notice

This view returns the lifetime deposit limit for the given asset



### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| asset_source | `address` | Contract address for given ERC20 token |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `get_withdraw_threshold`

>👀 `view`

### 📋 Notice

This view returns the given token&#39;s withdraw threshold above which the withdraw delay goes into effect



### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| asset_source | `address` | Contract address for given ERC20 token |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `get_exemption_lister`

>👀 `view`

### 📋 Notice

this view returns the address that can exempt depositors from deposit limits



### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `is_exempt_depositor`

>👀 `view`

### 📋 Notice

this view returns true if the given despoitor address has been exempted from deposit limits



### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| depositor | `address` | The depositor to check |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `get_multisig_control_address`

>👀 `view`




### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `get_vega_asset_id`

>👀 `view`




### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| asset_source | `address` | Contract address for given ERC20 token |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bytes32` |



## `get_asset_source`

>👀 `view`




### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| vega_asset_id | `bytes32` | Vega-assigned asset ID for which you want the ERC20 token address |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



