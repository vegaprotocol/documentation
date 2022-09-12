#!/usr/bin/env bash

sed -i -E 's/CoreService/REST \> Core service/g' docs/api/rest/core/sidebar.js
sed -i -E 's/CoreStateService/REST \> Core State/g' docs/api/rest/state/sidebar.js
sed -i -E 's/TradingDataService/REST \> Trading Data \(v2\)/g' docs/api/rest/data-v2/sidebar.js
sed -i -E 's/TradingDataService/REST \> Trading Data \(v1\)/g' docs/api/rest/data-v1/sidebar.js


# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

