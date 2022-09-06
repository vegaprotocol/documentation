---
sidebar_position: 7
title: Market lifecycle
hide_title: false
description: See every stage possible for a proposed or live market.
---
The market lifecycle begins when a proposal for a new market is accepted, and is driven by the market's state. The table shows a high-level view of each part of a market's lifecycle, including when that stage is over and a new one begins. Below, learn more about each lifecycle stage.

| Status              | Accepting LP[1]  | Trading Mode        | Condition for entry                                                           | Condition for exit                   
| ------------------ | -------------- | ------------------- | --------------------------------------------------------------- | -----------------------------------------         
| [Proposed](#market-status-proposed)           |   ✅          | No trading          | Governance proposal valid and accepted                                       | Governance proposal voting period ends
| [Rejected](#market-status-rejected)           |   ❌           | No trading          | Outcome of governance votes is to reject the market             | N/A                                                    
| [Pending](#market-status-pending)            |   ✅          | Opening auction     | Governance vote passes                                     | Governance vote (to close) OR enactment date reached
| [Active](#market-status-active)             |   ✅          | Normal trading      | Enactment date reached and usual auction exit checks pass       | Governance vote (to close) OR maturity of market      
| [Suspended](#market-status-suspended)          |   ✅          | Exceptional auction | Price monitoring or liquidity monitoring trigger, or product lifecycle trigger                | Exit conditions met per monitoring spec. that triggered it, no other monitoring triggered or governance vote if allowed (see below)
| [Trading Terminated](#market-status-trading-terminated) |   ❌           | No trading          | Defined by the product (i.e. from a product parameter, specified in market definition, giving close date/time) | Settlement event commences                       
| [Settled](#market-status-settled)            |   ❌           | No trading          | Settlement triggered and completed as defined by product                                      | N/A                                            

[1] Accepting LPs: it is possible to submit or amend liquidity commitments

<!--![Life cycle flow diagram](./0043-market-lifecycle-flow-diagram.svg)-->

## Market status: Proposed
All markets must first be proposed by tokenholders by following the [governance process](../vega-protocol.md). Once a valid market proposal is accepted, the market can accept [liquidity commitments](./../../tutorials/providing-liquidity). 

Voting begins and its state is `proposed`. Not every market that is proposed (and accepts liquidity) is guaranteed to exist, as it must get enough votes in favour from tokenholders.

### Enters proposed state
- Valid governance proposal is submitted and accepted by the network's consensus validator nodes

### What is and isn't possible
- Participants can vote for or against the market proposal
- Liquidity providers can submit, amend, or cancel liquidity commitments 
- No trading is possible. No orders can be placed (except the buy/sell order shapes that form part of a liquidity commitment)
- No market data (price, etc.) is emitted, no positions exist on the market, and no risk management occurs

### Exits proposed state
- Market Proposal voting period ends
  - Passed ('yes' votes win and thresholds met) → [Pending](#market-status-pending)
  - Failed ('no' votes win or thresholds not met) → [Rejected](#market-status-rejected)

## Market status: Rejected
If a market proposal is not successful, i.e., does not get the required amount of 'yes' votes, its state is `rejected`. 

Any collateral in the bond account for liquidity commitments is returned to the general accounts of the party/parties that submitted liquidity commitment orders.

### Enters rejected state
- Voting period ends
  - Failed ('no' votes win or thresholds not met)

### What is and isn't possible
- Nothing can happen to a market with this status, it does not exist. 

### Exits rejected state
- No exit, as nothing more can be done with this market

## Market status: Pending
When a market proposal is successful at the end of the voting period, the market state is `pending`, until the enactment date. A pending market is in auction, and accepting liquidity commitments. 

### Enters pending state
- Valid market proposal was successful ('yes' votes win and thresholds met)

### What is and isn't possible
- Liquidity providers can submit, amend, or cancel commitments 
- Auction orders are accepted
- Continuous trading is not (yet) available for the market

### Exits pending state
- A market is no longer pending when any of the following occur:
- Enactment date is reached, the conditions for exiting the auction are met, and at least one trade will be generated when uncrossing the auction. The auction is uncrossed during this transition → [Active](#market-status-active) 

## Market status: Active
Once the enactment date is reached, the other conditions specified to exit the pending state are met, and the opening auction uncrosses, then the market becomes `active`.

An active market status indicates it is in continuous trading.

### Enters active state
- From `Pending`: enactment date reached and conditions to transition from pending to active are met
- From `Suspended`: conditions specified in [price monitoring](/docs/testnet/concepts/trading-framework/market-protections#price-monitoring), and [liquidity monitoring](/docs/testnet/concepts/trading-framework/market-protections#liquidity-monitoring) are met for the market to exit the suspended status back to active

### What is and isn't possible
- Liquidity providers can submit, amend, or cancel commitments 
- Orders can be placed into the market, trading occurs according to normal trading mode rules
- Market data is emitted
- Positions and margins are managed
- Changes to a market configuration can be enacted through governance

### Exits active state
- Price or liquidity monitoring triggers suspension → [Suspended](#market-status-suspended)
- Trading termination or settlement, triggered if the trading termination date or settlement price is reached → [Trading Terminated](#market-status-trading-terminated) | [Settled](#market-status-settled)

## Market status: Suspended
A market is `suspended` when an active market is temporarily stopped from trading to protect the market or the network from a risk, when the system has determined it is either not safe or not reasonable to operate the market at that point, for example due to extremely low liquidity. No trades may be created while a market is suspended.

Suspended markets are in auction. Depending on the type of suspension, the auction call period may have a defined end (but can be extended) or may be indefinite until the required conditions are met. The auction is uncrossed as part of the transition back to the active state and normal trading.

### Enters suspended state
- Price or liquidity monitoring triggers suspension

### What is and isn't possible
- Liquidity providers can submit, amend, or cancel commitments 
- Orders applicable to auctions are accepted
- Changes to a market configuration can be enacted through governance

### Exits suspended state
- Conditions specified in price monitoring and liquidity monitoring and end of auction checks are met → [Active](#market-status-active) 

## Market status: Trading Terminated
A market may enter `trading terminated` if the instrument expires or the market is otherwise configured to have a finite lifetime. 

In the case of futures, termination occurs at some point prior to, or at, the settlement of the product. Markets in this state accept no trading, but retain the positions and margin balances that were in place after processing the expiry trigger. 

A market moves from this termination state to settled when enough information exists and the triggers are reached to settle the market. 

This could happen instantly upon trading termination, though usually there will be a delay, for instance to wait to receive and accept data from a data source.

### Enters trading terminated state
- Triggered by the expiry for the market, which depends on the market's data source

### What is and isn't possible
- Mark to market settlement happens once if required after termination is triggered, then never again
- A single set of market data may be emitted for the final settlement data (e.g. settlement mark price), after which no market data are emitted
- No trading occurs, no orders are accepted
- No risk management or price/liquidity monitoring occurs

### Exits trading terminated state
- During the transition out of this state:
  - All final settlement cashflows are calculated and applied (settled) 
  - Margins are transferred back to participants' collateral
  - Insurance pool funds are redistributed
- Settlement dependencies met (i.e. oracle data received) → Settled

## Market status: Settled
A market is `settled` once the required data to calculate the settlement cashflows is provided by the market's data source. These cashflows are calculated and applied to all traders with an open position. Positions are then closed and all orders cancelled.

### Enters settled state
- Triggered by product logic and inputs (i.e. required data is received)
- During the transition into this state:
  - All final settlement cashflows are calculated and applied 
  - Money held in margin accounts is transferred back to traders' collateral
  - All insurance pool funds are redistributed or moved to a network wide insurance fund account
  - All fees are distributed
- Trading is terminated

### What is and isn't possible
- No trading occurs
- No orders are accepted

### Exits settled state
- There is no way to exit this state, as nothing more can be done with this market
