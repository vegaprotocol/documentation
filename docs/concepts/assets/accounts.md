---
sidebar_position: 3
title: Accounts
hide_title: false
vega_network: TESTNET
description: Accounts hold assets for different purposes.
---

## Accounting system
Vega uses accounts in various situations to ensure funds are never lost or double spent. The amounts in each account, as well as the transactions that were added to and removed from those accounts, are all recorded and stored on-chain. Double entry accounting is maintained at all points.

Accounts are used either to hold assets that you're in control of using — such as collateral you deposit, or for setting money aside that only the network can manage — to fulfil margin requirements, for example, or to store assets that are earmarked for rewards or paying out fees. This means that, for example, when your funds are allocated to margin to support a position you opened, or you submit a liquidity commitment and bond amount is reserved, those assets can't be used for anything else.

## General account
The *general account* is managed by the party who controls the keys that account was created for.

Every public key has a potential general account in every asset supported by the network; it's created the first time assets are deposited or transferred to it. The general account is the place where deposits and rewards go, where withdrawals come from, and where a participant can transfer assets from (or receive assets to).

The general account also holds governance tokens that have been deposited to a network (but not those associated with a Vega key via the Ethereum staking bridge and/or locked in a smart contract). Staking rewards, as well as trading rewards, are paid into the general account.

Any assets that are in a general account can be withdrawn or transferred.

:::tip Query for data
**[REST](../../api/rest/data-v2/trading-data-service-get-party.api.mdx)**: Use the API to check your public key for the accounts your assets are allocated to.
:::

## Vault
A *vault* holds assets that have been contributed by one or more parties to be used by the vault manager for trading. The assets in a vault can only be used to enter and exit positions. Vaults have general and margin accounts associated with them.

Contributors to a vault have a share of the value in the vault, based on how much their deposited amount contributed to its original value.

The vault manager - the party that created the account - can charge fees on the performance and on management if they choose to. Vault managers can transfer the ownership of a vault to another user/public key.

Each vault account handles one asset.

### Create a vault
Submitting a `CreateVault` transaction will create a vault for others to contribute to.

The transaction needs to include the following information for the vault:
- Settlement asset for the vault
- Metadata describing the vault
- Fee period, which sets the frequency of the vault's fees assessment
- Management fee factor
- Performance fee factor
- Redemption dates
- The cut-off period following the redemption date until which a redemption request is queued

Once a vault is created, if the vault manager wants to transfer ownership to another party, they'll need to submit a `ChangeVaultOwnership` transaction with the vault ID and the Vega public key of the new vault manager.

### Change a vault
A vault manager can submit a transaction to `UpdateVault` if they want to change some of the parameters.

Fields that can be changed:
- Metadata describing the vault
- Fee period
- Management fee factor
- Performance fee factor
- Redemption dates: The closest redemption date **cannot** be removed, nor can any date that falls within the cut-off period. New redemption dates can only be after the upcoming redemption date
- The cut-off period following the redemption date until which a redemption request is queued

### Contribute to a vault
To deposit assets into a vault, a participant will need to submit a `depositIntoVault` transaction, which includes the vault ID (account ID), and the amount to contribute.

### Redeem from a vault
To redeem from a vault, a vault participant will need to submit a `withdrawFromVault` transaction, which includes the vault ID, and the amount to redeem. 

Each vault has a list of dates when redemption takes place. Each redemption cycle has a cut-off period that follows the redemption date,

There are two redemption types:
- Available funds only: Vault participants can redeem from assets available in the vault's general account. When a withdrawal request falls closest to an `available funds only` date, a fraction can be withdrawn. The withdrawal amount will be the lesser of the amount requested, and the amount that available to withdraw based on the participant's share of the 'maximum redemption fraction * available amount'. Each redemption is fulfilled as much as possible, and the redemption request is considered complete. Any remainder of the redemption requests is cancelled and participants can request a redemption for the next date.
- Normal: Vault participants can redeem up to a certain fraction of the vault's total balance, which includes the general and margin accounts. If any amount of the withdrawal cannot be fulfilled, the remaining is marked as 'late', and whenever more funds reach the general account, late withdrawals will be fulfilled.

Each redemption date also has a cut-off period beforehand, set by the vault manager per vault. Any redemption requests that come during the cut-off period are queued until the following redemption date.

`Available funds only` redemption example:

- Redemption day balance in general account = 100
- Max fraction = 0.5
- Participant's vault share = 20%
- Max possible withdrawal = 10. (0.2*0.5*100 = 10)
- Withdrawn amount = min(asked_withdrawal_amount,10)

In this example, if a partcipant asks for more than 10, they get 10. If they ask for 5, they receive 5.

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
[Margin](../trading-framework/margin.md)
:::

### Settlement accounts
This account type temporarily holds assets to be distributed based on the outcomes of trades and market movements.

Each market has its own settlement account. Cashflows from mark-to-market settlement are collected into that account and distributed from it every time there is a mark-to-market calculation. After each mark-to-market settlement, the account balance is back to zero. 

Note that this happens instantaneously, so you will likely never observe a current balance in an account of this type. However, you may see transfers to and from this account and historic balances if you examine historic data. This can help you to understand how funds have moved between parties with active positions on a market.

:::info Read more
[Concept: Mark-to-market settlement](../trading-framework/settlement.md#mark-to-market-settlement) 
:::

### Holding accounts
Holding accounts temporarily hold assets to be distributed based on the outcomes of trades on spot markets.

An order on a spot market that doesn't immediately trade in full, has the collateral needed to cover the order, and any possible fees, moved to a holding account, to ensure you can support your open order. If you cancel or reduce the size, any freed up collateral is returned to your general account. This is true in both continuous trading and auction modes.

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
* [Concept: Market lifecycle](../trading-framework/market-lifecycle.md)
* [Concept: Market protections](../trading-framework/market-protections.md)
:::

### Accounts for fees
Fees that are collected from market participants are held in accounts before they're distributed to the relevant recipients. The funds used for paying fees are held in an account for each specific type of fee - not all market participants will pay the same fees. 

All fees that a trader is due to pay are held in a temporary account per trade - so the protocol knows who the maker is on each trade. 

Maker fees go directly to the trade's passive party from the temporary account.

The revenue from other fees go into fee-specific accounts:
* **Liquidity fee pool**: per market, to then be distributed to the market's liquidity providers based on their share of the market
* **Infrastructure fee pool**: per asset, to then be distributed to the consensus validators who run the network and thus provide the infrastructure

:::note Read more
[Concept: Fees](../trading-framework/fees.md)
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
[Concept: Trading rewards](../trading-framework/discounts-rewards.md#trading-rewards)
:::

### Validator reward accounts
Validator reward accounts are used to distribute rewards, if they're funded, to consensus and standby validators based on their ranking score. These accounts can be funded through [deposits](./deposits-withdrawals.md) or [transfers](./transfers.md).

:::note Read more
[Concept: Validator scores and rewards](../chain/validator-scores-and-rewards.md)
:::

### Network treasury accounts
The network treasury is made up of accounts, one per asset (if funded), that can be contributed to by participants in the network. They can be funded through deposits or transfers. 

The assets in network treasury accounts can only be moved out if a [governance-initiated transfer](./transfers.md#governance-initiated-transfers) is enacted, meaning a governance proposal to move assets has passed the vote.

Assets in the network treasury can be used for rewards, grants, or other uses defined by tokenholder governance.
