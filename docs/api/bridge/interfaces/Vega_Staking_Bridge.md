# Vega_Staking_Bridge
> 👤 Vega Protocol
```
ERC20 Staking Bridge
```


### 📋 Notice

This contract manages the vesting of the Vega V2 ERC20 token




### 🎟 Events


#### Stake_Deposited
| Name | Indexed | Type |
|:-:|:-:|:-:|
| user | `true` | `address` |
| amount | `false` | `uint256` |
| vega_public_key | `true` | `bytes32` |


#### Stake_Removed
| Name | Indexed | Type |
|:-:|:-:|:-:|
| user | `true` | `address` |
| amount | `false` | `uint256` |
| vega_public_key | `true` | `bytes32` |


#### Stake_Transferred
| Name | Indexed | Type |
|:-:|:-:|:-:|
| from | `true` | `address` |
| amount | `false` | `uint256` |
| to | `true` | `address` |
| vega_public_key | `true` | `bytes32` |



## `stake`

>👀 `nonpayable`

### 📋 Notice

This stakes the given amount of tokens and credits them to the provided Vega public key


### 🔎 Details

Emits Stake_Deposited eventUser MUST run &quot;approve&quot; on token prior to running Stake

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| vega_public_key | `uint256` | Target Vega public key to be credited with the stake |



## `remove_stake`

>👀 `nonpayable`

### 📋 Notice

This removes specified amount of stake of available to user


### 🔎 Details

Emits Stake_Removed event if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| vega_public_key | `uint256` | Target Vega public key from which to deduct stake |



## `transfer_stake`

>👀 `nonpayable`

### 📋 Notice

This transfers all stake from the sender&#39;s address to the &quot;new_address&quot;


### 🔎 Details

Emits Stake_Transfered event if successful

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| vega_public_key | `uint256` | Target Vega public key to be credited with the transfer |



## `staking_token`

>👀 `view`



### 🔎 Details

This is IStake.staking_token

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `stake_balance`

>👀 `view`



### 🔎 Details

This is IStake.stake_balance

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| vega_public_key | `address` | Target vega public key to check |

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `total_staked`

>👀 `view`



### 🔎 Details

This is IStake.total_staked

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



