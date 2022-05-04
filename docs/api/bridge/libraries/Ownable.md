---
id: Ownable
title: Ownable
original_id: Ownable
---

# Ownable.sol

View Source: [contracts/tests/Ownable.sol](https://github.com/vegaprotocol/MultisigControl/blob/solidoc/docs/Ownable.md)

**↘ Derived Contracts: [Killable](./Killable)**

**Ownable**

Contract module which provides a basic access control mechanism, where
 there is an account (an owner) that can be granted exclusive access to
 specific functions.
 This module is used through inheritance. It will make available the modifier
 `onlyOwner`, which can be applied to your functions to restrict their use to
 the owner.

## Contract Members
**Constants & Variables**

```js
address private _owner;
```
---

## OwnershipTransferred

**Parameters**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| previousOwner | address |  | 
| newOwner | address |  | 

## Modifiers

- [onlyOwner](#onlyowner)

### onlyOwner

Throws if called by any account other than the owner.

```js
modifier onlyOwner() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [Ownable.sol](#ownablesol)
  - [Contract Members](#contract-members)
  - [OwnershipTransferred](#ownershiptransferred)
  - [Modifiers](#modifiers)
    - [onlyOwner](#onlyowner)
  - [Functions](#functions)
    - [](#)
    - [owner](#owner)
    - [isOwner](#isowner)
    - [renounceOwnership](#renounceownership)
    - [transferOwnership](#transferownership)
    - [_transferOwnership](#_transferownership)

### 

Initializes the contract setting the deployer as the initial owner.

```js
function () public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### owner

Returns the address of the current owner.

```js
function owner() public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### isOwner

Returns true if the caller is the current owner.

```js
function isOwner() public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### renounceOwnership

Leaves the contract without owner. It will not be possible to call
 `onlyOwner` functions anymore. Can only be called by the current owner.
 NOTE: Renouncing ownership will leave the contract without an owner,
 thereby removing any functionality that is only available to the owner.

```js
function renounceOwnership() public nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### transferOwnership

Transfers ownership of the contract to a new account (`newOwner`).
 Can only be called by the current owner.

```js
function transferOwnership(address newOwner) public nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newOwner | address |  | 

### _transferOwnership

Transfers ownership of the contract to a new account (`newOwner`).

```js
function _transferOwnership(address newOwner) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newOwner | address |  | 

