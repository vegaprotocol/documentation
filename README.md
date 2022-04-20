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

Edit `scripts/build.sh` and update `vega_api_branch` to a new branch/tag as necessary.

```console
cd /path/to/src/github.com/vegaprotocol/documentation
GITHUB_API_TOKEN=a1b2c3 ./scripts/build.sh
```

## Running locally

```console
yarn run serve
```
