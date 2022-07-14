[![Netlify Status](https://api.netlify.com/api/v1/badges/5c36333c-e63e-4bb3-8819-ef16ff2183de/deploy-status)](https://app.netlify.com/sites/vega-docusaurus/deploys)


# Documenting the Vega protocol

This repo currently includes documentation about the Vega restricted mainnet. For testnet documentation, visit [docs.fairground.vega.xyz](https://docs.fairground.vega.xyz).

If you have any questions, drop them into Vega's [Discord](https://vega.xyz/discord), [Telegram](https://t.me/vegacommunity), or [Forum](https://community.vega.xyz).

# Docusaurus

This website is built using [Docusaurus 2](https://docusaurus.io/).

## Requirements
For the scripts to work there must be an up to date version of `node` installed along with `yarn`.

The best way to get the correct version of node is using the `nvm` utility which can be installed from these instructions:

`https://github.com/nvm-sh/nvm#installing-and-updating`

Once nvm is installed (check with `nvm --version`) you can run the following command from inside the root of the documentation folder to download and install the correct version of node required by the script:

```
> nvm install
> npm --version
```

`Yarn` can be install by running:

```
> npm install -g yarn
> yarn --version
```

The libraries needed by yarn can be installed by:

```
> yarn install
```

Lastly you need to have Python3 installed, you can check if you have by running:

```
> python3 --version
```


## Installation and local development

Edit `scripts/generate-api-docs.sh` and update `vega_api_branch` to a new branch/tag as necessary.

```console
cd /path/to/src/github.com/vegaprotocol/documentation
GITHUB_API_TOKEN=a1b2c3 ./scripts/generate-api-docs.sh
```

## Running locally

```console
yarn run serve
```

# API documentation

## Plugins used
- [docusaurus-protobuffet](https://www.npmjs.com/package/docusaurus-protobuffet) - Protobuf docs
- [redocusaurus](https://www.npmjs.com/package/redocusaurus) - REST docs
- [docusaurus2-graphql-doc-generator](https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator) - GraphQL docs

## Setup
- GraphQL docs are generated in to `/docs/graphql/`
- docusaurus-protobuffet-plugin is used to generate docs, but unlike the defaults setup generates them into the `/docs/` so as to avoid documenting them separately
- New versions of REST docs are configured in `docusaurus.config.js`, as redocusaurus does not generate pages.

# Versioning
This site uses [Docusaurus' built in support for versioning](https://docusaurus.io/docs/versioning). This is configured so that:

* */docs/mainnet/* represents the last deployed version on [mainnet](https://blog.vega.xyz/what-to-expect-from-restricted-mainnet-616086d9fdaf)
* */docs/testnet/* represents the most recent version on [Fairground testnet](https://fairground.wtf)

## Version tags
In these pre-v1-in-semver times, where version numbers are in the form v(`major.minor.patch`) the versions move when a new *minor* release is deployed to a network. Tagging a version is done [with Docusaurus' `docs:version` command](https://docusaurus.io/docs/versioning#tagging-a-new-version), for example:

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
Some of the [API docs generators](#plugins-used) put a full link in the sidebar or documentaiton, rather than relative. There is a script in `scripts/version-switch.sh` that contains some example replacement regexes that will help with this

### Post tagging: adding redocusaurus documents
Ensure that there are three new redocusaurus configurations in `docusaurus.config.js` that have the correct version label in them.

# Notes
- Only *the sidebar* and *things in the /docs/ folder* are 'versioned'.
- Some updates will need to touch old versions as well as the current version
- Some files (particularly ones with Ethereum addresses) need to be checked to ensure they point to the right networks

