---
sidebar_position: 1
title: Data node software releases
hide_title: false
---

While the Vega data node (API) software is still closed-source, you can refer here for a full list of release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

### Versions 0.50.1-0.49.3 combined | 2022-04-27

- Breaking change: Extend node model with additional information about reward scores and ranking scores plus validator statuses
- Migrate withdrawal API to retrieve data from `Postgres`
- Migrate existing Oracles API to new `Postgres` database
- Migrate market data time series to consistent format
- Migrate existing Liquidity Provisions API to new `Postgres` database
- Migrate existing Positions API to new `Postgres` database
- Migrate transfers API to retrieve data from `Postgres`
- Migrate existing stake linking API to new `Postgres` database
- Migrate `ERC20WithdrawlApproval` and `NodeSignaturesAggregate` API to new `Postgres` database
- Clean up error handling in subscribers and make action on error configurable
- Trade data retention
- Account for `SettlePosition` events reaching the positions plug-in before the `PositionState` event
- Make sure `SettlePosition` does not result in a division by zero panic
- Correct conversion of pending validator status
- Fix `OracleSpecs GraphQL` query returns error and null when there is no data
- Fix position open volume calculation
- Fix estimate margin calculates incorrectly for limit orders
- Fan out event broker should only call listen once on source broker
- Add bindings for party less liquidity provision requests
- Migrate deposit API to retrieve data from Postgres
- Migrate governance API to retrieve data from Postgres
- Migrate estimator API to retrieve data from Postgres
- Add market risk factors that were missing from market GraphQL API
- Extend node model with additional information about reward scores and ranking scores + validator statuses
- Added support using TLS for `GraphQL` connections
- Data store migration
- Migrate Asset API to retrieve data from `Postgres`
- Fixes incorrect data types in the `MarketData` proto message
- Cache `ChainInfo` data
- Added support for fractional positions
- Constrain the number of epochs for which Vega keeps delegations in memory
- Update go requirement to 1.17
- Updated proto and core and added support for the new events (state and network limits)
- Add support for pagination of delegations
- Move to `ghcr.io` container registry
- Update pegged orders offset
- Expose validator performance score attributes on Node object
- Remove creation of vendor directory
- Added endpoint to support multiple versions of transaction request
- Add basic framework for connecting to `postgres` database
- Add initial `sql` storage package
- Embed the facility to run a file based event store into the data node
- Add `BlockNr()` methods to implementers of event interface
- Add support for running an embedded version of `Postgresql`
- Remove trading mode and future maturity
- Add `grpcui` web user interface
- Add brokers for the new data stores to support sequential and concurrent event processing
- Add balances `sql` store and upgrade `gqlgen`
- Add orders `sql` store
- Add network limits store and API
- Fix compatibility with new `protoc-gen-xxx` tools used in `protos` repository
- Add support for storing market data events in the SQL store
- Persist trade data to SQL store
- Now returns not-found error instead of internal error when proposal not found
- Bug fix for proposal "no" vote showing incorrect weight and tokens
- Add back `assetId` GraphQL resolver for `RewardPerAssetDetail`, change `RiskFactor` fields to strings
- Fix GraphQL support for free-form governance proposals
- Add the missing events conversion to data node
- Market data record should be using the sequence number from the event

### Versions 0.47.0-0.47.1 combined | 2022-01-10

- Constrain the number of epochs for which the Vega core keeps delegations in memory
- Add key rotation support 
- Add statistics to GraphQL API

### Versions 0.46.0-0.46.3 combined | 2022-01-10

- Don't return API error when no rewards for party
- Allow risk factor events to be streamed via GraphQL subscription
- Remove non-functional `SubmitTransaction` GraphQL endpoint
- Add filtering/pagination GraphQL schema for rewards
- Add handling for checking/storing Chain ID
- Added subscriptions for delegations & rewards
- Add changelog and project board Github actions and update linked PR action version
- Set time limit for system-tests, and also do not ignore failures for pull requests
- Move to XDG file structure
- Stabilise API tests
- Populate target address for `erc20WithdrawalApprovals`
- Fix rewards schema and update Vega dependencies to have reward event fixes
- Update GraphQL schema to not require every asset to have a global reward account.
