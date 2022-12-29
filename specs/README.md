# Specs

Contains the API definition files for versions of vegaprotocol/vega that have had documentation generated.

As of 0.57.0, for each tagged version this will include:
- Multiple swagger files, one per API
  - `../scripts/build.sh` also generates an OpenAPI 3 version of the Swagger (OpenAPI v2) file that is generated in vegaprotocol/vega
- `openrpc.json`, the wallet V2 api definition
- `proto.json`, the protobuf definitions
- `schema.graphql`, the graphql schema

This folder also contains some extra per-network files that are updated by `../scripts/build.sh` at build time:
- `mainnet_network_parameters.json` and `testnet_network_parameters.json`, used by the custom NetworkParameters component to render network paramter values with their current value in the documentation
- `vaguer.mainnet.json` and `vaguer.testnet.json`, used by `../scripts/build.sh` to avoid rendering seemingly unreliable servers as valid endpoints in the OpenAPI v3 docs

# Updates
A Github action in vegaprotocol/vega automatically makes a pull request whenever a new version is tagged. This PR should be run through `../scripts/build.sh` to reorganise, regenerate and fix various small things in the specs before being ready to generate the documentation.
