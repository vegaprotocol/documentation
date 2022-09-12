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
 
testnet_network_parameters=https://lb.testnet.vega.xyz/network/parameters
mainnet_network_parameters=https://api.token.vega.xyz/network/parameters

# set -e

doc_version=v0.53.0
doc_org=vegaprotocol

grpc_doc_repo=protos
graphql_doc_repo=data-node

# https://raw.githubusercontent.com/vegaprotocol/protos/v0.53.0/generated/proto.json
echo "Fetching grpc..."
curl "https://raw.githubusercontent.com/${doc_org}/${grpc_doc_repo}/${doc_version}/generated/proto.json" -o "proto.json" -s

echo "Fetching graphql..."
curl "https://raw.githubusercontent.com/${doc_org}/${graphql_doc_repo}/${doc_version}/gateway/graphql/schema.graphql" -o "schema.graphql" -s

echo "Fetching latest network parameters as placeholders for NetworkParameter.js"
rm data/testnet_network_parameters.json 2> /dev/null
curl ${testnet_network_parameters} -o "data/testnet_network_parameters.json" 
rm data/mainnet_network_parameters.json 2> /dev/null
curl ${mainnet_network_parameters} -o "data/mainnet_network_parameters.json" 

# Create an empty folder to keep the tools happy
echo "Regenerating docs..."
yarn install
mkdir -p ./docs/grpc
yarn run generate-grpc
yarn run generate-graphql

# This var is used in GraphQL tidyup
echo "GraphQL: Removing generated on date..."
sed -i -E '/Generated on/d' docs/graphql/generated.md
echo "GraphQL: Updating generated title on date..."
sed -i -E 's/Schema Documentation/GraphQL Schema/g' docs/graphql/generated.md

# GRPC tidyup
echo "GRPC: Do not hide titles"
find . -type f -name '*.mdx' -exec sed -i -E 's/hide_title: true/hide_title: false/g' {} +

./scripts/build-sidebars.sh
./scripts/version-switch.sh
yarn run build

echo "Tidying up..."

# GRPC tidyup
rm proto.json
rm schema.graphql

echo "Done! Now check if you need to run the versioning script"

