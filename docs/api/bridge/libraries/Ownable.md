# Ownable


### 🔎 Details

Contract module which provides a basic access control mechanism, where there is an account (an owner) that can be granted exclusive access to specific functions. This module is used through inheritance. It will make available the modifier `onlyOwner`, which can be applied to your functions to restrict their use to the owner.


### 🎟 Events


#### OwnershipTransferred
| Name | Indexed | Type |
|:-:|:-:|:-:|
| previousOwner | `true` | `address` |
| newOwner | `true` | `address` |



## `owner`

>👀 `view`



### 🔎 Details

Returns the address of the current owner.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `address` |



## `isOwner`

>👀 `view`



### 🔎 Details

Returns true if the caller is the current owner.

### → Returns



| Name | Type |
|:-:|:-:|
|  Not specified  | `bool` |



## `renounceOwnership`

>👀 `nonpayable`



### 🔎 Details

Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.



## `transferOwnership`

>👀 `nonpayable`



### 🔎 Details

Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.



