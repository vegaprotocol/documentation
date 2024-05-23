#!/usr/bin/env bash

version="$(cat package.json | jq .version -r)"
doc_version="v$version"

echo "Pre-fixup: $doc_version"

echo "- Swagger: Add version in"
find "specs/$doc_version/" -name "*.swagger.json" -exec sed -i -E "s/version not set/$version/g" {} +

echo "- Swagger: Remove trailing punctuation from summaries"
# These are some ugly sed lines too, but removes trailing , or .
sed -i -E 's/"summary": "\(.*[^,.]\).*"/"summary": "\1"/g' "specs/$doc_version/trading_data_v1.swagger.json"
sed -i -E 's/"summary": "\(.*[^,.]\).*"/"summary": "\1"/g' "specs/$doc_version/trading_data_v2.swagger.json"

echo "- Swagger: Give TradingDataService v1 a distinct name"
sed -i -E 's/"name": "TradingDataService"/"name": "Trading Data Service (v1)"/' "specs/$doc_version/trading_data_v1.swagger.json"

echo "- Swagger: Give TradingDataService v2 a distinct name"
sed -i -E 's/"name": "TradingDataService"/"name": "Trading Data Service (v2)"/' "specs/$doc_version/trading_data_v2.swagger.json"

echo "- Swagger: Give BlockExplorerService a better name"
sed -i -E 's/"name": "BlockExplorerService"/"name": "Block Explorer"/' "specs/$doc_version/blockexplorer.swagger.json"
sed -i -E 's/BlockExplorerService/BlockExplorer/' "specs/$doc_version/blockexplorer.swagger.json"

echo "- Swagger: CoreService -> TransactionService"
sed -i -E 's/CoreService/Transaction/' "specs/$doc_version/transaction.swagger.json"

echo "- Swagger: Fix servers"
find "specs/$doc_version/" -name "*.swagger.json" -exec sed -i -E 's/lb.testnet.vega.xyz/api.n10.testnet.vega.xyz/g' {} +
find "specs/$doc_version/" -name "*.swagger.json" -exec sed -i -E 's/\/datanode\/rest//g' {} +
find "specs/$doc_version/" -name "*.swagger.json" -exec sed -i -E 's/"http",//g' {} +

echo "- GRPC: Filter out files that contain only internal types"
node ./scripts/build-pre-fix-specs-filter-protos.js $doc_version

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +




