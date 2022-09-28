#!/usr/bin/env bash

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
}

doc_version="v$(cat package.json | jq .version -r)"

echo "flattening: ${doc_version}"
cd "specs/$doc_version"

trading_data_swagger1="./data-node/swagger/data-node/api/v1/trading_data.swagger.json"
trading_data_swagger1_dest="./trading_data_v1.swagger.json"
movePlease "$trading_data_swagger1" "$trading_data_swagger1_dest"

trading_data_swagger2="./data-node/swagger/data-node/api/v2/trading_data.swagger.json"
trading_data_swagger2_dest="./trading_data_v2.swagger.json"
movePlease "$trading_data_swagger2" "$trading_data_swagger2_dest"

core_swagger="./vega/swagger/vega/api/v1/core.swagger.json"
core_swagger_dest="./core.swagger.json"
movePlease "$core_swagger" "$core_swagger_dest"

corestate_swagger="./vega/swagger/vega/api/v1/corestate.swagger.json"
corestate_swagger_dest="./corestate.swagger.json"
movePlease "$corestate_swagger" "$corestate_swagger_dest"

blocks_swagger="./blockexplorer/swagger/blockexplorer/blockexplorer.swagger.json"
blocks_swagger_dest="./blockexplorer.swagger.json"
movePlease "$blocks_swagger" "$blocks_swagger_dest"

proto="./grpc/proto.json"
proto_dest="./proto.json"
movePlease "$proto" "$proto_dest"

movePlease "./datanode-schema.graphql" "./schema.graphql"

movePlease "./wallet/api/openrpc.json" "./openrpc.json"

rm -rf blockexplorer
rm -rf data-node
rm -rf grpc
rm -rf vega
rm -rf wallet

cd ../../