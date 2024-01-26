---
sidebar_position: 3
title: Accounts
hide_title: false
description: Accounts hold assets for different purposes.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

## Accounting system
Vega uses accounts in various situations to ensure funds are never lost or double spent. The amounts in each account, as well as the transactions that were added to and removed from those accounts, are all recorded and stored on-chain. Double entry accounting is maintained at all points.

Accounts are used either to hold assets that you're in control of using — such as collateral you deposit, or for setting money aside that only the network can manage — to fulfil margin requirements, for example, or to store assets that are earmarked for rewards or paying out fees. This means that, for example, when your funds are allocated to margin to support a position you opened, or you submit a liquidity commitment and bond amount is reserved, those assets can't be used for anything else.

## General account
The *general account* is managed by the party who controls the keys that account was created for.

Every public key has a potential general account in every asset supported on the Vega network; it's created the first time assets are deposited or transferred to it. The general account is the place where deposits and rewards go, where withdrawals come from, and where a participant can transfer assets from (or receive assets to).

The general account also holds VEGA tokens that have been deposited to the network (but not those associated with a Vega key via the Ethereum staking bridge and/or locked in a smart contract). Staking rewards, as well as trading rewards, are paid into the general account.

Any assets that are in a general account can be withdrawn or transferred.

You'll see references to your general account in various places, including under collateral in Console, the trading interface.

:::tip Query for data
**[Vega Console](https://console.fairground.wtf)**: See how much is allocated to the accounts for your public key.

**[REST](../../api/rest/data-v2/trading-data-service-get-party.api.mdx)**: Use the API to check your public key for the accounts your assets are allocated to.
:::

## Accounts governed by the protocol
Assets that are held in any other type of account other than the general account can't be moved by you, though they may be used to support your trades or liquidity commitments. Your assets are still tied to your Vega public key, even if they are in an account you can't actively manage.

### Margin accounts
Margin accounts temporarily hold assets that support a participant's trades on a market. Depending on the margin mode you're using: isolated or cross margin, assets are held in diffferent accounts.

When you trade on a market, the required initial margin is moved from your general account to be used to support your order/position, and thus it can't be withdrawn.

Isolated margin mode:
* Margin account: Used to hold margin for supporting open positions 
* Order margin account: Used to hold margin for supporting open orders

Cross margin mode:
* Margin account is used for both positions and orders

If you're using *cross margin mode*, collateral may be periodically transferred between your margin account and your general account if the balance becomes too low to support your trading, or if the gains on your position mean the account contains more collateral than needed.

To move some or all of the money in your margin or order margin account back into your general account, you can try reducing the size of your position on the market, or closing it entirely. If your position size is zero and you have no active orders, your margin accounts will be empty and all the funds will be returned to your general account and you can access them again.

:::note Read more
[Margin](../trading-on-vega/margin.md)
:::

### Settlement accounts
This account type temporarily holds assets to be distributed based on the outcomes of trades and market movements.

Each market has its own settlement account. Cashflows from mark-to-market settlement are collected into that account and distributed from it every time there is a mark-to-market calculation. After each mark-to-market settlement, the account balance is back to zero. 

Note that this happens instantaneously, so you will likely never observe a current balance in an account of this type. However, you may see transfers to and from this account and historic balances if you examine historic data. This can help you to understand how funds have moved between parties with active positions on a market.

:::info Read more
[Concept: Mark-to-market settlement](../trading-on-vega/settlement.md#mark-to-market-settlement) 
:::

### Liquidity bond accounts
Every liquidity provider automatically transfers a certain amount of money to a bond account for each market that they're committed to. The liquidity provider chooses how much goes into the bond account, and that amount is locked up for the entire time that party commits liquidity to the market. It acts as a guarantee for the liquidity obligation, to assure that the commitment is firm and the protocol can rely on that liquidity in any market conditions.

:::note Read more
[Concept: How liquidity works on Vega](../liquidity/index.md) 
:::

### Insurance pool accounts
There are insurance pool accounts per market and per asset. 

The insurance pool holds funds that have been collected if a liquidity provider pays a penalty for not providing their committed liquidity, or if a trader is closed out. The funds in the pool are called on if a market's events cause extreme movements, and traders become too distressed to cover their losses. 

Once a market settles and terminates, any amount left in a market's insurance pool is divided equally between the asset insurance pool and the insurance pools of the remaining active markets using the same settlement asset.

However, the behaviour is different when a market is defined as a parent to a successor. In a successor market proposal, a portion of a market's insurance pool can be earmarked for transfer to the successor market. The rest of the market's insurance pool, if there is any, is then divided equally as described above.

The assets in the asset insurance pools can only be moved if a  [governance-initiated transfer](./transfers.md#governance-initiated-transfers) is enacted, meaning a governance proposal to move assets to another specified account has passed the vote.

:::note Read more
* [Concept: Market lifecycle](../trading-on-vega/market-lifecycle.md)
* [Concept: Market protections](../trading-on-vega/market-protections.md)
:::

### Accounts for fees
Fees that are collected from market participants are held in accounts before they're distributed to the relevant recipients. The funds used for paying fees are held in an account for each specific type of fee - not all market participants will pay the same fees. 

All fees that a trader is due to pay are held in a temporary account per trade - so the protocol knows who the maker is on each trade. 

Maker fees go directly to the trade's passive party from the temporary account.

The revenue from other fees go into fee-specific accounts:
* **Liquidity fee pool**: per market, to then be distributed to the market's liquidity providers based on their share of the market
* **Infrastructure fee pool**: per asset, to then be distributed to the consensus validators who run the network and thus provide the infrastructure

:::note Read more
[Concept: Fees](../trading-on-vega/fees.md)
:::

### Trading reward accounts 
Trading rewards are funded by community members that want to incentivise certain types of market activities.

Reward accounts can exist for each combination of reward metric, asset, and market, and they come to exist when they are funded by reward account transfers, which occur at the end of each epoch. The amount of assets entering each reward account depends on the amount transferred and the reward transfer strategy that the funder(s) defined when they set up the rewards transfer.

There is also a global rewards account, which is used for validator rewards on top of infrastructure fee revenue.

| Reward account name                               | Account purpose |
|---------------------------------------------------|-----------------|
| Vested rewards      | Holds earned rewards that have passed the vesting period and can be redeemed |
| Vesting rewards | Holds earned rewards that are still within the vesting period |
| Maker fees paid reward | Holds funds allocated to reward aggressive side of a trade based on fees paid |
| Maker fees received reward | Holds funds allocated to reward passive side of a trade based on fees earned |
| LP received fees reward     | Holds funds allocated to reward liquidity providers based on fees received for trades hit |
| Average position reward | Holds funds allocated to reward the largest traders by position size |
| Relative return reward | Holds funds allocated to reward most profitable traders |
| Return volatility reward | Holds funds allocated to reward traders with the most consistent returns |
| Market proposers reward | Holds funds allocated to reward creating markets that attract good trading volume |

:::note Read more
[Concept: Trading rewards](../trading-on-vega/discounts-rewards.md#trading-rewards)
:::

### Validator reward accounts
Validator reward accounts are used to distribute rewards, if they're funded, to consensus and standby validators based on their ranking score. These accounts can be funded through [deposits](./deposits-withdrawals.md) or [transfers](./transfers.md).

:::note Read more
[Concept: Validator scores and rewards](../vega-chain/validator-scores-and-rewards.md)
:::

### Network treasury accounts
The network treasury is made up of accounts, one per asset (if funded), that can be contributed to by participants in the network. They can be funded through deposits or transfers. 

The assets in network treasury accounts can only be moved out if a [governance-initiated transfer](./transfers.md#governance-initiated-transfers) is enacted, meaning a governance proposal to move assets has passed the vote.

Assets in the network treasury can be used for rewards, grants, or other uses defined by tokenholder governance.
