# IERC20

### 🔎 Details

Interface of the ERC20 standard as defined in the EIP. Does not include the optional functions.


### 🎟 Events


#### Approval
| Name | Indexed | Type |
|:-:|:-:|:-:|
| owner | `true` | `address` |
| spender | `true` | `address` |
| value | `false` | `uint256` |


#### Transfer
| Name | Indexed | Type |
|:-:|:-:|:-:|
| from | `true` | `address` |
| to | `true` | `address` |
| value | `false` | `uint256` |



## `totalSupply`

>👀 `view`



### 🔎 Details

Returns the amount of tokens in existence.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `balanceOf`

>👀 `view`



### 🔎 Details

Returns the amount of tokens owned by `account`.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `transfer`

>👀 `nonpayable`



### 🔎 Details

Moves `amount` tokens from the caller&#39;s account to `recipient`. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `allowance`

>👀 `view`



### 🔎 Details

Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. This value changes when {approve} or {transferFrom} are called.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `approve`

>👀 `nonpayable`



### 🔎 Details

Sets `amount` as the allowance of `spender` over the caller&#39;s tokens. Returns a boolean value indicating whether the operation succeeded. IMPORTANT: Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender&#39;s allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729 Emits an {Approval} event.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `transferFrom`

>👀 `nonpayable`



### 🔎 Details

Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. `amount` is then deducted from the caller&#39;s allowance. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



