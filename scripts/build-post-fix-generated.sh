#!/usr/bin/env bash
hide_send_button() {
    local file_path="$1"
    local line_to_add="hide_send_button: true"

    # Check if the line already exists in the file
    if ! grep -qF -- "$line_to_add" "$file_path"; then
        echo "Add $line_to_add to $file_path"
        # If the line does not exist, insert it at the second line of the file
        sed -i "-E" "2i\\
$line_to_add
        " "$file_path"
    fi
}

find 'specs' -name '*_temp.json' -exec rm {} +

echo "- REST: Hide submit buttons for observe endpoints"
find "docs/api/rest/data-v2/" -name "trading-data-service-observe-*.mdx" | while read -r file; do hide_send_button "$file"; done
find "versioned_docs" -name "trading-data-service-observe-*.mdx" | while read -r file; do hide_send_button "$file"; done

echo "- REST: Hide submit buttons for export ledger entries endpoint"
find "docs/api/rest/data-v2/" -name "trading-data-service-export-ledger-entries.api.mdx" | while read -r file; do hide_send_button "$file"; done 
find "versioned_docs" -name "trading-data-service-export-ledger-entries.api.mdx" | while read -r file; do hide_send_button "$file"; done 

echo "- REST: Hide submit buttons for mainnet core state api"
find "versioned_docs" -name "core-service-*.mdx" | while read -r file; do hide_send_button "$file"; done 

echo "- REST: Remove indexes (todo: fix hardcoded version)"
find 'versioned_docs/version-v0.73/api/rest/' -name '*-service.mdx' -exec rm {} +
find 'versioned_docs/version-v0.73/api/rest/' -name '*.info.mdx' -exec rm {} +
find 'docs/api/rest/' -name '*-service.mdx' -exec rm {} +
find 'docs/api/rest/' -name '*.info.mdx' -exec rm {} +
# Hacky undelete
git checkout docs/api/graphql/overview.md

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

