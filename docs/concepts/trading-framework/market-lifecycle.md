---
sidebar_position: 7
title: Market lifecycle
hide_title: false
---
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


[1] Accepting LPs: it is possible to submit or amend [liquidity commitments](/docs/testnet/concepts/liquidity#submit-liquidity-commitment)

<!--![Life cycle flow diagram](./0043-market-lifecycle-flow-diagram.svg)-->

### Market status: Proposed
All markets are first proposed permissionlessly via [governance](../vega-protocol.md). Once a valid market proposal is accepted the market is created and can accept [liquidity commitments](/docs/testnet/concepts/liquidity#submit-liquidity-commitment).

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

The market will terminate trading according to a product trigger -- for futures, if the trading termination date is reached -- and can be temporarily suspended automatically by market protections such as [price monitoring](/docs/testnet/concepts/trading-framework/market-protections#price-monitoring), or [liquidity monitoring](/docs/testnet/concepts/trading-framework/market-protections#liquidity-monitoring).

**Entry:**

- From Pending: enactment date reached and conditions to transition from pending to active are met
- From Suspended: conditions specified in [price monitoring](/docs/testnet/concepts/trading-framework/market-protections#price-monitoring), and [liquidity monitoring](/docs/testnet/concepts/trading-framework/market-protections#liquidity-monitoring) are met for the market to exit the suspended status back to active

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