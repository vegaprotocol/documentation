#!/usr/bin/env bash

version="$(cat package.json | jq .version -r)"
doc_version="v$version"

echo "Pre-fixup: $doc_version"

echo "Swagger: Add version in"
sed -i -E "s/version not set/$version/g" "specs/$doc_version/trading_data_swagger_v1.json"

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

