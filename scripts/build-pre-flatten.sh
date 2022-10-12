#!/usr/bin/env bash

# This file does some tidyup, and probably shouldn't really exist.
# It could be run automatically when a new PR
# to the spec folder comes in. Or the PR could run the equivalent of this
# script. Or even... openapi docs could be generated from the start.
#
# This script lets us pretend it is, and also keeps compatibility with vegaprotocol/docs

# Moves a file only if it exists, explains why it doesn't if it doesn't
# Also produces an OpenAPI equivalent to the swagger
# Only OpenAPI is required for this repo, but vegaprotocol/docs depends on
# .swagger.json. When it is retired, only the openapi.json needs to be kept
movePlease () {
    if test -e "$1"; then
        mv "$1" "$2"
        echo "$1 moved (from $2)"
    else
        if test -f "$2"; then
            echo "$2 already exists"

        else
            echo "$1 missing"
        fi
    fi

    if test -e "$2"; then
        # Only try to generate if a third parameter is passed, which is an openapi filename
        if [ -n "$3" ]; then
            if test -f "$3"; then
              echo "  $3 already exists, regenerating.."
            else
              echo "  Generating openapi from swagger ($2 to $3).."
            fi
            npx api-spec-converter --from=swagger_2 --to=openapi_3 "$2" > "$3"
        fi
    fi
}

# Select which version to run against based on package.json version
doc_version="v$(cat package.json | jq .version -r)"

echo "flattening: ${doc_version}"
cd "specs/$doc_version"

# Swagger/openapi
trading_data_swagger1="./data-node/swagger/data-node/api/v1/trading_data.swagger.json"
trading_data_swagger1_dest="trading_data_v1.swagger.json"
trading_data_openapi_dest="trading_data_v1.openapi.json"
movePlease "$trading_data_swagger1" "$trading_data_swagger1_dest" "$trading_data_openapi_dest"

trading_data_swagger2="./data-node/swagger/data-node/api/v2/trading_data.swagger.json"
trading_data_swagger2_dest="trading_data_v2.swagger.json"
trading_data_openapi_dest="trading_data_v2.openapi.json"
movePlease "$trading_data_swagger2" "$trading_data_swagger2_dest" "$trading_data_openapi_dest"

core_swagger="./vega/swagger/vega/api/v1/core.swagger.json"
core_swagger_dest="core.swagger.json"
core_openapi_dest="core.openapi.json"
movePlease "$core_swagger" "$core_swagger_dest" "$core_openapi_dest"

corestate_swagger="./vega/swagger/vega/api/v1/corestate.swagger.json"
corestate_swagger_dest="corestate.swagger.json"
corestate_openapi_dest="corestate.openapi.json"
movePlease "$corestate_swagger" "$corestate_swagger_dest" "$corestate_openapi_dest"

blocks_swagger="./blockexplorer/swagger/blockexplorer/blockexplorer.swagger.json"
blocks_swagger_dest="blockexplorer.swagger.json"
blocks_openapi_dest="blockexplorer.openapi.json"
movePlease "$blocks_swagger" "$blocks_swagger_dest" "$blocks_openapi_dest"

#
# Non-swagger/openapi - omits the third param to movePlease so no openapi stuff is done
#
proto="./grpc/proto.json"
proto_dest="./proto.json"
movePlease "$proto" "$proto_dest"

movePlease "./datanode-schema.graphql" "./schema.graphql"

movePlease "./wallet/api/openrpc.json" "./openrpc.json"

#
# Delete the messy folders full of files we no longer need
#
rm -rf blockexplorer
rm -rf data-node
rm -rf grpc
rm -rf vega
rm -rf wallet

cd ../../

