---
sidebar_position: 1
title: Trading framework
hide_title: false
---

# Trading framework
The Vega protocol software is built to provide a framework for creating markets for trading financial instruments that are based on the values of their underlying assets. All markets created using the Vega protocol have been initiated and voted on by tokeholders.

Participants that interact with a futures market created using Vega software can submit market, limit, pegged and liquidity commitment orders.

This page covers the trading lifecycle and the market lifecycle.

Other pages in the trading framework section cover the concepts of:
* [Trading modes](./trading-modes.md)
* [Order types and times in force](./orders.md)
* [Market protections](./market-protections.md)
* [Liquidity on Vega markets](./liquidity.md)
* [Trading fees and rewards](./fees-rewards.md)

## Trading lifecycle

### Settlement process
To start, only cash-settled futures markets can be created. This means that settlement occurs in the settlement asset of the market, which is defined in the market framework when the market was proposed.

The settlement asset is defined by within the governance proposal that led to the market's creation, and **does not** need to be the same asset as the ‘quote unit’ (i.e. ETH on a BTC/ETH December 2028 market). 

The network executes settlement with a two step process:

1. Collection -  The protocol collects from the margin accounts of those who, according to the settlement formula, are liable to pay. The instruction will aim to collect all the owed collateral, starting with the trader's margin account for the market. Whatever is not available from the margin account (if any) is collected from the general account, and if there is any remaining, it is collected from the market's insurance pool. If the full required amount cannot be collected from all three accounts, then as much as possible is collected and loss socialisation is enacted.
 
Collection will result in ledger entries being formulated. They adhere to double entry accounting and record the actual transfers that occurred on the ledger. The destination account is the *market settlement account* for the market, which will have a zero balance before the settlement process begins and after it completes.
 
2. Distribution -  If all requested amounts are succesfully transferred to the market settlement account, then the amount collected will match the amount to be distributed and the settlement function will formulate instructions to distribute to the margin accounts of those whose moves have been positive according to the amount they are owed. 
 
These transfers will debit from the market's market settlement account and be credited to the margin accounts of traders who have are due to receive an asset flow as a result of the settlement.

Read more: 
* [Insurance pools](./market-protections#insurance-pools)
* [Loss socialisation](./market-protections#loss-socialisation)
 
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

<!--## Pre-trade and trade [WIP]

### Positions and netting [WIP]

## Market data [WIP]-->

<!-- ## Decimal places
Decimal places come up in lots of situations on Vega. They're used for proposing assets, using those assets for a market, and deciding how large or small an order size can be.

They can be configured in the asset's original governance proposal, and then refined even further in a market governance proposal.

### Market decimal places
It is possible to configure a market for which orders can only be priced in increments of a specific size. This is done by specifying, within a market proposal, a different (smaller) number of decimal places than the market's settlement asset supports. Consider a market that settles in GBP. This market can be configured to have 0 decimal places so that the price levels on the order book will be separated by at least £1, rather than the default £0.01 that the asset would support.

### Asset decimal places [WIP]
In effect, the number of decimal places tell you how divisible a token or asset is. To start, the number of decimal places of an asset used on Vega is defined in the asset governance proposal that introduces the asset to the network. An asset should the same number of decimal places that its native token contract has.

When an asset is chosen to be a market's settlement asset, it can have its decimal places limited further for that market specifically. (Why? Can it? Settlement decimals field actually takes from the data source so what's going on here?) -->

## Market lifecycle
The market lifecycle begins at acceptance of a proposal and is driven by the market's state.

Assuming a market passes the governance vote and is enacted, it undergoes various state changes throughout its lifecycle. 

The overall market status flow is shown in the diagram below. A market is created in a `proposed` state when a valid market creation governance proposal is `accepted`. 


| Status              | Accepting LP[1]  | Trading Mode        | Condition for entry                                                           | Condition for exit                   
| ------------------ | -------------- | ------------------- | --------------------------------------------------------------- | -----------------------------------------         
| Proposed           |   Yes          | No trading          | Governance proposal valid and accepted                                       | Governance proposal voting period ends
| Rejected           |   No           | No trading          | Outcome of governance votes is to reject the market             | N/A                                                    
| Pending            |   Yes          | Opening auction     | Governance vote passes                                     | Governance vote (to close) OR enactment date reached
| Cancelled           |  No           | No trading          | Market triggers cancellation condition or governance votes to close before market becomes Active              | N/A                                                    
| Active             |   Yes          | Normal trading      | Enactment date reached and usual auction exit checks pass       | Governance vote (to close) OR maturity of market      
| Suspended          |   Yes          | Exceptional auction | Price monitoring or liquidity monitoring trigger, or product lifecycle trigger                | Exit conditions met per monitoring spec. that triggered it, no other monitoring triggered or governance vote if allowed (see below)
| Trading Terminated |   No           | No trading          | Defined by the product (i.e. from a product parameter, specified in market definition, giving close date/time) | Settlement event commences                       
| Settled            |   No           | No trading          | Settlement triggered and completed as defined by product                                      | N/A                                            


[1] Accepting LPs: it is possible to submit or amend [liquidity commitments](./liquidity#submit-liquidity-commitment)

<!--![Life cycle flow diagram](./0043-market-lifecycle-flow-diagram.svg)-->

### Market status: Proposed
All markets are first proposed permissionlessly via [governance](../vega-protocol.md). Once a valid market proposal is accepted the market is created and can accept [liquidity commitments](./liquidity#submit-liquidity-commitment).

Voting begins and its state is `proposed`.

**Entry:**

- Valid governance proposal submitted and accepted. 

**Exit:**

- Market Proposal voting period ends

  - Passed ('yes' votes win & thresholds met) → Pending
  - Failed ('no' votes win or thresholds not met) → Rejected

**Behaviour:**

- Participants can vote for or against the market proposal
- Liquidity providers can submit, amend, or cancel liquidity commitments 
- No trading is possible. No orders can be placed (except the buy/sell order shapes that form part of a liquidity commitment)
- No market data (price, etc.) is emitted, no positions exist on the market, and no risk management occurs

### Market status: Rejected
If a market proposal is not successful, its state is `rejected`.

**Entry:**

- Voting period ends
  - Failed (no votes win or thresholds not met) → Rejected

**Exit:**

- No exit, as nothing more can be done with this market.

**Behaviour:**

- Nothing can happen to a market with this status, it does not exist. Any collateral in the bond account for liquidity commitments is returned to the general accounts of the party or parties that submitted the liquidity commitment.

### Market status: Pending
When a market proposal is successful at the end of the voting period, the market state is `pending`, until the enactment date. A pending market is in auction, and accepting liquidity commitments. 

**Entry:**

- Valid market proposal was successful (yes votes win & thresholds met)

**Exit:**

- Auction period ends when any of the following occur:

  - Enactment date is reached, the conditions for exiting an auction are met, and at least one trade will be generated when uncrossing the auction → Active (the auction is uncrossed during this transition)
  - Enactment date is passed and the product would trigger the `trading terminated` status  →  Cancelled (the market ceases to exist, auction orders are cancelled, and no uncrossing occurs)
  - Enactment date is passed by more than the `market.auction.maximumDuration` network parameter →  Cancelled (the market ceases to exist, auction orders are cancelled, and no uncrossing occurs)

**Behaviour:**

- Liquidity providers can submit, amend, or cancel commitments 
- Auction orders are accepted

### Market status: Cancelled

A market is `cancelled` when a market proposal is successful, but conditions are not met to transition the market to the `active` state, and one of the following applies:

* The market reaches a timeout for the length of time in the pending state; or
* the instrument hits expiry

**Entry:**

  - Enactment date is passed and the product would trigger the trading terminated status  →  Cancelled (the market ceases to exist, auction orders are cancelled, and no uncrossing occurs)
  - Enactment date is passed by more than the `market.auction.maximumDuration` network parameter →  Cancelled (the market ceases to exist, auction orders are cancelled, and no uncrossing occurs)

**Exit:**

- No exit, as nothing more can be done with this market.

**Behaviour:**

- Nothing can happen to a market with this status, it does not exist. Any collateral in the bond account for liquidity commitments is returned to the general accounts of the party or parties that submitted the liquidity commitment.

### Market status: Active
Once the enactment date is reached, the other conditions specified to exit the pending state are met, and the opening auction uncrosses, then the market becomes `active` 

This status indicates it is trading via its normally configured trading mode. 

The market will terminate trading according to a product trigger -- for futures, if the trading termination date is reached -- and can be temporarily suspended automatically by market protections such as [price monitoring](./market-protections#price_monitoring), or [liquidity monitoring](./market-protections#liquidity_monitoring).

**Entry:**

- From Pending: enactment date reached and conditions to transition from pending to active are met
- From Suspended: conditions specified in [price monitoring](./market-protections#price_monitoring), and [liquidity monitoring](./market-protections#liquidity_monitoring) are met for the market to exit the suspended status back to active

**Exit:**

- Price, liquidity or other monitoring system triggers suspension → Suspended
- Trading termination, settlement, or suspension is triggered by a product trigger (for futures, if the trading termination date, set by a market parameter, is reached) → Trading Terminated | Settled | Suspended

**Behaviour:**

- Liquidity providers can submit, amend, or cancel commitments 
- Orders can be placed into the market, trading occurs according to normal trading mode rules
- Market data is emitted
- Positions and margins are managed

### Market status: Suspended
A market is `suspended` when an active market is temporarily stopped from trading to protect the market or the network from a risk, when the system has determined it is either not safe or not reasonable to operate the market at that point, for example due to extremely low liquidity. No trades may be created while a market is suspended.

Suspended markets are in auction. Depending on the type of suspension, the auction call period may have a defined end (but can be extended) or may be indefinite until the required conditions are met. The auction is uncrossed as part of the transition back to the active state and normal trading.

**Entry:**

- Price, liquidity or other monitoring system triggers suspension → Suspended

**Exit:**

- Conditions specified in price monitoring and liquidity monitoring and end of auction checks are met → Active 

**Behaviour:**

- Liquidity providers can submit, amend, or cancel commitments 
- Auction orders are accepted

### Market status: Trading Terminated
A market may enter `trading terminated` if the instrument expires or the market is otherwise configured to have a finite lifetime. 

In the case of futures, termination occurs at some point prior to, or at, the settlement of the product. Markets in this state accept no trading, but retain the positions and margin balances that were in place after processing the expiry trigger. 

A market moves from this termination state to settled when enough information exists and the triggers are reached to settle the market. 

This could happen instantly upon trading termination, though usually there will be a delay, for instance to wait to receive and accept data from a data source.

**Entry:**

- Triggered by the product

**Exit:**

- Settlement dependencies met (i.e. oracle data received) → Settled

**Behaviour:**

- No trading occurs, no orders are accepted
- Mark to market settlement is performed, if required, after termination is triggered, then never again
- A single set of market data may be emitted for the final settlement data (e.g. settlement mark price), after which no market data are emitted
- During the transition out of this state:
  - All final settlement cashflows are calculated and applied (settled) 
  - Margins are transferred back to participants' collateral
  - Insurance pool funds are redistributed
- No risk management or price/liquidity monitoring occurs

### Market status: Settled
A market is `settled` once the required data to calculate the settlement cashflows is provided by data source input for a market. These cashflows are calculated and applied to all traders with an open position. The positions are then closed and all orders cleared. 

All money held in margin accounts after final settlement is returned to traders' collateral. 

Insurance pool funds are transferred to the on-chain treasury for the asset. 

Liquidity provision fees that have been cumulated but not yet paid out are distributed to the market LPs.

**Entry:**

- Trading is terminated
- Triggered by product logic and inputs (i.e. required data is received)

**Exit:**

- No exit, as nothing more can be done with this market.

**Behaviour:**

- No trading occurs, no orders are accepted
- During the transition into this state:
  - All final settlement cashflows are calculated and applied 
  - Margins are transferred back to traders' collateral
  - All insurance pool funds are redistributed or moved to a network wide insurance fund account
  - All fees are distributed