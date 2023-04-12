#!/usr/bin/env bash

#!/usr/bin/env bash

echo "GraphQL: Remove unused generated sidebar"
rm -f docs/graphql/sidebar.schema.js

echo "REST: Rename services (improve search results appearance, remove indexes)"
sed -i -E 's/CoreService/Core service/g' docs/api/rest/core/sidebar.js
sed -i -E 's|{"type":"doc","id":"api/rest/core/vega-core-apis"},||g' docs/api/rest/core/sidebar.js

sed -i -E 's/TradingDataService/Trading Data \(v2\)/g' docs/api/rest/data-v2/sidebar.js
sed -i -E 's|{"type":"doc","id":"api/rest/data-v2/vega-data-node-apis"},||g' docs/api/rest/data-v2/sidebar.js

sed -i -E 's/CoreStateService/Core State/g' docs/api/rest/state/sidebar.js
sed -i -E 's|{"type":"doc","id":"api/rest/state/vega-core-state-apis"},||g' docs/api/rest/state/sidebar.js

sed -i -E 's|{"type":"doc","id":"api/rest/explorer/vega-block-explorer-apis"},||g' docs/api/rest/explorer/sidebar.js
sed -i -E 's|{"type":"doc","id":"api/rest/vega-wallet/reference/local-service/wallet-api"},||g' docs/api/vega-wallet/reference/local-service/sidebar.js

sed -i -E 's|{"type":"doc","id":"version-v0.53/api/rest/core/vega-api-v-1-core-proto"},||g' versioned_docs/version-v0.53/api/rest/core/sidebar.js
sed -i -E 's|{"type":"doc","id":"version-v0.53/api/rest/data-v1/data-node-api-v-1-trading-data-proto"},||g' versioned_docs/version-v0.53/api/rest/data-v1/sidebar.js
sed -i -E 's|{"type":"doc","id":"version-v0.53/api/rest/state/vega-api-v-1-corestate-proto"},||g' versioned_docs/version-v0.53/api/rest/core/sidebar.js


echo "GRPC: Rename root ('Files' is not useful)"
sed -i -E 's/Files/GRPC/g' docs/api/grpc/sidebar.js

echo "GRPC: Fix explorer links"
sed -i -E 's/"blockexplorer\/blockexplorer.proto"/"api\/grpc\/blockexplorer\/blockexplorer.proto"/g' docs/api/grpc/sidebar.js

echo "GRPC: Fix sidebar links (fixes incorrect path mappings for the versioned world)"
sed -i -E 's/"vega/"api\/grpc\/vega/g' docs/api/grpc/sidebar.js
sed -i -E 's/"data-node/"api\/grpc\/data-node/g' docs/api/grpc/sidebar.js

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

