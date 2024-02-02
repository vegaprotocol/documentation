---
sidebar_position: 5
title: Rewards & Vesting
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Vega Protocol contains a flexible system allowing for various behaviours on the network to be measured and rewarded, with the rewards able to be configured and funded permissionlessly by any network participant.

## Trading rewards
Market participants can receive rewards for their trading activity, liquidity provision, and for proposing actively traded markets.

**Traders** can receive bonuses for placing market and/or limit orders that are filled, and keeping positions open. 

**Liquidity providers** can receive rewards on top of the fees they earn for placing orders that are likely to match. 

**Market proposers** can receive rewards for proposing markets that draw in trading volume. 

Your reward earnings can grow if you have an [activity streak](./activity.md) and/or keep earned rewards in your rewards account. A full summary off all reward metrics can be found in [this](../trading-on-vega/discounts-rewards.md) deeper-dive into rewards.

Rewards are independent from [fees](./fees.md), which are paid to validators, liquidity providers, and price makers on each trade.

### How rewards are paid
Rewards that you earn are paid into a per-asset *vesting rewards account*. They may be locked for a time, if there's a lock period set. Each epoch, a percentage of the locked rewards begin vesting. Once they're vested, they are moved into a *vested rewards account*. From there, they can be redeemed by transferring them into your general account and withdrawn.

Once they unlock, a proportion of the rewards move into the vested account each epoch: <NetworkParameter frontMatter={frontMatter} name="current rate" param="rewards.vesting.baseRate" formatter="percent" />. That percentage can be higher if you have an [activity streak](#activity-streak) going.

### Active rewards

The currently active rewards can be explored within the [Console ↗](https://console.vega.xyz/#/rewards)

![Rewards](/img/101/rewards.png)

At the time of writing, there are three active rewards for each market on Vega:

 - **1200 VEGA per epoch**: Liquidity Fees Received
   - Distributed based on proportional amount of liquidity fees received by a trader. To be eligible for these, a party must submit a liquidity commitment and meet the time-on-book requirements. After this, fees are distributed based on the size of their on-book commitment and quality of prices. See [liquidity provision](./liquidity-provision.md) for more on how to supply liquidity.
 - **100 VEGA per epoch**: Maker Fees Earned
   - Distributed based on proportional amount of maker fees received by a trader that epoch (Acting as maker on a trade).
 - **100 VEGA per epoch**: Maker Fees Paid
   - Distributed based on proportional amount of maker fees paid by a trader that epoch (Acting as taker on a trade).

### Reward hoarder bonus
Leaving your reward earnings in your vested account will increase your share of the trading rewards you've accrued. How much extra you get depends on your total rewards balance, whether it's locked, vesting, or vested.

See the current reward hoarder bonus requirements and benefits on the [block explorer ↗](https://explorer.vega.xyz/network-parameters#rewards.vesting.benefitTiers).
