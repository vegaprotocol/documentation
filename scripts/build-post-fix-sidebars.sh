#!/usr/bin/env bash

#!/usr/bin/env bash

echo "REST: Rename services (improve search results appearance)"
sed -i -E 's/CoreService/Core service/g' docs/api/rest/core/sidebar.js
sed -i -E 's/CoreStateService/Core State/g' docs/api/rest/state/sidebar.js
sed -i -E 's/TradingDataService/Trading Data \(v2\)/g' docs/api/rest/data-v2/sidebar.js
sed -i -E 's/TradingDataService/Trading Data \(v1\)/g' docs/api/rest/data-v1/sidebar.js

echo "GRPC: Rename root ('Files' is not useful)"
sed -i -E 's/Files/GRPC/g' docs/api/grpc/sidebar.js

echo "GRPC: Fix explorer links"
sed -i -E 's/"blockexplorer\/api\/v1\/blockexplorer\.proto"/"api\/grpc\/blockexplorer\/api\/v1\/blockexplorer\.proto"/g' docs/api/grpc/sidebar.js

echo "GRPC: Fix sidebar links (fixes incorrect path mappings for the versioned world)"
sed -i -E 's/"vega/"api\/grpc\/vega/g' docs/api/grpc/sidebar.js
sed -i -E 's/"data-node/"api\/grpc\/data-node/g' docs/api/grpc/sidebar.js

# echo "GRPC: Fix sidebar links (fixes incorrect path mappings for the versioned world)"
# rm docs/api/rest/state/vega-core-state-apis.info.mdx
# rm docs/api/rest/data-v2/vega-data-node-apis.info.mdx

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

