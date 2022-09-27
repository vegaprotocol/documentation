# Versioning

This site uses [Docusaurus' built in support for versioning](https://docusaurus.io/docs/versioning). This is configured so that:

- _/docs/mainnet/_ represents the last deployed version on [mainnet](https://blog.vega.xyz/what-to-expect-from-restricted-mainnet-616086d9fdaf)
- _/docs/testnet/_ represents the most recent version on [Fairground testnet](https://fairground.wtf)

Both of those do not neccessarily move in lock step. There could be two version updates to one network before the other updates. Bumping a testnet version is easy. Moving a testnet version to mainnet is harder.

# Changing the testnet version
When a new release is *tagged*, a pull request with the API documents will automatically be create. It will add a new folder in `/specs/`, for example `v0.88.1`. When the network is updated:

1. Update the version in [package.json](./package.json) to the version that has been released (e.g. `0.88.1`)
2. Run `./scripts/build.sh`

This runs a number of tasks:
- Tidying up the file structure in `/specs/`
- Making minor tweaks to those files to improve the output
- Generate:
  - REST, GRPC, GraphQL API docs
  - OpenRPC page
  - Example proposals
- Making minor tweaks to those generated files to improve the output
- Attempt a build

If everything passes, you're good to create a pull request and do some manual testing. If something *fails*, check the output. If Generate Proposals fails, it's likely a breaking API change, and the relevant generator will need to be updated.

# Changing the mainnet version
The assump

## Version tags

In these pre-v1-in-semver times, where version numbers are in the form v(`major.minor.patch`) the versions move when a new _minor_ release is deployed to a network. Tagging a version is done [with Docusaurus' `docs:version` command](https://docusaurus.io/docs/versioning#tagging-a-new-version), for example:

```
yarn run docusaurus docs:version v0.54
```

This would take a copy of the current docs folder, and make a new folder in `versioned_docs` called `v0.54` with the same content. This mostly works for us, but there are now some manual steps:

### Post tagging: moving labels

Then in [docusaurus.config.js](https://github.com/vegaprotocol/documentation/blob/main/docusaurus.config.js#L196-L210), the `docs` configuration needs to be updated:

- `lastVersion` should be set to the version number of `mainnet`
- The labels and paths should be updated so that the [networks mentioned above](#versioning) line up to their deployed version
- This will leave older versions without a 'testnet' or 'mainnet' mapping - leave the label and path as the version number
- Only two releases need to be kept. Older ones can be removed.

### Post tagging: fixing 'absolute' links

Some of the [API docs generators](#plugins-used) put a full link in the sidebar or documentation, rather than relative. There is a script in `scripts/version-switch.sh` that contains some example replacement regexes that will help with this

### Post tagging: adding redocusaurus documents

Ensure that there are three new redocusaurus configurations in `docusaurus.config.js` that have the correct version label in them.

# Notes

- Only _the sidebar_ and _things in the /docs/ folder_ are 'versioned'.
- Some updates will need to touch old versions as well as the current version
- Some files (particularly ones with Ethereum addresses) need to be checked to ensure they point to the right networks
- `scripts/version-switch.sh` contains some useful commands for ensuring that version changes are made correctly. It isn't quite ready for people unfamiliar with the system, but is commented well and intended to eventually cover most versions.
- Regenerating the wallet OpenAPI v2 documentation is a manual step currently, using openapi-md
