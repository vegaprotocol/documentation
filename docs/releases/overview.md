---
title: Vega software releases
hide_title: false
---
import Topic from '/docs/topics/_topic-development.mdx'

<Topic />

The Vega software is publicly available on [GitHub ↗](https://github.com/vegaprotocol). Below find summaries of key released features and breaking changes, as well as links to release notes in GitHub. 

[**Vega core software**](#vega-core-software) - Below, find a summary of each version's features and breaking changes.

From 0.54.0 the core repository also holds the data node and CLI wallet code, therefore the following code is included in the releases:

- The data node APIs allow for querying for historic information and for snapshots of the current state of the systems.
- The code for the Vega Wallet CLI app is now in the Vega repo, where a full list of changes can be found.

See the full release notes on [GitHub ↗](https://github.com/vegaprotocol/vega/releases).

[**Vega Desktop Wallet on GitHub** ↗](https://github.com/vegaprotocol/vegawallet-desktop/releases) - The code for the Vega Wallet desktop app is open source, and you can read the contents of each release on the repo.

[**Token dApp on GitHub** ↗](https://github.com/vegaprotocol/frontend-monorepo/releases) - The Token dApp, which provides an interface for interacting with VEGA tokens, is open-source and you can read the contents of each release on the Token Frontend repo.

[**Vega Capsule on GitHub** ↗](https://github.com/vegaprotocol/vegacapsule/releases) - Vega Capsule, which lets you create an instance of the Vega network on your computer to experiment with using the protocol, is public and you can resad the contents of each release on GitHub.

## Vega core software
The Vega core software is public on a business-source licence, so you can both view the repository change logs, and refer here for summary release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

### Version 0.55.0 | 2022-09-20
This version was released to the Vega testnet on 20 September, 2022.

For full details see the vega core [0.55.0 release page ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.55.0).

The primary focus of this release has been to progress work on the data node ensuring there is a scalable data store with historical data, resolve any bugs found and to improve the node operator experience.

:::warning API deprecations
**Data node**: The v2 APIs ([REST](./../api/rest/overview) and [gRPC](./../grpc/data-node/api/v2/trading_data.proto)) for the data node will be replace V1, which will soon be removed. Therefore anyone building apps on to of Vega should start to use the V2 APIs from this release (0.55) onwards.

**Vega Wallet**: For most use cases, the v2 [wallet API](./../api/vega-wallet) will soon be the only one available for interacting with the Vega Wallet. V1 will continue to be used for the testnet-only hosted wallet for testing and incentives, for slightly longer.
:::

#### Breaking Changes
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
With the introduction of the [V2 wallet API](../api/vega-wallet/v2-api/get-started) there is now added security in order for a dApp to request metadata that can be used by the user to label a key in wallet and dApp, thus preventing data being leaked unintentionally. This work was done in issue [6139 ↗](https://github.com/vegaprotocol/vega/issues/6139).

#### Critical Bug fixes

#### Data nodes serve stale data if their Vega node dies
It was identified that if a core node fails the the validators data-node can serve stale data. In order to resolve this, the data node team has added headers `X-Block-Height`, `X-Block-Timestamp` and `X-Vega-Connection` to all API responses. Using this approach will not break any current client implementations that rely on a 200 status code, but gives a clear indicator of the state of the API responses. This work was done in issue [5971 ↗](https://github.com/vegaprotocol/vega/issues/5971).

#### Asset cache was returning stale data
During QA testing, an asset which has been proposed, enabled and listed was being reported as `STATUS_PROPOSED`, when it should have been `STATUS_ENABLED`. This was due to fetching an asset by ID after it had been updated, but before the transaction was committed leading to a poisoned cache that returned stale values. This work was done in issue [5687 ↗](https://github.com/vegaprotocol/vega/issues/5687).


#### Fix panic on settlement
During testing using the [Vega Market Simulator ↗](https://github.com/vegaprotocol/vega-market-sim), the protocol panicked on a settlement. It was found that because trading was terminated the oracle data source has already been unsubscribed from thus causing the panic. This bug has been resolved under [6054 ↗](https://github.com/vegaprotocol/vega/issues/6054).

#### Price and pegged offset in orders need to accept decimals
During investigations of this bug the team found that `orderPrice` and `peggedOffset` were using incorrect types. As the data node needs to be able to hold numbers greater than 9.2e18 for these values the types were updated. This bug was resolved in [6144 ↗](https://github.com/vegaprotocol/vega/issues/6144).

#### New features: Core
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

#### New features: Data node
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



### Version 0.54.0 | 2022-08-19
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


#### 0.53.0 (14 July 2022)

**Smart contract upgrade:**
With the upgrade of the network to version v0.53 will come an upgrade of the smart contracts. The multisig control contract and the collateral bridge will thus increase users' control over the funds they deposit (opt-out) and include performance improvements, such as decreasing gas cost when using the bridge. The Vega asset pool contract will not be upgraded. Once the new contracts are properly set up on Ethereum, the validators will migrate the asset pool to use the new contracts.

Information on how to upgrade can be found in the [smart contracts migration guide](../node-operators/migration-guides/smart-contracts-migration.md).

**Checkpoint commands:**
From version 0.53.0, checkpoints are always loaded via the genesis. To facilitate this the  `--genesis-file` option has been added to the `load_checkpoint` command. 

With the introduction of this, the restore checkpoint command has now been deprecated and removed.

**Vega wallet in core repo:**
The core and Vega Wallet codebases have been unified. This reduces the risk that core and Vega Wallet software changes get out of sync. Users of the CLI wallet app can easily confirm if the version of their wallet is compatible with  the core Vega software version as they will be built and released together, and thus have the same version number. 

In the short term, the CLI wallet app will still be available to download from the Vega Wallet repo, but it will not be supported for future releases.

**Decentralised validator selection bug:**
During the testing of the decentralised validator selection feature, a bug was found whereby if the network parameter that controls the number of ersatz validators is reduced in the same epoch that an ersatz validator is promoted, the network could be left with a node set where the actual number of ersatz validators was greater than the total allowed number. A fix has been implemented to handle Tendermint demotion and ersatz slot reduction at the same time and keep true to the configured network parameter values.

**PostgreSQL database:**
**Find out how to run a data node with Postgres in the [data-node readme ↗](https://github.com/vegaprotocol/data-node/blob/v0.53.0/README.md).**

As of version 0.53, data node uses [PostgreSQL ↗](https://www.postgresql.org) as its storage back end instead of the previous mix of in-memory and BadgerDB file stores. We also make use of a Postgres extension called [TimescaleDB](https://www.timescale.com), which adds a number of time series specific features.

Postgres is not an embedded database, but a separate server application that needs to be running before a data node starts. A side effect of this transition is a little bit of setup is required by the data node operator. By default, data node will attempt to connect to a database called `vega` listening on `localhost:5432`, using the username and password `vega`. This is all configurable in data node’s `config.toml` file.

We are developing using `PostgreSQL 14.2` and `Timescale 2.6` and _strongly recommend_ that you also use the same versions. For more information see the **[data-node readme ↗](https://github.com/vegaprotocol/data-node/blob/v0.53.0/README.md)**.

**Critical bugs resolved:**
Collateral checkpoint locked global reward balance:
With the deployment of version 0.50.3 a new format for the account owner of the global reward account was introduced. When the mainnet was upgraded, the above was interpreted as a general party account rather than the newly formatted global reward account. As such, a balance of 21500 VEGA became locked in an account that is no longer accessible. To resolve this issue and recover the trapped VEGA, when the checkpoint is read, and on discovery of an old account format, the balance is transferred to the relevant new reward account. Full details can be seen in issue [5546 ↗](https://github.com/vegaprotocol/vega/issues/5546)

**Unable to query the VEGA asset due to large quantum:**
Part of testing the network version compatibility is to deploy the latest version of the software using a mainnet checkpoint file. During this test it was found that the VEGA asset could not be found in the data-node via the assets API. To resolve this issue support was introduced in the data-node for large integers for the asset quantum. Full details can be seen in issue [782 ↗](https://github.com/vegaprotocol/data-node/issues/782)

**Incorrect prices returned from depth endpoint in data node API:**
The depth value in the data node API appeared to occasionally become desynchronised from the 'true' prices. This was observed on testnet when a market’s prices of the 'bids' values were much higher than those of 'ask' and did not tally with values from best bid/ask.

In V1 of the data node (which will be replaced with V2) there is a check which relies on the Vega time (block time) being correctly set. However, as the V1 broker is multi-threaded per event type, there is no guarantee that the time event that sets the Vega time will arrive at the market depth subscriber with the orders to which the time corresponds. This change sends the Vega time of the block along with the order event in the V1 broker to ensure that a correct sequence number is generated for each order event. 

Note: this issue affects the V1 APIs which will be deprecated and replaced by V2 which is single threaded and thus could not have this bug.

**Event subscriptions for orders was broken:**
When placing an order the orders subscription correctly emits an update for the newly created order. However, the bus event subscription did not emit the expected event. The fix for [719 ↗](https://github.com/vegaprotocol/data-node/issues/719) (market depth in data-node V1 incorrect due to race condition) changed the type of the order event such that it no longer implemented these interfaces (no code broke as the check is dynamic), and this prevented the event bus from sending events using the party and market filters.

Full details can be seen in issue [730 ↗](https://github.com/vegaprotocol/data-node/issues/730)

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

A critical defect was identified on mainnet 0.50.3 where some staking events on Ethereum were replicated multiple times on Vega. During investigations it was identified that some validators were still running their event forwarder as an external service, which forwards events in a slightly different format, meaning those events were not successfully deduplicated. The defect that made it non-deterministic and not successfully deduplicate has now been resolved in [5510 ↗](https://github.com/vegaprotocol/vega/pull/5510) - fix: dedupe sorting made consistent

When restarting from a checkpoint file during the 0.50.3 deployment, at the end of the epoch the reward was paid as expected. However, the `rewardScore` field for the validators in that first epoch was missing in GraphQL. For all following epochs the `rewardScore` field was present as it should be. The cause was identified: when the core emits the event at the end of the first epoch, after the checkpoint restart, it was emitted with the wrong epoch sequence. This has now been resolved in [5515 ↗](https://github.com/vegaprotocol/vega/pull/5515) - fix: emit `rewardScore` correctly when loading from checkpoint

For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/release/v0.50.4/CHANGELOG.md#0504)

### Versions 0.50.3-0.49.8 combined | 2022-04-27
This release was shared with validators on 27 April, 2022. The validators released it to the mainnet network on 22 June, 2022.

The primary focus of this and the next upcoming releases has been to complete the final remaining features, progress data-node improvements for scalability and to add test coverage and fix bugs.

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

### Versions 0.46.0-0.47.6 combined | 2022-01-11
This release was shared with validators on 11 January, 2022. Validators released it to the mainnet network on 31 January, 2022.

A key theme of this combined release has been improvements to the checkpointing feature; this includes fixes to ensure epochs and other key data is preserved as they should be during checkpoint restarts. In addition to this, the “free-form governance” feature has been implemented. This feature further decentralises the protocol by allowing users to submit a range of governance proposals for community consideration and voting.

The protocol calculates a validator score for each validator. This score is used to set their voting power in Tendermint and determine their reward amounts. The changes introduced in this release mean that the protocol no longer prevents users from delegating to any node, however, an overcrowded node will impact the validator score thus affecting rewards. Further scoring of performance measurements in future releases will bring with it the mechanism to adjust rewards in reflection of validator performance in the network. This is another step in getting the network more decentralised, and open to new validators joining the network.

A “null blockchain” implementation of the protocol has been created. Whilst this has no impact on the validators running the nodes, or users using the network, it’s an important part of our future testing, and validation of the protocol strategy. In fact it’s the first step into building an integrated tool, or suite of tools, in order to simulate networks in various conditions.

For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0476)
* [Data node change log ↗](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0471)

### Version 0.45.6 | 2021-12-22
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0456)

### Version 0.45.4 | 2021-11-05
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0454)

### Versions 0.45.0-0.45.2 combined | 2021-10-27
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0452)
* [Vega data node change log](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0451)

### Version 0.44.1 | 2021-10-08
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0441)

### Version 0.44.0 | 2021-10-07
For full detailed information on the changes please see:
* [Vega core change log ↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0440)
* [Vega data node change log ↗](https://github.com/vegaprotocol/data-node/blob/develop/CHANGELOG.md#0440)
