#!/usr/bin/env bash

# This script fetches schemas for our three documentation types (REST, GraphQL, GRPC) and uses
# docusaurus generator plugins to produce markdown documents for them.
#
# Each documentation type uses a different generator, so the behaviour for each varies slightly
#
# Additionally, a script is called to generate proposal documentation. It's not a docusaurus plugin.

# Removing old versions
rm proto.json 2> /dev/null
rm schema.graphql 2> /dev/null
rm -rf docs/graphql/ 2> /dev/null
rm -rf docs/grpc 2> /dev/null
 
testnet_network_parameters=https://api.n07.testnet.vega.xyz/network/parameters
mainnet_network_parameters=https://api.vega.xyz/network/parameters

set -e
doc_version=v0.55.0

# This should be using /specs/vxxx but those versions are not yet build correctly
echo "Fetching grpc..."
cp "./specs/${doc_version}/proto.json" ./proto.json

echo "Fetching graphql..."
cp "./specs/${doc_version}/schema.graphql" ./schema.graphql

echo "Fetching latest network parameters as placeholders for NetworkParameter.js"
rm specs/testnet_network_parameters.json 2> /dev/null
curl ${testnet_network_parameters} -o "specs/testnet_network_parameters.json"
rm specs/mainnet_network_parameters.json 2> /dev/null
curl ${mainnet_network_parameters} -o "specs/mainnet_network_parameters.json"

# Create an empty folder to keep the tools happy
echo "Regenerating docs..."
yarn install
yarn run generate-grpc
yarn run generate-rest
yarn run generate-graphql --force

# This var is used in GraphQL tidyup
echo "GraphQL: Removing generated on date..."
sed -i -E '/Generated on/d' docs/graphql/generated.md
echo "GraphQL: Updating generated title on date..."
sed -i -E 's/Schema Documentation/GraphQL Schema/g' docs/graphql/generated.md

# GRPC tidyup
echo "GRPC: Do not hide titles"
find './grpc/' -type f -name '*.mdx' -exec sed -i -E 's/hide_title: true/hide_title: false/g' {} +

# GRPC tidyup
echo "REST: Hide titles"
find './docs/api/rest' -type f -name '*.mdx' -exec sed -i -E 's/hide_title: false/hide_title: true/g' {} +


# Fix up sidebars for all APIs
./scripts/build-sidebars.sh
yarn run build

echo "Tidying up..."

# GRPC tidyup
rm proto.json
rm schema.graphql

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +


echo "Done! Now check if you need to run the versioning script (./scripts/version.sh)"

