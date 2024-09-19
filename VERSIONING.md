# Versioning

This site uses [Docusaurus' built in support for versioning](https://docusaurus.io/docs/versioning). This is configured so that:

- _/release/_ represents the last deployed version on Testnet
- _/pre-release/_ represents the likely next release


# Overview
![update-process png excalidraw](https://user-images.githubusercontent.com/6678/200811843-564a0127-2f25-4f6b-ae56-10305cf1ddfa.png)

Every time a release is [tagged in vegaprotocol/vega](https://github.com/vegaprotocol/vega), a [pull request is created in this repository](https://github.com/vegaprotocol/documentation/pulls?q=is%3Apr+automated+specs+update).  

1. When the release is adopted on testnet, in that branch, follow the [Changing the testnet version](#changing-the-testnet-version) instructions
2. Patch releases that are deployed to the network follow the same update process as above. Patches that do not get deployed to testnet don't require an update - the pull request can be closed.
3. When a release is adopted on mainnet, follow the [Changing the mainnet version](#changing-the-mainnet-version) instructions.

--- 

## tl;dr
- [/docs/](https://github.com/vegaprotocol/documentation/tree/main/docs/) is 'the current testnet version'. Every time testnet is updated, the docs here will be updated. This folder is served as `/pre-release/`.
- [/versioned_docs/](https://github.com/vegaprotocol/documentation/tree/main/versioned_docs/) contains version folders. The most recent version in this folder is served as `/release/`.
- Only one version is kept in `versioned_docs`. [vegaprotocol/vega](https://github.com/vegaprotocol/vega). This is because each version contains a lot of pages, which slows down the build - and at this point in time, the benefit of keeping old versions is small.

## Changing the testnet version
When a new release is *tagged*, a pull request with the API documents will automatically be created. It will add a new folder in `/specs/`, for example `v0.88.1`. Only those versions that actually get released need to be merged, so **when the network is updated**:

1. Update the version in [package.json](./package.json) to the version that has been released (e.g. `0.88.1`)
2. Run `./scripts/build.sh`

This runs a number of tasks:
- Tidying up the file structure in `/specs/`
- Making minor tweaks to those files to improve the output
- Generate:
  - REST, GRPC, GraphQL API docs
  - JSON-RPC page
  - Example proposals
- Making minor tweaks to those generated files to improve the output
- Attempt a build

If everything passes, you're good to create a pull request and do some manual testing. If something *fails*, check the output. If Generate Proposals fails, it's likely a breaking API change, and the relevant generator will need to be updated.

## Changing the mainnet version
The assumption is that when a release is adopted by a network, it will be done from the latest testnet release. Unlike testnet, **there is no automated process for knowing when mainnet adopts a new version.**. This process must be kicked off manually.

1. Update the `mainnetVersion` field in [package.json](./package.json)
2. Run `yarn docusaurus version v0.88.1` - where `v0.88.1` is the version that has been deployed to the network. This creates a new folder under [versioned_docs](https://github.com/vegaprotocol/documentation/tree/main/versioned_docs/) containing a snapshot of the current testnet docs.
3. Run `./scripts/version-switch.sh`

This runs a number of tasks on the newly snapshotted docs for mainnet:
- replace any [front matter](https://docusaurus.io/docs/markdown-features#front-matter) metadata referring to TESTNET to MAINNET
- Fix any sidebar links that still contain `/pre-release/` to `/release/`


# Notes

- Some documentation updates will need to touch old documentation versions as well as the current version. This is mainly true for sections like 'Concepts', where the broad point of the file covers the protocol rather than the API documentation.
- Some files (particularly ones with Ethereum addresses) need to be checked to ensure they point to the right networks. This should be done automatically by the scripts ([see Changing the mainnet version](#changing-the-mainnet-version), but check manually to ensure the wrong contract addresses aren't shown for the relevant network)
- `./scripts/build.sh` (see [Changing the testnet version](#changing-the-testnet-version)) does a lot of steps that are workarounds - see [issue #326](https://github.com/vegaprotocol/documentation/issues/326). 
  - `./scripts/build-pre-flatten.sh` reorganises the `specs` folder in the pull request created when [vegaprotocol/vega is tagged](https://github.com/vegaprotocol/vega/blob/develop/.github/workflows/release-docs.yml). This could be run upstream, or automatically on PR.
  - `yarn run generate-proposals` is intentionally error happy. It creates example code for the network, and is very sensitive to REST API changes. A failure in this script indicates that the proposal format changed.