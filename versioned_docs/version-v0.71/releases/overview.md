---
title: Vega software releases
hide_title: false
---
import Topic from '../topics/_topic-development.mdx';

<Topic />

The Vega software is publicly available on [GitHub ↗](https://github.com/vegaprotocol). Below find summaries of key released features and breaking changes, as well as links to release notes in GitHub. From 0.54.0 the [core repository ↗](https://github.com/vegaprotocol/vega) also holds the data node and CLI wallet code, therefore the following code is included in the releases:

- The data node APIs allow for querying for historic information and for snapshots of the current state of the systems.
- The code for the Vega Wallet CLI app is now in the Vega repo, where a full list of changes can be found.

See the full release notes on [GitHub ↗](https://github.com/vegaprotocol/vega/releases).

[**Vega Desktop Wallet on GitHub** ↗](https://github.com/vegaprotocol/vegawallet-desktop/releases) - The code for the Vega Wallet desktop app is open source, and you can read the contents of each release on the repo.

<!--[**Governance dApp on GitHub** ↗](https://github.com/vegaprotocol/frontend-monorepo/releases) - The Governance dApp, which provides an interface for interacting with governance proposals, VEGA tokens, and staking to validators; Console, a trading interface; and the Vega Block Explorer are open-source and you see more about them in the frontend monorepo.-->

[**Vega Capsule on GitHub** ↗](https://github.com/vegaprotocol/vegacapsule/releases) - Vega Capsule, which lets you create an instance of the Vega network on your computer to experiment with using the protocol, is public and you can read the contents of each release on GitHub.

## Vega core software
The Vega core software is public on a business-source licence, so you can both view the repository change logs, and refer here for summary release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

### Version 0.71.5 | 2023-05-26

Version 0.71.5 was released to the Vega mainnet on 26 May 2023.

Whilst investigating a failed withdrawal, a bug was identified in the Vega asset pool smart contract. This bug could cause assets to become stuck in the bridge and therefore required a rapid patch release. New versions of the bridge and asset pool contracts were deployed on the Ethereum mainnet and are in the control of the Vega network.

New bridge contracts:

- Bridge: `0x23872549cE10B40e31D6577e0A920088B0E0666a`
- Asset pool: `0xa226e2a13e07e750efbd2e5839c5c3be80fe7d4d`

Take a look at the [incident report](https://medium.com/vegaprotocol/incident-report-incident-under-investigation-d41cb2815de0) for full details regarding this patch release.

### Versions 0.54.0 through to 0.71.4 combined | 2023-05-09

Version 0.71.4 was released to the Vega mainnet on 09 May 2023.

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

More information is available in the [spam protection concepts](../concepts/vega-chain/network.md#spam-protection) pages.

**Freeform governance proposals**
Building on the governance features in restricted mainnet, the community can now propose freeform proposals. These differ from other proposals as when the enactment time comes, no changes are auto-enacted on the network if a proposal is successful. However, a record of how token holders voted will be stored on-chain and enactment will come at a future time, e.g., a code change that will come in a future deployment.

Find out more about [freeform ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0028-GOVE-governance.md#6-freeform-governance-proposal) governance proposals in the specs.

**Vega transaction gas costs and priorities**
Vega doesn't charge users gas costs per transaction. However, the system processing capacity is still limited; in order to ensure liveness, each transaction will have an associated gas cost. Each block will contain only transactions up to a certain block gas limit. Transactions with higher priorities will get scheduled first.
More information on transaction gas costs and priorities in the [Vega chain concept](../concepts/vega-chain/transactions.md#filling-a-block-transaction-gas-value) pages.

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

**Add `marketIds` and `partyIds` to orders queries' filter** (v0.70): To allow getting all orders for a single party or market so that users can more easily find their orders across multiple keys or markets, filtering on the orders endpoint has been enhanced.

**Use nanoseconds for one-off transfers** [(v0.70)↗](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0700): The time input field now validates for nanoseconds, which is consistent with other inputs.

**Require slippage factors in market proposals** [(v0.69)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.69.0): When creating a new market proposal the `linear` and `quadratic` slippage factor fields have been changed from optional to required.

**Data node API rate limiting** [(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): Rate limiting has been introduced for the gRPC, REST and GraphQL APIs. Users will be warned, and where required, banned from submitting more requests. Should the user continue to breach the API rate limits, the ban length will increase exponentially.

**`IssueSignatures` command** [(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): The `IssueSignatures` command is no longer limited to validators, and can now be used by any member of the community. It is also now covered by spam protection rules.

**Removed: `Grpc-Metadata-` headers** [(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): The deprecated headers with the `Grpc-Metadata-` prefix in datanode API and REST and GraphQL gateways have been removed.

**Removed: Network API fields removed**[(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): Legacy fields from network API have now been removed.

**Deprecated: `X-Vega-Connection` HTTP header**[(v0.68)↗](https://github.com/vegaprotocol/vega/releases/tag/v0.68.0): The `X-Vega-Connection` HTTP header in data node API and REST and GraphQL gateways has been deprecated and will be removed in a future release.

**Removed: Wallet command removals** [v0.66 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.66.0): A number of the CLI wallet APIs have been deprecated. To find out how to see all the current CLI wallet commands please refer to the [CLI wallet documentation](../tools/vega-wallet/cli-wallet/latest/guides/get-help.md).

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
This version was released to the Vega mainnet on 22 March 2023.

This deployment addresses a critical mainnet issue. A bug has been identified that caused a network outage at the time that the protocol was promoting a new validator to consensus validator status. The issue was caused by insufficient validation of the Tendermint public keys specified in the `announce node` command.

The fix introduced both resolved the issue and enhances the validation so that this cannot be repeated again.

To find out more please see the issue [7936 ↗](https://github.com/vegaprotocol/vega/issues/7936) and the [incident blog ↗](https://blog.vega.xyz/incident-report-validator-nodes-down-in-mainnet-2ac2f724d67e)

### Versions 0.53-0.51 | 2022-08-15
This version was released to mainnet by the validators on 15 August, 2022.

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
