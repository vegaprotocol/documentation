#!/usr/bin/env bash

# exit when any command fails
set -e

echo "Vaguer run"

## Mainnet block - hardcoded to 1.2.0 while it is 0.53.0
echo " - Fetching mainnet"
JSON=true npx --yes --silent github:vegaprotocol/vaguer#semver:^1.2.0 mainnet1 > "./specs/mainnet_vaguer_temp.json"
mainnet_temp_good=$(jq '[.[] | select(."🥇" == "🥇")] | length' ./specs/mainnet_vaguer_temp.json)
mainnet_current_good=$(jq '[.[] | select(."🥇" == "🥇")] | length' ./specs/mainnet_vaguer.json)

d=$(date -u)
dt=$(date -u +%s)

if ((mainnet_temp_good >= 3)); then
  echo "   - New run: ${mainnet_temp_good}, old run: ${mainnet_current_good}"
  rm "./specs/mainnet_vaguer.json"
  mv "./specs/mainnet_vaguer_temp.json" "./specs/mainnet_vaguer.json"
else
  echo "   - 0 good nodes, doing nothing"
  rm "./specs/mainnet_vaguer_temp.json"
fi

rm  -f "./specs/mainnet_vaguer_timestamp.json"
echo "{\"date\": \"$d\", \"timestamp\": \"$dt\"}" > ./specs/mainnet_vaguer_timestamp.json

## Testnet block. Currently follows the same rules
echo " - Fetching testnet"
JSON=true npx --yes --silent github:vegaprotocol/vaguer fairground > "./specs/testnet_vaguer_temp.json"
testnet_temp_good=$(jq '[.[] | select(."🥇" == "🥇")] | length' ./specs/testnet_vaguer_temp.json)
testnet_current_good=$(jq '[.[] | select(."🥇" == "🥇")] | length' ./specs/testnet_vaguer.json)

if ((testnet_temp_good >= 3)); then
  echo "   - New run ${testnet_temp_good}, old run: ${testnet_current_good}"
  rm "./specs/testnet_vaguer.json"
  mv "./specs/testnet_vaguer_temp.json" "./specs/testnet_vaguer.json"
else
  echo "   - 0 good nodes, doing nothing"
  rm "./specs/testnet_vaguer_temp.json"
fi

rm -f "./specs/testnet_vaguer_timestamp.json"
echo "{\"date\": \"$d\", \"timestamp\": \"$dt\"}" > ./specs/testnet_vaguer_timestamp.json
