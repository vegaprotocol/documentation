---
sidebar_position: 1
title: Data node software releases
hide_title: false
---

While the Vega data node (API) software is still closed-source, you can refer here for a full list of release notes for each version that the validators use to run the Vega mainnet. Releases are listed with their semantic version number and the date the release was made available to mainnet validators.

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
