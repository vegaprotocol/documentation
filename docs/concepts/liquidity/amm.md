---
sidebar_position: 3
title: Using an AMM
hide_title: false
---

## What you need to set up an AMM
AMM (automated market maker) strategies are used to contribute to a liquidity pool. AMM providers receive a cut of liqudity fees paid by traders, as well as a portion of [community-funded rewards for liquidity providers](./rewards-penalties.md#community-funded-lp-rewards).

Add as little as `market.amm.minCommitmentQuantum` to any market, and earn from the fees paid by traders, plus any potential AMM rewards.

When providing liquidity using an AMM, the liquidity goes into a pool for the market, which is then tapped when participants place orders. 

To provide liquidity using an AMM, you’ll need:
* Vega public key 
* Enough of the market's settlement asset to provide liquidity

## How to set up AMM

The following fields are used to **set up an AMM** and to **change an existing AMM**.

* **Pool**: Choose the market pool. For each pool that you want to supply, you’ll need to set up a separate AMM 
* **Commitment amount**: How much of the market’s settlement asset you want to add to the liquidity pool
* **Base price**: What your AMM will quote as its price when its position is zero
* **Slippage tolerance percentage**: Maximum percentage of slippage you’re willing to accept on your AMM's first position, if it immediately needs to open a position. This is only relevant if your base price is above or below the best bid/offer, which will trigger a limit order
* **Proposed [liquidity fee](../trading-framework/fees.md#liquidity-fee)**: Your proposal for what percentage price takers will pay on trades
* **Price bounds** - The price bounds you set determine what range your liquidity is deployed in. You'll need to input either an upper bound or lower bound.
    * Upper bound - Price at which your AMM will stop quoting sell volume. If you don’t set a price for this, your AMM will only ever hold a long position.
        * Leverage at upper bound. If not set, the market's risk factors will be used to calculate your leverage.
    * Lower bound - Price at which your AMM will stop quoting buy volume. If not supplied the AMM will only ever hold a short position.
        * Leverage at lower bound. If not set, the market’s risk factors will be used to calculate leverage.

## How to stop an AMM
An AMM can be cancelled in two ways, either immediately by abandoning your position, or over time by reducing your commitment.

If you **abandon your AMM position**, your open position is immediately taken over by the network, and the margin held aside is transferred to the network's insurance pool. Other funds held by the AMM are transferred back to the AMM owner's key.

If you convert your AMM to **reduce only**, then the AMM's position is reduced over time and will never grow larger. Your AMM's price bound will be set to the current market price. Then, your AMM will only ever quote on the side that will reduce its position. Once the position reaches 0, the AMM is completely cancelled and any remaining funds are transferred back to the AMM owner. How long your AMM position remains open will depend on if traders are interested in taking your AMM's price level.

You can change a "reduce only" AMM position to be completely abandoned, or amend it to convert it back to an active AMM. 

## How AMM works
AMMs provide an off-book source of liquidity for markets, where AMMs set up by participants automatically provide prices according to a simple set of rules based on current market data. AMM can work in partnership with liquidity provided by active management of [on-book liquidity](./provision.md). All AMMs are considered as meeting the [liquidity SLA requirement](./rewards-penalties.md#liquidity-sla).

The protocol uses a concentrated liquidity methodology for automated market makers, giving AMMs control over the maximum and minimum price bounds for their AMM positions, rather than having to potentially support all prices in all market situations.

AMM providers receive a cut of [liquidity fees](rewards-penalties.md#earning-liquidity-fees) paid by traders, as well as rewards for liquidity providers - if any liquidity reward programs are enabled.

### AMM accounts
When you set up an AMM, a separate key is created for each pool you contribute to. That key is tied directly to your main key, but functions entirely separately once the AMM is active. Your AMM's key will have its own accounts that it will use to supply margin, and collect fees and rewards into. When you submit your commitment, those funds are moved to the AMM's accounts.

Once an AMM is set up, it's added to the pool of available AMMs to be utilised for filling orders.

When an AMM is fully cancelled, remaining funds are transferred from the AMM accounts back to the AMM owner's general account.