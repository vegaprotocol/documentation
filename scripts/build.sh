#!/usr/bin/env bash

# This script fetches schemas for our three documentation types (REST, GraphQL, GRPC) and uses
# docusaurus generator plugins to produce markdown documents for them.
#
# Each documentation type uses a different generator, so the behaviour for each varies slightly
#
# Additionally, a script is called to generate proposal documentation. It's not a docusaurus plugin.


doc_version="v$(cat package.json | jq .version -r)"
echo "Building: v${doc_version}"


echo " 🛠  Tidy up"
echo "==========================="

# Removing old versions
rm proto.json 2> /dev/null
rm schema.graphql 2> /dev/null
rm -rf docs/api/graphql 2> /dev/null
rm -rf docs/api/grpc/data-node 2> /dev/null
rm -rf docs/api/grpc/vega 2> /dev/null
rm -rf docs/api/grpc/blockexplorer 2> /dev/null
## Back compat: Remove former GRPC docs path
rm -rf docs/graphql 2> /dev/null
rm -rf versioned_docs/version-v0.53.0/graphql 2> /dev/null
## Back compat: Remove former GRPC docs path
rm -rf docs/grpc 2> /dev/null
rm -rf versioned_docs/version-v0.53.0/grpc 2> /dev/null
 
echo ""
echo " 🛠  Install deps"
echo "==========================="
echo ""

yarn install

set -e

echo ""
echo " 🛠  The main bit"
echo "==========================="
echo ""

# Unnest important files, delete the rest
./scripts/build-pre-flatten.sh
# Fix things that are easier fixed in the specs than the output
./scripts/build-pre-fix-specs.sh


# Inject more testnet servers for testnet
## Run vaguer and store the output
./scripts/build-pre-vaguer.sh


# Generate OpenAPI from swagger 
./scripts/build-pre-openapi.sh
# Now inject servers
node --no-warnings --experimental-fetch scripts/build-pre-openapi-servers.js
MAINNET=true node --no-warnings --experimental-fetch scripts/build-pre-openapi-servers.js

export NO_UPDATE_NOTIFIER="true"

yarn run generate-netparams

yarn run generate-grpc
yarn run generate-graphql
yarn run docusaurus clean-api-docs all
yarn run generate-rest

yarn run generate-proposals
yarn run generate-openrpc

echo ""
echo " 🛠  Fix ups"
echo "==========================="
echo ""

# Fix unconfigurable things from generated docs
./scripts/build-post-fix-generated.sh
# Fix up sidebars for all APIs
./scripts/build-post-fix-sidebars.sh

if [ -z ${SKIP_BUILD+x} ]; then yarn run build; else echo "Docusaurus build skipped"; fi

echo "Done! Now check if you need to run the versioning script (./scripts/version.sh)"


