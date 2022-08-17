---
sidebar_position: 4
title: Accounts on Vega
hide_title: false
---
## Accounting system
Vega uses accounts across the protocol to ensure funds are never lost or double spent. 

This means that, for example, when your funds are allocated to a market as margin, or you submit a liquidity commitment and bond amount is reserved, the assets can't be used for anything else. A new account is created and the relevant funds are moved to that account.

In general, accounts are used either to hold assets that you're in control of using, or for setting money aside that you can't access -- to fulfil margin requirements, for example, or to store assets that are earmarked for rewards or paying out fees.

## Accounts you can manage
general: 

also displayed as your collateral (check what this is in console)

## Accounts controlled by the protocol
Margin and settlement accounts 
* Mark-to-market settlement account per market: this is used for collecting and distributing mark-to-market settlement cashflows and is zero at the end of each mark-to-market settlement run.
* Margin accounts for each party with open orders or positions on any market.

When you trade on a market, the required initial margin is allocated to that market from your funds, meaning that it can't be withdrawn or used as margin on another market while it is allocated to the first market.

Party accounts 
* Bond account for any party that's an LP on any market.

Fee accounts
* Insurance pool account for any market.
* Liquidity fee pool for any market.
* Infrastructure fee pool for any asset.

Asset-specific accounts
* Reward accounts which exist for each reward account per every Vega asset (settlement asset) and per every reward metric per every Vega asset (reward asset). There is an additional staking rewards account.
* Vega trasury accounts per Vega asset.

Some accounts are created only when they're needed, and cease to exist when they're no longer required. 
