---
sidebar_position: 8
title: Market lifecycle
vega_network: MAINNET
hide_title: false
description: See every stage possible for a proposed or live market.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

The market lifecycle begins when a proposal for a new market is accepted, and is driven by the market's state. The table shows a high-level view of each part of a market's lifecycle, including when that stage is over and a new one begins. Below, learn more about each lifecycle stage.

| Status              | Accepting LP[1]  | Trading Mode        | Condition for entry                                                           | Condition for exit                   
| ------------------ |:--------------:| ------------------- | --------------------------------------------------------------- | -----------------------------------------         
| [Proposed](#market-status-proposed)           |   ✅          | No trading          | Governance proposal valid and accepted                                       | Governance proposal voting period ends
| [Rejected](#market-status-rejected)           |   ❌           | No trading          | Outcome of governance votes is to reject the market             | N/A                                                    
| [Pending](#market-status-pending)            |   ✅          | Opening auction     | Governance vote passes                                     | Governance vote OR enactment date reached
| [Cancelled](#market-status-cancelled)            |   ❌          | No trading     | Market trigger for a cancellation       | N/A
| [Active](#market-status-active)             |   ✅          | Normal trading (such as continuous)     | Enactment date reached and usual auction exit checks pass       | Maturity of market      
trigger, or product lifecycle trigger                | Exit conditions met per [monitoring requirements](./market-protections.md) that triggered it, no other monitoring triggered or governance vote if allowed (see below)
| [Trading Terminated](#market-status-trading-terminated) |   ❌           | No trading          | Defined by the product (i.e. from a product parameter, specified in market definition, giving close date/time) | Settlement event commences                       
| [Settled](#market-status-settled)            |   ❌           | No trading          | Settlement triggered and completed as defined by product                                      | N/A                                            

[1] Accepting LPs: it is possible to submit or amend liquidity commitments

<!--![Life cycle flow diagram](./0043-market-lifecycle-flow-diagram.svg)-->

## Market status: Proposed
All markets must first be proposed by tokenholders by following the [governance process](../governance.md). Once a valid market proposal is accepted, the market can accept [liquidity commitments](../liquidity/provision.md). 

Voting begins and its state is `proposed`. Not every market that is proposed (and accepts liquidity) is guaranteed to exist, as it must get enough votes in favour from tokenholders.

### Enters proposed state
- Valid governance proposal is submitted and accepted by the network's consensus validator nodes

### What is and isn't possible
- Participants can vote for or against the market proposal
- Liquidity providers can submit, amend, or cancel liquidity commitments 
- No trading is possible
- No market data (price, etc.) is emitted, no positions exist on the market, and no risk management occurs

### Exits proposed state
- Market Proposal voting period ends
  - Passed ('yes' votes win and thresholds met) → [Pending](#market-status-pending)
  - Failed ('no' votes win or thresholds not met) → [Rejected](#market-status-rejected)

## Market status: Rejected
If a market proposal is not successful, i.e., does not get the required amount of 'yes' votes, its state is `rejected`. 

Any collateral in the bond account for liquidity commitments is returned to the general accounts of the party/parties that submitted a liquidity commitment transaction.

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


## Market status: Cancelled
A market can be `cancelled` if it cannot leave `pending` before the maximum opening auction duration is reached, or if an update market proposal changes the market's parameters such that it enters [trading terminated](#market-status-trading-terminated) before it leaves `pending`.

### Enters cancelled state
- Market does not have enough trading to leave opening auction before <NetworkParameter frontMatter={frontMatter} param="market.auction.maximumDuration" hideValue={true} />
- Market's enactment date has passed without trading, and parameters that would lead to trading terminated are triggered
- An update governance proposal with a market parameter change that would result in the market being closed passes its governance vote
- Auction orders are cancelled and no uncrossing occurs
- After `market.liquidity.successorLaunchWindowLength` has elapsed since a market's cancellation, that means a market does not have a successor, and any insurance pool balance is transferred into the network treasury account for that asset
- All margin and liquidity boond is returned to users' general accounts

### What is and isn't possible
- Once a market is cancelled, it cannot be traded on

### Exits cancelled state
- There is no way to exit this state, as nothing more can be done with this market

## Market status: Active
Once the enactment date is reached, the other conditions specified to exit the pending state are met, and the opening auction uncrosses, then the market becomes `active`.

An active market status indicates it is in continuous trading.

### Enters active state
- From `Pending`: enactment date reached and conditions to transition from pending to active are met
- From `Suspended`: conditions specified in [price monitoring](../trading-on-vega/market-protections.md#price-monitoring) are met for the market to exit the suspended status back to active

### What is and isn't possible
- Liquidity providers can submit, amend, or cancel commitments 
- Orders can be placed into the market, trading occurs according to normal trading mode rules (for example, such as continuous trading)
- Market data is emitted
- Positions and margins are managed
- Changes to a market configuration can be enacted through governance

### Exits active state
- Price monitoring triggers suspension → [Suspended](#market-status-suspended)
- Trading termination or settlement, triggered if the trading termination date or settlement price is reached → [Trading Terminated](#market-status-trading-terminated) | [Settled](#market-status-settled)

## Market status: Suspended
A market is `suspended` when an active market is temporarily stopped from trading to protect the market or the network from a risk, when the system has determined it is either not safe or not reasonable to operate the market at that point, for example due to extremely low liquidity. No trades may be created while a market is suspended.

Suspended markets are in auction. Depending on the type of suspension, the auction call period may have a defined end (but can be extended) or may be indefinite until the required conditions are met. The auction is uncrossed as part of the transition back to the active state and normal trading.

### Enters suspended state
- Price monitoring triggers suspension

### What is and isn't possible
- Liquidity providers can submit, amend, or cancel commitments 
- Orders applicable to auctions are accepted
- Changes to a market configuration can be enacted through governance

### Exits suspended state
- Conditions specified in price monitoring and end of auction checks are met → [Active](#market-status-active) 

## Market status: Trading Terminated
A market may enter `trading terminated` if the instrument expires or the market is otherwise configured to have a finite lifetime. 

In the case of futures, termination occurs at some point prior to, or at, the settlement of the product. Markets in this state accept no trading, but retain the positions and margin balances that were in place after processing the expiry trigger. 

A market moves from this termination state to settled when enough information exists and the triggers are reached to settle the market. 

This could happen instantly upon trading termination, though usually there will be a delay, for instance to wait to receive and accept data from a data source.

Perpetuals markets can only be terminated if a governance proposal to terminate it passes a community vote.

### Enters trading terminated state
- Triggered by the expiry for the futures market, which depends on the market's data source

### What is and isn't possible
- Perpetuals markets do not enter trading terminated unless it is triggered by a successful governance proposal
- Mark to market settlement happens once if required after termination is triggered, then never again
- A single set of market data may be emitted for the final settlement data (e.g. settlement mark price), after which no market data are emitted
- No trading occurs, no orders are accepted
- No risk management or price monitoring occurs

### Exits trading terminated state
- During the transition out of this state:
  - All final settlement cashflows are calculated and applied (settled) 
  - Margins are transferred back to participants' collateral
  - Insurance pool funds are redistributed
- Settlement dependencies met (i.e. oracle data received) → Settled

## Market status: Settled
A futures market is `settled` once the required data to calculate the settlement cashflows is provided by the market's data source. These cashflows are calculated and applied to all traders with an open position. Positions are then closed and all orders cancelled. 

Perpetuals markets will not enter settled state unless trading is terminated through a successful governance proposal.

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
