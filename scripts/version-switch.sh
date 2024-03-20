#!/usr/bin/env bash

# -----
# Most links are relative, which means they don't need to change when docs is versioned 
# For those that aren't, we have sed to replace links
# -----
# After running docusaurus docs:version, you'll have a new folder in versioned_docs, and versioned_sidebars
# Below, update the values where appropriate. For instance, when 'docs' was tagged to 'v0.50.2',
# - 'mainnet' moved to version 'v0.50.2', which means replacing all the links in what was formerly 'testnet' to 'mainnet'
# - Now that v0.47.0 is not deployed anywhere, it means removing its bespoke path and fixing all the links from 'mainnet' to 'v0.47.0'
# - Pages that use <EthAddresses /> will need their frontmatter updated to reflect network
# -----

# Mainnet docs
find 'versioned_docs' -type f -name '*.md' -exec sed -i -E 's#title: Schema Documentation#title: GraphQL Schema Documentation#g' {} +
find 'docs' -type f -name '*.md' -exec sed -i -E 's#title: Schema Documentation#title: GraphQL Schema Documentation#g' {} +

## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs' -type f -name '*.mdx' -exec sed -i -E 's#testnet/api/graphql#mainnet/api/graphql#g' {} +

## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs' -type f -name '*.mdx' -exec sed -i -E 's#testnet/api/grpc#mainnet/api/grpc#g' {} +

## Sidebar fixup
sed -i -E 's/\/docs\/testnet\//\/docs\/mainnet\//g' versioned_sidebars/version-v0.75-sidebars.json 

# Testnet docs
## Ensure graphql pages in /docs/ link to /testnet/
find 'docs/api/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/graphql/\/docs\/testnet\/graphql/g' {} +
## Ensure grpc pages in /docs/ link to /testnet/
find 'docs/api/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/grpc/\/docs\/testnet\/grpc/g' {} +

## Ensure frontmatter for non-testnet docs is set to mainnets
find 'versioned_docs' -type f -name '*.mdx' -exec sed -i -E 's/vega_network: TESTNET/vega_network: MAINNET/g' {} +
find 'versioned_docs' -type f -name '*.md' -exec sed -i -E 's/vega_network: TESTNET/vega_network: MAINNET/g' {} +

## Fix tutorials
find 'versioned_docs' -type f -name '*.mdx' -exec sed -i -E 's/--network fairground/--network mainnet1/g' {} +
find 'versioned_docs' -type f -name '*.md' -exec sed -i -E 's/--network fairground/--network mainnet1/g' {} +

## Explorer links
find 'versioned_docs' -type f -name '*.mdx' -exec gsed -i -E 's/https:\/\/explorer.fairground.wtf/https:\/\/explorer.vega.xyz/g' {} +
find 'versioned_docs' -type f -name '*.md' -exec gsed -i -E 's/https:\/\/explorer.fairground.wtf/https:\/\/explorer.vega.xyz/g' {} +


# Tidy up any stray backup files from seds (non-gnused)
find . -name "*-E" -exec rm -rf {} +
