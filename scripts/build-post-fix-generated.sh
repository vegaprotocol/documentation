#!/usr/bin/env bash

find 'specs' -name '*_temp.json' -exec rm {} +

echo "- REST: Hide submit buttons for observe endpoints"
find "docs/api/rest/data-v2/" -name "trading-data-service-observe-*.mdx" -exec sed -i -E 's/hide_title: true/hide_title: true\r\nhide_send_button: true/g' {} +
#find "versioned_docs" -name "trading-data-service-observe-*.mdx" -exec sed -i -E 's/hide_title: true/hide_title: true\r\nhide_send_button: true/g' {} +

echo "- REST: Hide submit buttons for export ledger entries endpoint"
find "docs/api/rest/data-v2/" -name "trading-data-service-export-ledger-entries.api.mdx" -exec sed -i -E 's/hide_title: true/hide_title: true\r\nhide_send_button: true/g' {} +
find "versioned_docs" -name "trading-data-service-export-ledger-entries.api.mdx" -exec sed -i -E 's/hide_title: true/hide_title: true\r\nhide_send_button: true/g' {} +

echo "- REST: Remove indexes (todo: fix hardcoded version)"
find 'versioned_docs/version-v0.72/api/rest/' -name '*-service.mdx' -exec rm {} +
find 'docs/api/rest/' -name '*-service.mdx' -exec rm {} +

# Hacky undelete
git checkout docs/api/graphql/overview.md

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

