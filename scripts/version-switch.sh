#!/usr/bin/env bash

# Old docs
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.47.0/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/mainnet\/graphql/\/docs\/v0.47\/graphql/g' {} +
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.47.0/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/mainnet\/ggrpc/\/docs\/v0.47\/grpc/g' {} +

# Mainnet docs
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.50.2/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/testnet\/graphql/\/docs\/mainnet\/graphql/g' {} +
## Ensure all docs in the versioned folder link to /mainnet/
find 'versioned_docs/version-v0.50.2/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/testnet\/grpc/\/docs\/mainnet\/grpc/g' {} +

# Testnet docs
## Ensure graphql pages in /docs/ link to /testnet/
find 'docs/graphql' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/graphql/\/docs\/testnet\/graphql/g' {} +
## Ensure grpxc graphql pages in /docs/ link to /testnet/
find 'docs/grpc' -type f -name '*.mdx' -exec sed -i -E 's/\/docs\/grpc/\/docs\/testnet\/grpc/g' {} +

# Tidy up any stray backup files from seds (non-gnused)
find . -name "*-E" -exec rm -rf {} +
