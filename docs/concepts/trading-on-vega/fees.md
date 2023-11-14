---
sidebar_position: 4
title: Fees
hide_title: false
description: Trades and transfers can incur fees.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Participants in the Vega network who place orders on the order book, provide liquidity and run the network infrastructure receive the fees that traders pay on filled trades and transfers. The protocol does not charge gas fees for interacting with the network.

You can offset some of those fees, or earn even more, by receiving discounts or getting rewards based on trading activity. Rewards can be funded by anyone, and can be in any asset. See the rewards that are currently available on [vega.xyz ↗](https://vega.xyz/rewards).

:::note Read more
[Concept: Discounts and rewards](./discounts-rewards.md)
:::

## Trading fees
The Vega protocol does not charge gas fees, but rather has a fee structure that rewards participants who fill essential roles in a decentralised system.

Fees are incurred on every trade on a market in continuous trading, but it's the price taker who pays the fee. The price taker is the party that traded using a market order, or placed a limit order that traded immediately. The price maker (the party whose passive order was on the book prior to the trade) receives some of the trading fees as a reward for placing orders on the book.

The amount a trader pays in fees for each order is the same regardless of how many trades it takes to fill the order. Even though, if an order crosses with more than one other order, multiple trades are created and multiple fees are incurred, in the end they would balance out. See an example fee calculation below.

During a market's opening auction, no fees are collected.

### Fee distribution and breakdown
Fees are calculated when a trade is filled, and paid in the market's settlement currency. The fees due are taken from the collateral in the trader's general account. 

The fee is divided between the maker for the trade, the infrastructure providers, and the liquidity provider(s) for each market.

### Maker fee
The maker portion of the fee is paid by the aggressive party in a trade (the taker), and transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker). This is done as soon as the trade settles.

### Infrastructure fee
The infrastructure portion of the fee is paid to validators as a reward for running the network infrastructure, and transferred to the infrastructure fee pool for the market's settlement asset. It is then distributed to the validators at the end of each epoch, in proportion to the number of tokens they represent. 

Some of the infrastructure fee paid to validators is then distributed to the validators' nominators.

### Liquidity fee
The liquidity portion of the fee is paid by a trader who hits an order on the order book, and is paid to those who [commit liquidity](../liquidity/provision.md#liquidity-commitments) to the market.

It's transferred to a liquidity fee account, and distributed to each liquidity provider's margin account at a defined time (based on network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.distributionTimeStep" />), and depending on how much liquidity they have contributed to the market.

### Fee calculations
At a high level, the trading fee that someone pays is calculated using the following formulas:

* Total fee = (infrastructure fee factor + maker fee factor + liquidity fee factor) x trade value for fee purposes
* Trade value for fee purposes = notional value of the trade = size of trade x price of trade
  
#### Fee calculation example
* Trade value for fee purposes: If you were to place an order for 100 at USDC50, the trade value for fee purposes is: *100 x USDC50 = USDC5000*. 
* Fee factor: For this example, each of the 3 fees is *0.001*, meaning total fee factor is *0.003*.
* Trade value and fee factor: *USDC5000 x 0.003 = USDC15*
* The fee is the same regardless of the number of transactions the order needs to be completely filled, as long as they trade at the same price.

Two of the three fee factors are set through network parameters: <NetworkParameter frontMatter={frontMatter} param="market.fee.factors.infrastructureFee" />, <NetworkParameter frontMatter={frontMatter} param="market.fee.factors.makerFee" />. The liquidity fee is set by the liquidity providers on the market.

## Transfer fees
You may need to pay a fee to transfer assets, whether from one Vega key to another, or from a Vega key to a reward pool to fund trading rewards. The fee amount is taken when the transfer is executed, on top of the total amount to be transferred. It's charged in the same asset that is being transferred.

You only pay a fee if you haven't already paid or accrued enough trading fee revenue in past epochs to cover the calculated transfer fee. The trading fees you've paid or accrued act like a discount balance that's subtracted from with every transfer. You'd also pay a fee if you use up your fee discount balance.

Transfers initiated by governance don't incur a fee.

The fee goes to validators for providing the network infrastructure that supports transfers, and goes into the infrastructure fee pool.

The fee is calculated by multiplying the transfer amount and the <NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" /> network parameter.