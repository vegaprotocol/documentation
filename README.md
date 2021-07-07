# Documenting the Vega protocol

This repo is a WIP for a new documentation format. For the live docs website, visit [docs.testnet.vega.xyz](https://docs.testnet.vega.xyz).

If you have any questions, drop them into Vega's [Discord](https://vega.xyz/discord), [Telegram](https://t.me/vegacommunity), or [Forum](https://community.vega.xyz).

# Docusaurus

This website is built using [Docusaurus 2](https://docusaurus.io/).

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
