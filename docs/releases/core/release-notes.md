---
sidebar_position: 1
title: Core software releases
hide_title: false
---

While the Vega core software is closed-source, you can refer here for a full list of release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

### Versions 0.50.3-0.49.8 combined | 2022-04-27
This release was made available to validators on 27 April, 2022.

The primary focus of this and the next upcoming releases has been to complete the final remaining features, progress data-node improvements for scalability and to add test coverage and fix bugs.

Note: While many of the features below are related to trading, it is not yet enabled on mainnet. 

**Proposals to change market parameters**: After a market has been proposed and enacted, changes to the market parameters are required. Tokenholders will be able to submit proposals to change market parameters.

To change any market parameter, the proposer will submit the same data as if they were to create a market, except for the liquidity commitment, however this submission would contain the desired updates to the fields / structures that they wish to be changed. Some of the market parameters will not be able to be changed: market decimal places, position decimal places, settlement asset and the market name.

Read more: 
* [Market framework spec](https://github.com/vegaprotocol/specs/blob/main/protocol/0001-MKTF-market_framework.md#market)
* [Change market parameters](https://github.com/vegaprotocol/specs/blob/main/protocol/0028-GOVE-governance.md#2-change-market-parameters)

**Spam Protection**: This release introduces a rate-limiting scheme to prevent clients from attacking the network by spamming the network with requests. Unlike many other systems Vega does not charge a transaction fee; fees are only charged on trades. To prevent spamming, there is a client-side Proof of Work (PoW) mechanism required along with all transaction submissions. The difficulty of the PoW puzzle can be adjusted by governance, and is low for most use-case scenarios. It is automatically increased if a single client submits an abnormal number of transactions.

This rate-limiting is based upon a client-side PoW which is quite different from the PoW term predominantly used for proof-of-work blockchains and associated with high energy consumption.

Read more: [Spam protection POW](https://github.com/vegaprotocol/specs/blob/main/protocol/0072-SPPW-spam-protection-PoW.md)

**Checkpoint Improvements**: Checkpoints have been simplified. Before, validators would have to have a synchronisation period between nodes in order to reconcile the state from Ethereum when restarting the network from a checkpoint. This was due to the fact that the validators and staking balances were not stored in the checkpoint files.

This data is now stored in the checkpoints, which means that it is now possible to restart from checkpoints asynchronously, which removes the synchronisation period (when feasible). This will become especially important as validator numbers increase and the network sees validators joining and leaving based on stake.

**Add Ethereum key rotation support**: Vega now supports validators rotating their Ethereum keys. Ethereum keys are required so that validators can allow deposits and withdrawals via the Ethereum bridge. The controller of the bridge is a multisig bundle, and periodically validators will want to change their keys but still be part of the controlling group. This feature allows them to do this with a new transaction type.

Read more: [Key management](https://github.com/vegaprotocol/specs-internal/blob/master/protocol/0067-KEYS-key_management.md)

**Liquidity Provision Improvements**: Over the last month, the project team has been running a number of community incentives, including around liquidity provision. A number of bugs and enhancements have been introduced as a result of the incentive. These include:
* In some cases, amending liquidity orders triggered a liquidity auction. This was due to the fact that an order amend was effectively equivalent to a cancel and submit. During investigations it was found that if there was only 1 order on either side of the book, amending it would trigger an auction because, temporarily, there were no orders left
* A fix has been implemented to ensure that the margin is correctly released when an LP order is cancelled
* With the introduction of the market decimal places feature (see below), an issue was found related to decimal places and price bounds. This fix ensures that LP orders are adjusted to the min/max price according to the market precision

**Tendermint**: The current version of Tendermint being used by Vega has a bug where a transaction would pass `checkTx` but was never added to the memory pool. Tendermint has fixed the bug and the protocol is now able to use `sendTx` sync successfully. Therefore, if any transactions are rejected by the memory pool an error is raised to indicate why this has happened. 

**EEF internalising**: The Ethereum Event Forwarder is functionality inside Vega that allows the network to be aware of activity on the Ethereum network. When the forwarder service is aware of events, such as the staking or unlocking of tokens, it translates and passes the events to the tendermint blockchain in Vega. Originally this was deployed as a single service alongside the Vega node, with the node needing to be configured to accept events from the forwarder service. This has now been rewritten and internalised into the Vega node, which simplifies the configuration of running a Vega node and makes it easier to deploy. Other benefits of doing this include it being easier to maintain and add future enhancements, which will be described in future release notes.

**Data node**: In order to have a scalable solution for accessing data, work has begun on migrating the datastore into a postgres with time-series database. Migrations of assets, accounts, markets, market data, orders and trades have been done. The changes have been made to the codebase and live in parallel with the existing solution. As the remaining APIs are migrated and testing is completed, the old datastore and APIs will be removed.

**Market decimal places**: In this release, the protocol now makes it possible to configure a market for which orders can only be priced in increments of a specific size. This is done by specifying a different (smaller) number of decimal places than its settlement asset supports. To explain this, consider a market that settles in GBP. This market can now be configured to have 0 decimal places so that the price levels on the orderbook will be separated by at least £1, rather than the default £0.01. 

Read more: [Market decimal places](https://github.com/vegaprotocol/specs/blob/main/protocol/0070-MKTD-market-decimal-places.md)

**Offsets for pegged and liquidity commitment orders**: The numbers used to offset how far from the reference price a pegged and liquidity provision order (respectively) can now only be input as positive. Whether they need to be added or subtracted from the price will be dependent on the order side.

Read more: [Pegged orders](https://github.com/vegaprotocol/specs/blob/main/protocol/0037-OPEG-pegged_orders.md)

**Liquidity provision improvements**: The `LiquidityProvisionSubmission` API was used for submitting, amending and cancelling liquidity provision.  To both simplify the code and have a more explicit user experience a breaking change has been implemented to split these into three API commands. 

**Floating point determinism**: Computations within a blockchain-based system need to be deterministic as the application state between nodes replicating it can start to differ potentially resulting in consensus failure. The protocol has been improved so that if the system has a differing floating point value there is a resolution strategy to reach consensus on the value that should be used. This is key due to the fact that validators will be running different hardware that could increase the chances of this happening.

Read more: [Floating point consensus](https://github.com/vegaprotocol/specs/blob/main/protocol/0065-FTCO-floating_point_consensus.md)

**Snapshots**: In order to simplify and streamline the process for both restarting or adding a node on the Vega network, the snapshot feature has been implemented. To allow a Vega node to be restarted or join without the need to replay the whole blockchain, a Vega node can load an existing snapshot. Snapshots contain all the network state required to start a node; nodes can use a snapshot stored locally or one created by a different node in the network. Starting a node using a snapshot populates all the state inside the core as if the core had processed the historic blockchain. The node can then start or resume listening to blocks after the snapshot until it gets to the live block height where it will be classed as a normal contributing node. This is a key feature to both ensure the constant availability of the network and for decentralisation.

**On-chain treasury**: This release also sees the introduction of the on-chain treasury. This is a series of, per asset type, accounts that allows the transfer of the reward types that will be seen when trading is enabled. Part of this change has seen the enabling of transfers between wallets, this allows the reward accounts in the treasury to pay out rewards. With these recurring transfers the reward pools will be distributed in full each epoch. This means that the network parameters for fractional payout and payout delays will be removed. Rewards will be distributed to those staking and providing liquidity, first on testnet, and soon it will be available as a feature validators can release on mainnet.

An on-chain treasury, per asset type, has been implemented where the balance of the insurance pool is transferred when the market closes. To enable this transfers between Vega Wallets has been enabled, this not only is a feature of the on-chain treasury/rewards system but also allows people using the protocol to be able to transfer assets between wallets. With this feature there have been other changes around the rewards system meaning the full amount of the global reward pool will be distributed in all assets at the end of each epoch.

Read more: 
* [On-chain treasury](https://github.com/vegaprotocol/specs/blob/main/protocol/0055-TREA-on_chain_treasury.md)
* [Transfers](https://github.com/vegaprotocol/specs/blob/main/protocol/0057-TRAN-transfers.md)

**Validators joining and leaving, and standby validators**: 
In addition to the consensus validators, there is now functionality on testnet to allow a set of ersatz, or standby validators. These are validators that will  not contribute to the chain, but are on standby to jump in if a current validator drops off or their performance drops below a certain threshold. In order to be considered as an ersatz validator, the node operators need to meet certain criteria, including a minimum self-stake as well as stake nominated by other token holders.

Note: The network will be set to allow 0 standby validators for alpha mainnet, and increase the validator numbers via governance as early alpha mainnet progresses.

Read more: [Validators chosen by stake](https://github.com/vegaprotocol/specs/blob/main/protocol/0069-VCBS-validators_chosen_by_stake.md)

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

#### New
- Set and increment LP version field correctly
- Add integration test for LP versioning
- Add integration test making sure margin is released when an LP is cancelled
- Use `BroadcastTxSync` instead of async for submitting transactions to Tendermint
- Add support for settlement price decimal place in governance
- Ensure at most 5 triggers are used in price monitoring settings
- Add Ethereum key rotation support
- Add retries to floating point consensus engine to work around Tendermint missing transactions
- Remove genesis sign command
- Add ability to stream events to a file
- Add block hash to statistics and to block height request
- Extend auction feature tests
- Add validation of update market proposals
- Emit validators signature when a validator is added or remove from the set
- Update the decimal library
- Get rid of unnecessary `ToDecimal` conversions (no functional change)
- Implement governance vote based on equity-like share for market update
- Add specific insurance pool balance test
- Add possibility to list snapshots from the Vega command line
- Update feature tests related to liquidity provision following integration of probability of trading with floating point consensus
- State variable engine for floating point consensus
- Add an example client application that uses the null-blockchain
- Add network limits service and events
- Add a command to clean up all Vega node state
- Remove Float from network parameters, use `num.Decimal` instead
- Send staking asset total supply through consensus
- Require Go minimum version 1.17
- Integrate risk factors with floating point consensus engine
- Change snapshot interval default to 1000 blocks
- Fast forward epochs when loading from checkpoint to trigger payouts for the skipped time
- Integrate price ranges with floating point consensus engine
- Ensure validators are started with the right set of keys
- Move to `ghcr.io` docker container registry
- Remove execution configuration duplication from configuration root
- Probability of trading integrated into floating point consensus engine
- Measure validator performance and use to penalise rewards
- Allow raw private keys for bridge functions
- Add `--update` and `--replace` flags on `vega genesis new validator`
- Add `--network-url` option to `vega tm`
- Add transfer command support (one off transfers)
- Add transfer command support (recurring transfers)
- Add cancel transfer command
- Fix null blockchain by forcing it to always be a non-validator node
- Remove old ID generator fields from execution engine's snapshot
- Reward refactoring for network treasury
- Added endpoint `SubmitRawTransaction` to provide support for different transaction request message versions
- Replace asset insurance pool with network treasury
- Internalise Ethereum Event Forwarder
- Make `BlockNr` part of event interface
- Rename `min_lp_stake` to quantum + use it in liquidity provisions
- Check smart contract hash on startup to ensure the correct version is being used
- Add integration test ensuring positions plug-in calculates P&L accurately
- Validators joining and leaving the network
- Add `totalTokenSupplyStake` to the snapshots
- Add transfers snapshots
- Serialise timestamp in time update message as number of nanoseconds instead of seconds
- Add internal oracle supplying Vega time data for time-triggered events
- Use a deterministic generator for order IDs, set new order IDs to the transaction hash of the Submit transaction
- Hash again list of hash from engines
- Make trade IDs unique using the deterministic ID generator
- Simplified performance score
- Add command line tool to sign for the asset pool method `set_bridge_address`
- Send governance events when restoring proposals on checkpoint reload
- Fix margins calculations for positions with a size of 0 but with a non zero potential sell or buy
- Improve and optimise replay protection
- Add Ethereum events reconciliation for `multisig control`

#### Fixes
- Set market pending timestamp to the time at which the market is created
- Do not induce a system panic when admin server stops
- Fix invalid `http` status set in faucet
- Always call `StartAggregate()` when signing validators joining and leaving even if not a validator
- Fix pegged orders to be reset to the order pointer after snapshot loading
- Fix the check for overflow in scaling settlement price
- Fix panic in loading validator checkpoint
- Unwrap properly position decimal place from payload
- Set last mark price to settlement price when market is settled
- Send proof-of-work when announcing node
- Ensure to / from in transfers payloads are Vega public keys
- Stop updating the market's initial configuration when an opening auction is extended
- Return an error if market decimal place > asset decimal place
- Stabilise state sync restore and restore block height in the topology engine
- Mark a snapshot state change when liquidity provision state changes
- Add missing commands to the `TxError` event
- Fix banking snapshot for transfers, risk factor restoration, and `statevar` handling of settled markets
- Fixed mark to market bug where settlement balance would not be zero when loss amount was 1.
- Fixed proof of engine end of block callback never called to clear up state
- Fix positions engines `vwBuys` and `vwSell` when amending, send events on `Update` and `UpdateNetwork`
- Target stake in asset decimal place in Market Data
- Fixed promotion of ersatz to Tendermint validator
- Fixed wrong tick size used for calculating probability of trading
- Fixed the default voting power in case there is stake in the network
- Add proto serialisation for update market proposal
- Ensure update market proposal computes a proper auction duration
- Add replay protection for validator commands
- Ensure Oracle specs handle numbers using `num.Decimal` and `num.Int`
- Fix settlement at expiry to scale the settlement price from market decimals to asset decimals
- Fix mark to market settlement where transfers get truncated resulting in settlement balance not being zero after settlement
- Send order event on settlement
- Use settlement price if exists when received trading terminated even
- Fix bug where amending orders in opening auctions did not work as expected
- Process recurring transfer before rewards
- Allow recurring transfers to start during the current epoch
- Fix time formatting problem that was breaking consensus on nodes in different time zones
- Fix concurrent write to price monitoring ref price cache
- Fix `vega announce_node` to work with `--home` and `--passphrase-file`
- Fix price monitoring snapshot
- Fix topology and `erc20` topology snapshots
- Epoch service now notifies other engines when it has restored from a snapshot
- Fixes for invalid data types in the `MarketData` proto message.
- Set Tendermint validators' voting power when loading from snapshot
- Fixed tracking of liquidity fee received and added feature tests for the fee based rewards
- Add ranking score information to checkpoint and snapshot and emit an event when loaded
- Fix the string used for resource ID of stake total supply to be stable to fix the replay of non validator node locally
- Fix margin balance not being released after close-out
- Fix panic in loading topology from snapshot
- Better error when trying to use the null-blockchain with an ERC20 asset
- Set statistics block height after a snapshot reload
- User tree importer and exporter to transfer snapshots via `statesync`
- Updated `vega verify genesis` to understand new `app_state` layout
- Set log level in snapshot engine
- Save checkpoint with `UnixNano` when taking a snapshot
- Fix restoring markets from snapshot by handling generated providers properly
- `corestate` endpoints are now populated after a snapshot restore
- save state of the `feesplitter` in the execution snapshot
- Fix restoring markets from snapshot in an auction with orders
- Set transfer responses event when paying rewards
- Withdrawal fails should return a status rejected rather than cancelled
- Deposits stayed in memory indefinitely, and withdrawal keys were not being sorted to ensure determinism
- Fail when missing Tendermint home and public key in `nodewallet import` command
- Bug fix for `--snapshot.db-path` parameter not being used if it is set
- Bug fix for `--snapshot.max-retries` parameter not working correctly
- Restore all market fields when restoring from a snapshot
- Fix restoring rejected markets by signalling to the generated providers that their parent is dead
- An array of fixes in the snapshot code path
- Allow replaying a chain from zero when old snapshots exist
- Fix liquidity provision commands decode
- Remove all references to `TxV2`
- Fix commit hash problem when checkpoint and snapshot overlap. Ensure the snapshot contains the correct checkpoint state.
- Handle removing stake with no balances gracefully
- Fix protobuf conversion in orders
- Set a protocol version and properly send it to `Tendermint` in all cases
- `TimeUpdate` is now first event sent
- Ensure Ethereum event forwarder doesn't process the current block multiple times
- Ensure verification of type between oracle spec binding and oracle spec
- Add vesting contract as part of the Ethereum event forwarder
- Dispatch network parameter updates at the same block when loaded from checkpoint
- Fix for markets loaded from snapshot not terminated by their oracle
- Add testing for auction state changes and remove unnecessary market state change
- Added verification of `uint` market data in integration test
- Fixed issue where LP orders did not get redeployed
- Snapshot fixes for market and update market tracker on trades
- Snapshot fixes for the `statevar` engine
- Fixed panic in `maybeInvalidateDuringAuction`
- Fixed liquidity auction trigger for certain cancel & replace amends

### Versions 0.46.0-0.47.6 combined | 2022-01-11
This release was made available to validators on 11 January, 2022. Validators released it to the mainnet network on 31 January, 2022.

A key theme of this combined release has been improvements to the checkpointing feature; this includes fixes to ensure epochs and other key data is preserved as they should be during checkpoint restarts. In addition to this, the “free-form governance” feature has been implemented. This feature further decentralises the protocol by allowing users to submit a range of governance proposals for community consideration and voting.

The protocol calculates a validator score for each validator. This score is used to set their voting power in Tendermint and determine their reward amounts. The changes introduced in this release mean that the protocol no longer prevents users from delegating to any node, however, an overcrowded node will impact the validator score thus affecting rewards. Further scoring of performance measurements in future releases will bring with it the mechanism to adjust rewards in reflection of validator performance in the network. This is another step in getting the network more decentralised, and open to new validators joining the network.

A “null blockchain” implementation of the protocol has been created. Whilst this has no impact on the validators running the nodes, or users using the network, it’s an important part of our future testing, and validation of the protocol strategy. In fact it’s the first step into building an integrated tool, or suite of tools, in order to simulate networks in various conditions.

**Improvements**
- Unwrap the timestamps in reward payout event
- Remove badger related code from the codebase
- Add oracle snapshot
- Add liquidity snapshot
- Experiment at removing the snapshot details from the engine
- Adding more error messages
- Extend integration tests with global check for net deposits
- Add tests to show margins not being released
- Add trading fees feature test
- Updating return codes
- Implement liquidity supplied snapshot
- Add target liquidity engine
- Remove staking of cache at the beginning of the epoch for spam protection
- Change spam error messages to debug and enabled reloading of configuration
- Remove usage of `vegatime.Now` over the code base
- Add Prometheus metrics on snapshots
- Add markets snapshot
- Refactor delegation
- Add CLI options to start node with a null-blockchain
- Add transaction hash to `SubmitTransactionResponse`
- Add step to clear all events in integration tests
- Fully remove expiry from withdrawals
- Add free form governance proposals
- Reduce the number of iterations in reward calculation
- Include chain ID in event bus messages
- Update validator power in Tendermint based on their staking

**Fixes**
- Handle undelegate stake with no balances gracefully
- Bug fix for incorrectly reporting auto delegation
- Send an epoch event when loaded from checkpoint
- Non determinism in checkpoint fixed
- Set minimum for validator power to avoid accidentally removing them
- Limit delegation epochs in core API
- Fix premature ending of epoch when loading from checkpoint
- Wire network parameters to time service to flush out pending changes
- Disable snapshots while still in testing
- Fix non determinism in topology checkpoint
- Do not validate assets when loading checkpoint from non-validators
- Return 400 on bad mint amounts sent via the faucet
- Add free form governance network parameters to `allKeys` map
- Add ability for the null-blockchain to deliver transactions
- Introduce API to allow time-forwarding in the null-blockchain
- Add support for validator key rotation
- Remove the need for an Ethereum connection when using the null-blockchain
- Allow reloading of null-blockchain configuration while core is running
- Change validator weights to be based on validator score
- Add checkpoint validator key rotation
- Add network parameters overwrite from checkpoints
- Add calls to enable state-sync via tendermint
- Fix non determinism in deposits snapshot
- Add some logging + height/version handling fixes
- Fix problem where chain ID was not present on event bus during checkpoint loading
- Fix rewards checkpoint not assigned to its correct place
- Limit the number of iterations for reward calculation for delegator and fix for division by zero
- Remove state from the witness snapshot and infer it from votes
- Fix notary implementation
- Fix non deterministic test by using same `idGenerator`
- Remove usage of `time.Now()` in the auction state
- Implement `Uint` for network parameters and for money values
- Fix orders still being accepted after market in trading terminated state
- Fix drone pipeline
- Set proper status on withdrawal errors
- Fix to missing pending rewards in LNL checkpoint
- Fix snapshot cleanup, improve logging when specified block height could not be reloaded
- Fix division by zero when all validator scores are 0
- Fix reward account balance not being saved/loaded to/from checkpoint
- Wire rewards checkpoint to checkpoint engine and store infrastructure fee accounts in collateral checkpoint

### Version 0.45.6 | 2021-12-22
- Fully remove expiry from withdrawals and release version v0.45.5

### Version 0.45.4 | 2021-11-05
- If all association is nominated, allow association to be unnominated and nominated again in the same epoch
- Remove staking of cache at the beginning of the epoch for spam protection

### Versions 0.45.0-0.45.2 combined | 2021-10-27
- Add Visual Studio Code configuration
- Add snapshot node topology
- Implement retries for notary transactions
- Implement retries for witness transactions
- Add replay protection snapshot
- Add ABCI snapshot
- Reconcile delegation more frequently
- Add staking snapshot
- Add timestamps to rewards
- Add witness snapshot
- Add stake verifier snapshot
- Update the Vega Wallet version
- Make event forwarder hashing result more random
- Prevent overflow with pending delegation
- Ensure sufficient balances when nominating multiple nodes
- Checkpoints fixes
- Add rewards snapshot
- Add limit snapshot
- Ask for passphrase confirmation on initialisation and generate commands when applicable
- Implement spam snapshot
- Add ERC20 logic signing
- Implement snapshot for notary
- Enable linters
- Ensure the vega and Ethereum wallet are not nil before accessing
- Replay protection snapshot
- Set timeout for system-tests steps
- Improve handling of expected trades
- Make event forward mode deterministic
- Update code still using `uint64`
- Add command to list and describe Vega paths
- Add minimum validators network parameter and bug fix for overflow reward


### Version 0.44.1 | 2021-10-08
- Fix `undelegateNow` to use the passed amount instead of 0
- Remove 0 balance events from checkpoint of delegations
- Fix event sent on reward pool creation + fix owner

### Version 0.44.0 | 2021-10-07
- Clean up and separate checkpoints and snapshots
- Added `assetActions` to banking snapshot
- Add tools and linting
- Assets snapshot implemented
- Add clef wallet
- Snapshot positions engine
- Update to latest proto and go mod tidy
- Adding `IDGenerator` types
- Banking snapshot
- Matching engine snapshots
- Add fields to validators genesis
- Port code to use last version of proto (layout change)
- Collateral snapshots
- Snapshot epoch engine
- Add delegation snapshot
- Document default file location
- Update proto dependencies to latest
- Additional test scenarios for delegation & rewards
- Simplify node wallet integration
- Auto delegation
- Add auto delegation to checkpoint
- Snapshot preparation
- Edge case scenarios delegation
- Fix filename for checkpoints
- Remove delay in reward/delegation calculation
- De-duplicate stake linkings
- Add missing key to all network parameters key map
- Send delegation events
- Simplify checkpointing for network parameters and start fixing collateral checkpoint
- Fixed non-deterministic checkpoint and added auto delegation to checkpoint
- Fixed epoch issue
