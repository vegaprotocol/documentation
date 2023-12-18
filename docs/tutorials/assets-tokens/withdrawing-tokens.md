---
title: Withdraw tokens
sidebar_position: 5
hide_title: false
vega_network: TESTNET
description: Withdraw staked or claimed tokens
---

## Check the status of your tokens

How to withdraw your VEGA tokens depends on the status of the tokens. You can withdraw any tokens that are *vested*, or that you already hold on your Ethereum address.

In a nutshell, tokens may be locked for a time. Each epoch, a percentage of locked tokens begin vesting. Once they're vested, they are moved into a vested account. From there, you can redeem vested tokens by transferring them into your general account, at which point they can be withdrawn.

1. Search for your Ethereum address into the redeem page on the [governance dApp](https://governance.fairground.wtf/token/redeem). 

2. If you are connected to your Ethereum and Vega wallets, you can also see a breakdown of your tokens and their status in the wallet sidebar.

## Remove tokens from Vega that are stored on Ethereum

For tokens that are already in your Ethereum wallet, and not locked, vesting or vested with Vega, you can remove them from Vega almost immediately.

### Remove staked tokens
If your tokens are associated to a Vega key and staked to a validator: 

1. To remove your tokens immediately, use the governance dApp to [disassociate](https://governance.fairground.wtf/token/disassociate) the tokens from your Vega key. This will also remove any validator nominations you have. You'll lose any accrued staking rewards for the current epoch.

2. To receive the current epoch's staking rewards, use the governance dApp. 
    a. Visit the [validators](https://governance.fairground.wtf/validators) page.

    b. Click on "Staked by me". 
    
    c. Choose a validator to remove stake from, and how much you want to remove. Click "Remove $VEGA tokens at the end of the epoch."
    
    d. You'll need to remove stake from each validator individually.

### Remove unstaked tokens

For tokens that are associated to a Vega key, but not used for staking validators, all you need to do is [disassociate](https://governance.fairground.wtf/token/disassociate) the tokens from your Vega key. You won't need to 

## Withdraw vested tokens

For tokens that have been through vesting and are now vested, you will need to move them from Vega to Ethereum. 

1. [Disassociate](https://governance.fairground.wtf/token/disassociate) your vested tokens. If you have nominated validators, disassociating without removing your nomination means you'll lose any staking rewards for that epoch. You can choose to un-nominate at the end of the epoch if you'd rather not lose rewards.

2. Redeem your tokens to move them to your general account on Vega. 
    a. On the [Governance dApp](https://governance.fairground.wtf), you can click on Redeem on the wallet sidebar, which will take you to Console where you can transfer those tokens to your general account.

    b. On Console, under [Rewards](https://vegafairground.eth.limo/#/rewards), you can see any tokens or assets that are available to redeem. From there you can transfer those tokens from your vested account into your general account. 

3. Withdraw tokens from Vega to your Ethereum wallet. In Console, use the Withdraw icon in the right sidebar to initiate your withdrawal into your Ethereum address.