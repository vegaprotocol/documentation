---
title: Vega software releases
hide_title: false
---
import Topic from '/docs/topics/_topic-development.mdx'

<Topic />

The Vega software is publicly available on [GitHub ↗](https://github.com/vegaprotocol). Below find summaries of key released features and breaking changes, as well as links to release notes in GitHub.

[**Vega core software**](#vega-core-software) - Below, find a summary of each version's features and breaking changes.

See the full release notes on [GitHub ↗](https://github.com/vegaprotocol/vega/releases).

<!--[**Governance dApp on GitHub** ↗](https://github.com/vegaprotocol/frontend-monorepo/releases) - The Governance dApp, which provides an interface for interacting with governance proposals, VEGA tokens, and staking to validators; Console, a trading interface; and the Vega Block Explorer are open-source and you see more about them in the frontend monorepo.-->

[**Vega Capsule on GitHub** ↗](https://github.com/vegaprotocol/vegacapsule/releases) - Vega Capsule, which lets you create an instance of the Vega network on your computer to experiment with using the protocol, is public and you can read the contents of each release on GitHub.

## Vega core software
The Vega core software is public on a business-source licence, so you can both view the repository change logs, and refer here for summary release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

### Pre-release version 0.73.6 (patch) | 2023-11-22
Version 0.73.6 was released to the Vega testnet on 20 November, 2023.

This release contains a protocol optimisation required as a result of  the following [mainnet incident ↗](https://medium.com/vegaprotocol/incident-report-forwarding-events-from-ethereum-a384fc35fbdf) raised on the 21st November 2023 regarding the forwarding of events from Ethereum.

Check out the full details of what is contained in the patch release in the Vega core [0.73.6 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.6) release page.

### Mainnet incident - protocol optimisation

The mainnet incident was resolved without any code change, however, the Vega project team identified improvements to reduce the Ethereum RPC load and minimise the chance of future similar incidents given their impact. The improvements, of adding metrics and reducing the amount of requests sent to the Ethereum RPC, were done under the following [issue](https://github.com/vegaprotocol/vega/issues/10153).

### Pre-release version 0.73.5 (patch) | 2023-11-20
Version 0.73.5 was released to the Vega testnet on 20 November, 2023.

This release contains a number of critical fixes required as a result of testing feedback after the 0.73 deployment.

Check out the full details of what is contained in the patch release in the Vega core [0.73.5 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.5) release page.

### Critical fixes

An issue was noticed affecting perpetual markets when the market doesn't have at least 1 of each price observation (internal and external). When this occurs the funding payment doesn't get exchanged, however, the Margin Estimate assumes it has exchanged and thus provides and incorrect estimate for the side due to make the payment. This issue was resolved in 3 pull requests [10119 ↗](https://github.com/vegaprotocol/vega/pull/10119), [10121 ↗](https://github.com/vegaprotocol/vega/pull/10121) and [10124 ↗](https://github.com/vegaprotocol/vega/pull/10124).

During a [Market Simulation ↗](https://github.com/vegaprotocol/vega-market-sim) fuzzing test, when sending a batch market transaction, a bug was identified where it crashed the network. This was found to be an invalid stop order without a rises-above or falls-below that causes the count of how many pre-generated IDs required to fall out of sync. This was resolved in the pull request [10070 ↗](https://github.com/vegaprotocol/vega/pull/10070)

When carrying out some testing of `StopOrdersSubmission` in batch proposals it was found that sending this proposal without any values crashes the data node. The investigation found this to be a nill-pointer panic and this bug was fixed in the pull requests [10126 ↗](https://github.com/vegaprotocol/vega/pull/10126)

An issue with the GraphQL `LedgerEntries` API was identified resulting in the query failing if `TransferType` filter is specified. On investigation the API worked as intended however, the error message was misinforming users. The error message has been improved and the API documentation made consistent between the gRPC and GraphQL APIs. This bug was fixed in the pull requests [10117 ↗](https://github.com/vegaprotocol/vega/pull/10117)

### Pre-release version 0.73.4 (patch) | 2023-11-10
Version 0.73.4 was released to the Vega testnet on 10 November, 2023.

This release contains 2 fixes required as a result of testing feedback after the 0.73 deployment.

Check out the full details in the Vega core [0.73.4 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.4) release page.

### Critical fixes

An issue with the entry price value seen on the positions API was reported. The average entry price from the positions API is flickering - it sometimes briefly changes to read an incorrect value - thus impacting users of the API. This was resolved in this [pull request ↗](https://github.com/vegaprotocol/vega/pull/10037).

The list ledger entries API failed when pagination was provided. The query had been updated to use `ledger entry time` instead of Vega time, but the cursor for filtering did not recognise `ledger entry time`. This was resolved in this [pull request ↗](https://github.com/vegaprotocol/vega/pull/10043).


### Pre-release version 0.73.3 (patch) | 2023-11-09

Version 0.73.3 was released to the Vega testnet on 09 November, 2023.

Check out the full details in the Vega core [0.73.3 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.3) release page.

### Critical fixes

Shortly after the 0.73.1 release a user reported that immediately after trade the PnL shown in Console would flicker, affecting both realised and unrealised PnL. This was resolved in [pull request ↗](https://github.com/vegaprotocol/vega/pull/9959).

### Pre-release version 0.73.2 (patch) | 2023-11-01

Version 0.73.2 was released to the Vega testnet on 01 November, 2023.

This release contains 3 fixes required as a result of testing feedback after the 0.73.1 deployment.

Check out the full details in the Vega core [0.73.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.2) release page.

### Critical fixes

A number of liquidity providers reported that they had been penalised incorrectly after the migration of LP orders from the old mechanism to the new SLA liquidity mechanism. It was found that the default parameter changes were not being published to the markets on restart, this was resolved in [commit ↗](https://github.com/vegaprotocol/vega/commit/53b2b19cbf462963532d115a4b4b4605125944da).

Due to this issue, bond penalties were temporarily disabled and will allow 7 epochs for LPs to adjust to the new SLA liquidity. This was introduced in this [commit ↗](https://github.com/vegaprotocol/vega/commit/8866cf289d7a99269a91caf16ee238db4a420414). This code will be removed in a future release.

An issue with governance transfers was reported whereby the default parameter values were incorrect. This [commit ↗](https://github.com/vegaprotocol/vega/commit/3f344142c465b279345c9f1e8c9aef66dbd9f086) sets the default values correctly.

## Pre-release version 0.73 | 2023-09-20
This version was released to the Vega testnet on 20 September 2023.

This pre-release contains several new features, including the new product type perpetuals, Ethereum oracles and a refactored liquidity mechanism.

### Breaking changes

The snapshot configuration `load-from-block-height` no longer accepts -1 as a value. From 0.73.0 onwards, the value of 0 must be used to reload from the latest snapshot. Along with this change the snapshot configuration `snapshot-keep-recent` only accepts values from 1 to 10 inclusive. These changes have been included in the issue [8679 ↗](https://github.com/vegaprotocol/vega/issues/8679) and are documented in [0.73 deployment instructions](../node-operators/migration-guides/upgrade-node.md).

The `AssetID` field on the `ExportLedgerEntriesRequest` gRPC API, for exporting ledger entries, has had its type changed in order to make it optional. This change has been included in the issue [8944 ↗](https://github.com/vegaprotocol/vega/issues/8944)

### New features

#### New liquidity mechanism

At a high level, this change replaces the legacy system that requires LPs to be on the book all the time. The new implementation, called SLA liquidity can be summarised as follows:

- LPs that meet an SLA (i.e. % of time spent providing their liquidity obligation within a range) are rewarded.
- LPs that have a better performance against the SLA receive more rewards, ensuring there is an incentive to do more than the bare minimum if market conditions allow.
- LPs that commit and do not meet the SLA within the LP price range will lose fee revenue and have a sliding penalty applied to their bond account, depending on if their underperformance continues.

**How this is different:**

In the previous liquidity model, providers would make a commitment and define a “shape” in their liquidity provision order. Any of their commitment volume that wasn't on the book from limit orders would be filled by orders that were automatically deployed based on the shape they defined. In this release, “shapes” are being removed and providers will now be required to deploy their own orders to fulfill their liquidity obligation.

**What to expect during the migration:**

- All existing orders deployed as a result of the LP shapes will be canceled immediately.
- Any active liquidity provision orders will be converted to align to the new liquidity protocol implementation by removing the definition of the buy / sell shape.

- Default values for the new liquidity network parameters will be applied, as follows:

| Network parameter | Default | Description |
| ----------- | ----------- | ----------- |
| market.liquidity.sla.nonPerformanceBondPenaltySlope | 1 |  Not meeting the SLA deprives an LP of liquidity fee revenue, and a sliding penalty is applied. How much penalty is based on the value of this network parameter. |
| market.liquidity.sla.nonPerformanceBondPenaltyMax | 0.05 (5%) | Defines the maximum penalty on that sliding scale that will be applied to the liquidity provider’s bond account if they do not meet SLA.
 |

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
To allow existing users of the protocol/community members to refer new users, the on-chain referral program lets participants enact and vote for a program that provide benefits for referrers and referees.

A party will be able to create a referral code and share this code with referees. Referees who apply the code will be added to the referrer's "referral set".

Whilst a referral program is active, the following benefits may be available to participants in the referral program.

- A referrer may receive a proportion of referee's paid fees as a reward.
- A referee may be eligible for a discount on fees they incur.

Providing a party has been associated with a referral set for long enough, they will become eligible for greater benefits as their referral set's running taker volume increases. To see more details check out this [spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0083-RFPR-on_chain_referral_program.md). The work items completed on this feature can be seen on issues and pull requests with the [`referral ` ↗](https://github.com/vegaprotocol/vega/issues?q=is%3Aclosed+label%3Areferral+) label.

#### Changes to reward framework
This release introduces locking and vesting for all rewards accrued, including trading, validator score, and staking rewards. Those rewards will go into a [vesting account](../concepts/trading-on-vega/discounts-rewards.md#how-rewards-are-paid), and can be redeemed on a per-epoch basis. Some rewards may be locked for a number of epochs before they begin vesting, this is defined in each reward pool's funding transfer and may differ for each type of reward.

The initial base rate for vesting will be 25%, meaning 25% of your unlocked pool will vest every epoch. This is set in a network parameter and can be changed by the community through governance. At release time, there is no vesting period for staking rewards, and they will be available to transfer from the vested account to general account as they accrue.

The vesting rate can also be accelerated for faster vesting by keeping rewards in the vesting account, and gaining access to vesting benefit tiers if these are defined and enabled by the community. This is disabled at launch and controlled by governance.

#### Expanded reward opportunities
Trading rewards have increased to include 3 new reward types, and validator node operators can also benefit from a new reward.

See details on the [trading rewards page](../concepts/trading-on-vega/discounts-rewards.md#trading-rewards) and the [validator rewards page](../concepts/vega-chain/validator-scores-and-rewards.md#validator-metric-based-rewards).

## Pre-release version 0.72.5 | 2023-07-20
This version was released to the Vega testnet on 20 July, 2023.

This pre-release contains several new features, including the ability to propose successor markets, submit stop orders, submit iceberg orders, and initiate transfers between certain accounts through governance. It also includes some basic work to support future features.

It also includes fixes to several APIs, including the API for exporting ledger entries.

### Deprecation
The unused rewards-related network parameter `reward.staking.delegation.payoutFraction` has been deprecated and will be removed in the next release. This was done in [8280 ↗](https://github.com/vegaprotocol/vega/issues/8280).

### New features
**Stop orders**
A stop order is an order to buy or sell once the price reaches a specified price, known as the trigger price. Stop orders can be used to help a trader limit losses (stop loss), or capitalise on a gain (take profit) automatically when they already have an open position. Stop orders can be submitted as a single stop order trigger or an OCO (one cancels the other) pair.

**Iceberg orders**
An iceberg order is a limit order for a large amount that, rather than being entered as a single large order of that size, is placed on the book as a smaller order that is replenished as that order amount is filled. The peak / 'visible' amount can be filled with one trade, while the reserve is used to support the smaller order amount. As the Vega network is a public one, the iceberg amount below the peak can still be deduced.

**Successor markets**
A successor market is a market that will carry on after the original market, or parent, that it is based on has settled, which offers liquidity providers the option to keep their equity-like share on the new market, even after the original market expires.

### Fixes
Profit and loss data was flickering between different values when subscribed to. This is fixed in [8362 ↗](https://github.com/vegaprotocol/vega/issues/8362).

Settled markets did not have a close timestamp available in the API. Fixed in [8186 ↗](https://github.com/vegaprotocol/vega/issues/8186).

Added number of decimal places to data source events, so it can be determined how many decimal places are being referenced. Done in [8206 ↗](https://github.com/vegaprotocol/vega/issues/8206).

The estimate positions endpoint did not correctly validate data, meaning it would accept values that it could not use. Fixed in [8222 ↗](https://github.com/vegaprotocol/vega/issues/8222).

Check out the full details of the main pre-release and the patch bug fixes in the Vega core [0.72.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.0), [0.72.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.1), [0.72.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.2), [0.72.3 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.3), [0.72.4 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.4), [0.72.5 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.72.5) release pages.

## Pre-release patch version 0.71.6 | 2023-06-19
This version was released to the Vega testnet on 19 June, 2023.

This patch release contains a security vulnerability fix, a number of critical fixes and minor but important enhancements.

### Security vulnerability

:::caution Security vulnerability
A security vulnerability was identified that allows a malicious validator (consensus or pending) to trick the Vega network into re-processing past Ethereum events from Vega’s Ethereum bridge. To find out more please see the [security advisory - GHSA-8rc9-vxjh-qjf2 ↗](https://github.com/vegaprotocol/vega/security/advisories/GHSA-8rc9-vxjh-qjf2). Please ensure, if running a node, the version has been upgraded to 0.71.6, in which the vulnerability has been fixed.
:::

### Critical fixes

A fix has been implemented to avoid a potential division by 0 error when calculating the fees accrued by each party in the a market. If the total fees are 0, the protocol will now return 0 rather than trying to divide by 0 [8402 ↗](https://github.com/vegaprotocol/vega/issues/8402).

The orders subscription API was not emitting data for all active orders. When querying for some orders it would indicate that they have been updated, however, the message notifying the client that that order was updated was never received. This bug was resolved with [8414 ↗](https://github.com/vegaprotocol/vega/issues/8414).

On the 9th of May, the protocol processed an auto delegation where a party had increased their stake during the epoch. As they were eligible for auto delegation their new stake was auto delegated to the validators they already had stake to; this led to events in a random order across the different validators. The issue [8412 ↗](https://github.com/vegaprotocol/vega/issues/8412) fixes this bug.

The liquidation price estimate API now works when the open volume is 0 [8313 ↗](https://github.com/vegaprotocol/vega/issues/8313).

When creating database metadata on an empty database, the data node software was attempting to query timescale tables that did not yet exist. This fix returns an empty metadata object in this scenario. See [8226 ↗](https://github.com/vegaprotocol/vega/issues/8226).

Trying to view a transaction in the block explorer API returned an error. Replay protection is now available and fixes the problem as of [8358 ↗](https://github.com/vegaprotocol/vega/issues/8358).

A fix has been added to address an invalid auction duration for new market proposals. Auction durations now start from the closing time of the proposal, and run through until the proposal enactment time [8451 ↗](https://github.com/vegaprotocol/vega/issues/8451).

An issue that was spotted during a snapshot test run has been addressed so that all combinations of core state in any snapshots taken are valid when used to restore a node [8471 ↗](https://github.com/vegaprotocol/vega/issues/8471).

### Enhancements

Since the deployment of the Alpha Mainnet release there has been some user feedback on improving the ledger entry CSV export. This has been carried out in [8353 ↗](https://github.com/vegaprotocol/vega/issues/8353).

Check out the full details in the Vega core [0.71.6 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.6) release page.

## Pre-release versions 0.71.3, and 0.71.4 combined | 2023-05-05
This version was released to the Vega testnet on 05 May, 2023.

This combined release contains fixes for two bugs found in data node during the final community incentive run on the alpha mainnet release candidate.

A bug was identified in the way expired orders were handled by the protocol. Orders were being inserted into the databases with different sequence numbers; this resulted in the logic to expire orders being unable to get deterministic data across the network. This issue was resolved by querying the data by `id` to ensure the correct sequencing on all nodes in the network. See the full details of this bug fix in issue [8251 ↗](https://github.com/vegaprotocol/vega/issues/8251)

The network history status endpoint was found to be unresponsive due to a recent name change in the functions that get the network history peers and the status. The function names were updated, reinstating the functionality of the `GetNetworkHistoryStatus` API endpoint. See the full details of this bug fix in issue [8231 ↗](https://github.com/vegaprotocol/vega/issues/8231)

This release contains the two aforementioned bug fixes and minor enhancements and makes up the software version recommended to the validators to deploy for the release of alpha mainnet. Check out the full details of these patch releases in the Vega core [0.71.3 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.3) and [0.71.4 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.4) release page.

## Pre-release versions 0.71.0, 0.71.1, and 0.71.2 combined | 2023-04-26
This version was released to the Vega testnet on 26 April, 2023.

This combined release contains improvements to API documentation, as well as bug fixes and minor enhancements to improve usability.

:::caution Breaking changes
**Remove WebSocket for rewards**: An unused and unnecessary event stream has been removed to simplify the APIs.

**Remove all offset pagination**: While cursor pagination has been available for a number of releases, some endpoints still also supported offset pagination. This has now been removed for clarity and simplicity.

Check out a full summary of all the 0.71.0 [breaking changes ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0710) entries in the changelog. There were no breaking changes in 0.71.1 or 0.71.2.
:::

This release contains breaking changes, bug fixes and minor enhancements. Check out the full details in the Vega core [0.71.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.0), [0.71.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.1) and [0.71.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.2) release page.

## Pre-release versions 0.70.0, 0.70.1, and 0.70.2 combined | 2023-03-28
This version was released to the Vega testnet on 28 March 2023, with the 0.70.2 patch released on 31 March, 2023.

Versions 0.70.0-0.70.3 contain the fixes and minor enhancements to verify in Fairground before the validators deploy to the validator-run testnet for the Market Simulation #4 event.

Several new features were released with these versions: the addition of post-only and reduce-only options for certain order types. In addition, bugs in restoring deposits after checkpoints and order subscriptions were also fixed.

These deployments also realised further data node enhancements to aid performance and improve management of stored data. The indexes on the positions table have been reworked in order to maintain performance of network history on the data nodes. Additionally, the buffer-size config has been adjusted to best utilise the node memory on startup.

Finally, to help manage the volume of data being created, LP orders are no longer sent when resubmitted without any changes, giving a direct data storage benefit.

:::caution Breaking changes
**Rename `marketId` and `partyId` in the orders queries' filter** [(v0.70)↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0700): To allow getting all orders for a single party or market so that users can more easily find their orders across multiple keys or markets, filtering on the orders endpoint has been enhanced. The API fields `party_id` and `market_id` have been changed to `party_ids` and `market_ids` respectively.

**Use nanoseconds for one off transfers**: During the Market Simulation #3, the data node crashed due to an invalid time input when carrying out an internal transfer. The field now validates for nanoseconds, which is consistent with other inputs.

**Rename table `current liquidity provisions` to `live liquidity provisions` and add a `live` option**: During testing it was identified that over time the current liquidity provisions table will continue to grow as LPs are created/deleted. This change will help the management of the data being created by the protocol.

Check out a full summary of all the 0.70.0 [breaking changes ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0700) entries in the changelog. There were no breaking changes in 0.70.1 or 0.70.2.
:::

This release contains breaking changes, bug fixes and minor enhancements. Check out the full details in the Vega core [0.70.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.70.0), [0.70.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.70.1) and [0.70.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.70.2) release page.

## Pre-release Version 0.69.0 | 2023-03-15
This version was released to the Vega testnet on 15 March 2023.

Version 0.69.0 is a large release that incorporates both fixes from the Market Simulation activities and many improvements to the protocol.

One of the key improvements in this version has been to the process of restoring data from network history. The insert query time for the orders table was continually increasing, eventually resulting in the data node falling behind the core. This has been resolved by optimising the query and replacing the ‘current order’ flag with some SQL magic and carefully crafted indexing.

The CLI wallet has been improved to allow a better UX to `locate`, `describe` and `reset` the wallet service configuration. These changes have been made in conjunction with other wallet improvements creating a better CLI and desktop wallet user experience.

:::caution Breaking changes
**Require slippage factors in market proposals**: When creating a new market proposal the `linear` and `quadratic` slippage factor fields have been changed from optional to required.

**Deprecated fields removed from the wallet API**: The `version` field has been removed from the `admin.import_wallet` wallet API. All references to file paths have now been removed from the `admin.import_wallet`, `admin.import_network`, `admin.create_wallet` and `admin.isolate_keywallet` API

Checkout a full summary of all the 0.69.0 [breaking changes ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0690) entries in the changelog.
:::

This release contains breaking changes, wallet improvements, bug fixes and minor enhancements. Check out the full details in the Vega core [0.69.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.69.0) release page.

## Pre-release Version 0.68.0 | 2023-02-22
This version was released to the Vega testnet on 22 February 2023.

Version 0.68.0 addresses the required improvements and fixes identified during pre-Alpha Mainnet Market Sim 1. Much of the effort on this version was spent ensuring data node stability, and this identified two areas of concern. The first of these was a memory leak found in the event subscriber. This functionality is where events are emitted by the core and consumed by the data nodes. The code shared between the nodes has been simplified and the memory leak fixed. Secondly, it was noticed that the data node did not close GraphQL subscriptions once they had been finished with, meaning many connections were left open, increasing the memory usage of the data node. To further help with CPU utilisation on both the core and data nodes, the team consolidated order expiry events into a single event containing just the market and order IDs of those orders set to expire.

In addition, improvements have been made to the protocol for margin calculations and capping of slippage. The latter of these changes resolves an issue whereby it was possible for a user to be closed out when the market moved in their favour. With the introduction of two new network parameters, the slippage component of the margin is never allowed to be larger than the `slippage_cap`, and if there is insufficient volume on the book, the cap is used instead of slippage per unit.

Finally, API enhancements in this release include a new API to query the market conditions that led to closeouts and loss socialisation. These changes combined with improvements in error messaging in the wallet round off a number of great UX improvements taking the protocol a step closer to Alpha Mainnet.

:::caution Breaking changes
**Data node API rate limiting**: Rate limiting has been introduced for the GRPC, REST and GraphQL APIs. Users will be warned and where required banned from submitting more requests. Should the user continue to breach the API rate limits, the ban length will increase exponentially.

**`IssueSignatures` command**: The `IssueSignatures` command is no longer limited to validators, and can now be used by any member of the community. It is also now covered by spam protection rules.

To find out more please see these issues [7445 ↗](https://github.com/vegaprotocol/vega/issues/7445) and [7382 ↗](https://github.com/vegaprotocol/vega/issues/7382)

To find out more please see all 0.68.0 [breaking changes ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0680) entries in the changelog.
:::

:::warning Removals
**`Grpc-Metadata-` headers**: The deprecated headers with the `Grpc-Metadata-` prefix in datanode API and REST and GraphQL gateways have now been removed.

**Network API**: The legacy fields from network API have now been removed.

To find out more please see these issues [7419 ↗](https://github.com/vegaprotocol/vega/issues/7419) and [6963 ↗](https://github.com/vegaprotocol/vega/issues/6963)
:::

:::warning Deprecations
**`X-Vega-Connection` HTTP header**: The `X-Vega-Connection` HTTP header in data node API and REST and GraphQL gateways has been deprecated and will be removed in a future release.

To find out more please see issue [7385 ↗](https://github.com/vegaprotocol/vega/issues/7385)
:::

This release contains a large number of bug fixes and minor enhancements. Check out the full details in the Vega core [0.68.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0) release page.

## Pre-release Versions 0.67.0, 0.67.1, 0.67.2 and 0.67.3 combined | 2023-01-20
This version was released to the Vega testnet on 20 January 2023, with patch 0.67.3 released on 24 January.

Building on the stability improvements in the first release of 2023, this second release of the year is the version the team believe is ready for the first community Market Simulation. This release brings with it bug fixes around data sourcing and a critical fix whereby transfers and announce-node spam policies were not included in snapshots. These issues have been resolved and covered in tests to ensure no regression in the future.

In addition to these fixes, improvements have been made to the data node API documentation and the data node operator UX. It is now possible to initialise a data node using one of the three [retention modes](https://github.com/vegaprotocol/specs/blob/master/protocol/0076-DANO-data-node.md#datanode-retention-modes). Finally for v0.67.2 the wallet API token support has been extended to support long lived tokens.

Check out the full details of this combined release in the Vega core [0.67.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.67.0), [0.67.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.67.1), [0.67.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.67.3) and [0.67.3 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.67.2) release pages.

## Pre-release Versions 0.66.0 and 0.66.1 combined | 2023-01-06
This version was released to the Vega testnet on 6 January 2023.

Happy New Year from the Vega team.

The first testnet deployment of 2023 brings with it the final planned data node stability improvements ahead of the market simulations. Using the data from the last incentive, the team has made changes to the way the snapshot metadata is stored, which has significantly improved RAM usage during snapshot file creation. In addition to the memory usage optimisations, a panic when fetching data segment history has been resolved.

These fixes and stability improvements bring the data node software into a state of readiness for the Alpha Mainnet market simulations.

To round off this release several API improvements have been introduced, along with a number of bug fixes, preparing the core and wallet software for the market simulations. Until then, the team is focused on completing wallet API token support, increasing the test coverage and fixing any bugs found along the way.

:::caution Breaking changes
**Wallet API  and command removals**: Over the recent testnet releases a number of the wallet APIs have been deprecated. The deployment of `0.66.0` now removes a number of these deprecated fields, endpoints and commands.
**Network parameter name change**: The network parameter `stakeToCcySiskas` has been renamed to `stakeToCcyVolume`.
**Network parameter name change**: The `triggeringRatio` field has been changed from `double` to a `string`. When proposing a market, using a float value would lead to a passing proposal, however the response from the APIs was incorrect. This has been resolved by changing the accepted data format.

To find out more please see the [breaking changes ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0660) entries in the changelog.
:::

Check out the full details of this combined release in the Vega core [0.66.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.66.0) and [0.66.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.66.1) release pages.

## Pre-release Versions 0.65.0 and 0.65.1 combined | 2022-12-23
This version was released to the Vega testnet on 23 December 2022.

The final scheduled testnet release of 2022 has introduced some refactors to the liquidity provision (LP) code. The protocol has been changed so LP margins will not be affected by the probability of trading, because that would make the job of being an LP overly difficult. Similarly, the protocol has been redesigned to discourage LPs from posting orders too far away from the mid price. This ensures that liquidity provided is 'useful' liquidity. Doing this refactor now addresses these points before liquidity providers integrate with the protocol, both for the mainnet sims and the Alpha Mainnet release.

The way snapshot data is stored and retrieved has been improved to manage the memory load during these processes. This combined with some Postgres configuration changes introduces the first of a set of planned improvements to the network stability. This will be further updated and proved out in the incentives running over the coming weeks.

Finally as a parting gift to 2022, the team has added a couple of additional APIs. One allows users to query the reward types and amounts distributed for a given epoch and the other can show the liquidity score in the market data response.

This deployment brings with it many other fixes and improvements leading up to Alpha Mainnet; check out the full details of this combined release in the Vega core [0.65.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.65.0) and [0.65.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.65.1) release pages.

:::caution Breaking changes
**Market definition API**: The market definition API has been extended with the new field for LP price range, this has resulted in a breaking change.
**Data source decimal places**: The decimal places are now defined in the oracle data source and removed from the market definition resulting in a breaking change.

To find out more please see these issues [6955 ↗](https://github.com/vegaprotocol/vega/issues/6955) and [6645 ↗](https://github.com/vegaprotocol/vega/issues/6645) respectively.
:::

:::warning Deprecations
**Vega Wallet**: A number of recent changes have deprecated commands in the Vega CLI wallet, these will be removed in the next release.

To find out more please see these issues [6887 ↗](https://github.com/vegaprotocol/vega/issues/6887), [6957 ↗](https://github.com/vegaprotocol/vega/issues/6957), [6963 ↗](https://github.com/vegaprotocol/vega/issues/6963), [7067 ↗](https://github.com/vegaprotocol/vega/issues/7067), [7069 ↗](https://github.com/vegaprotocol/vega/issues/7069) and [7079 ↗](https://github.com/vegaprotocol/vega/issues/7079)
:::

## Pre-release Versions 0.63.0, 0.63.1, 0.63.2 and 0.64.0 combined | 2022-12-09
This version was released to the Vega testnet on 09 December 2022.

As we approach the end of 2022 we are still pushing out some awesome updates to testnet. Any eagle eyed followers will have seen the recent demo on Twitch sharing the outputs of the performance testing. This has resulted in a few new features to help maintain the stability of the network as usage scales up:

- [Network wide limits](https://github.com/vegaprotocol/specs/blob/master/protocol/0078-NWLI-network_wide_limits.md) will allow the community to tune the maximum number of pegged orders on a market and the number of LP shapes on the network. The expectation is that these will be increased via governance as the protocol is adopted as the performance and interplay between the core and data nodes is better understood in mainnet.
- [Vega transaction gas costs and priorities](https://github.com/vegaprotocol/specs/blob/master/protocol/0079-TGAP-transaction_gas_and_priority.md) Vega doesn't charge users gas costs per transaction, however, there are still constraints in the system processing capacity. In order to ensure liveness, each transaction will have an associated gas cost. This allows the protocol to ensure that each block will contain only transactions up to a certain block "gas limit".

This deployment brings with it many other fixes and improvements leading up to Alpha Mainnet; check out the full details of this combined release in the Vega core [0.63.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.63.0), [0.63.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.63.1), [0.63.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.63.2) and [0.64.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.64.0) release pages.


:::warning Deprecations
**Vega Wallet**: A number of changes have been introduced resulting in the deprecation of commands in the Vega CLI wallet.

These will be removed in the next release.

To find out more please see the issues [7065 ↗](https://github.com/vegaprotocol/vega/issues/7065), [7066 ↗](https://github.com/vegaprotocol/vega/issues/7066) and [7068 ↗](https://github.com/vegaprotocol/vega/issues/7068)
:::

:::caution Breaking changes
**Data node V1 APIs removed**: As flagged previously, the data node V1 APIs have now been removed.

This release also introduces a number of [breaking  changes ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0630) that should be reviewed if you are using data node APIs or starting to use the V2 wallet APIs.
:::


## Pre-release Versions 0.61.0, 0.62.0 and 0.62.1 combined | 2022-11-11
This version was released to the Vega testnet on 11 November, 2022.

As the software gets closer to being ready for Alpha Mainnet, all focus is on testing, bug fixing and measuring performace to ensure a stable network. The team has been running performance tests and gathering metrics to enhance both the core and the data node. This release brings enhancements to the data node ensuring performant operation, and the all-important accuracy of every APIs response.

The last three weeks have seen unfortunate delays to the usual weekly testnet release cadence. This was caused by a large refactor of the `oracleSpec`, clarifying the naming and distinctions between oracles and the data they provide. Why do this now? The team wanted to mitigate against large breaking changes in the months after Alpha Mainnet when new features will be developed, and building on top of Vega gets into full swing... you can thank us later.

Check out the full details of this combined release in the Vega core [0.61.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.61.0), [0.62.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.62.0) and [0.62.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.62.1) release pages.

:::warning API deprecations
**Data node**: UPDATE: The v2 APIs ([REST](./../api/rest/overview) and [gRPC](./../api/grpc/data-node/api/v2/trading_data.proto)) for the data node will replace v1 in the next major version release to testnet. Therefore anyone building apps on top of Vega should start to use the v2 APIs immediately.

**Vega Wallet**: For most use cases, the v2 [wallet API](../api/vega-wallet/before-you-start.md) will soon be the only one available for interacting with the Vega Wallet. V1 will continue to be used for the testnet-only hosted wallet for testing and incentives, for slightly longer.
:::

:::caution Breaking changes
**Vega tools**: The `vegatools` snapshot command has been updated to be consistent with other CLI options. The change also formats the json output so that it can be parsed and used programmatically.

**Data sourcing**: The data sourcing types have been updated to account for multiple types of data in the future. Data types are generalised as much as possible, as in the future data will be sourced from more than the currently implemented 'price' data - this is now represented by the types `DataSpec` and `ExternalData`.
:::

## Pre-release Versions 0.59.0 and 0.60.0 combined | 2022-10-25
This version was released to the Vega testnet on 25 October, 2022.

For full details see the vega core [0.59.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.59.0) and  [0.60.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.60.0) release pages.

The primary focus of this release has been to add general bug fixes and improvements, improve the stability of the network and implement data node snapshots to be used for protocol upgrades and new nodes joining the network. This feature is now in testing.

:::warning API deprecations
**Data node**: The v2 APIs ([REST](./../api/rest/overview) and [gRPC](./../api/grpc/data-node/api/v2/trading_data.proto)) for the data node will replace V1, which will soon be removed. Therefore anyone building apps on top of Vega should start to use the v2 APIs from release 0.55 onwards.

**Vega Wallet**: For most use cases, the v2 [wallet API](../api/vega-wallet/before-you-start.md) will soon be the only one available for interacting with the Vega Wallet. V1 will continue to be used for the testnet-only hosted wallet for testing and incentives, for slightly longer.
:::

### Breaking Changes

#### Data node `init` requires the `ChainID` parameter
To share data across the network, all data nodes for a given network (chain) will be part of the same IPFS Swarm. The IPFS Swarm key is generated using the node's chain ID. Therefore, when initialising the data node, it is a requirement that the `ChainID` parameter is passed in the command. To find out more about the feature please read the [Decentralised History readme file](https://github.com/vegaprotocol/vega/tree/develop/datanode/dehistory). This work was done under the issue [6227 ↗](https://github.com/vegaprotocol/vega/issues/6227).

#### Allow the user to specify a different passphrase when isolating a key
To harden the security of Vega key management for node operators, a different passphrase can be used to protect an isolated wallet. This ensures that the risk of the "full" wallet's passphrase being exposed is minimised. Before this change, when isolating a wallet, its passphrase was inherited from the original wallet, and there was no option to choose a different one. This work was done under the issue [6477 ↗](https://github.com/vegaprotocol/vega/issues/6477).

#### Output from nodewallet reload is now more useful JSON
The output from `vega nodewallet reload --output=json` was not structured in a manner that was easy to use. This change creates a better UX for anyone interacting with the JSON output of the command. This work was done under the issue [6549 ↗](https://github.com/vegaprotocol/vega/issues/6549).

#### Rename get bundles API function `GetMultiSigSigner` to `ListMultiSigSigner`
In order to be consistent with v2 APIs and return context aware results, the get bundles API function name has been changed from `GetMultiSigSigner` to `ListMultiSigSigner`. This work was done under the issue [6458 ↗](https://github.com/vegaprotocol/vega/issues/6458).

#### Swap places of PID and date in log files in the wallet service
Before the implementation of this change wallet log files were named with the PID first e.g. `47060-2022-10-13-19-49-02.log`. This makes log files easy to search for if you have the PID but less so if you do not. In order to be able to easily sort the log files by date the file format name has been changed to start with the date e.g. `2022-10-13-19-49-02-47060.log`. This work was done under the issue [6506 ↗](https://github.com/vegaprotocol/vega/issues/6506).

#### Refactor datanode API for getting balance history
The API field `GetBalanceHistory` has been renamed to `ListBalanceHistory` and has had improvements in the documentation to help users understand APIs the 'grouping' feature. This change aslo fixes an issue with leaking account IDs. This work was done under the issue [6513 ↗](https://github.com/vegaprotocol/vega/issues/6513).

#### Allow negative position decimal places for market
In order to maintain spam protection, a market with a price of 10^-3 should only allow the smallest position of something like 10000 so the position decimal places would equal -4 meaning an order size of 1 => 10000. This work was done under the issue [6505 ↗](https://github.com/vegaprotocol/vega/issues/6505).

### Critical Bug fixes

#### Price monitoring price-range cache restored incorrectly
When restoring the `pricemonitor` for a market from a snapshot, the integer-representation from the `wrappedDecimal`s used for the price-range cache are derived from the decimal representation. This is slightly different to how they are created in the normal, non-snapshot code path. This causes markets to act differently after a snapshot restore, and eventually the restored node falls out of consensus. This fix was implemented under issue [6525 ↗](https://github.com/vegaprotocol/vega/issues/6525).

### New features: Core

#### Add reason to stopped or rejected transfer events
In order to know why a transfer event has been stopped or rejected the reason for the transfer rejection is now exposed in `BUS_EVENT_TYPE_TRANSFER` events. This work was done under the issue [6529 ↗](https://github.com/vegaprotocol/vega/issues/6529)

#### Update Tendermint to v0.34.22
To keep Tendermint up-to-date with all of the latest bug fixes it has been upgraded to v0.34.22. To find out more about the changes please see the [Tendermint changelog](https://github.com/tendermint/tendermint/blob/v0.34.22/CHANGELOG.md#v03422). This work was done under the issue [6548 ↗](https://github.com/vegaprotocol/vega/issues/6548).

### New features: Data node

#### Data node handles upgrade block and ensures data is persisted before upgrade
In order to ensure that the whole state of the data node matches that of the validator nodes, the data node should ensure that it processes all blocks up to the block height of a scheduled upgrade before shutting down. Respectively the core node shouldn't shut down until the data node has consumed all the blocks in the broker queue. This work was done under the issue [6080 ↗](https://github.com/vegaprotocol/vega/issues/6080).

#### Add last-block sub-command to data node CLI
To make the Vega Visor UX easier to restart a node on the network, a command has been added to the data node software that will return the height of the last block committed. This will make it easier for Visor to know at what snapshot height it should start the core. This work was done under the issue [6527 ↗](https://github.com/vegaprotocol/vega/issues/6527).

### New features: Wallet

#### Add new wallet commands
In order to further improve the UX on the wallets, two new commands have been added. These commands allow both the name and the passphrase of a wallet to be updated. These changes have been implemented in [6530 ↗](https://github.com/vegaprotocol/vega/issues/6530) and [6531 ↗](https://github.com/vegaprotocol/vega/issues/6531) respectively.


## Pre-release Version 0.58.0 | 2022-10-17
This version was released to the Vega testnet on 17 October, 2022.

For full details see the vega core [0.58.0 release page ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.58.0).

The primary focus of this release has been to add general bug fixes and improvements, improve the stability of the network and continue to implement data node snapshots ahead of this feature being used for protocol upgrades and new nodes joining the network.

### Breaking Changes

#### Data-node API field name changes
The market proposal (data source) field `settlementPriceDecimals` was changed to `settlementDataDecimals`, in version 0.56, to be future-proofed for when settlement data isn’t just driven by prices. To ensure consistency throughout the APIs the field `oracleSpecForSettlementPrice` has now also been changed to `oracleSpecForSettlementData` This work was done under issue [6367 ↗](https://github.com/vegaprotocol/vega/issues/6367).

#### Require signature from new Ethereum key to validate key rotation submission.
To ensure that a compromised old key cannot validate a key rotation, a new CLI command has been introduced to send in an Ethereum key rotation submission that contains a signature generated with the new Ethereum key. The work was completed in issue [6316 ↗](https://github.com/vegaprotocol/vega/pull/6316) where you can also see the new flow.

#### Improve the estimate fee and margin APIs
The changes implemented to improve the estimate fee and margin APIs now mean that you only have to pass in the actual parameters required for the estimation calculation. This change also makes the required parameters mandatory. This work was done in [6420 ↗](https://github.com/vegaprotocol/vega/pull/6402).

#### Wallet improvements
As of today users can only temporarily approve or reject a wallet connection using a boolean. In the future, support will be required for other options, such as permanently approve or reject a host name. The interaction has been updated to accept a "mode" instead of a simple boolean. The boolean changes from `yes` | `no` to mode `APPROVED_ONLY_THIS_TIME` | `REJECTED_ONLY_THIS_TIME` and was implemented in [6428 ↗](https://github.com/vegaprotocol/vega/issues/6428).

Whatever the state of the sent transaction, the `TransactionStatus` was updated with an `error` field that was filled on error, and a transaction hash field that was filled on success. To create a better developer experience this has been split in two distinct notifications: `TransactionFailed` with the `error` field, and `TransactionSucceeded` with `txHash` field. This work was implemented in [6430 ↗](https://github.com/vegaprotocol/vega/issues/6430).

The final breaking change for the wallet in 0.58 improves the wallet interactions framework. To make the framework clearer, the name `pipeline` has been updated to `interactor`. The work was implemented under[6309 ↗](https://github.com/vegaprotocol/vega/pull/6309) where you can see all the API changes.

### Critical Bug fixes

#### Error if the same node is announced twice
During testing it was found that there was no error should a single node be announced to the network more than once. The core was not flagging the second announced (duplicate) node as added. The work completed in [6444 ↗](https://github.com/vegaprotocol/vega/issues/6444) ensures that the core will return an error if adding a node fails.

#### Failed to extract orders as not enough volume within price limits
During testing, `cumlativeVolumeAndPrice` caused a panic with the error "Failed to extract orders as not enough volume within price limits". To resolve this, the protocol resets `minPrice` and `maxPrice` once the cumulative volume is built if it is recalculated. This work was done in [6406 ↗](https://github.com/vegaprotocol/vega/issues/6406).

#### Failed to extract orders as not enough volume within price limits
At the end of final market settlement, there was a panic if the settlement balance is not zero. To resolve this in most cases, if there is one unit left over at the end of final market settlement, the balance will be transferred to the network treasury. Should there be more than one unit remaining the protocol will log all transfers and panic. [6434 ↗](https://github.com/vegaprotocol/vega/issues/6434).

#### Wallet selection selection fails when wallet has a capitalised name
When the wallet name is capitalised, the wallet would fail saying that is is not a valid option. This is because the verification formats the name to lowercase to ensure the user input is not a problem. This change removes the lowercase formatting during the verification and therefore requires that the user respects the case of the wallet name. This work was done in [6359 ↗](https://github.com/vegaprotocol/vega/issues/6395).

### New features: Core

#### Add `GetTransaction` API call for block explorer
In release 0.57 the new Block Explorer service code and APIs were created. This has now been enhanced to include the `GetTransaction` API call. This work was done in [6435 ↗](https://github.com/vegaprotocol/vega/issues/6435).

:::info
The service to be able to interact with the block explorer API will be enabled in testnet before 0.59. Details on configuring and running will also part of the validator deployment instructions for mainnet, when it is applicable.
:::

### New features: Data node

#### Add maximum lifetime to postgres connections
Before the release of 0.58, postgres connections in the pool were never closed. This created a risk whereby any memory leaks, in any of the postgres worker processes, would result in that memory never being reclaimed. The addition of `pgxpool` as a config option with default values means connections will be closed after a certain time, with functionality to avoid starving the pool all at once. This work was done in [6461 ↗](https://github.com/vegaprotocol/vega/issues/6461).

#### Handle `BeginBlock` and `EndBlock` events
In order for the data node snapshots feature to work in alignment with core and the blockchain, the data node will use `BeginBlock` and `EndBlock` events. This will allow the datanode to know which block to stop processing data from, and which to start again from. This will provide seamless data during protocol upgrades. This work was implemented in [6211 ↗](https://github.com/vegaprotocol/vega/issues/6211).

#### Add Ledger Entry API
This change introduces an API to query the `LedgerEntry` schema. `LedgerEntry` objects can be filtered by asset ID, market ID, or party ID for sending and receiving accounts, as well as on transfer types. This API was implemented under issue [6368 ↗](https://github.com/vegaprotocol/vega/issues/6368).

#### New features: Wallet
Version 0.58 brings with it a number of improvements to the wallet both for the end user and developers that will use the wallet APIs. The full list of wallet changes and improvements can be seen in the [0.58.0 release page ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.58.0) issues that are also labeled with `wallet`.

#### Support parallel requests in wallet API version 2
This change brings with it the ability to support parallel requests, which from a CLI application point of view is ok, however may limit UX with the desktop wallet and any future UI based wallets. The work done to implement this improvement was done in [6308 ↗](https://github.com/vegaprotocol/vega/issues/6308).

#### Improve interactions documentation
With a large amount of the improvements in this version focusing on the wallet interactions, this change updates existing and creates new documentation about the interactions. This will help speed up the lead times for developers to integrate with the existing service. The documentation improvements were made under [6427 ↗](https://github.com/vegaprotocol/vega/issues/6427).

## Pre-release Version 0.57.0 | 2022-09-28
This version was released to the Vega testnet on 28 September, 2022.

For full details see the vega core [0.57.0 release page ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.57.0).

The primary focus of this release has been to improve the stability of the network, add functionality for better exploring the blockchain, and implement data node snapshots ahead of this feature being used for protocol upgrades and new nodes joining the network.

### Breaking Changes
The release of [0.57 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.57.0) brings with it a small number of breaking changes.

#### Changing clef address now requires re-importing config
The Nodewallet.ETH section of the config has been removed, and as a consequence some CLI arguments have changed when using clef. Before, when starting a Vega node with a clef wallet, Vega would read whatever clef address was in nodewallet.ETH, whereas after this change, the network only ever uses the value set for the clef address when the key was imported/generated. This work was done under issue [6291 ↗](https://github.com/vegaprotocol/vega/issues/6291)

#### Wallet v2 API `session` renamed
To add more clarity to what the wallet API does, the `session` namespace has been renamed to `client`. This work was done under issue [6314 ↗](https://github.com/vegaprotocol/vega/issues/6314)

### New features: Core

#### Block explorer APIs
To support the block explorer to list transactions and provide a good user experience, a service and new APIs have been implemented. This work was carried out in [6163 ↗](https://github.com/vegaprotocol/vega/issues/6163)

### New features: Data node

#### Data node snapshots
As part of the protocol upgrade process and when new nodes join the network, the nodes need to ensure the data node data is correct. Data node snapshots will be used for these use cases. This is an ongoing in-development feature, this part was implemented in [6239](https://github.com/vegaprotocol/vega/pull/6239)

#### Update asset proposal to include the asset ID in GraphQL response
In order to ensure GraphQL users understand which asset is being updated the field `assetId` has been added into the `UpdateAsset` proposals response. This work was done under issue [6296 ↗](https://github.com/vegaprotocol/vega/issues/6296)

#### Add rate limiter for GraphQL
During testing it was identified that GraphQL subscriptions could cause overloading on the data node. A rate limiter has been implemented for GraphQL subscriptions. This work was implemented under [6334 ↗](https://github.com/vegaprotocol/vega/pull/6334)

### New features: Wallet

#### Add commit hash to version if development version
To avoid version confusion by developers and builders due to the wallet not raising compatibility issues between different development versions of the software, the version check has been enhanced to add the commit hash (first 8 characters) behind the +dev build tag. This work was carried out in issue [6283 ↗](https://github.com/vegaprotocol/vega/issues/6283)


## Pre-release Version 0.56.0 | 2022-09-26
This version was released to the Vega testnet on 26 September, 2022.

For full details see the vega core [0.56.0 release page ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.56.0).

The primary focus of this release has been to resolve a number of critical bugs that have caused stability issues.

### Breaking Changes
The release of [0.56 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.56.0) brings with it a small number of breaking changes.

#### Clef wallet signatures not readable by network
When a clef wallet was used with a validator node, the validator heartbeats sent out, signed by the clef wallet, could not be verified when received by the network. This was being caused by the message being hashed clef before signing when using clef for validator heartbeats. The Vega team has created a fork of the Clef software to resolve this issue. This was done under issue [6187 ↗](https://github.com/vegaprotocol/vega/issues/6187)

#### Clean up unused network parameters
During recent development, a number of network parameters have been replaced or are no longer required. In order to have clean code, the unused network parameters have been removed. This work was done under issue [6196 ↗](https://github.com/vegaprotocol/vega/issues/6196)

#### Wallet v2 API field name change
To make the wallet API v2 clearer to understand, the field `Client` has been renamed to `User`. This work was implemented in issue [6155 ↗](https://github.com/vegaprotocol/vega/issues/6155)

### Data-node API field name changes
To ensure that the settlement API field name can scale to non-cash products, for example, where settlement data is not necessarily a price, the API field name has been changed from `SettlementPriceDecimals` to `SettlementDataDecimals`. This change was made under [5641 ↗](https://github.com/vegaprotocol/vega/issues/5641)

To ensure clarity of the positions subscription API the field name `Position` has been updated to `PositionUpdate`. This change was made under [6162 ↗](https://github.com/vegaprotocol/vega/issues/6162)

### Critical Bug fixes

#### Equity like share calculations
The equity like share feature applied the market growth scaling factor to the virtual stakes every block, instead of every market window. This resulted in the core spending an increasing amount of time carrying out calculations, thus having to serialise larger and larger decimals values and marshall and store each bit of data. The snapshot engine was unable to process correctly and caused network instability. The fix for this bug was carried out as part of [6245 ↗](https://github.com/vegaprotocol/vega/issues/6245)

#### Data-node failed to process key rotation
During testing of the wallet key rotation feature, the wallet rotation transaction was not processed correctly by the data-node software, causing the data-node to crash on update. This bug was resolved in issue [6175 ↗](https://github.com/vegaprotocol/vega/issues/6175)

#### Snapshot creation
It was found that when stopping a node core was being stopped before tendermint. This meant that the snapshot engine would close its connection to the snapshot database, however, as tendermint was still running it would try to commit a block and save a new snapshot even though the core had stopped. This issue was resolved in issue [6183 ↗](https://github.com/vegaprotocol/vega/issues/6183)

### New features: Core
As the `BlockchainsEthereumConfig` network parameter has core code dependencies it should not be changed via the normal governance proposal and enactment process. This change ensures that a change to this via network parameter governance will be rejected. Adding this parameter to the `updateDisallowed` list in issue [6254 ↗](https://github.com/vegaprotocol/vega/issues/6254) ensures this parameter can only be considered for change through a freeform governance proposal.

### New features: Data node
To enhance the GraphQL API user experience, newly added API endpoints have been documented and the schema (query and subscription types) have been ordered alphabetically. This work was done in [6221 ↗](https://github.com/vegaprotocol/vega/issues/6221) and [6170 ↗](https://github.com/vegaprotocol/vega/issues/6170) respectively.

### New features: Wallet
The focus of the wallet work in this release is to migrate the remaining wallet capabilities to the v2 API. Any wallet UIs can stop using the soon-to-be-deprecated v1 APIs without loss of functionality. This work was done in [5600 ↗](https://github.com/vegaprotocol/vega/issues/5600)

#### Add proof-of-work to transaction when using vegawallet command `sign`
Proof-of-work is now attached to the Vega Wallet return transaction command `sign`. This is done either by specifying a network which will be used to call `LastBlockHeightAndHash` or by passing in the `LastBlockData` manually. This work and information on using these instructions is detailed in issue [6077 ↗](https://github.com/vegaprotocol/vega/issues/6077)

#### Automatic consent for transactions
The permission and connection requests for consent are the last layer of protection when using the Vega Wallet, however, in some cases users may require these requests have automatic consent. The command line flag `--automatic-consent` has been added to wallet API v2 to override the default security, which brings this v1 feature into the new API. This has been implemented in issue [6203 ↗](https://github.com/vegaprotocol/vega/issues/6203)

## Pre-release Version 0.55.0 | 2022-09-20
This version was released to the Vega testnet on 20 September, 2022.

For full details see the vega core [0.55.0 release page ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.55.0).

The primary focus of this release has been to progress work on the data node ensuring there is a scalable data store with historical data, resolve any bugs found and to improve the node operator experience.

:::warning API deprecations
**Data node**: The v2 APIs ([REST](./../api/rest/overview) and [gRPC](./../api/grpc/data-node/api/v2/trading_data.proto)) for the data node will be replace v1, which will soon be removed. Therefore anyone building apps on to of Vega should start to use the v2 APIs from this release (0.55) onwards.

**Vega Wallet**: For most use cases, the v2 [wallet API](../api/vega-wallet/before-you-start.md) will soon be the only one available for interacting with the Vega Wallet. V1 will continue to be used for the testnet-only hosted wallet for testing and incentives, for slightly longer.
:::

### Breaking Changes
The release of [0.55 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.55.0) brings with it a small number of breaking changes.

#### Remove liquidity commitment from market proposal
Before the deployment of 0.55 liquidity commitment was optional on a market proposal. This change removes the option for any liquidity commitment completely from the market proposal. This work was done in issue [5989 ↗](https://github.com/vegaprotocol/vega/issues/5989).

#### Remove market name from GraphQL market type
The [market framework specification ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0001-MKTF-market_framework.md) does not mention having the market `name` field at the top level definition of a market. This has been fixed such that the `name` and `code` fields are at the instrument level as per the specification. This work was done in issue [6031 ↗](https://github.com/vegaprotocol/vega/issues/6031).

#### Rename rewards from taker fee to maker fee
In order to correct and clean up names in the APIs, the following account types and dispatch metrics names have been changed to match existing fee names:
`AccountType_ACCOUNT_TYPE_REWARD_TAKER_PAID_FEES` is now named `AccountType_ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES`
`DispatchMetric_DISPATCH_METRIC_TAKER_FEES_PAID` is now named `DispatchMetric_DISPATCH_METRIC_MAKER_FEES_PAID`
This work was done in issue [6095 ↗](https://github.com/vegaprotocol/vega/issues/6095).

#### Use the latest local snapshot as default behaviour when restarting a node
The best experience for restarting a node is to load from the highest possible block before the node was stopped. This is most important when a node was started using state-sync and the tendermint block store does not contain enough history to replay the chain from block zero. To avoid any issues with not being able to reply from block zero, the default behaviour is now to always start from the most recent local snapshot. This work was done in issue [5442 ↗](https://github.com/vegaprotocol/vega/issues/5442).

#### Return the key on `session.list_keys` endpoint on wallet API version 2
With the introduction of the [v2 wallet API](../api/vega-wallet/before-you-start.md) there is now added security in order for a dApp to request metadata that can be used by the user to label a key in wallet and dApp, thus preventing data being leaked unintentionally. This work was done in issue [6139 ↗](https://github.com/vegaprotocol/vega/issues/6139).

### Critical Bug fixes

#### Data nodes serve stale data if their Vega node dies
It was identified that if a core node fails the validators data-node can serve stale data. In order to resolve this, the data node team has added headers `X-Block-Height`, `X-Block-Timestamp` and `X-Vega-Connection` to all API responses. Using this approach will not break any current client implementations that rely on a 200 status code, but gives a clear indicator of the state of the API responses. This work was done in issue [5971 ↗](https://github.com/vegaprotocol/vega/issues/5971).

#### Asset cache was returning stale data
During QA testing, an asset which has been proposed, enabled and listed was being reported as `STATUS_PROPOSED`, when it should have been `STATUS_ENABLED`. This was due to fetching an asset by ID after it had been updated, but before the transaction was committed leading to a poisoned cache that returned stale values. This work was done in issue [5687 ↗](https://github.com/vegaprotocol/vega/issues/5687).


#### Fix panic on settlement
During testing using the [Vega Market Simulator ↗](https://github.com/vegaprotocol/vega-market-sim), the protocol panicked on a settlement. It was found that because trading was terminated the oracle data source has already been unsubscribed from thus causing the panic. This bug has been resolved under [6054 ↗](https://github.com/vegaprotocol/vega/issues/6054).

#### Price and pegged offset in orders need to accept decimals
During investigations of this bug the team found that `orderPrice` and `peggedOffset` were using incorrect types. As the data node needs to be able to hold numbers greater than 9.2e18 for these values the types were updated. This bug was resolved in [6144 ↗](https://github.com/vegaprotocol/vega/issues/6144).

### New features: Core
The project core engineering team have been working on completing the following features, on bug fixing, and on performance and stability improvements in readiness for a community governance vote to enable markets to be created on the network.

#### Equity-like-share
The guiding principle of splitting fees between liquidity providers is that by committing stake, a liquidity provider gets a virtual stake of the market value that relates to how trading has grown on the market. The virtual stake then determines equity-like-share. Equity-like-share is then used to calculate the fee revenue split between LPs. A problem was identified whereby in extreme cases when trading volume was zero in the previous period, or if it is zero in the current period, then a growth variable was not defined. To resolve this, under the extreme conditions, the virtual stake now reverts to the physical stake. This work was carried out in [5358 ↗](https://github.com/vegaprotocol/vega/issues/5358) to match the spec change in [1088 ↗](https://github.com/vegaprotocol/specs/pull/1088).

#### Vega Visor
Without Vega Visor, upgrading the protocol is near impossible when major changes are to be implemented, without using a [limited network life checkpoint restore ↗](https://github.com/vegaprotocol/specs/non-protocol-specs/0005-NP-LIMN-limited_network_life.md). This has the undesired effect of requiring synchronous restarts and for it to happen within a short window of time so all state can be restored from Ethereum, and the network can start properly with a checkpoint. The Vega Visor protocol upgrade process enables upgrading the network both asynchronously and without a restart / downtime. The validators signal their readiness to upgrade at a block height in the future and the Vega Visor orchestrates the upgrade, managing the state of the two versions. The development work on this feature has been completed and the QA team are now focused on proving its readiness for mainnet deployments. The work was carried out under the issue [5717 ↗](https://github.com/vegaprotocol/vega/issues/5717).

#### Batch order instructions
The implementation of batch order instructions adds a transaction type that allows a user to submit multiple market instructions (e.g. submit order, cancel order, amend order) in a single transaction. This decreases the complexity of client integrations, and furthermore, reduces the computational and network load on both validators and clients. It will also make Vega's functionality and APIs closer to parity with those of traditional centralised exchanges.
The work for this feature was carried out under issue [5961 ↗](https://github.com/vegaprotocol/vega/issues/5961) to the following [specification ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0074-BTCH-batch-market-instructions.md).

#### Add some Vega tools into the Vega repo
The `vegatools` repo contains a number of useful tools to aid development and investigations of the protocol. The tools that integrate most closely with the core software have been brought into the Vega repo, meaning these are exposed through the CLI and can be run in a terminal alongside the Vega binary. Specifically, tools to help investigate and debug streams, snapshots and checkpoints have been integrated. The work was carried out under the issue [5807 ↗](https://github.com/vegaprotocol/vega/issues/5807).

### New features: Data node
Data node work has focused on addressing scalability and adding the final features to complement protocol upgrades and new nodes joining the network. The primary work that has made it into this release and deployment has been on the APIs: fixing bugs and improving the UX.

#### Expose equity share weight in the API
For both users querying the data node and for front end applications to display liquidity provision information, an API to expose the total `equityLikeShare` has been added. This was implemented under issue [5682 ↗](https://github.com/vegaprotocol/vega/issues/5682)

#### Added date range to a number of historic balances, deposits, withdrawals, orders and trades queries
To further enhance the pagination implemented in the version 2 data node APIs, date ranges have been added to a number of queries. This work was carried out under the issue: [5684 ↗](https://github.com/vegaprotocol/vega/issues/5684)

#### Set GraphQL query complexity limit
To ensure that the data node does not have overly complex queries that could cause performance issues, a complexity limit has been calculated and implemented. This work has been carried out under the issue [6042 ↗](https://github.com/vegaprotocol/vega/issues/6042).

#### Update GraphQL endpoints and add fields
In order to allow both users and front end applications to access data via GraphQL, the follow endpoints for Ethereum bundles have been added: `listAsset`, `updateAsset`, `addSigner` and `removeSigner`. The field `settlementPriceDecimals` has also been added to GraphQL future and future product types. This work was done in the issues [5678 ↗](https://github.com/vegaprotocol/vega/issues/5678) and [5694 ↗](https://github.com/vegaprotocol/vega/issues/5694) respectively.

#### New features: Wallet
The focus of the wallet development work has been to implement the V2 APIs. This API version offers increased security for users as important data is no longer input into a dApp/website thus reducing the risk of data being unintentionally leaked.

#### Signing transactions with the V2 API
In order to ensure that users can sign their transactions in the wallet using the V2 API the functionality and endpoints have been added. This work was carried out in issues [6106 ↗](https://github.com/vegaprotocol/vega/issues/6106) and
[6105](https://github.com/vegaprotocol/vega/issues/6105).

#### Better notification for version update on the wallet
As development progresses both on the protocol and the wallet, it is important that users keep up-to-date. Additional notifications have been added to ensure that users are notified of the need to update their wallet version. This work was carried out in issues [5766 ↗](https://github.com/vegaprotocol/vega/issues/5766).


## Pre-release Version 0.54.0 | 2022-08-19
This version was released to the Vega testnet on 19 August, 2022.

For full details see the vega core [0.54.0 release page ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.54.0)

#### Breaking Changes

**Vega as a built-in application:**
Vega is now a built-in application, this means that Tendermint does not need to be started separately, providing a simpler, streamlined user experience for node operators. This introduces some breaking changes to the commands used when running a node:

- The `vega node` command has been renamed to `vega start`.
- The `vega tm` command has been renamed to `vega tendermint`.
- The `Blockchain.Tendermint.ClientAddr` configuration field has been renamed to `Blockchain.Tendermint.RPCAddr`.
- The `init` command now also generates the configuration for tendermint, and also has the newly introduced flags `--no-tendermint`,` --tendermint-home` and `--tendermint-key`.
This work was all done in issue [5579 ↗](https://github.com/vegaprotocol/vega/issues/5579)

**Remove `updateFrequency` in price monitoring definition:**
The `updateFrequency` within price monitoring is not being used by the core protocol, therefore, this has now been removed. This work was done in issue [5624 ↗](https://github.com/vegaprotocol/vega/issues/5624)

**Remove wallet support for launching a proxy in front of dApps:**
Introducing the proxy was a way to navigate the browser security that prevents web apps from being able to talk to local web servers; this is now no longer required and therefore has been removed. This has been carried out in the issue [5601 ↗](https://github.com/vegaprotocol/vega/issues/5601)

#### Critical Bug Fixes

**Updating oracle termination caused the core to panic:**
During a recent incentive on testnet it was found that when a user made the oracle termination conditions to be set to be ten seconds in the future and before the market could be enabled; when the network reached this time the core threw a panic.
This bug has been resolved in [5668 ↗](https://github.com/vegaprotocol/vega/pull/5668)

**Network parameter set to `0` can cause node startup failure:**
An issue was discovered using the [Market Simulator](https://github.com/vegaprotocol/vega-market-sim) when the governance parameter `governance.proposal.updateMarket.minProposerEquityLikeShare` is set to `0` in the `genesis.json`, this resulted in the node startup failing. The fix implemented in [5633 ↗](https://github.com/vegaprotocol/vega/issues/5633) addresses this and allows the value to be `0`.

**Cannot unregister order caused core to crash in Market Simulator:**
When using the [Market Simulator ↗](https://github.com/vegaprotocol/vega-market-sim) it was found that a "cannot unregister order" error was thrown for pegged orders and caused the core to crash. This bug has been resolved in [5663](https://github.com/vegaprotocol/vega/issues/5663)

**Pegged orders not removed from list after repricing:**
It was identified that during a market's life when it is not in an auction and a pegged order gets repriced, the order was removed from the book, however, it remained in the pegged orders list. If the market then goes into an auction the pegged order list is used to try to get the order from the book, but as the order no longer exists, it can't be done. This bug has been resolved in [5825 ↗](https://github.com/vegaprotocol/vega/issues/5825)

#### Core

**Asset proposal:**
In order to complete the governance features, asset proposals have been implemented. This allows a user to propose and modify assets on the network via the governance process. This work was completed in [5242 ↗](https://github.com/vegaprotocol/vega/issues/5242) and [5851](https://github.com/vegaprotocol/vega/pull/5851)

**Tendermint:**
During the development of this software version, the team upgraded Tendermint to 0.35. This change would have brought breaking changes with it, however, the Tendermint project team announced this version will be discontinued. To find out more please see [the Tendermint blog post ↗](https://interchain-io.medium.com/discontinuing-tendermint-v0-35-a-postmortem-on-the-new-networking-layer-3696c811dabc). In light of this, the upgrade has been rolled back and Vega 0.54 will use the tendermint version 0.34.20. This work was done in issue [5249 ↗](https://github.com/vegaprotocol/vega/issues/5249) and rolled back in issue [5804 ↗](https://github.com/vegaprotocol/vega/issues/5804)

#### Data Node

**Move data node into the core repository:**
In order to simplify the  release process, running a node and manage dependencies across code repositories, the data node software has been incorporated into the core Vega repo. This work was done in issue [5613 ↗](https://github.com/vegaprotocol/vega/issues/5613).

**Version 2 APIs:**
Since the introduction of the PostgresQL database and work to stabilise this, the team has now migrated all the APIs to use the new database. Version 2 APIs introduce pagination and filtering to provide a better user experience for people using the network both via the APIs and via dApps. This work was done in issue [5685 ↗](https://github.com/vegaprotocol/vega/issues/5685) and issue [5660 ↗](https://github.com/vegaprotocol/vega/issues/5660). Further work on the V2 APIs will be released in the next version.

**API improvements:**
In order to ensure API parity between the API types the gRPC endpoints have all been mapped to REST. Further work on the GraphQL APIs remains in progress and will be in the next version. This work was done in issue [5760 ↗](https://github.com/vegaprotocol/vega/issues/5760)

#### Wallet

The Vega Wallet API has been completely rewritten to support all authentication happening within the wallet apps, rather than on the UI-side. These changes have been implemented to provide better wallet security. The wallet has also had some updates in order to provide more meaningful responses when a transaction fails providing a better UX for wallet users. The implementation has been carried out in issues [5439 ↗](https://github.com/vegaprotocol/vega/issues/5439), [5541 ↗](https://github.com/vegaprotocol/vega/issues/5541) and [5503 ↗](https://github.com/vegaprotocol/vega/issues/5503).

Further information on these changes can be found in the updated documentation implemented in issues [5618 ↗](https://github.com/vegaprotocol/vega/issues/5618) and [5619 ↗](https://github.com/vegaprotocol/vega/issues/5619).

## Versions 0.53.1 and 0.53.2 combined | 2023-03-22
This version was released to the Vega mainnet on 22 March 2023.

This deployment addresses a critical mainnet issue. A bug has been identified that caused a network outage at the time that the protocol was promoting a new validator to consensus validator status. The issue was caused by insufficient validation of the Tendermint public keys specified in the `announce node` command.

The fix introduced both resolved the issue and enhances the validation so that this cannot be repeated again.


To find out more please see the issue [7936 ↗](https://github.com/vegaprotocol/vega/issues/7936) and the [incident blog ↗](https://blog.vega.xyz/incident-report-validator-nodes-down-in-mainnet-2ac2f724d67e)

## Versions 0.53-0.51 | 2022-08-15
This version was released to mainnet by the validators on 15 August, 2022.

#### 0.53.0 (14 July 2022)

**Smart contract upgrade:**
With the upgrade of the network to version v0.53 will come an upgrade of the smart contracts. The multisig control contract and the collateral bridge will thus increase users' control over the funds they deposit (opt-out) and include performance improvements, such as decreasing gas cost when using the bridge. The Vega asset pool contract will not be upgraded. Once the new contracts are properly set up on Ethereum, the validators will migrate the asset pool to use the new contracts.

**Checkpoint commands:**
From version 0.53.0, checkpoints are always loaded via the genesis. To facilitate this the  `--genesis-file` option has been added to the `load_checkpoint` command.

With the introduction of this, the restore checkpoint command has now been deprecated and removed.

**Vega wallet in core repo:**
The core and Vega Wallet codebases have been unified. This reduces the risk that core and Vega Wallet software changes get out of sync. Users of the CLI wallet app can easily confirm if the version of their wallet is compatible with  the core Vega software version as they will be built and released together, and thus have the same version number.

In the short term, the CLI wallet app will still be available to download from the Vega Wallet repo, but it will not be supported for future releases.

**Decentralised validator selection bug:**
During the testing of the decentralised validator selection feature, a bug was found whereby if the network parameter that controls the number of ersatz validators is reduced in the same epoch that an ersatz validator is promoted, the network could be left with a node set where the actual number of ersatz validators was greater than the total allowed number. A fix has been implemented to handle Tendermint demotion and ersatz slot reduction at the same time and keep true to the configured network parameter values.

**PostgreSQL database:**
**Find out how to run a data node with Postgres in the [data node readme ↗](https://github.com/vegaprotocol/data-node/blob/v0.53.0/README.md).**

As of version 0.53, data node uses [PostgreSQL ↗](https://www.postgresql.org) as its storage back end instead of the previous mix of in-memory and BadgerDB file stores. We also make use of a Postgres extension called [TimescaleDB](https://www.timescale.com), which adds a number of time series specific features.

Postgres is not an embedded database, but a separate server application that needs to be running before a data node starts. A side effect of this transition is a little bit of setup is required by the data node operator. By default, data node will attempt to connect to a database called `vega` listening on `localhost:5432`, using the username and password `vega`. This is all configurable in data node’s `config.toml` file.

We are developing using `PostgreSQL 14.2` and `Timescale 2.6` and _strongly recommend_ that you also use the same versions. For more information see the **[data-node readme ↗](https://github.com/vegaprotocol/data-node/blob/v0.53.0/README.md)**.

**Critical bugs resolved:**
Collateral checkpoint locked global reward balance:
With the deployment of version 0.50.3 a new format for the account owner of the global reward account was introduced. When the mainnet was upgraded, the above was interpreted as a general party account rather than the newly formatted global reward account. As such, a balance of 21500 VEGA became locked in an account that is no longer accessible. To resolve this issue and recover the trapped VEGA, when the checkpoint is read, and on discovery of an old account format, the balance is transferred to the relevant new reward account. Full details can be seen in issue [5546 ↗](https://github.com/vegaprotocol/vega/issues/5546)

**Unable to query the VEGA asset due to large quantum:**
Part of testing the network version compatibility is to deploy the latest version of the software using a mainnet checkpoint file. During this test it was found that the VEGA asset could not be found in the data node via the assets API. To resolve this issue support was introduced in the data node for large integers for the asset quantum. Full details can be seen in issue [782 ↗](https://github.com/vegaprotocol/data-node/issues/782)

**Incorrect prices returned from depth endpoint in data node API:**
The depth value in the data node API appeared to occasionally become desynchronised from the 'true' prices. This was observed on testnet when a market’s prices of the 'bids' values were much higher than those of 'ask' and did not tally with values from best bid/ask.

In V1 of the data node (which will be replaced with V2) there is a check which relies on the Vega time (block time) being correctly set. However, as the V1 broker is multi-threaded per event type, there is no guarantee that the time event that sets the Vega time will arrive at the market depth subscriber with the orders to which the time corresponds. This change sends the Vega time of the block along with the order event in the V1 broker to ensure that a correct sequence number is generated for each order event.

Note: this issue affects the V1 APIs which will be deprecated and replaced by V2 which is single threaded and thus could not have this bug.

**Event subscriptions for orders was broken:**
When placing an order the orders subscription correctly emits an update for the newly created order. However, the bus event subscription did not emit the expected event. The fix for [719 ↗](https://github.com/vegaprotocol/data-node/issues/719) (market depth in data node V1 incorrect due to race condition) changed the type of the order event such that it no longer implemented these interfaces (no code broke as the check is dynamic), and this prevented the event bus from sending events using the party and market filters.

Full details can be seen in issue [730 ↗](https://github.com/vegaprotocol/data-node/issues/730)

### 0.52.0 (15 June 2022)
**Spam protection updates:** Until version 0.52 any changes to the proof of work network parameters would take effect immediately, which resulted in changes being enforced on transactions that were generated on blocks preceding the current one. This is not desired because someone may have prepared multiple transactions for a block before the changes were applied, which would then be rejected.

To ensure that this does not affect existing transactions the protocol verifies proof of work with the parameters as they were configured at the time of the block of the transaction.

### 0.51.2 (10 June 2022)
Version 0.51 of the Vega software implements some key changes to the features of governance and rewards as well as smart contracts. In addition, work continues on the data node to transition to the time-series `PostGres` data storage and the migrated APIs which will help the data node scale as usage increases on the network.

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

## Versions 0.50.4 | 2022-06-29
This release was shared with validators on 29 June, 2022. The validators released it to the mainnet network on on 30 June, 2022.

This is a patch release to address two high priority bugs seen in version 0.50.3.

A critical defect was identified on mainnet 0.50.3 where some staking events on Ethereum were replicated multiple times on Vega. During investigations it was identified that some validators were still running their event forwarder as an external service, which forwards events in a slightly different format, meaning those events were not successfully deduplicated. The defect that made it non-deterministic and not successfully deduplicate has now been resolved in [5510 ↗](https://github.com/vegaprotocol/vega/pull/5510) - fix: dedupe sorting made consistent

When restarting from a checkpoint file during the 0.50.3 deployment, at the end of the epoch the reward was paid as expected. However, the `rewardScore` field for the validators in that first epoch was missing in GraphQL. For all following epochs the `rewardScore` field was present as it should be. The cause was identified: when the core emits the event at the end of the first epoch, after the checkpoint restart, it was emitted with the wrong epoch sequence. This has now been resolved in [5515 ↗](https://github.com/vegaprotocol/vega/pull/5515) - fix: emit `rewardScore` correctly when loading from checkpoint

For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/release/v0.50.4/CHANGELOG.md#0504)

## Versions 0.50.3-0.49.8 combined | 2022-04-27
This release was shared with validators on 27 April, 2022. The validators released it to the mainnet network on 22 June, 2022.

The primary focus of this and the next upcoming releases has been to complete the final remaining features, progress data node improvements for scalability and to add test coverage and fix bugs.

Note: While many of the features below are related to trading, it is not yet enabled on mainnet.

**Proposals to change market parameters**: After a market has been proposed and enacted, changes to the market parameters can be proposed in a different governance action. Tokenholders will be able to submit proposals to change market parameters.

To change any market parameter, the proposer will submit the same data as if they were to create a market, except for the liquidity commitment, however this submission would contain the desired updates to the fields / structures that they wish to be changed. Some of the market parameters will not be able to be changed: market decimal places, position decimal places, settlement asset and the market name.

Read more:
* [Market framework spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0001-MKTF-market_framework.md#market)
* [Change market parameters ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0028-GOVE-governance.md#2-change-market-parameters)

**Spam Protection**: This release introduces a rate-limiting scheme to prevent clients from attacking the network by spamming the network with requests. Unlike many other systems Vega does not charge a transaction fee; fees are only charged on trades. To prevent spamming, there is a client-side Proof of Work (PoW) mechanism required along with all transaction submissions. The difficulty of the PoW puzzle can be adjusted by governance, and is low for most use-case scenarios. It is automatically increased if a single client submits an abnormal number of transactions.

This rate-limiting is based upon a client-side PoW which is quite different from the PoW term predominantly used for proof-of-work blockchains and associated with high energy consumption.

Read more: [Spam protection POW ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0072-SPPW-spam-protection-PoW.md)

**Checkpoint Improvements**: Checkpoints have been simplified. Before, validators would have to have a synchronisation period between nodes in order to reconcile the state from Ethereum when restarting the network from a checkpoint. This was due to the fact that the validators and staking balances were not stored in the checkpoint files.

This data is now stored in the checkpoints, which means that it is now possible to restart from checkpoints asynchronously, which removes the synchronisation period (when feasible). This will become especially important as validator numbers increase and the network sees validators joining and leaving based on stake.

**Add Ethereum key rotation support**: Vega now supports validators rotating their Ethereum keys. Ethereum keys are required so that validators can allow deposits and withdrawals via the Ethereum bridge. The controller of the bridge is a multisig bundle, and periodically validators will want to change their keys but still be part of the controlling group. This feature allows them to do this with a new transaction type.

Read more: [Key management ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0067-KEYS-key_management.md)

**Liquidity Provision Improvements**: Over the last month, the project team has been running a number of community incentives, including around liquidity provision. A number of bugs and enhancements have been introduced as a result of the incentive. These include:
* In some cases, amending liquidity orders triggered a liquidity auction. This was due to the fact that an order amend was effectively equivalent to a cancel and submit. During investigations it was found that if there was only 1 order on either side of the book, amending it would trigger an auction because, temporarily, there were no orders left
* A fix has been implemented to ensure that the margin is correctly released when an LP order is cancelled
* With the introduction of the market decimal places feature (see below), an issue was found related to decimal places and price bounds. This fix ensures that LP orders are adjusted to the min/max price according to the market precision

**Tendermint**: The current version of Tendermint being used by Vega has a bug where a transaction would pass `checkTx` but was never added to the memory pool. Tendermint has fixed the bug and the protocol is now able to use `sendTx` sync successfully. Therefore, if any transactions are rejected by the memory pool an error is raised to indicate why this has happened.

**EEF internalising**: The Ethereum Event Forwarder is functionality inside Vega that allows the network to be aware of activity on the Ethereum network. When the forwarder service is aware of events, such as the staking or unlocking of tokens, it translates and passes the events to the tendermint blockchain in Vega. Originally this was deployed as a single service alongside the Vega node, with the node needing to be configured to accept events from the forwarder service. This has now been rewritten and internalised into the Vega node, which simplifies the configuration of running a Vega node and makes it easier to deploy. Other benefits of doing this include it being easier to maintain and add future enhancements, which will be described in future release notes.

**Data node**: In order to have a scalable solution for accessing data, work has begun on migrating the datastore into a postgres with time-series database. Migrations of assets, accounts, markets, market data, orders and trades have been done. The changes have been made to the codebase and live in parallel with the existing solution. As the remaining APIs are migrated and testing is completed, the old datastore and APIs will be removed.

**Market decimal places**: In this release, the protocol now makes it possible to configure a market for which orders can only be priced in increments of a specific size. This is done by specifying a different (smaller) number of decimal places than its settlement asset supports. To explain this, consider a market that settles in GBP. This market can now be configured to have 0 decimal places so that the price levels on the orderbook will be separated by at least £1, rather than the default £0.01.

Read more: [Market decimal places ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0070-MKTD-market-decimal-places.md)

**Offsets for pegged and liquidity commitment orders**: The numbers used to offset how far from the reference price a pegged and liquidity provision order (respectively) can now only be input as positive. Whether they need to be added or subtracted from the price will be dependent on the order side.

Read more: [Pegged orders ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0037-OPEG-pegged_orders.md)

**Liquidity provision improvements**: The `LiquidityProvisionSubmission` API was used for submitting, amending and cancelling liquidity provision.  To both simplify the code and have a more explicit user experience a breaking change has been implemented to split these into three API commands.

**Floating point determinism**: Computations within a blockchain-based system need to be deterministic as the application state between nodes replicating it can start to differ potentially resulting in consensus failure. The protocol has been improved so that if the system has a differing floating point value there is a resolution strategy to reach consensus on the value that should be used. This is key due to the fact that validators will be running different hardware that could increase the chances of this happening.

Read more: [Floating point consensus ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0065-FTCO-floating_point_consensus.md)

**Snapshots**: In order to simplify and streamline the process for both restarting or adding a node on the Vega network, the snapshot feature has been implemented. To allow a Vega node to be restarted or join without the need to replay the whole blockchain, a Vega node can load an existing snapshot. Snapshots contain all the network state required to start a node; nodes can use a snapshot stored locally or one created by a different node in the network. Starting a node using a snapshot populates all the state inside the core as if the core had processed the historic blockchain. The node can then start or resume listening to blocks after the snapshot until it gets to the live block height where it will be classed as a normal contributing node. This is a key feature to both ensure the constant availability of the network and for decentralisation.

**On-chain treasury**: This release also sees the introduction of the on-chain treasury. This is a series of, per asset type, accounts that allows the transfer of the reward types that will be seen when trading is enabled. Part of this change has seen the enabling of transfers between wallets, this allows the reward accounts in the treasury to pay out rewards. With these recurring transfers the reward pools will be distributed in full each epoch. This means that the network parameters for fractional payout and payout delays will be removed. Rewards will be distributed to those staking and providing liquidity, first on testnet, and soon it will be available as a feature validators can release on mainnet.

An on-chain treasury, per asset type, has been implemented where the balance of the insurance pool is transferred when the market closes. To enable this transfers between Vega Wallets has been enabled, this not only is a feature of the on-chain treasury/rewards system but also allows people using the protocol to be able to transfer assets between wallets. With this feature there have been other changes around the rewards system meaning the full amount of the global reward pool will be distributed in all assets at the end of each epoch.

Read more:
* [On-chain treasury spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0055-TREA-on_chain_treasury.md)
* [Transfers spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0057-TRAN-transfers.md)

**Validators joining and leaving, and standby validators**:
In addition to the consensus validators, there is now functionality on testnet to allow a set of ersatz, or standby validators. These are validators that will  not contribute to the chain, but are on standby to jump in if a current validator drops off or their performance drops below a certain threshold. In order to be considered as an ersatz validator, the node operators need to meet certain criteria, including a minimum self-stake as well as stake nominated by other token holders.

Note: The network will be set to allow 0 standby validators for alpha mainnet, and increase the validator numbers via governance as early alpha mainnet progresses.

Read more: [Validators chosen by stake](https://github.com/vegaprotocol/specs/blob/master/protocol/0069-VCBS-validators_chosen_by_stake.md)

For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0502)
* [Data node change log ↗](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0500)

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

## Versions 0.46.0-0.47.6 combined | 2022-01-11
This release was shared with validators on 11 January, 2022. Validators released it to the mainnet network on 31 January, 2022.

A key theme of this combined release has been improvements to the checkpointing feature; this includes fixes to ensure epochs and other key data is preserved as they should be during checkpoint restarts. In addition to this, the “free-form governance” feature has been implemented. This feature further decentralises the protocol by allowing users to submit a range of governance proposals for community consideration and voting.

The protocol calculates a validator score for each validator. This score is used to set their voting power in Tendermint and determine their reward amounts. The changes introduced in this release mean that the protocol no longer prevents users from delegating to any node, however, an overcrowded node will impact the validator score thus affecting rewards. Further scoring of performance measurements in future releases will bring with it the mechanism to adjust rewards in reflection of validator performance in the network. This is another step in getting the network more decentralised, and open to new validators joining the network.

A “null blockchain” implementation of the protocol has been created. Whilst this has no impact on the validators running the nodes, or users using the network, it’s an important part of our future testing, and validation of the protocol strategy. In fact it’s the first step into building an integrated tool, or suite of tools, in order to simulate networks in various conditions.

For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0476)
* [Data node change log ↗](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0471)

## Version 0.45.6 | 2021-12-22
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0456)

## Version 0.45.4 | 2021-11-05
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0454)

## Versions 0.45.0-0.45.2 combined | 2021-10-27
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0452)
* [Vega data node change log](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0451)

## Version 0.44.1 | 2021-10-08
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0441)

## Version 0.44.0 | 2021-10-07
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0440)
* [Vega data node change log ↗](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0440)
