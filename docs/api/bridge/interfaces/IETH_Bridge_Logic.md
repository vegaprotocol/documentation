# IETH_Bridge_Logic
> 👤 Vega Protocol
```
ETH Bridge Logic Interface
```


### 📋 Notice

Implementations of this interface are used by Vega network users to deposit and withdraw ETH to/from Vega.




### 🎟 Events


#### ETH_Deposit_Maximum_Set
| Name | Indexed | Type |
|:-:|:-:|:-:|
| new_maximum | `false` | `uint256` |
| nonce | `false` | `uint256` |


#### ETH_Deposit_Minimum_Set
| Name | Indexed | Type |
|:-:|:-:|:-:|
| new_minimum | `false` | `uint256` |
| nonce | `false` | `uint256` |


#### ETH_Deposited
| Name | Indexed | Type |
|:-:|:-:|:-:|
| user_address | `true` | `address` |
| amount | `false` | `uint256` |
| vega_public_key | `false` | `bytes32` |


#### ETH_Withdrawn
| Name | Indexed | Type |
|:-:|:-:|:-:|
| user_address | `true` | `address` |
| amount | `false` | `uint256` |
| nonce | `false` | `uint256` |



## `set_deposit_minimum`

>👀 `nonpayable`

### 📋 Notice

This function sets the minimum allowable deposit for ETHSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Deposit_Minimum_Set if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `uint256` | Vega-supplied signature bundle of a validator-signed order |



## `set_deposit_maximum`

>👀 `nonpayable`

### 📋 Notice

This function sets the maximum allowable deposit for ETHSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Deposit_Maximum_Set if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| signatures | `uint256` | Vega-supplied signature bundle of a validator-signed order |



## `withdraw_asset`

>👀 `nonpayable`

### 📋 Notice

This function sets the maximum allowable deposit for the given ETHSee MultisigControl for more about signatures


### 🔎 Details

MUST emit Asset_Withdrawn if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| target | `uint256` | Target Ethereum address to receive withdrawn ETH |



## `deposit_asset`

>👀 `payable`

### 📋 Notice

This function allows a user to deposit ETH into VegaETH approve function should be run before running this


### 🔎 Details

MUST emit Asset_Deposited if successfulETH approve function should be run before running this

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| vega_public_key | `bytes32` | Target vega public key to be credited with this deposit |



## `get_deposit_minimum`

>👀 `view`

### 📋 Notice

This view returns minimum valid deposit



### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `get_deposit_maximum`

>👀 `view`

### 📋 Notice

This view returns maximum valid deposit



### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `get_multisig_control_address`

>👀 `view`




### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `get_vega_asset_id`

>👀 `view`




### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bytes32` |



