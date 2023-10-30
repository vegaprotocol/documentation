---
sidebar_position: 3
title: Fees
hide_title: false
description: Trades and transfers can incur fees.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

The Vega trading fee structure incentivises passive trading (placing orders on the order book), providing liquidity, and running the network infrastructure. The protocol does not charge gas fees for interacting with the network.

In addition, any participant can fund accounts that reward traders for their activity in a market, including those who 'take' prices off the order book. Those rewards only exist when a party is funding them, and can be set per market and per activity type (or metric).

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
The liquidity portion of the fee is paid by a participant who hits an order on the order book, and is paid to those participants who [commit liquidity](../liquidity/provision.md#liquidity-commitments) to the market.

It's transferred to a liquidity fee account, and distributed to each liquidity provider's margin account at a defined time (based on network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.distributionTimeStep" />), and depending on how much their liquidity commitments have contributed to the market.

### Fee calculations
At a high level, the trading fee is calculated using the following formulas:

* Total fee = (infrastructure fee factor + maker fee factor + liquidity fee factor) x trade value for fee purposes
* Trade value for fee purposes = notional value of the trade = size of trade x price of trade
  
#### Fee calculation example
* Trade value for fee purposes: If you were to place an order for 100 futures at USDC50, the trade value for fee purposes is: *100 x USDC50 = USDC5000*. 
* Fee factor: For this example, each of the 3 fees is *0.001*, meaning total fee factor is *0.003*.
* Trade value and fee factor: *USDC5000 x 0.003 = USDC15*
* The fee is the same regardless of the number of transactions the order needs to be completely filled, as long as they trade at the same price.

Two of the three fee factors are set through network parameters: <NetworkParameter frontMatter={frontMatter} param="market.fee.factors.infrastructureFee" />, <NetworkParameter frontMatter={frontMatter} param="market.fee.factors.makerFee" />. The liquidity fee is set by the liquidity providers on the market.

## Transfer fees
When transferring assets, whether from one Vega key to another, or from a Vega key to a reward pool to fund trading rewards, the party that initiates the transfer needs to pay a fee. The fee amount is taken when the transfer is executed, on top of the total amount to be transferred. It's charged in the same asset that is being transferred.

The fee goes to validators for providing the network infrastructure that supports transfers, and goes into the infrastructure fee pool.

The fee is calculated by multiplying the transfer amount and the <NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" /> network parameter.
