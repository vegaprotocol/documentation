---
sidebar_position: 6
title: Trade lifecycle
hide_title: false
---
### Settlement process
To start, only cash-settled futures markets can be created. This means that settlement occurs in the settlement asset of the market, which is defined in the market framework when the market was proposed.

The settlement asset is defined by within the governance proposal that led to the market's creation, and **does not** need to be the same asset as the ‘quote unit’ (i.e. ETH on a BTC/ETH December 2028 market).

The network executes settlement with a two step process:

1. Collection -  The protocol collects from the margin accounts of those who, according to the settlement formula, are liable to pay. The instruction will aim to collect all the owed collateral, starting with the trader's margin account for the market. Whatever is not available from the margin account (if any) is collected from the general account, and if there is any remaining, it is collected from the market's insurance pool. If the full required amount cannot be collected from all three accounts, then as much as possible is collected and loss socialisation is enacted.
 
Collection will result in ledger entries being formulated. They adhere to double entry accounting and record the actual transfers that occurred on the ledger. The destination account is the *market settlement account* for the market, which will have a zero balance before the settlement process begins and after it completes.
 
2. Distribution -  If all requested amounts are succesfully transferred to the market settlement account, then the amount collected will match the amount to be distributed and the settlement function will formulate instructions to distribute to the margin accounts of those whose moves have been positive according to the amount they are owed. 
 
These transfers will debit from the market's market settlement account and be credited to the margin accounts of traders who have are due to receive an asset flow as a result of the settlement.

<!--Read more: 
* [Insurance pools](/docs/testnet/concepts/trading-framework/market-protections#insurance-pools)
* [Loss socialisation](/docs/testnet/concepts/trading-framework/market-protections#loss-socialisation) -->
 
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

Read more: [Data sources](./data-sources.md)

### Mark to market settlement
Settlement instructions are generated based on the change in market value of the open positions of a party.

When the mark price changes, the network calculates settlement cash flows for each party.

Each time the mark price for a given market changes, all the open positions and orders are marked to market, resulting in interim partial payments that are calculated by the network. Those payments go directly the relevant trader's collateral. 

Read more: [Mark to market](/docs/testnet/concepts/trading-framework/market-protections#mark-to-market)

### Settlement parameters defined through governance
Data sources for settlement must be specified when a market is proposed. For cash-settled futures, this is the final price/value at the expiry of the instrument, and the expiry date/time.

At the point when a market nears its specified expiry, trading terminates, and the data sources provide the final ‘settlement value’.

The network settles all open positions on the market using the price provided by the data source. Positions are regularly mark to market settled, so the final settlement is, in effect, a final mark to market settlement using the data source price.

