# Vega_2
> 👤 Vega Protocol
```
Vega 2 Token
```


### 📋 Notice

This contract is the Vega V2 ERC20 token that replaces the initial VEGA token




### 🎟 Events


#### Approval
| Name | Indexed | Type |
|:-:|:-:|:-:|
| owner | `true` | `address` |
| spender | `true` | `address` |
| value | `false` | `uint256` |


#### Controller_Changed
| Name | Indexed | Type |
|:-:|:-:|:-:|
| new_controller | `true` | `address` |


#### Transfer
| Name | Indexed | Type |
|:-:|:-:|:-:|
| from | `true` | `address` |
| to | `true` | `address` |
| value | `false` | `uint256` |



## `allowance`

>👀 `view`



### 🔎 Details

See {IERC20-allowance}.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `approve`

>👀 `nonpayable`



### 🔎 Details

See {IERC20-approve}. Requirements: - `spender` cannot be the zero address.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `balanceOf`

>👀 `view`



### 🔎 Details

See {IERC20-balanceOf}.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `controller`

>👀 `view`

### 📋 Notice

Address of the controller of this contract (similar to &quot;owner&quot; in other contracts)



### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `decimals`

>👀 `view`



### 🔎 Details

Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5,05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the value {ERC20} uses, unless this function is overloaded; NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint8` |



## `decreaseAllowance`

>👀 `nonpayable`



### 🔎 Details

Atomically decreases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `increaseAllowance`

>👀 `nonpayable`



### 🔎 Details

Atomically increases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `mint_lock_expiry`

>👀 `view`

### 📋 Notice

Timestamp of when mint becomes available to the current controller of the token



### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `name`

>👀 `view`



### 🔎 Details

Returns the name of the token.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `string` |



## `symbol`

>👀 `view`



### 🔎 Details

Returns the symbol of the token, usually a shorter version of the name.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `string` |



## `totalSupply`

>👀 `view`



### 🔎 Details

See {IERC20-totalSupply}.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `uint256` |



## `transfer`

>👀 `nonpayable`



### 🔎 Details

See {IERC20-transfer}. Requirements: - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `transferFrom`

>👀 `nonpayable`



### 🔎 Details

See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for ``sender``&#39;s tokens of at least `amount`.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `change_controller`

>👀 `nonpayable`

### 📋 Notice

This function allows the controller to assign a new controller


### 🔎 Details

Emits Controller_Changed event

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| new_controller | `address` | Address of the new controller |



## `mint_and_issue`

>👀 `nonpayable`

### 📋 Notice

This function allows the controller to mint and issue tokens to the target addressThis function is locked until mint_lock_expiry


### 🔎 Details

Runs ERC20 _mint function

### ⚙️ Parameters

| Name | Type | Description |
|:-:|:-:| - |
| target | `address` | Target address for the newly minted tokens |



