# IStake
> 

### 🔎 Details

Interface contains all of the events necessary for staking Vega token


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



## `staking_token`

>👀 `view`




### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `stake_balance`

>👀 `view`




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




### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



