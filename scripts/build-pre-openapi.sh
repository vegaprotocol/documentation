#!/usr/bin/env bash
# Produces an OpenAPI equivalent to the swagger
# Only OpenAPI is required for this repo, but vegaprotocol/docs depends on
# .swagger.json. When it is retired, only the openapi.json needs to be kept
convert () {
    if test -e "$1"; then
        # Only try to generate if a third parameter is passed, which is an openapi filename
        if [ -n "$2" ]; then
            if test -f "$2"; then
              echo "  $2 already exists, regenerating.."
            else
              echo "  Generating openapi from swagger ($1 to $2).."
            fi
            npx api-spec-converter --from=swagger_2 --to=openapi_3 "$1" > "$2"
        fi
    fi
}

# Select which version to run against based on package.json version
doc_version="v$(cat package.json | jq .version -r)"

echo "swagger -> openapi: ${doc_version}"
cd "specs/$doc_version"

# Swagger/openapi
trading_data_swagger1_dest="trading_data_v1.swagger.json"
trading_data_openapi_dest="trading_data_v1.openapi.json"
convert "$trading_data_swagger1_dest" "$trading_data_openapi_dest"

trading_data_swagger2_dest="trading_data_v2.swagger.json"
trading_data_openapi_dest="trading_data_v2.openapi.json"
convert "$trading_data_swagger2_dest" "$trading_data_openapi_dest"

core_swagger_dest="core.swagger.json"
core_openapi_dest="core.openapi.json"
convert "$core_swagger_dest" "$core_openapi_dest"

corestate_swagger_dest="corestate.swagger.json"
corestate_openapi_dest="corestate.openapi.json"
convert "$corestate_swagger_dest" "$corestate_openapi_dest"

blocks_swagger_dest="blockexplorer.swagger.json"
blocks_openapi_dest="blockexplorer.openapi.json"
convert "$blocks_swagger_dest" "$blocks_openapi_dest"

cd ../../

