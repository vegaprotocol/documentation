---
title: Vega software releases
hide_title: false
---
import Topic from '/docs/topics/_topic-development.mdx'

<Topic />

The Vega software is publicly available on [GitHub ↗](https://github.com/vegaprotocol). Below find summaries of key released features and breaking changes, as well as links to release notes in GitHub.

[**Vega core software**](#vega-core-software) - Below, find a summary of each version's features and breaking changes.

See the full release notes on [GitHub ↗](https://github.com/vegaprotocol/vega/releases).

## Vega core software
The Vega core software is public and open source under the [AGPL ↗](https://www.gnu.org/licenses/agpl-3.0.en.html) license, so you can both view the repository change logs, and refer here for summary release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

## Version v0.77 | 2024-08-07
This version was released by validators to the Vega mainnet on 7 August 2024.

This release introduces the ability to create prediction markets, futures markets with a final settlement price cap, and fully collateralised futures markets. There are also a range of bug fixes and general improvements.

Included in this release are a series of new network parameters. Below is a list with their default values.

| New parameter | Description | Default value |
|---------------|---------------|----------------|
| `auction.LongBlock` | Determines the length of block auctions based on block times | `{"threshold_and_duration": [{"threshold":"10s","duration":"1m"}, {"threshold":"1m","duration":"5m"}, {"threshold":"10m","duration":"1h"}, {"threshold":"1h","duration":"1h"}, {"threshold":"6h","duration":"3h"}, {"threshold":"24h","duration":"6h"}]}`|
| `spam.order.minimumMarginQuantumMultiple` | Sets a minimum order size for future/perp markets. At 0.01, an order must use at least 1 cent (equivalent) of margin to be executed | 0.01 | 
| `spam.order.minimumHoldingQuantumMultiple` | Sets a minimum order size for spot markets. At 0.01, an order must have at least 1 cent of value | 0.01 |
| `market.liquidity.equityLikeShareFeeFraction` | Sets weight of liquidity score vs the equity-like share score when calculating LP fee allocation. | 0.1 |
| `market.aggressiveOrderBlockDelay` | Sets the number of blocks by which aggressive (taker) orders are delayed relative to passive (maker) orders. | 1 |
| `rewards.updateFrequency` | Sets how frequently the live game scores are updated. | 10m |

### Improvements:

- Adds the ability to publish data about games while the games are ongoing, rather than only after. [Issue 11209 ↗](https://github.com/vegaprotocol/vega/issues/11209)
- Introduces auctions during times of long block processing. [Issue 11400 ↗](https://github.com/vegaprotocol/vega/issues/11400)
- Relaxes finality check to allow instant deposits using the Arbitrum bridge. [Issue 11408 ↗](https://github.com/vegaprotocol/vega/issues/11408)
- Adds optional parameters to manually set risk factors for new markets. [Issue 11234 ↗](https://github.com/vegaprotocol/vega/issues/11234)
- Adds an Ethereum heartbeat chain event if no event-logs are seen on a contract for over an hour. [Issue 11334 ↗](https://github.com/vegaprotocol/vega/issues/11334)
- Adds configuration to Visor to help improve binary retries. [Issue 11242 ↗](https://github.com/vegaprotocol/vega/issues/11242)
- Adds a field in the price monitoring bounds details to make the bounds clearer. [Issue 11196 ↗](https://github.com/vegaprotocol/vega/issues/11196)
- Add support for allowing trading transaction ordering to be enabled or disabled. [Issue 11285 ↗](https://github.com/vegaprotocol/vega/issues/11285)
- Enhances transaction reordering with per-market control and configurable delay. [Issue 11337 ↗](https://github.com/vegaprotocol/vega/issues/11337)
- Adds source chain ID when available to transaction event details. [Issue 11329 ↗](https://github.com/vegaprotocol/vega/issues/11329)
- Adds spam checks for orders/liquidity provision. [Issue 10634 ↗](https://github.com/vegaprotocol/vega/issues/10634)
- Supports querying for historical game scores. [Issue 11357 ↗](https://github.com/vegaprotocol/vega/issues/11357)

### Fixes:

- Ensures that vesting statistics match vesting accounts numbers. [Issue 11066 ↗](https://github.com/vegaprotocol/vega/issues/11066)
- Multiple transfers were erroneously blocked when targeting the same game ID. [Issue 11279 ↗](https://github.com/vegaprotocol/vega/issues/11279)
- Fixes an issue with the position estimate endpoint which could cause data nodes to crash. [Issue 11293 ↗](https://github.com/vegaprotocol/vega/issues/11293)
- Adds source chain ID to GraphQL `Erc20WithdrawalApproval` endpoint. [Issue 11379 ↗](https://github.com/vegaprotocol/vega/issues/11379)
- Handles when asset decimals are smaller than market decimals when uncrossing the order book upon leaving an auction. [Issue 11297 ↗](https://github.com/vegaprotocol/vega/issues/11297)
- Ensures pegged order offsets are correctly verified with respect to tick size in the correct units. [Issue 11304 ↗](https://github.com/vegaprotocol/vega/issues/11304)
- Adds a field to governance proposals for recurring transfers  for a decay factor, and reports the proposal amount rather than 0 when the proposal gets enacted. [Issue 11336 ↗](https://github.com/vegaprotocol/vega/issues/11336)
- Adds support to REST to update vesting stats and fix summing the quantum balance for vesting stats. [Issue 11368 ↗](https://github.com/vegaprotocol/vega/issues/11368)
- Improves error handling for badly formed stop orders. [Issue 11380 ↗](https://github.com/vegaprotocol/vega/issues/11380)
- Fixes an issue with the fee stats event reporting. [Issue 11136 ↗](https://github.com/vegaprotocol/vega/issues/11136)
- Fixes broken snapshots when dispatch strategies are cancelled mid-epoch. [Issue 11401 ↗](https://github.com/vegaprotocol/vega/issues/11401)
- Fixes the epoch filters for `gameTeamScores`. [Issue 11438 ↗](https://github.com/vegaprotocol/vega/issues/11438)

To review these changes in the last released version, see [GitHub ↗](https://github.com/vegaprotocol/vega/compare/release/v0.76.8...v0.77.0-preview.10).

## Release version v0.76.8 | 2024-05-29

This version was released by the validators to mainnet on 29 May 2024.

### New features

**Spot markets**
The protocol now supports [proposing spot markets](../tutorials/proposals/new-spot-market.md), which will let users buy or sell assets using assets they own. [Spot](../concepts/trading-framework/market-types.md#spot) markets have no margin or leverage.

**New bridge support**
There is now support for an Arbitrum bridge so that users can bridge assets easily from Arbitrum to Vega and avoid Ethereum gas fees.

A new reward metric has been added that rewards based on the highest realised return. [Read more on the rewards page](../concepts/trading-framework/discounts-rewards.md#highest-realised-return). This has been done in [issue 11167 ↗](https://github.com/vegaprotocol/vega/issues/11167).

The most profitable trader reward has been extended to include losses in the calculation. This has been done in [issue 11165 ↗](https://github.com/vegaprotocol/vega/issues/11165).

Batch governance proposals now support including [new asset proposals](../tutorials/proposals/new-asset-proposal.md). This was completed in [11143 ↗](https://github.com/vegaprotocol/vega/issues/11143).

Transfers for rewards now allow for setting exactly when the reward is paid out using the field `transferInterval`. If this optional field is not included, it continues to default to paying out at every epoch. This was completed in [11170 ↗](https://github.com/vegaprotocol/vega/issues/11170).

### Breaking change
* New futures and derivatives market proposals now require a new field for liquidation strategy: `disposalSlippageRange`. This field sets  the range above and below the mid price within which the network will trade to dispose of a position it acquired because of a liquidation. This was done in [10995 ↗](https://github.com/vegaprotocol/vega/issues/10995).
* `chainId` is now required when submitting new asset proposal and `IssueSignature` transactions.
* `chainId`/`chain_id` and `sourceChainId`/`source_chain_id` are now returned when querying assets, withdrawals and chain events.  
* a `list games` request's epoch filter parameters have changed. If `from epoch` or `to epoch` is omitted, only the last 30 epochs are provided, and there is a limit of a 30 epoch range for each request.

### Improvements
- Reward cap was erroneously only counting the maker fees paid, rather than total fees a trader was paying. This was resolved in [issue 11105 ↗](https://github.com/vegaprotocol/vega/issues/11105).
- When calculating rewards, the protocol now distinguishes between no metric and metric is zero. For example, for returns, 0 means they balanced their m2m payments, and none means they received none. This is important for the case where 0 should get adjusted for negative returns and none should not get anything. This was resolved in [issue 11185 ↗](https://github.com/vegaprotocol/vega/issues/11185).
-  Auction trigger staleness functionality has been removed after it caused odd behaviour at auction uncrossing. This was resolved in [11121 ↗](https://github.com/vegaprotocol/vega/issues/11121).
- Price monitoring engine was simplified, taking into account that there are no longer liquidity monitoring auctions or a need for VWAP calculations. This was done in [11127 ↗](https://github.com/vegaprotocol/vega/issues/11127).
- Realised PnL is now calculated differently depending on whether the position was long or short. This was resolved in [11177 ↗](https://github.com/vegaprotocol/vega/issues/11177).
- Transfers are not as strictly restricted when it comes to validating whether a transfer is the 'same', and thus likely spam. This was done in [11184 ↗](https://github.com/vegaprotocol/vega/issues/11184).
- The spot market feature also had several issues fixed in this release.
- The minimum epochs in a team network parameter can now be set to 0, so team members can take part in games immediately. This has been done in [issue 10994 ↗](https://github.com/vegaprotocol/vega/issues/10994).
- Market decimal validation in governance is now market decimals + position decimals >= asset decimals. This ensures it’s not possible to be in a situation where small price moves don’t register but big ones do. This has been done in [issue 11009 ↗](https://github.com/vegaprotocol/vega/issues/11009).
- Auctions in cross-margin mode now use max(order price, auction price) for margin calculation. This was done in [11036 ↗](https://github.com/vegaprotocol/vega/issues/11036).
- Querying recurring governance transfers now includes the dispatch strategy. This was done in [10946 ↗](https://github.com/vegaprotocol/vega/issues/10945).
- Vesting summary events are now sorted deterministically before sending. This was done in [11000 ↗](https://github.com/vegaprotocol/vega/issues/11000).
- For some LPs, the `SLA` commitment state was returning as higher than 100% of time on book. It is now reset correctly at the end of an epoch, as of issue [11065 ↗](https://github.com/vegaprotocol/vega/issues/11065).
- Previously, a referral set could be made into a team and owned by anyone in the set. This has been fixed in [10960 ↗](https://github.com/vegaprotocol/vega/issues/10960) so only the owner of a referral set can update it.
- If a validator node hasn't received its own node vote some time after sending it, the node vote will be sent again, and the error received had a hard-coded time. The time in the error message is now dependent on how long it actually was. This was fixed in [10943 ↗](https://github.com/vegaprotocol/vega/issues/10943).
- The `collateralIncreaseEstimate` for limit orders in isolated margin mode was wrongly calculated on the API. This has been fixed in [10928 ↗](https://github.com/vegaprotocol/vega/issues/10928).
- Cancelled liquidity provisions would persist after opening auction when they shouldn't. This has been fixed in [10950 ↗](https://github.com/vegaprotocol/vega/issues/10950).
- Stop order rejections were not returning correct errors. This was fixed in [10975 ↗](https://github.com/vegaprotocol/vega/issues/10975).
- Opening auctions were displayed as uncrossing in the past, even while still open. This was fixed in [10973 ↗](https://github.com/vegaprotocol/vega/issues/10973).
- Teams statistics API was showing data from all rewards, not just those limited to teams. This was fixed in [10969 ↗](https://github.com/vegaprotocol/vega/issues/10969).
- The `lastFeeDistribution` time in snapshots was incorrect. This was fixed in [10962 ↗](https://github.com/vegaprotocol/vega/issues/10962).
- The hard limit on `gRPC` message sizes meant that some data, such as network history logs, was unattainable. This limit is now configurable, and defaults to 20MB, as of issue [10980 ↗](https://github.com/vegaprotocol/vega/issues/10980).
- Cases where leaving opening auction triggers monitoring auction are now handled by defaulting to last trade price if the opening auction breaches price bound. This was completed with issue [10997 ↗](https://github.com/vegaprotocol/vega/issues/10997).
- The price ranges state for price monitoring has been simplified, making loading from a snapshot unsuccessful. This was fixed in [11038 ↗](https://github.com/vegaprotocol/vega/issues/11038).
- Stop orders with invalid percentages were not being rejected with a rejection reason. This was causing the data node to crash.  An enum for the order rejecting reason was added in [11042 ↗](https://github.com/vegaprotocol/vega/issues/11042).
- When querying historic ledger movements, an error would be received. This was fixed in [11059 ↗](https://github.com/vegaprotocol/vega/issues/11059).
- The error for rejected batch proposals was not included in GraphQL. This was resolved in [11052 ↗](https://github.com/vegaprotocol/vega/pull/11052).

To review these changes in the last released version, see [GitHub](https://github.com/vegaprotocol/vega/compare/release/v0.75.7...v0.76.4).
## Release version 0.75.8 patch | 2024-05-24
This version was released by the validators to mainnet on 23 May 2024.

This patch release resolves an issue where a snapshot of price monitoring price ranges was not sorted deterministically. This was fixed by using the existing price range component in the sorting order, such that if two entries have equal bounds they will be sorted by their "range" component. This was completed in [release 0.75.8-fix.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.75.8-fix.2).

## Release version 0.75.8 | 2024-04-04
This version was released by the validators to mainnet on 04 April 2024.

### Breaking change

Market proposals now require the minimum `tick size` field. This allows for changeable tick sizes to support market flexibility if an asset's value changes dramatically. This breaking change was made in [issue 10635 ↗](https://github.com/vegaprotocol/vega/issues/10635).


#### Isolated margin

The protocol now allows users to choose between one of two margining modes for each position. The current mode will be stored alongside the party's position record.

* Cross-margin mode (default): this is the mode used by all newly created orders, but it can be changed. When in cross-margin mode, margin is dynamically acquired and released as a position is marked to market, allowing profitable positions to offset losing positions for higher capital efficiency.
* Isolated margin mode: this mode sacrifices capital efficiency for predictability and risk management by segregating positions. In this mode, the entire margin for any newly opened position's volume is transferred to the margin account when the trade is executed. This includes completely new positions and increases to position size. Other than at time of future trades, the general account will then never be searched for additional funds - a position will be allowed to be closed out instead - nor will profits be moved into the general account from the margin account while a position is open.

To see lower level details of how the new isolated margin feature is designed check out the following [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0019-MCAL-margin_calculator.md#isolated-margin-mode).

### Bug fixes

- In a previous release, [issue 10852 ↗](https://github.com/vegaprotocol/vega/issues/10852) was introduced to handle an auction leaving and starting in the same block. However, it did not undo the cached value of the total time spent in complete auction periods, resulting in a core panic. This was resolved in [issue 10916 ↗](https://github.com/vegaprotocol/vega/issues/10916).
- A mainnet alert raised a suspected duplicate deposit. While the duplicate event was caught and rejected by the validation, and thus would never finalise, the status in the API was still showing as `OPEN`. The API will now correctly update with the introduction of the fix in [issue 10915 ↗](https://github.com/vegaprotocol/vega/issues/10915).
- A user submitted feedback regarding the `balances` API taking a very long time to return any values. It was found that when a `from` and `to` date range was not specified, the query performed a full table scan, posing a risk to data node stability. This has been resolved by requiring a date range be provided with a 'from' or 'to' date, and the period must not be greater than 1 year. This has been fixed in [issue 10910 ↗](https://github.com/vegaprotocol/vega/issues/10910).
- Since the introduction of the notional time weighted average position API, using the endpoint would result in a data node panic. The `timeWeightedNotionalPositionService` and the `timeWeightedNotionalPositionStore` had not been initialised in the data node. The issues were fixed in [issue 10895 ↗](https://github.com/vegaprotocol/vega/issues/10895) and [issue 10897 ↗](https://github.com/vegaprotocol/vega/issues/10897) respectively.
- The `ListTransfers` API would fail when given a cursor, resulting in the API not always constructing valid queries and returning an error. This has been resolved in [issue 10837 ↗](https://github.com/vegaprotocol/vega/issues/10837).
- In testing using numerous auction triggers, markets were entering auctions for the correct duration but being extended for incorrect durations. A fix has been introduced to only break single bound on auction exit. This was resolved in [issue 10823 ↗](https://github.com/vegaprotocol/vega/issues/10823).
- It was identified that the command line wallet leaves terminal input invisible upon Ctrl-C at the wrong time. This has now been fixed in [issue 10055 ↗](https://github.com/vegaprotocol/vega/issues/10055).
- When preparing for the 0.75 testnet incentive, it was found that the new check for mark price calculations triggering a price auction was causing the bookkeeping of enter/leaving auctions for perpetual markets to become out of sync. The protocol now tells the market that it is leaving auction, and is then updated again to enter an auction if price monitoring is triggered. The market will be able to handle this zero-length interval. This was fixed in [issue 10858 ↗](https://github.com/vegaprotocol/vega/issues/10858).
- After the deployment of 0.74.9, validators that use Sentry nodes reported high RAM usage. In some cases nodes were submitting duplicate node vote commands. The window during which the node is expecting to see its own vote was hard-coded to `v.lastSentVote.Add(10 * time.Second)`. This has been resolved by adding a config value and setting it to a higher value than the hard-coded value. As a result the number of failed node votes due to duplicate votes or invalid resource IDs should decrease, along with RAM usage. This has been addressed in [issue 10862 ↗](https://github.com/vegaprotocol/vega/issues/10862).
- A bug was found in the `EstimatePosition` API with regards to collateral increase. The estimate returned from the API and the actual difference between the general account balance was significantly different. This has now been addressed and the API estimate and actual difference are now the same. This was fixed in [issue 10852 ↗](https://github.com/vegaprotocol/vega/issues/10852).
- During testing a snapshot restore was observed to have failed when pegged orders and iceberg pegged orders had been submitted. This bug has been fixed in [issue 10864 ↗](https://github.com/vegaprotocol/vega/issues/10864).
- In a market sim fuzzing test a bug was found to cause a panic when converting an "unknown" event to a proto. The event binding for time weight event has now been fixed. This was resolved in [issue 10877 ↗](https://github.com/vegaprotocol/vega/issues/10877).
- During a market-sim fuzz test a core panic was observed when amending an order in place. This has been resolved in [issue 10804 ↗](https://github.com/vegaprotocol/vega/issues/10804).
- During performance testing of loading oracle data in the block explorer (carried out in [issue 10785 ↗](https://github.com/vegaprotocol/vega/issues/10785)) it was found that a further fix was required. This has been updated such that if there is a first `N` cursor traversing newest first data, without an after cursor, the query is also restricted by date to ensure performant loading of the data. This was resolved in [issue 10820 ↗](https://github.com/vegaprotocol/vega/issues/10820)
- Several bugs in isolated margin were resolved:
    - Cancelling an order for party with multiple orders while in isolated margin, when entering an auction, would cause a panic. [10750 ↗](https://github.com/vegaprotocol/vega/issues/10750)
    - Order margin was not being updated after an order was cancelled. [10696 ↗](https://github.com/vegaprotocol/vega/issues/10696)
    -  Amending an order would cause a failure when doing the isolated margin check. [10752 ↗](https://github.com/vegaprotocol/vega/issues/10752)
    - A submitted and not-matched FoK order in isolated margin would cause an order to become unregistered from its position. [10753 ↗](https://github.com/vegaprotocol/vega/issues/10753)
- Testing scenarios determined that the market depths API was reporting a crossed order book while a market was in continuous trading. This bug has been fixed in [issue 10748 ↗](https://github.com/vegaprotocol/vega/issues/10748).
- The opening auction uncrossing price was not being registered by the perpetual markets engine. This bug has been fixed in [issue 10136 ↗](https://github.com/vegaprotocol/vega/issues/10136).
- Querying for oracle data was loading so slowly as to become unusable. This issue was resolved by adding a date constraint is added to the to the API query when the first page of results is requested. This bug has been fixed in [issue 10785 ↗](https://github.com/vegaprotocol/vega/issues/10785).
- When requesting multiple party IDs using REST, the API reported one or more invalid parties, however when requesting them individually, the given party IDs are valid and results are returned. The API was refactored to support this use case. This bug has been fixed in [issue 10780 ↗](https://github.com/vegaprotocol/vega/issues/10780).
- An issue was identified where an LP that joins a market and leaves before the opening auction ends receives all of the LP fees. This issue was fixed in [issue 10950 ↗](https://github.com/vegaprotocol/vega/issues/10950).
- A bug was found whereby a user that is not the owner could update a referral set and create an associated team. This bug has been resolved in [issue 10960 ↗](https://github.com/vegaprotocol/vega/issues/10960).
- An issue was identified whereby incorrect rewards were showing in the `teamStats` API. It was found that the query behind the API was not filtering correctly on the `entityScope` thus not filtering out non-team rewards. This has been fixed in [issue 10969 ↗](https://github.com/vegaprotocol/vega/issues/10969).
- A bug was found where suspending a market in a proposed state, before it gets enacted, will result in the market not being able to leave the opening auction. This has been fixed in [issue 10973 ↗](https://github.com/vegaprotocol/vega/issues/10973).
- It was found that events being sent to the data node were not always being sent deterministically. This issue has been fixed by correctly sorting the vesting summary events before sending to the data node. This was resolved in [issue 11000 ↗](https://github.com/vegaprotocol/vega/issues/11000).
- During market simulation fuzz testing a panic was observed when leaving an opening auction triggered a monitoring auction. This has been fixed by defaulting to the last trade price if the opening auction breaches the price monitoring boundary. This was resolved in [issue 10997 ↗](https://github.com/vegaprotocol/vega/issues/10997).
- On the 27th March 2024 the netword was halted due to a consensus failure. Full details of this issue can be seen in the [incident blog ↗](https://blog.vega.xyz/incident-report-network-outage-dd83e48072c8). The team found this to be related to ordering of price monitoring data in the snapshot files and was resolved in [this patch ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.74.10-fix.1).
- The `collateralIncreaseEstimate` for limit orders in isolated margin was producing incorrect values via the API. This has been fixed in [issue 10928 ↗](https://github.com/vegaprotocol/vega/issues/10928).

### Improvements

- The book price is no longer updated during an auction. Now, when a futures, or perpetual, market is in a monitoring auction: the book price is undefined with staleness increasing with time; the book price at auction uncrossing is set to the price of the uncrossing trade; and the mark price is only recalculated when the auction exits, starting from only the last period indicated by the `network.markPriceUpdateMaximumFrequency` parameter. This was introduced in [issue 10810 ↗](https://github.com/vegaprotocol/vega/issues/10810).
- The price monitoring engine has now been updated to be in line with new mark price methodology. The price monitoring engine now tracks mark price evolution within the market. It is used to monitor trades as well as mark price update candidates. If any of these violates the price monitoring bounds, the market will go into auction and the transaction will be rejected. This was introduced in the following issues: [issue 10845 ↗](https://github.com/vegaprotocol/vega/issues/10845) and [issue 10392 ↗](https://github.com/vegaprotocol/vega/issues/10392).
- The margin calculations have now been simplified. This has been done by removing the orderbook-based exit price calculation from margin calculation. This was carried out in [issue 10754 ↗](https://github.com/vegaprotocol/vega/issues/10754).
- The lower bound validation for the isolated margin factor has been updated. The protocol now allows, when switching to isolated margin mode, the margin factor to be greater than `0`, and greater than `max(risk factor long, risk factor short) + linear slippage factor`. This has been updated in [issue 10846 ↗](https://github.com/vegaprotocol/vega/issues/10846).
- A new API has been created to expose the notional time weighted average position of a party. It's now possible using the transfers API to calculate if a party is eligible for rewards based on the notional time weighted average position rewards requirement. This has been added in [issue 10831 ↗](https://github.com/vegaprotocol/vega/issues/10831).
- The `ethcall` engine will now send to core a dummy chain event if it hasn't sent anything to core in the past hour. It will contain just the last `eth-block-height` checked. This allows core to store in the snapshot a more up to date `last-seen` block height meaning that a node will "re-check" fewer ethereum blocks after a protocol upgrade. This will reduce RPC calls to Ethereum after periods of inactivity sourcing data if there are no markets sourcing data from Ethereum data sources. This improvement has been made in [issue 10841 ↗](https://github.com/vegaprotocol/vega/issues/10841).
- CometBFT has been updated to the [latest patch version](https://github.com/cometbft/cometbft/blob/v0.38.6/CHANGELOG.md#v0386), this has been carried out in [issue 10879 ↗](https://github.com/vegaprotocol/vega/issues/10879).
- A change has been implemented to cancel pegged orders when updating the tick size as implemented in [issue 10635 ↗](https://github.com/vegaprotocol/vega/issues/10635). When the tick size is updated, all existing pegged orders are checked. If the offset of an order is no longer an integer multiple of the tick size, the order is cancelled. This has been carried out in [issue 10778 ↗](https://github.com/vegaprotocol/vega/issues/10778).
- Changes have been implemented to allow an optional fee cap for takers to a market. If set, the actual amount of reward transferred to each public key during distribution for the transfer will be `min(calculated_reward_in_quantum, cap_reward_fee_multiple × fees_paid_this_epoch_in_quantum)`.  This was done in [issue 10517 ↗](https://github.com/vegaprotocol/vega/issues/10517).

### API changes

- The `Get deposit`/ deposit status API now has a field for `STATUS_DUPLICATE_REJECTED`.
- `TimeWeightedNotionalPosition` can now be queried for a `party_id`, `asset_id` and `game_id` at a given `at_epoch`.
- `GetTimeWeightedNotionalPositionRequest` can now be queried for a `party_id`, `game_id`, and `asset_id`.
- `GetTimeWeightedNotionalPositionResponse` can now be queried for a `party_id`, `game_id`, and `asset_id`.
- `list transfers request` query allows for optional `from account type` and `to account type` filtering.
- `submit transfer`/`submit transfer proposal` commands and `list transfers` query now include optional `capRewardFeeMultiple`.
- `new market proposal` and `update market proposal` commands and `list market` query now includes `tickSize` field.
- `list votes` query has a new shape for equity-like share, `ELS per market`, which provides `market ID` and `els`.

To review the changes in the last released version, see the [comparison file ↗](https://github.com/vegaprotocol/vega/compare/patch/v0.74.10...v0.75.8).

## Release versions 0.74.10-fix.1 | 2024-03-27
This version was shared with the validators on 27 March 2024.

### Bug fixes

- At 11:40 UTC on 27 March 2024, the Vega mainnet stopped producing blocks as detailed in [this incident report ↗](https://blog.vega.xyz/incident-report-network-outage-dd83e48072c8). Nodes had differing `appHash` values. The issue is related to how price monitoring bounds were sorted, and has been fixed in the following [patch release ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.74.10-fix.1).

To see deployment instructions for this patch please see the [migration guide](../node-operators/migration-guides/upgrade-node.md)

To review the changes in the last released version, see the [comparison file ↗](https://github.com/vegaprotocol/vega/compare/v0.74.10...v0.74.10-fix.1).

## Release versions 0.74.10 | 2024-03-07
This version was released by the validators to mainnet on 07 March 2024.

### Bug fixes

- After the release of 0.74.9 validators reported an unusually high number of Ethereum RPC calls. As the markets were recently updated to source data from other EVM RPC compatible sources no events were received from Ethereum for a number of weeks. When a protocol upgrade happens the snapshot has a "last Ethereum block height" specified, in order for the network not to miss any events all blocks from this specified height are being checked thus causing a high number of RPC calls. As the deposits and withdrawals use the same client to monitor events these are affected. A temporary patch fix has been made in the following [issue 10842 ↗](https://github.com/vegaprotocol/vega/pull/10842). A further full fix will be included in the next published release.

To review the changes in the last released version, see the [comparison file ↗](https://github.com/vegaprotocol/vega/compare/v0.74.9...v0.74.10).


## Release versions 0.74.8 and 0.74.9 (combined) | 2024-03-07
This version was released by the validators to mainnet on 07 March 2024.


### Bug fixes

- The number of possible price monitoring triggers allowed has been increased to 100, this was missed validation from [issue 10770 ↗](https://github.com/vegaprotocol/vega/issues/10770) deployed in 0.74.7. This was rectified in [issue 10795 ↗](https://github.com/vegaprotocol/vega/issues/10795).
- During a snapshot test, some of the state in the staking engine and ETH verifier engine used to deduplicate events (from Ethereum or EVM chains) was not being saved in the snapshot as they should. This has been fixed in [issue 10811 ↗](https://github.com/vegaprotocol/vega/issues/10811).

To review the changes in the last released version, see the [comparison file ↗](https://github.com/vegaprotocol/vega/compare/v0.74.7...v0.74.9).


## Release versions 0.74.5, 0.74.6 and 0.74.7 (combined) | 2024-02-29
This version was released by the validators to mainnet on 29 February 2024.

### Bug fixes

-  After a recent change to the ledger entries API it did not return data when filtering by transfer ID. The `transfer ID` is now associated with the ledger entry. This bug has been fixed in [issue 10374 ↗](https://github.com/vegaprotocol/vega/issues/10374).
- The network parameter has been updated to support a block interval at which to call for new blocks. This was required to reduce the amount of EVM RPC data sourcing calls, and thus, the event forwarder snapshot size. This fix has been carried out in [issue 10698 ↗](https://github.com/vegaprotocol/vega/issues/10698).
- The `aggregationEpochs` API was returning the last 30 epochs that had results rather than the last 30 epochs overall. This has been fixed such that the response always starts from the current epoch and counts back the number of epochs given in the filter. This fix was implemented in the [issue 10722 ↗](https://github.com/vegaprotocol/vega/issues/10722).
- A snapshot bug was found when changing the SLA hysteresis network parameter in a batch proposal. This fix was implemented in the [issue 10743 ↗](https://github.com/vegaprotocol/vega/issues/10743).
- When LPs were voting on batch proposals they were not showing up in the API response. Batch proposal votes have been fixed to contain ELS per market and this now shows on the API. This fix was implemented in the [issue 10725 ↗](https://github.com/vegaprotocol/vega/issues/10725).
- It was possible to suspend a market via governance that was already in governance suspension. A fix has been implemented to prevent governance suspension of a market already suspended. This fix was implemented in the [issue 10744 ↗](https://github.com/vegaprotocol/vega/issues/10744).

### Improvements

- In order to further resolve issues seen with liquidations, a network disposal order will not cross with orders outside price monitoring bounds. Hence a network disposal cannot trade at a price outside the tightest price monitoring and it won't ever trigger a price monitoring auction. This improvement was made in [issue 10764 ↗](https://github.com/vegaprotocol/vega/issues/10764).
- It is now possible to make a market update proposal to set the `fundingRateScalingFactor` to a value of `0`. This improvement was made in [issue 10727 ↗](https://github.com/vegaprotocol/vega/issues/10727).
- The price monitoring bounds limits have been raised from a value of `5` to now be `100`.  This improvement was made in [issue 10770 ↗](https://github.com/vegaprotocol/vega/issues/10770).
- An improvement has been made to allow the transfers API to filter by from and to account type. This allows for building a network treasury view for the Block Explorer. This improvement to the API was made in the [issue 10686 ↗](https://github.com/vegaprotocol/vega/issues/10686).

To review the changes in the last released version, see the [comparison file ↗](https://github.com/vegaprotocol/vega/compare/v0.74.4...v0.74.7).

### API changes
- `aggregated ledger entry` endpoint has a new optional field for filtering by `transfer ID`
- `list transfers request` allows for optional `from account type` and `to account type` filtering
- `list votes` has a new shape for equity-like share, `ELS per market`, which provides `market ID` and `els`

## Release version 0.74.4 | 2024-02-23
This version was released by the validators to mainnet on 23 February 2024.

This release contains the changes to restore balances from manipulator withdrawals, as can be seen in the [release notes](https://github.com/vegaprotocol/vega/releases/tag/v0.74.4). It has been made available in response to the following [mainnet incident report ↗](https://medium.com/vegaprotocol/incident-report-network-outage-e60376912790).

## Release version 0.74.3 | 2024-02-20
This version was released by the validators to mainnet on 20 February 2024.

This release contains several new features for the Palazzo milestone, including batch proposals, Ethereum RPC and EVM based data sources, new mark price and perps funding TWAP methodology, LP fee setting improvements and team games and party profile updates.

### Breaking changes

- Listing transactions on block explorer no longer supports the field `limit`. This has been removed in [issue 10215 ↗](https://github.com/vegaprotocol/vega/issues/10215)
- Getting a transfer by ID now returns a `TransferNode`. This has been added in [issue 8056 ↗](https://github.com/vegaprotocol/vega/issues/8056)

### Deprecations

 - Commands `tm` and `tendermint` are deprecated in favour of `cometbft`. This has been completed in [issue 10000 ↗](https://github.com/vegaprotocol/vega/issues/10000)

### New Features

This release brings in a number of new network parameters. The below table details the parameters, default values and the associated specs should the community wish to change these post deployment.


| Network parameter    | Default value | Feature |
| -------------------- | ----- | ------------- |
| `blockchains.ethereumRpcAndEvmCompatDataSourcesConfig` | `{"network_id":"1","chain_id":"1","collateral_bridge_contract":{"address":"0x23872549cE10B40e31D6577e0A920088B0E0666a"},"confirmations":64,"staking_bridge_contract":{"address":"0x195064D33f09e0c42cF98E665D9506e0dC17de68","deployment_block_height":13146644},"token_vesting_contract":{"address":"0x23d1bFE8fA50a167816fBD79D7932577c06011f4","deployment_block_height":12834524},"multisig_control_contract":{"address":"0xDD2df0E7583ff2acfed5e49Df4a424129cA9B58F","deployment_block_height":15263593}}` | EVM RPC data sourcing [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0087-EVMD-eth-rpc-and-evm-data-source.md) |
| `network.internalCompositePriceUpdateFrequency` | 5s | Mark price [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0009-MRKP-mark_price.md) |
| `spam.protection.max.updatePartyProfile` | 10 | Teams and games [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0062-SPAM-spam_protection.md) |
| `spam.protection.updatePartyProfile.min.funds` | 10 | Teams and games [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0062-SPAM-spam_protection.md) |
| `spam.protection.referralSet.min.funds` | 10 | Teams and games [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0062-SPAM-spam_protection.md) |
| `transfer.fee.maxQuantumAmount` | 1 | Transfer fee improvements [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0057-TRAN-transfers.md) |
| `transfer.feeDiscountDecayFraction` | 0.8 | Transfer fee improvements [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0057-TRAN-transfers.md) |
| `transfer.feeDiscountMinimumTrackedAmount` | 0.01 | Transfer fee improvements [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0057-TRAN-transfers.md) |


#### Batch proposals

A `BatchProposalSubmission` is a top-level proposal type that allows grouping several individual proposals into a single proposal. All changes will pass or fail governance voting together.

The batch proposal is a wrapper containing one rationale (i.e. title and description) and one closing timestamp for the whole set, and a list of proposal submissions for each proposed change that omit certain fields.

Any governance proposal can be included in a batch except proposals to *add* new assets.

To see lower level details of how the new batch proposals feature is designed check out the following [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0028-GOVE-governance.md#batch-proposals).

#### Ethereum RPC and EVM based data sources

Updates in the Palazzo milestone (v0.74.0) introduce a new way of sourcing data from any chain or Ethereum Layer 2 blockchain (L2) that supports Ethereum RPC calls and runs an EVM.

In addition to listening to Ethereum events and reading oracle data from Ethereum contracts, as implemented the Cosmic Elevator milestone (v0.73), it will now be possible for Vega nodes to listen to events from and read from other chains that implement Ethereum RPC and run EVM, in particular Ethereum L2s.

The overarching principle is that the chain provides Ethereum RPC / EVMs and thus the contracts and ABIs are assumed to be functionally the same as on Ethereum itself.

To see lower level details of how the new Ethereum RPC and EVM based data sources feature is designed check out the following [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0087-EVMD-eth-rpc-and-evm-data-source.md).

#### Mark price and price for perps funding TWAP updates

For perpetual futures markets there is now a **mark price** configuration and a **mark price for funding** configuration so that the market can potentially use different mark price for mark-to-market and price monitoring and a completely different price for calculating funding.

To see lower level details of how the new mark price and price for perps funding TWAP updates is designed check out the following [spec ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0009-MRKP-mark_price.md).

#### Liquidation strategy improvements

Improvements have been made to how distressed parties are liquidated. Now new market proposals will need to include a liquidation strategy configuration.

This configuration is used to allow the network to hold an active position on the market. Parties that are distressed, but previously couldn't be liquidated because there was insufficient volume on the book, will now be liquidated. In this process the party's position is transferred to the network party, and rather than dumping the distressed volume on the market, an inventory management strategy carries this out over time.

This improvement has been added in [issue 9945 ↗](https://github.com/vegaprotocol/vega/issues/9945)

#### Liquidity provider fee setting improvements

There are three methods for setting the liquidity fee factor, with the default method being the current 'Marginal Cost method.' The liquidity fee setting mechanism is configured per market as part of the market proposal. Th two new methods are:

**Stake-weighted-average method for setting the liquidity fee factor**

The liquidity fee factor is set as the weighted average of the liquidity fee factors, with weights assigned based on the supplied stake from each liquidity provider, which can also account for the impact of one supplier's actions on others.

**"Constant liquidity fee" fethod**

The liquidity fee factor is set to a constant directly as part of the market proposal.

This has been implemented as per the [LP fee and rewards setting specification ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md)


#### Teams games and party profiles

A number of changes have been introduced to incentivise the use of Vega through rewards. Along with the referral program users will be able to create teams and incentivse use via reward structures. The team reward metrics and accounts have been implemented as per the [rewards specification ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0056-REWA-rewards_overview.md#team-reward-metrics).

Now, participants can also have an on-chain party profile allowing them to add an alias and metadata to a given party.

This has been implemented as per the [party profile specification ↗](https://github.com/vegaprotocol/specs/blob/palazzo/protocol/0088-PPRF-party_profile.md)


### Release version 0.73.14 (patch) | 2024-02-19
Version 0.73.14 was released by the validators to mainnet on 19 February, 2024.

This version:

* Contains changes that will suspend all markets at the time of the protocol upgrade and set the funding rate scaling factor to `0` as per the [0.73.14](https://github.com/vegaprotocol/vega/releases/tag/v0.73.14) release notes.
* This is in response to reports from the community of a potential intentional exploit and/or manipulation of markets as detailed in this [mainnet incident report ↗](https://medium.com/vegaprotocol/incident-report-network-outage-e60376912790) and is to protect the current markets.


### Release version 0.73.13 (patch) | 2024-02-06
Version 0.73.13 was released by the validators to mainnet on 06 February, 2024.

The version contained the following critical bug fixes:

* In a situation where the mark-to-market calculation included data for a party with no position, the code would raise a panic, which would then cause a node to fail. This issue was a patch fix in responce to the following network outage [mainnet incdent ↗](https://medium.com/vegaprotocol/incident-report-network-outage-e60376912790)
* In some circumstances, PnL was incorrectly displayed by the API. This was resolved in issue [10568 ↗](https://github.com/vegaprotocol/vega/issues/10568)
* During the governance voted termination of the LINK/USDT market on mainnet a particular edge case bug was identified. This is where the TWAP calculation for the internal data point, happening at the end of a funding period, can be incorrect. This led to some balances being incorrect during the funding payments. The calculation error has been resolved in the issue [10520 ↗](https://github.com/vegaprotocol/vega/issues/10520).


### Release versions 0.73.11 and 0.73.12 (patch) combined | 2024-01-12

Version 0.73.12 was released by the validators to mainnet on 12 January, 2024.

The version contained the following fixes:

* To address an issue whereby blocks may stop being produced, Vega now limits the number of blocks queried in a single `eth_getLogs` call to prevent large requests to Ethereum nodes. This limit is configurable so that it can match the requirements of Ethereum node providers being used by a Vega validator. This has been resolved under the issue [9992 ↗](https://github.com/vegaprotocol/vega/issues/9992) and in [0.73.12](https://github.com/vegaprotocol/vega/releases/tag/v0.73.12).
* A situation was identified whereby stop orders placed during an opening auction can cause a core panic, this has been resolved under the issue [10318 ↗](https://github.com/vegaprotocol/vega/issues/10318) and in [0.73.11](https://github.com/vegaprotocol/vega/releases/tag/v0.73.11).


### Release version 0.73.10 (patch) | 2023-12-10
Version 0.73.10 was released by the validators to mainnet on 28 December, 2023.

The version contained the following improvements:

* Market update proposals will now apply the correct equity-like-share threshold when accounting for votes, [10257 ↗](https://github.com/vegaprotocol/vega/issues/10257).
* The `aggregationEpochs` now does not count the start epoch to avoid a discrapancy between `totalRefereeNotionalTakerVolume` (aka `PeriodVolume`) and the sum of `epochNotionalTakerVolumes`, [10241 ↗](https://github.com/vegaprotocol/vega/issues/10241).

Check out the full details of what is contained in the patch release in the Vega core [0.73.10 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.10) release page.

### Release version 0.73.9 (patch) | 2023-12-09
Version 0.73.9 was released by the validators to mainnet on 09 December, 2023.

This release contains several fixes and improvements, including one to resolve a [mainnet incident ↗](https://blog.vega.xyz/incident-report-network-outage-991097f8cf5c).

The version contained the following improvements:
* Closed markets will not be subscribed to data sources when restored from a snapshot, [10166 ↗](https://github.com/vegaprotocol/vega/issues/10166).
* Added validation so that order sizes are not unrealistically large, [10177 ↗](https://github.com/vegaprotocol/vega/issues/10177).
* Ensured infra fees don't get counted for vesting, [10211 ↗](https://github.com/vegaprotocol/vega/issues/10211).
Volume discount stats no longer show volumes when party doesn't qualify for a discount tier, [10218 ↗](https://github.com/vegaprotocol/vega/issues/10218).
* Fixed expiring stop orders panic, [10233 ↗](https://github.com/vegaprotocol/vega/issues/10233).

Check out the full details of what is contained in the patch release in the Vega core [0.73.9 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.9) release page.

### Release version 0.73.6 (patch) | 2023-11-23
Version 0.73.6 was released by the validators to mainnet on 23 November, 2023.

This release contains a protocol optimisation required as a result of  the following [mainnet incident ↗](https://medium.com/vegaprotocol/incident-report-forwarding-events-from-ethereum-a384fc35fbdf) raised on the 21st November 2023 regarding the forwarding of events from Ethereum.

Check out the full details of what is contained in the patch release in the Vega core [0.73.6 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.6) release page.

### Mainnet incident - protocol optimisation

The mainnet incident was resolved without any code change, however, the Vega project team identified improvements to reduce the Ethereum RPC load and minimise the chance of future similar incidents; given their impact. The improvements, of adding metrics and reducing the amount of requests sent to the Ethereum RPC, was done under the following [issue](https://github.com/vegaprotocol/vega/issues/10153).

### Release version 0.73.5 (patch) | 2023-11-20
Version 0.73.5 was released by the validators to mainnet on 20 November, 2023.

This release contains a number of critical fixes required as a result of testing feedback after the 0.73 deployment.

Check out the full details of what is contained in the patch release in the Vega core [0.73.5 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.5) release page.

### Critical fixes

An issue was noticed affecting perpetual markets when the market doesn't have at least 1 of each price observation (internal and external). When this occurs the funding payment doesn't get exchanged, however, the Margin Estimate assumes it has exchanged and thus provides and incorrect estimate for the side due to make the payment. This issue was resolved in 3 pull requests [10119 ↗](https://github.com/vegaprotocol/vega/pull/10119), [10121 ↗](https://github.com/vegaprotocol/vega/pull/10121) and [10124 ↗](https://github.com/vegaprotocol/vega/pull/10124).

During a [Market Simulation ↗](https://github.com/vegaprotocol/vega-market-sim) fuzzing test, when sending a batch market transaction, a bug was identified where it crashed the network. This was found to be an invalid stop order without a rises-above or falls-below that causes the count of how many pre-generated IDs required to fall out of sync. This was resolved in the pull request [10070 ↗](https://github.com/vegaprotocol/vega/pull/10070)

When carrying out some testing of `StopOrdersSubmission` in batch proposals it was found that sending this proposal without any values crashes the data node. The investigation found this to be a nill-pointer panic and this bug was fixed in the pull requests [10126 ↗](https://github.com/vegaprotocol/vega/pull/10126)

An issue with the GraphQL `LedgerEntries` API was identified resulting in the query failing if `TransferType` filter is specified. On investigation the API worked as intended however, the error message was misinforming users. The error message has been improved and the API documentation made consistent between the gRPC and GraphQL APIs. This bug was fixed in the pull requests [10117 ↗](https://github.com/vegaprotocol/vega/pull/10117)

### Release version 0.73.4 (patch) | 2023-11-14
Version 0.73.4 was released by the validators to mainnet on 14 November, 2023.

This release contains 2 fixes required as a result of testing feedback after the 0.73 deployment.

Check out the full details in the Vega core [0.73.4 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.4) release page.

### Critical fixes

An issue with the entry price value seen on the positions API was reported. The average entry price from the positions API is flickering - it sometimes briefly changes to read an incorrect value - thus impacting users of the API. This was resolved in this [pull request ↗](https://github.com/vegaprotocol/vega/pull/10037).

The list ledger entries API failed when pagination was provided. The query had been updated to use `ledger entry time` instead of Vega time, but the cursor for filtering did not recognise `ledger entry time`. This was resolved in this [pull request ↗](https://github.com/vegaprotocol/vega/pull/10043).

### Release version 0.73.3 (patch) | 2023-11-09
Version 0.73.3 was released by the validators to mainnet on 09 November, 2023.

Check out the full details in the Vega core [0.73.3 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.3) release page.

### Critical fixes

Shortly after the 0.73.1 release a user reported that immediately after trade the PnL shown in Console would flicker, affecting both realised and unrealised PnL. This was resolved in [pull request ↗](https://github.com/vegaprotocol/vega/pull/9959).

### Release version 0.73.2 (patch) | 2023-11-01
Version 0.73.2 was released by the validators to mainnet on 01 November, 2023.

This release contains 3 fixes required as a result of testing feedback after the 0.73.1 deployment.

Check out the full details in the Vega core [0.73.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.2) release page.

### Critical fixes

A number of liquidity providers reported that they had been penalised incorrectly after the migration of LP orders from the old mechanism to the new SLA liquidity mechanism. It was found that the default parameter changes were not being published to the markets on restart, this was resolved in [commit ↗](https://github.com/vegaprotocol/vega/commit/53b2b19cbf462963532d115a4b4b4605125944da).

Due to this issue, bond penalties were temporarily disabled and will allow 7 epochs for LPs to adjust to the new SLA liquidity. This was introduced in this [commit ↗](https://github.com/vegaprotocol/vega/commit/8866cf289d7a99269a91caf16ee238db4a420414). This code will be removed in a future release.

An issue with governance transfers was reported whereby the default parameter values were incorrect. This [commit ↗](https://github.com/vegaprotocol/vega/commit/3f344142c465b279345c9f1e8c9aef66dbd9f086) sets the default values correctly.

### Release version 0.73.2 (patch) | 2023-11-01
Version 0.73.2 was released by the validators to mainnet on 01 November, 2023.

This release contains 3 fixes required as a result of testing feedback after the 0.73.1 deployment.

Check out the full details in the Vega core [0.73.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.2) release page.

### Critical fixes

A number of liquidity providers reported that they had been penalised incorrectly after the migration of LP orders from the old mechanism to the new SLA liquidity mechanism. It was found that the default parameter changes were not being published to the markets on restart, this was resolved in [commit ↗](https://github.com/vegaprotocol/vega/commit/53b2b19cbf462963532d115a4b4b4605125944da).

Due to this issue, bond penalties were temporarily disabled and will allow 7 epochs for LPs to adjust to the new SLA liquidity. This was introduced in this [commit ↗](https://github.com/vegaprotocol/vega/commit/8866cf289d7a99269a91caf16ee238db4a420414). This code will be removed in a future release.

An issue with governance transfers was reported whereby the default parameter values were incorrect. This [commit ↗](https://github.com/vegaprotocol/vega/commit/3f344142c465b279345c9f1e8c9aef66dbd9f086) sets the default values correctly.

### Release version 0.73.1 | 2023-11-01
Version 0.73.1 was released by the validators to mainnet on 01 November, 2023.

This release contains several new features, including the new product type perpetuals, Ethereum oracles and a refactored liquidity mechanism.

Check out the full details in the Vega core [0.73.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.1) release page.

### Breaking changes

1. The snapshot configuration `load-from-block-height` no longer accepts -1 as a value. From 0.73.0 onwards, the value of 0 must be used to reload from the latest snapshot. Along with this change the snapshot configuration `snapshot-keep-recent` only accepts values from 1 to 10 inclusive. These changes have been included in the issue [8679 ↗](https://github.com/vegaprotocol/vega/issues/8679) and are documented in [0.73 deployment instructions](../node-operators/migration-guides/upgrade-node.md).

2. The `AssetID` field on the `ExportLedgerEntriesRequest` gRPC API, for exporting ledger entries, has had its type changed in order to make it optional. This change has been included in the issue [8944 ↗](https://github.com/vegaprotocol/vega/issues/8944).

3. The command options for data node retention modes have been updated resulting in a breaking change. The `--lite` and `--archive` options to data node have been replaced with `--retention-profile=[archive|conservative|minimal]` with default mode as archive. This change has been included in the issue [9562 ↗](https://github.com/vegaprotocol/vega/issues/9562) and is documented in [0.73 deployment instructions](../node-operators/migration-guides/upgrade-node.md).

4. A crafted payload containing a very large integer can trigger a descriptive internal server error with SQL reference. In order to mitigate the risk of this happening, specifying the range for pagination has been mandated. A default value of 1000 items per page has been  applied. This change has been included in the issue [9408 ↗](https://github.com/vegaprotocol/vega/issues/9408).

5. The SLA API endpoint has been updated such that it has both a `current` part (amount, committed, fee proposed) and a `pending` part (new amount and fee which will be activated at epoch boundary). This change has added a `pending` element to the `LiquidityProvision` object causing a breaking change affecting the gRPC API. This change has been included in the issue [9757 ↗](https://github.com/vegaprotocol/vega/issues/9757)

### New features

#### New liquidity mechanism

At a high level, this change replaces the legacy system that requires LPs to be on the book all the time. The new implementation, called SLA liquidity can be summarised as follows:

- LPs that meet an SLA (i.e. % of time spent providing their liquidity obligation within a range) are rewarded.
- LPs that have a better performance against the SLA receive more rewards, ensuring there is an incentive to do more than the bare minimum if market conditions allow.
- LPs that commit and do not meet the SLA within the LP price range will lose fee revenue and have a sliding penalty applied to their bond account, depending on if their underperformance continues.

**How this is different:**

In the previous liquidity model, providers would make a commitment and define a “shape” in their liquidity provision order. Any of their commitment volume that wasn't on the book from limit orders would be filled by orders that were automatically deployed based on the shape they defined. In this release, “shapes” are being removed and providers will now be required to deploy their own orders to fulfil their liquidity obligation.

**What to expect during the migration:**

- All existing orders deployed as a result of the LP shapes will be cancelled immediately.
- Any active liquidity provision orders will be converted to align to the new liquidity protocol implementation by removing the definition of the buy / sell shape.

- Default values for the new liquidity network parameters will be applied, as follows:

| Network parameter | Default | Description |
| ----------- | ----------- | ----------- |
| market.liquidity.sla.nonPerformanceBondPenaltySlope | 1 |  Not meeting the SLA deprives an LP of liquidity fee revenue, and a sliding penalty is applied. How much penalty is based on the value of this network parameter. |
| market.liquidity.sla.nonPerformanceBondPenaltyMax | 0.5 (50%) | Defines the maximum penalty on that sliding scale that will be applied to the liquidity provider’s bond account if they do not meet SLA. |

- All existing markets will have the following default parameters applied:

| Market parameter | Default | Description |
| ----------- | ----------- | ----------- |
| priceRange | 0.05 (5%) |  Maximum range on both sides of the mid price that orders need to be in to count towards SLA. |
| commitmentMinTimeFraction | 0.95 (95%) |  Minimum per epoch that LPs must meet their commitment “on the book” in the price range to avoid penalties. |
| performanceHysteresisEpochs | 1 |  Number of epochs for which past performance will affect future fee revenue. |
| slaCompetitionFactor | 0.9 (90%) |  Amount of an LP’s accrued fees that may be allocated to other better scoring providers. |

For full details on these network and market parameters and what they represent please read the [liquidity concepts pages](../concepts/liquidity/index.md).

We advise any existing liquidity providers to use [Console on Fairground ↗](https://console.fairground.wtf/) or the APIs to experiment with the new liquidity protocol ahead of the release to ensure they are comfortable with the changes.

To see lower level details of how the new SLA liquidity feature is designed check out the following [spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0044-LIME-lp_mechanics.md). The work items completed on this feature can be seen on issues and pull requests with the [`liquidity-sla` ↗](https://github.com/vegaprotocol/vega/issues?q=is%3Aclosed+label%3Aliquidity-sla+) label.

#### Perpetual futures markets

Perpetual futures markets are cash-settled and do not have a pre-specified “delivery” date/market expiry, so positions can be held indefinitely.

Payments are periodically exchanged between holders of the two sides, long and short, with the direction and magnitude of the settlement based on the difference between the latest mark price and that of the underlying asset, as well as, if applicable, the difference in margin between the two sides.

Along with this new product, there are new market governance options that provide the option to suspend, resume or terminate a market via a community proposal and vote.

To learn more about the implementation of perpetual markets on Vega see the [spec](https://github.com/vegaprotocol/specs/blob/master/protocol/0053-PERP-product_builtin_perpetual_future.md). The work items completed on this feature can be seen on issues and pull requests with the [`perpetual` ↗](https://github.com/vegaprotocol/vega/issues?q=is%3Aclosed+label%3Aperpetual) label.

#### Ethereum oracles
In the current mainnet state, the markets on Vega are settled and terminated with data that come from centralised sources.

With this more flexible Ethereum oracle framework, there will be a new way to source data from the Ethereum blockchain, allowing for arbitrary data from Ethereum to be ingested as a data source. This had no impact on the already-existing Ethereum bridge.

To see more details check out this [spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0082-ETHD-ethereum-data-source.md). The work items completed on this feature can be seen on issues and pull requests with the [`ethereum-oracles` ↗](https://github.com/vegaprotocol/vega/issues?q=is%3Aclosed+label%3Aethereum-oracles+) label.

#### Referral program

To allow existing users of the protocol/community members to refer new users, the on-chain referral program lets participants enact and vote for a program that provides benefits for referrers and referees.

A party will be able to create a referral code and share this code with referees. Referees who apply the code will be added to the referrer's "referral set".

Whilst a referral program is active, the following benefits may be available to participants in the referral program.

- A referrer may receive a proportion of the referee's paid fees as a reward.
- A referee may be eligible for a discount on fees they incur.

Providing a party has been associated with a referral set for long enough, they will become eligible for greater benefits as their referral set's running taker volume increases. To see more details check out this [spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0083-RFPR-on_chain_referral_program.md). The work items completed on this feature can be seen on issues and pull requests with the [`referral ` ↗](https://github.com/vegaprotocol/vega/issues?q=is%3Aclosed+label%3Areferral+) label.

#### Changes to reward framework
This release introduces locking and vesting for all rewards accrued, including staking, trading, and validator score rewards. Those rewards will go into a [vesting account](../concepts/trading-framework/discounts-rewards.md#how-rewards-are-paid), and can be redeemed on a per-epoch basis. Some rewards may be locked for a number of epochs before they begin vesting, this is defined in each reward pool's funding transfer and may differ for each type of reward.

The initial base rate for vesting will be 25%, meaning 25% of your unlocked pool will vest every epoch. This is set in a network parameter and can be changed by the community through governance. At release time, there is no vesting period for staking rewards, and they will be available to transfer from the vested account to general account as they accrue.

The vesting rate can also be accelerated for faster vesting by keeping rewards in the vesting account, and gaining access to vesting benefit tiers if these are defined and enabled by the community. This is disabled at launch and controlled by governance.

#### Expanded reward opportunities
Trading rewards have increased to include 3 new reward types, and validator node operators can also benefit from a new reward.

See details on the [trading rewards page](../concepts/trading-framework/discounts-rewards.md#trading-rewards) and the [validator rewards page](../concepts/chain/validator-scores-and-rewards.md#validator-metric-based-rewards).


### Release version 0.72.14 | 2023-09-05

Version 0.72.14 was released by the validators to mainnet on 05 September, 2023.

This release contains several new features, including the ability to propose successor markets, submit stop orders and submit iceberg orders.

It also includes fixes to several APIs, including the API for exporting ledger entries.

#### Deprecation
The unused rewards-related network parameter `reward.staking.delegation.payoutFraction` has been deprecated and will be removed in the next release. This was done in [8280](https://github.com/vegaprotocol/vega/issues/8280).

#### New features
**Stop orders**
A stop order is an order to buy or sell once the price reaches a specified price, known as the trigger price. Stop orders can be used to help a trader limit losses (stop loss), or capitalise on a gain (take profit) automatically when they already have an open position. Stop orders can be submitted as a single stop order trigger or an OCO (one cancels the other) pair.

**Iceberg orders**
An iceberg order is a limit order for a large amount that, rather than being entered as a single large order of that size, is placed on the book as a smaller order that is replenished as that order amount is filled. The peak / 'visible' amount can be filled with one trade, while the reserve is used to support the smaller order amount. Assuming the network is a public one, the iceberg amount below the peak can still be deduced.

**Successor markets**
A successor market is a market that will carry on after the original market, or parent, that it is based on has settled, which offers liquidity providers the option to keep their equity-like share on the new market, even after the original market expires.

#### Fixes
Profit and loss data was flickering between different values when subscribed to. This is fixed in [8362](https://github.com/vegaprotocol/vega/issues/8362).

Settled markets did not have a close timestamp available in the API. Fixed in [8186](https://github.com/vegaprotocol/vega/issues/8186).

Added number of decimal places to data source events, so it can be determined how many decimal places are being referenced. Done in [8206](https://github.com/vegaprotocol/vega/issues/8206).

The estimate positions endpoint did not correctly validate data, meaning it would accept values that it could not use. Fixed in [8222](https://github.com/vegaprotocol/vega/issues/8222).

Check out the full details of the main release: [0.72.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.0),
Patch releases, which primarily improve the new features, can also be found on GitHub: [0.72.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.1), [0.72.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.2), [0.72.3 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.3), [0.72.4 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.4), [0.72.5 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.5), [0.72.6 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.6), [0.72.7 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.7), [0.72.8 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.8), [0.72.9 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.9), [0.72.10 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.10), [0.72.11 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.11), [0.72.12 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.12), [0.72.13 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.13), [0.72.14 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.14).

### Version 0.71.6 (patch) | 2023-06-19
This version was released to the Vega mainnet by validators on 19 June, 2023.

This patch release contains a security vulnerability fix, a number of critical fixes and minor but important enhancements.

#### Security vulnerability

:::caution Security vulnerability
A security vulnerability was identified that allows a malicious validator (consensus or pending) to trick the Vega network into re-processing past Ethereum events from Vega’s Ethereum bridge. To find out more please see the [security advisory - GHSA-8rc9-vxjh-qjf2](https://github.com/vegaprotocol/vega/security/advisories/GHSA-8rc9-vxjh-qjf2). Please ensure, if running a node, the version has been upgraded to 0.71.6, in which the vulnerability has been fixed.
:::

#### Critical fixes

A fix has been implemented to avoid a potential division by 0 error when calculating the fees accrued by each party in the a market. If the total fees are 0, the protocol will now return 0 rather than trying to divide by 0 [8402 ↗](https://github.com/vegaprotocol/vega/issues/8402).

The orders subscription API was not emitting data for all active orders. When querying for some orders it would indicate that they have been updated, however, the message notifying the client that that order was updated was never received. This bug was resolved with [8414 ↗](https://github.com/vegaprotocol/vega/issues/8414).

On the 9th of May, the protocol processed an auto delegation where a party had increased their stake during the epoch. As they were eligible for auto delegation their new stake was auto delegated to the validators they already had stake to; this led to events in a random order across the different validators. The issue [8412 ↗](https://github.com/vegaprotocol/vega/issues/8412) fixes this bug.

The liquidation price estimate API now works when the open volume is 0 [8313 ↗](https://github.com/vegaprotocol/vega/issues/8313).

When creating database metadata on an empty database, the data node software was attempting to query timescale tables that did not yet exist. This fix returns an empty metadata object in this scenario. See [8226 ↗](https://github.com/vegaprotocol/vega/issues/8226).

Trying to view a transaction in the block explorer API returned an error. Replay protection is now available and fixes the problem as of [8358 ↗](https://github.com/vegaprotocol/vega/issues/8358).

A fix has been added to address an invalid auction duration for new market proposals. Auction durations now start from the closing time of the proposal, and run through until the proposal enactment time [8451 ↗](https://github.com/vegaprotocol/vega/issues/8451).

An issue that was spotted during a snapshot test run has been addressed so that all combinations of core state in any snapshots taken are valid when used to restore a node [8471 ↗](https://github.com/vegaprotocol/vega/issues/8471).

#### Enhancements

Since the deployment of the Alpha Mainnet release there has been some user feedback on improving the ledger entry CSV export. This has been carried out in [8353 ↗](https://github.com/vegaprotocol/vega/issues/8353).

Check out the full details in the Vega core [0.71.6 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.6) release page.

### Version 0.71.5 | 2023-05-26

Version 0.71.5 was released, by the validators, to mainnet on 26 May 2023.

Whilst investigating a failed withdrawal, a bug was identified in the Vega asset pool smart contract. This bug could cause assets to become stuck in the bridge and therefore required a rapid patch release. New versions of the bridge and asset pool contracts were deployed on the Ethereum mainnet and are in the control of the Vega network.

New bridge contracts:

- Bridge: `0x23872549cE10B40e31D6577e0A920088B0E0666a`
- Asset pool: `0xa226e2a13e07e750efbd2e5839c5c3be80fe7d4d`

Take a look at the [incident report](https://medium.com/vegaprotocol/incident-report-incident-under-investigation-d41cb2815de0) for information regarding the requirement for this patch release. Check out the full details in the Vega core [0.71.5 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.5) release page.

### Versions 0.54.0 through to 0.71.4 combined | 2023-05-09

Version 0.71.4 was released, by the validators, to mainnet on 09 May 2023.

This version brings the planned features for the alpha mainnet phase to mainnet, making the protocol ready to remove restrictions for the community to propose assets and markets. This deployment brings some key features built upon the restricted mainnet version:

**Data node network history**
In a similar way to core snapshots, the data node can now obtain data node history after downtime without the need to replay the chain. Nodes can reach out to peer nodes to fetch the most recent history, as well as older history if desired, such that it can quickly get itself up to the latest block height of the network and start to consume events for the latest block from the Vega core. This feature is key in speeding up time-to-be-operational for new nodes joining the network.
Take a look at the data node [network history ↗](https://github.com/vegaprotocol/vega/blob/develop/datanode/networkhistory/README.md) readme file for more information.

**Protocol upgrades using Visor**
Until alpha mainnet, an upgrade of the network had to be carried out with a network checkpoint restore. This required a synchronous restart, with all nodes having to be restarted within a short time period so all state could be restored from Ethereum, and the network could start correctly.

With the implementation of the protocol upgrade process, which Vega Visor can orchestrate, the network upgrades can be done in an automated manner. Validators can choose a software version and at a predetermined block height the upgrade will take place.
Read [the spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0075-PLUP-protocol_upgrades.md) to understand more about Visor and the protocol upgrade process.

**Spam protection improvements**
Mitigating the risk of spam on the Vega blockchain requires both active monitoring for spamming transactions and a rate-limiting mechanism to keep the blocks from becoming clogged with malicious transactions.

If a transaction requires data from the chain for it to be validated, the network defers any checks for validity until it’s executed, meaning it cannot exclude all spam transactions from a block. This means it is possible that one spammer could essentially fill a block.

In order to mitigate this, spam protection will remove the offending transactions after the block is scheduled, i.e., not process them. The state can then be updated once a block is finalised and block transactions are based on the new state. The protection can then delete transactions from every (honest) validator’s mempool based on the new state.

More information is available in the [spam protection concepts](../concepts/chain/network.md#spam-protection) pages.

**Freeform governance proposals**
Building on the governance features in restricted mainnet, the community can now propose freeform proposals. These differ from other proposals as when the enactment time comes, no changes are auto-enacted on the network if a proposal is successful. However, a record of how token holders voted will be stored on-chain and enactment will come at a future time, e.g., a code change that will come in a future deployment.

Find out more about [freeform ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0028-GOVE-governance.md#6-freeform-governance-proposal) governance proposals in the specs.

**Vega transaction gas costs and priorities**
Vega doesn't charge users gas costs per transaction. However, the system processing capacity is still limited; in order to ensure liveness, each transaction will have an associated gas cost. Each block will contain only transactions up to a certain block gas limit. Transactions with higher priorities will get scheduled first.
More information on transaction gas costs and priorities in the [Vega chain concept](../concepts/chain/transactions.md#filling-a-block-transaction-gas-value) pages.

**Vega wallet v2 APIs**
The Vega wallet APIs have been updated to version 2 and now offers JSON-RPC API support. This allows users and UIs to more easily interact with wallets and their keys, and sign and send transactions. This is the core of the wallet backend and is consistent across all implementations.
Find out more about the latest wallet API updates in the [API docs](../api/vega-wallet/reference/core/index.md)

**Migration from Tendermint to CometBFT**
The consensus layer has been migrated from Tendermint to [CometBFT ↗](https://github.com/cometbft/cometbft/). This change has been implemented in order to ensure that the consensus layer used by Vega remains in support and that Vega can leverage the benefits of future developments. To find out more about the successor to Tendermint check out [this blog ↗](https://medium.com/the-interchain-foundation/cosmos-meet-cometbft-d89f5dce60dd).

**Network wide limits**
Network wide limits are aimed at keeping the protocol performant and responsive as usage increases. Vega has been designed with low-latency in mind so that the responsiveness of the network doesn't unduly impact the user's experience. Furthermore, the current implementation relies on an interplay between the execution layer (core) and the data consumption layer (data node).

For more information on Network Limits see the [spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0078-NWLI-network_wide_limits.md)

#### Breaking changes and deprecations

:::caution Breaking changes
The changes below may affect any automations, scripts or workflows you'll have set up for Vega mainnet before this release. Review the following changes carefully.
:::

**Rename `marketId` and `partyId` in the orders queries' filter** [(v0.70)↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0700): To allow getting all orders for a single party or market so that users can more easily find their orders across multiple keys or markets, filtering on the orders endpoint has been enhanced. The API fields `party_id` and `market_id` have been changed to `party_ids` and `market_ids` respectively.

**Use nanoseconds for one-off transfers** [(v0.70)↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0700): The time input field now validates for nanoseconds, which is consistent with other inputs.

**Require slippage factors in market proposals** [(v0.69)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.69.0): When creating a new market proposal the `linear` and `quadratic` slippage factor fields have been changed from optional to required.

**Data node API rate limiting** [(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): Rate limiting has been introduced for the gRPC, REST and GraphQL APIs. Users will be warned, and where required, banned from submitting more requests. Should the user continue to breach the API rate limits, the ban length will increase exponentially.

**`IssueSignatures` command** [(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): The `IssueSignatures` command is no longer limited to validators, and can now be used by any member of the community. It is also now covered by spam protection rules.

**Removed: `Grpc-Metadata-` headers** [(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): The deprecated headers with the `Grpc-Metadata-` prefix in datanode API and REST and GraphQL gateways have been removed.

**Removed: Network API fields removed**[(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): Legacy fields from network API have now been removed.

**Deprecated: `X-Vega-Connection` HTTP header**[(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): The `X-Vega-Connection` HTTP header in data node API and REST and GraphQL gateways has been deprecated and will be removed in a future release.

**Removed: Wallet command removals** [v0.66 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.66.0): A number of the CLI wallet APIs have been deprecated. To find out how to see all the current CLI wallet commands please refer to the [CLI wallet documentation](../tools/vega-wallet/cli-wallet/guides/get-help.md).

**Renamed: Network parameter** [v0.66 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.66.0): The network parameter `stakeToCcySiskas` has been renamed to `stakeToCcyVolume`.

**Format change: triggering ratio parameter** [v0.66 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.66.0): The `triggeringRatio` field has been changed from `double` to a `string`. When proposing a market, using a float value would lead to a passing proposal, however the response from the APIs was incorrect. This has been resolved by changing the accepted data format.

**Market definition API** [v0.65 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.65.0): The market definition API has been extended with the new field for LP price range, this has resulted in a breaking change.

**Data source decimal places** [v0.65 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.65.0): The decimal places are now defined in the oracle data source and removed from the market definition resulting in a breaking change.

**Vega tools** [v0.62 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.62.0): The `vegatools` snapshot command has been updated to be consistent with other CLI options. The change also formats the json output so that it can be parsed and used programmatically.

**Data sourcing** [v0.61 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.61.0): The data sourcing types have been updated to account for multiple types of data in the future. Data types are generalised as much as possible, as in the future data will be sourced from more than the currently implemented 'price' data - this is now represented by the types `DataSpec` and `ExternalData`.

**Deprecation: Wallet API v1** v0.62: For most use cases, the v2 [wallet API](../api/vega-wallet/before-you-start.md) will soon be the only one available for interacting with the Vega Wallet. V1 will continue to be used for the testnet-only hosted wallet for testing and incentives, for slightly longer.

**Data node `init` now requires the `ChainID` parameter** [v.0.59 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0):
To share data across the network, all data nodes for a given network (chain) will be part of the same IPFS Swarm. The IPFS Swarm key is generated using the node's chain ID. Therefore, when initialising the data node, it is a requirement that the `ChainID` parameter is passed in the command.

**User can now specify a different passphrase when isolating a key** [v.0.59 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0):
To harden the security of Vega key management for node operators, a different passphrase can be used to protect an isolated wallet. This ensures that the risk of the "full" wallet's passphrase being exposed is minimised. Before this change, when isolating a wallet, its passphrase was inherited from the original wallet, and there was no option to choose a different one.

**Output from nodewallet reload is now more useful JSON** [v.0.59 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0):
The output from `vega nodewallet reload --output=json` was not structured in a manner that was easy to use. This change creates a better UX for anyone interacting with the JSON output of the command.

**Renamed API: get bundles function `GetMultiSigSigner` to `ListMultiSigSigner`** [v.0.59 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0):
In order to be consistent with v2 APIs and return context aware results, the get bundles API function name has been changed from `GetMultiSigSigner` to `ListMultiSigSigner`.

**Swap places of PID and date in log files in the wallet service** [v.0.59 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0):
Before the implementation of this change wallet log files were named with the PID first e.g. `47060-2022-10-13-19-49-02.log`. This makes log files easy to search for if you have the PID but less so if you do not. In order to be able to easily sort the log files by date the file format name has been changed to start with the date e.g. `2022-10-13-19-49-02-47060.log`.

**Renamed API: Balance history** [v.0.59 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0):
The API field `GetBalanceHistory` has been renamed to `ListBalanceHistory` and has had improvements in the documentation to help users understand APIs the 'grouping' feature. This change also fixes an issue with leaking account IDs.

**Negative position decimal places for market** [v.0.59 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0):
In order to maintain spam protection, a market with a price of 10^-3 should only allow the smallest position of something like 10000 so the position decimal places would equal -4 meaning an order size of 1 => 10000.

**Renamed API: settlement price decimals** [v.0.58 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.58.0):
The market proposal (data source) field `settlementPriceDecimals` was changed to `settlementDataDecimals` to be future-proofed for when settlement data isn’t just driven by prices. To ensure consistency throughout the APIs the field `oracleSpecForSettlementPrice` has now also been changed to `oracleSpecForSettlementData`.

**Require signature from new Ethereum key to validate key rotation submission** [v.0.58 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.58.0):
To ensure that a compromised old key cannot validate a key rotation, a new CLI command has been introduced to send in an Ethereum key rotation submission that contains a signature generated with the new Ethereum key.

**Improve the estimate fee and margin APIs** [v.0.58 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.58.0):
The changes implemented to improve the estimate fee and margin APIs now mean that you only have to pass in the actual parameters required for the estimation calculation. This change also makes the required parameters mandatory.

**Wallet improvements** [v.0.58 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.58.0):
The approve/reject transaction interaction has been updated to accept a "mode" instead of a simple boolean. The boolean has changed from `yes` | `no` to mode `APPROVED_ONLY_THIS_TIME` | `REJECTED_ONLY_THIS_TIME`.

Whatever the state of the sent transaction, the `TransactionStatus` was updated with an `error` field that was filled on error, and a transaction hash field that was filled on success. To create a better developer experience this has been split in two distinct notifications: `TransactionFailed` with the `error` field, and `TransactionSucceeded` with `txHash` field.

To make the framework clearer, the name `pipeline` has been updated to `interactor`.

**Changing clef address requires re-importing config** [v.0.57 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.57.0):
The `Nodewallet.ETH` section of the config has been removed, and as a consequence some CLI arguments have changed when using clef. Before, when starting a Vega node with a clef wallet, Vega would read whatever clef address was in nodewallet.ETH, whereas after this change, the network will only ever use the value set for the clef address when the key was imported/generated.

**Fork: Clef forked so signatures are readable** [v.0.57 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.57.0):
When a clef wallet was used with a validator node, the validator heartbeats sent out, signed by the clef wallet, could not be verified when received by the network. This was being caused by the message being hashed clef before signing when using clef for validator heartbeats. The Vega team has created a fork of the Clef software to resolve this issue. This was done under issue [6187 ↗](https://github.com/vegaprotocol/vega/issues/6187)

**Removed: Clean up unused network parameters** [v.0.57 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.57.0):
A number of network parameters have been replaced or removed as they were not required.

**Renamed fields: settlement price data** [v.0.56 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.56.0):
To ensure that the settlement API field name can scale to non-cash products, for example, where settlement data is not necessarily a price, the API field name has been changed from `SettlementPriceDecimals` to `SettlementDataDecimals`.

**Renamed API: Positions WebSocket** [v.0.56 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.56.0):
To ensure clarity of the positions subscription API the field name `Position` has been updated to `PositionUpdate`.

**Use the latest local snapshot as default behaviour when restarting a node** [v.0.55 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.55.0):
The best experience for restarting a node is to load from the highest possible block before the node was stopped. This is most important when a node was started using state-sync and the tendermint block store does not contain enough history to replay the chain from block zero. To avoid any issues with not being able to reply from block zero, the default behaviour is now to always start from the most recent local snapshot.

**Vega as a built-in application** [v.0.54 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.54.0):
Vega is now a built-in application. This means that Tendermint does not need to be started separately, providing a simpler, streamlined user experience for node operators. This introduces some breaking changes to the commands used when running a node:

- The `vega node` command has been renamed to `vega start`.
- The `vega tm` command has been renamed to `vega tendermint`.
- The `Blockchain.Tendermint.ClientAddr` configuration field has been renamed to `Blockchain.Tendermint.RPCAddr`.
- The `init` command now also generates the configuration for tendermint, and also has the newly introduced flags `--no-tendermint`,` --tendermint-home` and `--tendermint-key`.

**Removed: Wallet support for launching a proxy in front of dApps** [v.0.54 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.54.0):
Introducing the proxy was a way to navigate the browser security that prevents web apps from being able to talk to local web servers; this is now no longer required and therefore has been removed.

### Versions 0.53.1 and 0.53.2 combined | 2023-03-22
This version was released, by the validators, to mainnet on 22 March 2023.

This deployment addresses a critical mainnet issue. A bug has been identified that caused a network outage at the time that the protocol was promoting a new validator to consensus validator status. The issue was caused by insufficient validation of the Tendermint public keys specified in the `announce node` command.

The fix introduced both resolved the issue and enhances the validation so that this cannot be repeated again.

To find out more please see the issue [7936 ↗](https://github.com/vegaprotocol/vega/issues/7936) and the [incident blog ↗](https://blog.vega.xyz/incident-report-validator-nodes-down-in-mainnet-2ac2f724d67e)

### Versions 0.53-0.51 | 2022-08-15
This version was released, by the validators, to mainnet on 15 August, 2022.

#### 0.53.0 (14 July 2022)

**Smart contract upgrade:**
With the upgrade of the network to version v0.53 there was upgrade of the smart contracts. The multisig control contract and the collateral bridge will thus increase users' control over the funds they deposit (opt-out) and include performance improvements, such as decreasing gas cost when using the bridge. The Vega asset pool contract will not be upgraded. Once the new contracts are properly set up on Ethereum, the validators will migrate the asset pool to use the new contracts.

**Checkpoint commands:**
From version 0.53.0, checkpoints are always loaded via the genesis. To facilitate this the  `--genesis-file` option has been added to the `load_checkpoint` command.

With the introduction of this, the restore checkpoint command has now been deprecated and removed.

**Vega wallet in core repo:**
The core and Vega Wallet codebases have been unified. This reduces the risk that core and Vega Wallet software changes get out of sync. Users of the CLI wallet app can easily confirm if the version of their wallet is compatible with  the core Vega software version as they will be built and released together, and thus have the same version number.

In the short term, the CLI wallet app will still be available to download from the Vega Wallet repo, but it will not be supported for future releases.

**Decentralised validator selection bug:**
During the testing of the decentralised validator selection feature, a bug was found whereby if the network parameter that controls the number of ersatz validators is reduced in the same epoch that an ersatz validator is promoted, the network could be left with a node set where the actual number of ersatz validators was greater than the total allowed number. A fix has been implemented to handle Tendermint demotion and ersatz slot reduction at the same time and keep true to the configured network parameter values.

**PostgreSQL database:**
**Find out how to run a data node with Postgres in the [data-node readme](https://github.com/vegaprotocol/data-node/blob/v0.53.0/README.md).**

As of version 0.53, data node uses [PostgreSQL](https://www.postgresql.org) as its storage back end instead of the previous mix of in-memory and BadgerDB file stores. We also make use of a Postgres extension called [TimescaleDB](https://www.timescale.com), which adds a number of time series specific features.

Postgres is not an embedded database, but a separate server application that needs to be running before a data node starts. A side effect of this transition is a little bit of setup is required by the data node operator. By default, data node will attempt to connect to a database called `vega` listening on `localhost:5432`, using the username and password `vega`. This is all configurable in data node’s `config.toml` file.

We are developing using `PostgreSQL 14.2` and `Timescale 2.6` and _strongly recommend_ that you also use the same versions. For more information see the **[data-node readme](https://github.com/vegaprotocol/data-node/blob/v0.53.0/README.md)**.

**Critical bugs resolved:**
Collateral checkpoint locked global reward balance:
With the deployment of version 0.50.3 a new format for the account owner of the global reward account was introduced. When the mainnet was upgraded, the above was interpreted as a general party account rather than the newly formatted global reward account. As such, a balance of 21500 VEGA became locked in an account that is no longer accessible. To resolve this issue and recover the trapped VEGA, when the checkpoint is read, and on discovery of an old account format, the balance is transferred to the relevant new reward account. Full details can be seen in issue [5546](https://github.com/vegaprotocol/vega/issues/5546)

**Unable to query the VEGA asset due to large quantum:**
Part of testing the network version compatibility is to deploy the latest version of the software using a mainnet checkpoint file. During this test it was found that the VEGA asset could not be found in the data-node via the assets API. To resolve this issue support was introduced in the data-node for large integers for the asset quantum. Full details can be seen in issue [782](https://github.com/vegaprotocol/data-node/issues/782)

**Incorrect prices returned from depth endpoint in data node API:**
The depth value in the data node API appeared to occasionally become desynchronised from the 'true' prices. This was observed on testnet when a market’s prices of the 'bids' values were much higher than those of 'ask' and did not tally with values from best bid/ask.

In V1 of the data node (which will be replaced with V2) there is a check which relies on the Vega time (block time) being correctly set. However, as the V1 broker is multi-threaded per event type, there is no guarantee that the time event that sets the Vega time will arrive at the market depth subscriber with the orders to which the time corresponds. This change sends the Vega time of the block along with the order event in the V1 broker to ensure that a correct sequence number is generated for each order event.

Note: this issue affects the V1 APIs which will be deprecated and replaced by V2 which is single threaded and thus could not have this bug.

**Event subscriptions for orders was broken:**
When placing an order the orders subscription correctly emits an update for the newly created order. However, the bus event subscription did not emit the expected event. The fix for [719](https://github.com/vegaprotocol/data-node/issues/719) (market depth in data-node V1 incorrect due to race condition) changed the type of the order event such that it no longer implemented these interfaces (no code broke as the check is dynamic), and this prevented the event bus from sending events using the party and market filters.

Full details can be seen in issue [730](https://github.com/vegaprotocol/data-node/issues/730)

#### 0.52.0 (15 June 2022)
**Spam protection updates:** Until version 0.52 any changes to the proof of work network parameters would take effect immediately, which resulted in changes being enforced on transactions that were generated on blocks preceding the current one. This is not desired because someone may have prepared multiple transactions for a block before the changes were applied, which would then be rejected.

To ensure that this does not affect existing transactions the protocol verifies proof of work with the parameters as they were configured at the time of the block of the transaction.

#### 0.51.2 (10 June 2022)
Version 0.51 of the Vega software implements some key changes to the features of governance and rewards as well as smart contracts. In addition, work continues on the data-node to transition to the time-series `PostGres` data storage and the migrated APIs which will help the data-node scale as usage increases on the network.

**Breaking change - asset governance:** In release 0.51.2, a breaking change has been introduced that may affect governance proposals that refer to assets. The function used to request the asset bundle before proposing an asset has been renamed to be clearer, as in the future there will be an option for removing assets.

The following method names have been updated:
* `GetERC20AssetBundleRequest` is now `GetERC20ListAssetBundleRequest`
* `GetERC20AssetBundleResponse` is now `GetERC20ListAssetBundleResponse`

**Breaking change - governance:** There has been a breaking change made to the governance process. A rationale is now required for all governance proposals. Every proposal transaction must contain a link to a text file in markdown format which summarises the proposed change and links back to the complete proposed change.

**Smart contract allow-listing:** The `MultisigControl` smart contracts have been updated to permit allow listing oneself to deposit above the specified deposit limits. This change both ensures that there are steps to protect users of the network during the early period of trading being enabled and also gives control to the user to allow list themselves if they understand the risks.

The contract changes have recently been through an audit of which the final version will be published alongside the deployment of the contracts into testnet. As confidence in the network is established, it is expected that governance proposals will be made to increase the deposit limits.

**Rewards:** To enable giving rewards in arbitrary tokens that may not necessarily be the settlement asset for a given market or the Vega governance token, changes have been implemented to enhance recurring transfers to reward accounts.

When transferring to a reward account, it is possible to define the reward metric, the reward metric asset, and a subset of markets. Should a market not be defined when initiating the transfer the protocol proceeds with all the markets that settle in the reward metric asset.

**Snapshots:** A snapshot is generated every N blocks, and that information is stored in a `GoLevelDB` file on the local file system. By default a node will always start up in normal mode in which it connects to Tendermint and replays any historic blocks before catching up and running at the same pace as the existing nodes on the network.

The snapshot system will keep by default 10 versions of the snapshots. When it has created 10 it will remove the oldest each time it creates a new snapshot. Extensive testing of snapshots has been conducted and is ready for use by the validators for stopping and starting nodes.

There has also been an array of fixes implemented for snapshots that ensure that a node restored from a snapshot always maintains consensus.

### Versions 0.50.4 | 2022-06-29
This release was shared with validators on 29 June, 2022. The validators released it to the mainnet network on on 30 June, 2022.

This is a patch release to address two high priority bugs seen in version 0.50.3.

A critical defect was identified on mainnet 0.50.3 where some staking events on Ethereum were replicated multiple times on Vega. During investigations it was identified that some validators were still running their event forwarder as an external service, which forwards events in a slightly different format, meaning those events were not successfully deduplicated. The defect that made it non-deterministic and not successfully deduplicate has now been resolved in [5510](https://github.com/vegaprotocol/vega/pull/5510) - fix: dedupe sorting made consistent

When restarting from a checkpoint file during the 0.50.3 deployment, at the end of the epoch the reward was paid as expected. However, the `rewardScore` field for the validators in that first epoch was missing in GraphQL. For all following epochs the `rewardScore` field was present as it should be. The cause was identified: when the core emits the event at the end of the first epoch, after the checkpoint restart, it was emitted with the wrong epoch sequence. This has now been resolved in [5515](https://github.com/vegaprotocol/vega/pull/5515) - fix: emit `rewardScore` correctly when loading from checkpoint

For full detailed information on the changes please see:
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/release/v0.50.4/CHANGELOG.md#0504)

### Versions 0.50.3-0.49.8 combined | 2022-04-27
This release was shared with validators on 27 April, 2022. The validators released it to the mainnet network on 22 June, 2022.

The primary focus of this and the next upcoming releases has been to complete the final remaining features, progress data-node improvements for scalability and to add test coverage and fix bugs.

Note: While many of the features below are related to trading, it is not yet enabled on mainnet.

**Proposals to change market parameters**: After a market has been proposed and enacted, changes to the market parameters can be proposed in a different governance action. Tokenholders will be able to submit proposals to change market parameters.

To change any market parameter, the proposer will submit the same data as if they were to create a market, except for the liquidity commitment, however this submission would contain the desired updates to the fields / structures that they wish to be changed. Some of the market parameters will not be able to be changed: market decimal places, position decimal places, settlement asset and the market name.

Read more:
* [Market framework spec](https://github.com/vegaprotocol/specs/blob/master/protocol/0001-MKTF-market_framework.md#market)
* [Change market parameters](https://github.com/vegaprotocol/specs/blob/master/protocol/0028-GOVE-governance.md#2-change-market-parameters)

**Spam Protection**: This release introduces a rate-limiting scheme to prevent clients from attacking the network by spamming the network with requests. Unlike many other systems Vega does not charge a transaction fee; fees are only charged on trades. To prevent spamming, there is a client-side Proof of Work (PoW) mechanism required along with all transaction submissions. The difficulty of the PoW puzzle can be adjusted by governance, and is low for most use-case scenarios. It is automatically increased if a single client submits an abnormal number of transactions.

This rate-limiting is based upon a client-side PoW which is quite different from the PoW term predominantly used for proof-of-work blockchains and associated with high energy consumption.

Read more: [Spam protection POW](https://github.com/vegaprotocol/specs/blob/master/protocol/0072-SPPW-spam-protection-PoW.md)

**Checkpoint Improvements**: Checkpoints have been simplified. Before, validators would have to have a synchronisation period between nodes in order to reconcile the state from Ethereum when restarting the network from a checkpoint. This was due to the fact that the validators and staking balances were not stored in the checkpoint files.

This data is now stored in the checkpoints, which means that it is now possible to restart from checkpoints asynchronously, which removes the synchronisation period (when feasible). This will become especially important as validator numbers increase and the network sees validators joining and leaving based on stake.

**Add Ethereum key rotation support**: Vega now supports validators rotating their Ethereum keys. Ethereum keys are required so that validators can allow deposits and withdrawals via the Ethereum bridge. The controller of the bridge is a multisig bundle, and periodically validators will want to change their keys but still be part of the controlling group. This feature allows them to do this with a new transaction type.

Read more: [Key management](https://github.com/vegaprotocol/specs/blob/master/protocol/0067-KEYS-key_management.md)

**Liquidity Provision Improvements**: Over the last month, the project team has been running a number of community incentives, including around liquidity provision. A number of bugs and enhancements have been introduced as a result of the incentive. These include:
* In some cases, amending liquidity orders triggered a liquidity auction. This was due to the fact that an order amend was effectively equivalent to a cancel and submit. During investigations it was found that if there was only 1 order on either side of the book, amending it would trigger an auction because, temporarily, there were no orders left
* A fix has been implemented to ensure that the margin is correctly released when an LP order is cancelled
* With the introduction of the market decimal places feature (see below), an issue was found related to decimal places and price bounds. This fix ensures that LP orders are adjusted to the min/max price according to the market precision

**Tendermint**: The current version of Tendermint being used by Vega has a bug where a transaction would pass `checkTx` but was never added to the memory pool. Tendermint has fixed the bug and the protocol is now able to use `sendTx` sync successfully. Therefore, if any transactions are rejected by the memory pool an error is raised to indicate why this has happened.

**EEF internalising**: The Ethereum Event Forwarder is functionality inside Vega that allows the network to be aware of activity on the Ethereum network. When the forwarder service is aware of events, such as the staking or unlocking of tokens, it translates and passes the events to the tendermint blockchain in Vega. Originally this was deployed as a single service alongside the Vega node, with the node needing to be configured to accept events from the forwarder service. This has now been rewritten and internalised into the Vega node, which simplifies the configuration of running a Vega node and makes it easier to deploy. Other benefits of doing this include it being easier to maintain and add future enhancements, which will be described in future release notes.

**Data node**: In order to have a scalable solution for accessing data, work has begun on migrating the datastore into a postgres with time-series database. Migrations of assets, accounts, markets, market data, orders and trades have been done. The changes have been made to the codebase and live in parallel with the existing solution. As the remaining APIs are migrated and testing is completed, the old datastore and APIs will be removed.

**Market decimal places**: In this release, the protocol now makes it possible to configure a market for which orders can only be priced in increments of a specific size. This is done by specifying a different (smaller) number of decimal places than its settlement asset supports. To explain this, consider a market that settles in GBP. This market can now be configured to have 0 decimal places so that the price levels on the orderbook will be separated by at least £1, rather than the default £0.01.

Read more: [Market decimal places](https://github.com/vegaprotocol/specs/blob/master/protocol/0070-MKTD-market-decimal-places.md)

**Offsets for pegged and liquidity commitment orders**: The numbers used to offset how far from the reference price a pegged and liquidity provision order (respectively) can now only be input as positive. Whether they need to be added or subtracted from the price will be dependent on the order side.

Read more: [Pegged orders](https://github.com/vegaprotocol/specs/blob/master/protocol/0037-OPEG-pegged_orders.md)

**Liquidity provision improvements**: The `LiquidityProvisionSubmission` API was used for submitting, amending and cancelling liquidity provision.  To both simplify the code and have a more explicit user experience a breaking change has been implemented to split these into three API commands.

**Floating point determinism**: Computations within a blockchain-based system need to be deterministic as the application state between nodes replicating it can start to differ potentially resulting in consensus failure. The protocol has been improved so that if the system has a differing floating point value there is a resolution strategy to reach consensus on the value that should be used. This is key due to the fact that validators will be running different hardware that could increase the chances of this happening.

Read more: [Floating point consensus](https://github.com/vegaprotocol/specs/blob/master/protocol/0065-FTCO-floating_point_consensus.md)

**Snapshots**: In order to simplify and streamline the process for both restarting or adding a node on the Vega network, the snapshot feature has been implemented. To allow a Vega node to be restarted or join without the need to replay the whole blockchain, a Vega node can load an existing snapshot. Snapshots contain all the network state required to start a node; nodes can use a snapshot stored locally or one created by a different node in the network. Starting a node using a snapshot populates all the state inside the core as if the core had processed the historic blockchain. The node can then start or resume listening to blocks after the snapshot until it gets to the live block height where it will be classed as a normal contributing node. This is a key feature to both ensure the constant availability of the network and for decentralisation.

**On-chain treasury**: This release also sees the introduction of the on-chain treasury. This is a series of, per asset type, accounts that allows the transfer of the reward types that will be seen when trading is enabled. Part of this change has seen the enabling of transfers between wallets, this allows the reward accounts in the treasury to pay out rewards. With these recurring transfers the reward pools will be distributed in full each epoch. This means that the network parameters for fractional payout and payout delays will be removed. Rewards will be distributed to those staking and providing liquidity, first on testnet, and soon it will be available as a feature validators can release on mainnet.

An on-chain treasury, per asset type, has been implemented where the balance of the insurance pool is transferred when the market closes. To enable this transfers between Vega Wallets has been enabled, this not only is a feature of the on-chain treasury/rewards system but also allows people using the protocol to be able to transfer assets between wallets. With this feature there have been other changes around the rewards system meaning the full amount of the global reward pool will be distributed in all assets at the end of each epoch.

Read more:
* [On-chain treasury](https://github.com/vegaprotocol/specs/blob/master/protocol/0055-TREA-on_chain_treasury.md)
* [Transfers](https://github.com/vegaprotocol/specs/blob/master/protocol/0057-TRAN-transfers.md)

**Validators joining and leaving, and standby validators**:
In addition to the consensus validators, there is now functionality on testnet to allow a set of ersatz, or standby validators. These are validators that will  not contribute to the chain, but are on standby to jump in if a current validator drops off or their performance drops below a certain threshold. In order to be considered as an ersatz validator, the node operators need to meet certain criteria, including a minimum self-stake as well as stake nominated by other token holders.

Note: The network will be set to allow 0 standby validators for alpha mainnet, and increase the validator numbers via governance as early alpha mainnet progresses.

Read more: [Validators chosen by stake](https://github.com/vegaprotocol/specs/blob/master/protocol/0069-VCBS-validators_chosen_by_stake.md)

For full detailed information on the changes please see:
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0502)
* [Data node change log](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0500)

#### Breaking changes
- Separate endpoints for liquidity provision submissions, amendment and cancellation
- Disallow negative offset for pegged and liquidity provision orders
- Add ranking scores and reward score to node
- Proposals have a new field for the rationale, which is optional for now but will be mandatory in a future release
- Add support for fractional order sizes
- Add more data to submit transaction endpoints
- Scale settlement price based on oracle definition
- Restructure Ethereum Config to separate staking and vesting contract addresses, plus add block height at which they have been added respectively
- Rework free form proposal protos so that they align with other proposals
- Add support for decimal places specific to markets. This means market price values and position events can have different values. Positions will be expressed in asset decimal places, market specific data events will list prices in market precision
- Remove tick size from market
- Remove maturity field from future
- Remove trading mode one-off from market proposal

### Versions 0.46.0-0.47.6 combined | 2022-01-11
This release was shared with validators on 11 January, 2022. Validators released it to the mainnet network on 31 January, 2022.

A key theme of this combined release has been improvements to the checkpointing feature; this includes fixes to ensure epochs and other key data is preserved as they should be during checkpoint restarts. In addition to this, the “free-form governance” feature has been implemented. This feature further decentralises the protocol by allowing users to submit a range of governance proposals for community consideration and voting.

The protocol calculates a validator score for each validator. This score is used to set their voting power in Tendermint and determine their reward amounts. The changes introduced in this release mean that the protocol no longer prevents users from delegating to any node, however, an overcrowded node will impact the validator score thus affecting rewards. Further scoring of performance measurements in future releases will bring with it the mechanism to adjust rewards in reflection of validator performance in the network. This is another step in getting the network more decentralised, and open to new validators joining the network.

A “null blockchain” implementation of the protocol has been created. Whilst this has no impact on the validators running the nodes, or users using the network, it’s an important part of our future testing, and validation of the protocol strategy. In fact it’s the first step into building an integrated tool, or suite of tools, in order to simulate networks in various conditions.

For full detailed information on the changes please see:
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0476)
* [Data node change log](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0471)

### Version 0.45.6 | 2021-12-22
For full detailed information on the changes please see:
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0456)

### Version 0.45.4 | 2021-11-05
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0454)

### Versions 0.45.0-0.45.2 combined | 2021-10-27
For full detailed information on the changes please see:
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0452)
* [Vega data node change log](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0451)

### Version 0.44.1 | 2021-10-08
For full detailed information on the changes please see:
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0441)

### Version 0.44.0 | 2021-10-07
For full detailed information on the changes please see:
* [Vega core change log](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0440)
* [Vega data node change log](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0440)