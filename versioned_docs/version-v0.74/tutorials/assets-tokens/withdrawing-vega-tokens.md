---
title: Withdraw VEGA tokens
sidebar_position: 5
hide_title: false
vega_network: MAINNET
description: Withdraw staked, claimed or reward VEGA tokens
---

## Check the status of your VEGA

How to withdraw your VEGA tokens depends on the status of the tokens. You can withdraw any tokens that are *unlocked*, or that are already held by your Ethereum address.

In a nutshell, tokens may be locked for a time. How they're locked depends on how you came to receive them.

If your tokens are in the *vesting contract*, they will need to be unlocked before you can remove them from the Vega network. VEGA in the vesting contract is broken up by tranches, which unlock block by block until each tranche's tokens are fully available.

If you received them as *trading rewards*, each epoch, a percentage of locked tokens begin vesting. Once they're vested, they are moved into a vested account. From there, you can redeem vested tokens by transferring them into your general account, at which point they can be withdrawn.

1. Search for your Ethereum address into the redeem page on the [governance dApp](https://governance.fairground.wtf/token/redeem). 

2. If you are connected to your Ethereum and Vega wallets, you can also see a breakdown of your tokens and their status in the wallet sidebar.

## Remove tokens from Vega that are stored on Ethereum

For tokens that are already in your Ethereum wallet, and not locked, vesting or vested with Vega, you can remove them from Vega almost immediately.

### Remove staked VEGA
If your tokens are associated to a Vega key and staked to a validator: 

1. To remove your tokens immediately, use the governance dApp to [disassociate](https://governance.fairground.wtf/token/disassociate) the tokens from your Vega key. This will also remove any validator nominations you have. You'll lose any accrued staking rewards for the current epoch.

2. To receive the current epoch's staking rewards, use the governance dApp. 
    a. Visit the [validators](https://governance.fairground.wtf/validators) page.

    b. Click on "Staked by me". 
    
    c. Choose a validator to remove stake from, and how much you want to remove. Click "Remove $VEGA tokens at the end of the epoch."
    
    d. You'll need to remove stake from each validator individually.

### Remove unstaked VEGA
Tokens that are not held in a tranche and are associated to a Vega key, but not used for staking validators are easy to remove from the Vega network.

All you need to do is [disassociate](https://governance.fairground.wtf/token/disassociate) the tokens from your Vega key.

## Withdraw VEGA from the vesting contract

For VEGA tokens that are in the vesting contract and are now unlocked, you will need to disassociate and then redeem them. This moves the VEGA directly to your Ethereum address.

1. [Disassociate](https://governance.fairground.wtf/token/disassociate) your vested tokens. If you have nominated validators, disassociating without removing your nomination means you'll lose any staking rewards for that epoch. You can choose to un-nominate at the end of the epoch if you'd rather not lose rewards.

2. Redeem your tokens to move them to your Ethereum address. Visit the Redeem page on the [Governance dApp](https://governance.fairground.wtf/token/redeem), enter the Ethereum address you used for those VEGA tokens, and follow the instructions.

## Withdraw VEGA received as rewards

Rewards also go through a vesting process, which is different from tokens in the vesting contract. Those tokens are held in accounts on Vega until they become vested. At that point, they can be moved into your general account on Vega, after which they can be withdrawn from the Vega network to the Ethereum network.

1. If you have associated your tokens to your Vega key for staking purposes, [disassociate](https://governance.fairground.wtf/token/disassociate) them. Disassociating without removing your validator nominations means you'll lose any staking rewards for that epoch. You can choose to un-nominate at the end of the epoch if you'd rather not lose rewards.

2. Redeem your tokens to move them to your general account on Vega. You can redeem using either the Governance dApp or Console.

    a. On the [Governance dApp](https://governance.fairground.wtf), you can click on Redeem on the wallet sidebar, which will take you to Console where you can transfer those tokens to your general account.

    b. On [Console](https://vegafairground.eth.limo/#/rewards) under Rewards, you can see any tokens or assets that are available to redeem. From there you can transfer those tokens from your vested account into your general account.

3. Withdraw tokens from Vega to your Ethereum wallet. In Console, you can use the Withdraw icon in the right sidebar to initiate your withdrawal into your Ethereum address. To use Etherscan, follow the [withdrawing assets tutorial](./withdrawing-assets.md).