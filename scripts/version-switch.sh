#!/usr/bin/env bash

# -----
# Most links are relative, which means they don't need to change when docs is versioned 
# For those that aren't, we have sed to replace links
# -----
# After running docusaurus docs:version, you'll have a new folder in versioned_docs, and versioned_sidebars
# Below, update the values where appropriate. For instance, when 'docs' was tagged to 'v0.50.2',
# - 'mainnet' moved to version 'v0.50.2', which means replacing all the links in what was formerly 'testnet' to 'mainnet'
# - Now that v0.47.0 is not deployed anywhere, it means removing its bespoke path and fixing all the links from 'mainnet' to 'v0.47.0'
# - You will still get some build errors related to the REST documentation. This is managed from docusaurus.config.js
# - Pages that use <EthAddresses /> will need their frontmatter updated to reflect network
# -----

# Old docs
## GraphQL fixup
find 'versioned_docs/version-v0.47.0/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/mainnet\/graphql/\/docs\/v0.47\/graphql/g' {} +
## GRPC fixup
find 'versioned_docs/version-v0.47.0/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/mainnet\/grpc/\/docs\/v0.47\/grpc/g' {} +
## Sidebar fixup
sed -i -E 's/\/docs\/mainnet\//\/docs\/v0.47\//g' versioned_sidebars/version-v0.47.0-sidebars.json 


# Mainnet docs
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.50.2/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/testnet\/graphql/\/docs\/mainnet\/graphql/g' {} +
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.50.2/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/testnet\/grpc/\/docs\/mainnet\/grpc/g' {} +
## Sidebar fixup
sed -i -E 's/\/docs\/testnet\//\/docs\/mainnet\//g' versioned_sidebars/version-v0.50.2-sidebars.json 

# Testnet docs
## Ensure graphql pages in /docs/ link to /testnet/
find 'docs/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/graphql/\/docs\/testnet\/graphql/g' {} +
## Ensure grpxc graphql pages in /docs/ link to /testnet/
find 'docs/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/grpc/\/docs\/testnet\/grpc/g' {} +

# Tidy up any stray backup files from seds (non-gnused)
find . -name "*-E" -exec rm -rf {} +
