---
sidebar_position: 6
title: Settlement
hide_title: false
---
Settlement is the process of moving collateral between accounts when a position is closed, when the market's mark price changes, and when the market expires. Vega operates as a decentralised 'central counterparty' that facilitates settlement.

More specifically, settlement on markets occurs when:
* A position is fully or partially closed, with settlement occuring for the closed volume. An open position is closed when the open position's holder enters into a countertrade
* The protocol runs mark to market settlement
* A market expires, at which point all open positions in the market are settled

## Parameters defined through governance
Market proposals define the fundamental details about a market, including its settlement asset and how it can terminate and be settled.

### Settlement asset
Vega can be used to create cash-settled futures markets, meaning they are margined and settled in a single asset. 

On those markets, settlement occurs in the settlement asset of the market, which is defined in the governance proposal that led to the market's creation. The settlement asset **does not** need to be the same asset as the ‘quote unit’ (i.e. ETH on a BTC/ETH December 2028 market).

### Data for settlement trigger
In addition to the settlement asset, a market's proposal also specifies the data sources that determine settlement triggers for the end of a market's lifecycle. The data sources defined, and the filters applied to them, must be able to provide the market's expiry date/time and its final price/value at expiry. 

At the point when a market arrives at its specified expiry, trading terminates, and then the data sources provide the final settlement value. The protocol settles all open positions on the market using the price provided by the data source.

<!--
:::note Read more
[Data sources]
:::
-->
 
## Settlement at market expiry
After a market reaches its maturity date and time, a final settlement is carried out. That settlement is dependent on the pre-defined data source publishing data that triggers the market’s expiry.

The trigger will cause the market to enter into a 'trading terminated' state. Markets in this state no longer accept trading, but retain the positions and margin balances that were in place after processing the market’s maturity trigger. Termination occurs just prior to settlement, so that no trading can occur after the settlement result can be known by participants.

As positions are regularly mark to market settled, the final settlement is, in effect, a final mark to market settlement using the data source quote.

Once a market settles:
* All open positions in that market are closed based on the final price
* Open orders are cancelled
* Collateral held in the market is released back to participants

After all positions are closed when the market expires, they are ‘forgotten’ by the protocol. However, data nodes will keep the information, thus making it possible to see the historical information even after the market can't be traded on.

### Expiry example
A cash-settled futures market reaches its expiry date and time. If the last mark price before settlement is 100, but the oracle price feed emits data that the price is 115, then a trader with a position of 1 long is paid 15. Another trader that has a position of 1 short, pays 15.

<!--
:::note Read more
[Data sources](./data-sources)
:::
-->

## Mark to market settlement
Settlement instructions are generated based on the change in market value of the open positions of a party. 

When the mark price changes, the protocol calculates settlement cash flows for each party.

Each time the mark price for a given market changes, all the open positions are marked to market, resulting in interim partial payments that are calculated by the protocol. Those payments go directly to the relevant trader's margin account. 

<!--
:::note Read more
[Mark to market]
:::
-->

## Settlement execution
The protocol executes settlement using a two step process: Collection and distribution.

### Collection
Assets are collected from the margin accounts of those who, according to the settlement formula and the traders' positions, are liable to pay. If any of the required collateral is not available from the margin account, it is collected from the general account, and if there is any still uncollected, it is collected from the market's insurance pool. 
 
If the full required amount cannot be collected from all three accounts, then as much as possible is collected and loss socialisation occurs.
 
When collateral is collected, ledger entries that adhere to double-entry accounting are created to record the actual transfers. The destination is the settlement account for the market, which will have a 0 balance before the settlement process begins, and again after it completes.
 
### Distribution
If all the requested amounts are succesfully transferred to the settlement account, then the amount collected will match the amount to be distributed and the participants whose moves were positive receive what they're owed in their margin accounts. 

:::note Read more 
* [Insurance pools](/docs/testnet/concepts/trading-on-vega/market-protections#insurance-pools)
* [Loss socialisation](/docs/testnet/concepts/trading-on-vega/market-protections#loss-socialisation)
* [Settlement account](./../accounts#settlement-accounts)
:::
