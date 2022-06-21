[![Netlify Status](https://api.netlify.com/api/v1/badges/5c36333c-e63e-4bb3-8819-ef16ff2183de/deploy-status)](https://app.netlify.com/sites/vega-docusaurus/deploys)


# Documenting the Vega protocol
This repo currently includes documentation about the Vega restricted mainnet. For testnet documentation, visit [docs.fairground.vega.xyz](https://docs.fairground.vega.xyz).

If you have any questions, drop them into Vega's [Discord](https://vega.xyz/discord) or [Forum](https://community.vega.xyz).

## Contributions
Raise issues about content that you would like to see included or issues you've spotted. 

If you'd like to fix something yourself or contribute to existing documentation, you can fork the repo and create a pull request. Keep an eye on your notifications to be sure you see any follow-up questions or comments! 

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
