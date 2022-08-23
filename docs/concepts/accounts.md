---
sidebar_position: 2
title: Accounts
hide_title: false
---

## Accounting system
Vega uses accounts in various situations to ensure funds are never lost or double spent. The amounts in each account, as well as the transactions that added to and removed from those accounts, are all recorded and stored on-chain. Double entry accounting is maintained at all points.

Accounts are used either to hold assets that you're in control of using — such as collateral you deposit, or for setting money aside that only the network can manage — to fulfil margin requirements, for example, or to store assets that are earmarked for rewards or paying out fees. This means that, for example, when your funds are allocated to margin to support a position you opened, or you submit a liquidity commitment and bond amount is reserved, those assets can't be used for anything else.

:::tip Query for data
You can see how much is allocated to the accounts for your public key in [Vega Console ↗](https://console.fairground.wtf), the trading interface.

Otherwise use a [GraphQL query](./../graphql/objects/party#accounts-account) to check your public key for the accounts.
:::

## General account
The *general account* is managed by the party who controls the keys that account was created for.

Every public key has a potential general account in every asset supported on the Vega network; it's created the first time assets are deposited or transferred to it. The general account is the place where deposits and rewards go, where withdrawals come from, and where a participant can transfer assets from (or receive assets to).

The general account also holds VEGA when it's not associated to a Vega key and/or locked in a smart contract. Staking rewards, as well as trading rewards, are paid into the general account.

Any assets that are in a general account can be withdrawn or transferred.

You'll see references to your general account in various places, including under collateral in Console, the trading interface.

## Accounts governed by the protocol
Assets that are held in any other type of account other than the general account can't be moved by you, though they may be used to support your trades or liquidity commitments. Your assets are still tied to your Vega public key, even if they are in an account you can't actively manage.

### Margin accounts
Margin accounts temporarily hold assets that support a participant's trades on a market. 

Each party with open orders or positions on any market has a margin account. When you trade on a market, the required initial margin is allocated to that market from your general account, meaning that it can't be withdrawn or used as margin on another market while it is allocated to the first market. Money may be periodically transferred into or out of your margin account from your general account if the balance becomes too low to support your trading, or if the gains on your position mean the account contains more funds than are needed.

To move some or all of the money in your margin account back into your general account, you can try reducing the size of your position on the market, or closing it entirely. If your position size is zero and you have no active orders, your margin account will be empty and all the funds will be returned to your general account and be accessible by you once more.

### Mark-to-market settlement accounts
This account type temporarily holds assets to be distributed based on the outcomes of trades and market movements.

Each market has a mark-to-market settlement account. Cashflows from mark-to-market settlement are collected into that account and distributed from it every time there is a mark-to-market calculation. After each mark-to-market settlement, the account balance is back to zero. 

Note that this happens instantaneously, so you will likely never observe a current balance in an account of this type. However, you may see transfers to and from this account and historic balances if you examine historic data. This can help you to understand how funds have moved between parties with active positions on a market.

### Liquidity bond accounts
Every liquidity provider automatically transfers a certain amount of money to a bond account for each market that they're committed to. The liquidity provider chooses how much goes into the bond account, and that amount is locked up for the entire time that party commits liquidity to the market. It acts as a guarantee for the liquidity obligation, to assure that the commitment is firm and the protocol can rely on that liquidity in any market conditions.

### Insurance pool accounts
There are insurance pool accounts per market and per asset. 

The insurance pool holds funds that have been collected if a liquidity provider pays a penalty for not providing their committed liquidity, or if a trader is closed out. The funds in the pool are called on if a market's events cause extreme movements, and traders become too distressed to cover their losses. 

Once a market settles and terminates, any amount left in a market's insurance pool is transferred to the asset insurance pool, which can then be drawn on by other markets that use the same settlement asset.

### Accounts for fees
Fees that are collected from market participants are held in accounts before they're distributed to the relevant recipients. The funds used for paying fees are held in an account for each specific type of fee - not all market participants will pay the same fees. 

All fees that a trader is due to pay are held in a temporary account per trade - so the protocol knows who the maker is on each trade. 

Maker fees go directly to the trade's passive party from the temporary account.

The revenue from other fees go into fee-specific accounts:
* **Liquidity fee pool**: per market, to then be distributed to the market's liquidity providers based on their share of the market
* **Infrastructure fee pool**: per asset, to then be distributed to the consensus validators who run the network and thus provide the infrastructure

### Reward accounts 
Trading rewards are funded by community members that want to incentivise certain types of market activities. 

Reward accounts can exist for each combination of reward metric, asset, and market, and they come to exist when they are funded by reward account transfers, which occur at the end of each epoch. The amount of assets entering each reward account depend on the amount transferred and the reward transfer strategy that the funder(s) defined when they set up the rewards transfer.

<!--### Network treasury accounts
The network treasury is made up of accounts, one per asset (if funded), that are contributed to by participants in the network. They can be funded through deposits or direct transfers from other protocol-governed accounts. In the future, funds in the network treasury can be used for rewards, grants, or other uses defined by tokenholder governance. -->
