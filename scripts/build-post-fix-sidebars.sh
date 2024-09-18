#!/usr/bin/env bash
if command -v gsed >/dev/null 2>&1; then
    SED_CMD=gsed
else
    if [ "$(uname -s)" = "Darwin" ]; then
        echo "Error: gsed is not available on this Mac system. Try `brew install gsed` Exiting."
        exit 1
    else
        SED_CMD=sed
    fi
fi

echo "REST: Rename services (improve search results appearance)"
$SED_CMD -i -E 's/CoreService/Core service/g' docs/api/rest/core/sidebar.js
$SED_CMD -i -E 's/CoreStateService/Core State/g' docs/api/rest/state/sidebar.js
$SED_CMD -i -E 's/TradingDataService/Trading Data \(v2\)/g' docs/api/rest/data-v2/sidebar.js

echo "GRPC: Rename root ('Files' is not useful)"
$SED_CMD -i -E 's/Files/GRPC/g' docs/api/grpc/sidebar.js

echo "GRPC: Fix explorer links"
$SED_CMD -i -E 's/"blockexplorer\/api\/v1\/blockexplorer\.proto"/"api\/grpc\/blockexplorer\/api\/v1\/blockexplorer\.proto"/g' docs/api/grpc/sidebar.js

echo "GRPC: Fix sidebar links (fixes incorrect path mappings for the versioned world)"
$SED_CMD -i -E 's/"vega/"api\/grpc\/vega/g' docs/api/grpc/sidebar.js
$SED_CMD -i -E 's/"data-node/"api\/grpc\/data-node/g' docs/api/grpc/sidebar.js
find 'docs/api/rest/' -name 'sidebar.js' -exec $SED_CMD -i 's/{"type":"doc","id":"[^"]*"},//g' {} +
# find 'versioned_docs/version-v0.73/api/rest/' -name 'sidebar.js' -exec $SED_CMD -i 's/{"type":"doc","id":"[^"]*"},//g' {} +
# cat versioned_sidebars/version-v0.73-sidebars.json | jq 'def recurse: if type == "array" then map(recurse) elif type == "object" then if has("id") and (.id | type == "string" and test("^api/rest.*-apis$")) then empty else with_entries( .value |= recurse ) end else . end; recurse' > temp.json && mv temp.json versioned_sidebars/version-v0.72-sidebars.json 
# echo "GRPC: Fix sidebar links (fixes incorrect path mappings for the versioned world)"
# rm docs/api/rest/state/vega-core-state-apis.info.mdx
# rm docs/api/rest/data-v2/vega-data-node-apis.info.mdx

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

