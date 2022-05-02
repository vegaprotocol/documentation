#!/usr/bin/env bash

# Old docs
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.47.0/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/graphql/\/docs\/mainnet\/graphql/g' {} +
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.47.0/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/grpc/\/docs\/mainnet\/grpc/g' {} +

# Testnet docs
## Ensure graphql pages in /docs/ link to /testnet/
find 'docs/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/graphql/\/docs\/testnet\/graphql/g' {} +
## Ensure grpxc graphql pages in /docs/ link to /testnet/
find 'docs/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/grpc/\/docs\/testnet\/grpc/g' {} +

# Tidy up any stray backup files from seds (non-gnused)
find . -name "*-E" -exec rm -rf {} +
