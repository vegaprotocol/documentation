---
sidebar_position: 1
title: Trading framework overview
hide_title: false
---

# Trading framework
The Vega protocol software is built to provide a framework for creating markets for trading financial instruments that are based on the values of their underlying assets. All markets created using the Vega protocol have been initiated and voted on by tokeholders.

Participants that interact with a futures market created using Vega can submit market, limit, pegged and liquidity commitment orders. 

## Pre-trade and trade [WIP]

### Positions and netting [WIP]

## Market data [WIP]

## Decimal places
Decimal places come up in lots of situations on Vega. They're used for proposing assets, using those assets for a market, and deciding how large or small an order size can be.

They can be configured in the asset's original governance proposal, and then refined even further in a market governance proposal.

### Market decimal places
It is possible to configure a market for which orders can only be priced in increments of a specific size. This is done by specifying, within a market proposal, a different (smaller) number of decimal places than the market's settlement asset supports. Consider a market that settles in GBP. This market can be configured to have 0 decimal places so that the price levels on the order book will be separated by at least £1, rather than the default £0.01 that the asset would support.

### Asset decimal places [WIP]
In effect, the number of decimal places tell you how divisible a token or asset is. To start, the number of decimal places of an asset used on Vega is defined in the asset governance proposal that introduces the asset to the network. An asset should the same number of decimal places that its native token contract has.

<!-- When an asset is chosen to be a market's settlement asset, it can have its decimal places limited further for that market specifically. (Why? Can it? Settlement decimals field actually takes from the data source so what's going on here?) -->

## Market / product / trade lifecycle [WIP]

## Settlement
To start, only cash-settled futures markets can be created. This means that settlement occurs in the settlement asset of the market, which is defined in the market framework. 

The settlement asset does not need to be the same asset as the ‘quote unit’ (i.e. BTC/ETH on a BTC/ETH December 2028 market). The settlement asset is defined by within the governance proposal that led to the market's creation. 

The network executes settlement with a two step process:

1. Collection -  The protocol collects from the margin accounts of those who, according to the settlement formula, are liable to pay. The instruction will aim to collect all the owed collateral, starting with the trader's margin account for the market. Whatever is not available from the margin account (if any) is collected from the general account, and if there is any remaining, it is collected from the market's insurance pool. If the full required amount cannot be collected from all three accounts, then as much as possible is collected and loss socialisation is enacted.
 
Collection will result in ledger entries being formulated. They adhere to double entry accounting and record the actual transfers that occurred on the ledger. The destination account is the *market settlement account* for the market, which will have a zero balance before the settlement process begins and after it completes.
 
2. Distribution -  If all requested amounts are succesfully transferred to the market settlement account, then the amount collected will match the amount to be distributed and the settlement function will formulate instructions to distribute to the margin accounts of those whose moves have been positive according to the amount they are owed. 
 
These transfers will debit from the market's market settlement account and be credited to the margin accounts of traders who have are due to receive an asset flow as a result of the settlement.

Read more: 
* [Insurance pools](#insurance-pools)
* [Loss socialisation](#loss-socialisation)
 
### Settlement at market expiry
When a market reaches its maturity date and time, a final settlement is carried out. That settlement is based on a pre-defined oracle publishing data that triggers the market’s expiry.

The oracle trigger will cause the market to enter into a 'trading terminated' state. Markets in this state no longer accept trading, but retain the positions and margin balances that were in place after processing the market’s maturity trigger. In the case of futures markets, termination occurs just prior to, or at, settlement.

Once a market settles:
* All open positions in that market are closed based on the final oracle price
* Open orders are cancelled
* Collateral held in the market is released back to the participants
* Corresponding cash flows happen as defined by the product type

For example: A cash-settled futures market reaches its expiry date and time. If the last mark price before settlement is 100, but the oracle price feed emits data that the price is 115, then a trader with a position of 1 long is paid 15. Another trader that has a position of 1 short, pays 15.

After all positions are closed at market expiry, they are ‘forgotten’ by the network.

Read more: [Data sources](#data-sources)

### Mark to market settlement
Settlement instructions are generated based on the change in market value of the open positions of a party.

When the mark price changes, the network calculates settlement cash flows for each party.

Each time the mark price for a given market changes, all the open positions and orders are marked to market, resulting in interim partial payments that are calculated by the network. Those payments go directly the relevant trader's collateral. 

Read more: [Mark to market](#mark-to-market)

### Settlement parameters defined through governance
Data sources for settlement must be specified when a market is proposed. For cash-settled futures, this is the final price/value at the expiry of the instrument, and the expiry date/time.

At the point when a market nears its specified expiry, trading terminates, and the data sources provide the final ‘settlement value’.

The network settles all open positions on the market using the price provided by the data source. Positions are regularly mark to market settled, so the final settlement is, in effect, a final mark to market settlement using the data source price.

Read more: [Mark to market settlement](#mark-to-market-settlement)