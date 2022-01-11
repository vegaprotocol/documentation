---
sidebar_position: 1
title: Core software releases
hide_title: false
---

While the Vega core software is closed-source, you can refer here for a full list of release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

### Versions 0.46.0-0.47.4 combined | 2022-01-11

This release was made available to validators on 11 January, 2022. 

A key theme of this combined release has been improvements to the checkpointing feature; this includes fixes to ensure epochs and other key data is preserved as they should be during checkpoint restarts. In addition to this, the “free-form governance” feature has been implemented. This feature further decentralises the protocol by allowing users to submit a range of governance proposals for community consideration and voting.

The validators are now being given a score internally for properly validating blocks and processing the application state. This is used to set their voting power in tendermint, and can impact validators' rewards in reflection of their performance in the network. This is another step in getting the network more decentralised, and open to new validators joining the network.

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
