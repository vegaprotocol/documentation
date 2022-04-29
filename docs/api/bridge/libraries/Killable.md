# Killable
>

### 🎟 Events


#### OwnershipTransferred
| Name | Indexed | Type |
|:-:|:-:|:-:|
| previousOwner | `true` | `address` |
| newOwner | `true` | `address` |



## `isOwner`

>👀 `view`



### 🔎 Details

Returns true if the caller is the current owner.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `owner`

>👀 `view`



### 🔎 Details

Returns the address of the current owner.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `renounceOwnership`

>👀 `nonpayable`



### 🔎 Details

Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.



## `transferOwnership`

>👀 `nonpayable`



### 🔎 Details

Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.



## `kill`

>👀 `nonpayable`






