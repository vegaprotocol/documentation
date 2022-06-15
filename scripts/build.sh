#!/usr/bin/env bash

# This script fetches schemas for our three documentation types (REST, GraphQL, GRPC) and uses
# docusaurus generator plugins to produce markdown documents for them.
#
# Each documentation type uses a different generator, so the behaviour for each varies slightly
#
# Additionally, a script is called to generate proposal documentation. It's not a docusaurus plugin.

rm proto.json 2> /dev/null
rm schema.graphql 2> /dev/null

set -e

grpc_doc_owner=vegaprotocol
grpc_doc_repo=protos
grpc_doc_branch="v0.52.0"

graphql_doc_owner=vegaprotocol
graphql_doc_repo=data-node
graphql_doc_branch="v0.52.0"

gh_token="${GITHUB_API_TOKEN:?}"

create_venv() {
	venv="$PWD/.venv"
	# Find python binary in a way which works on Netlify and elsewhere
	python="$(command -v python3.7 || command -v python3)"
	if test -z "$python" ; then
		echo "Failed to find Python"
		exit 1
	fi
	test -d "$venv" || virtualenv --quiet -p "$python" "$venv" 1>/dev/null
	# shellcheck disable=SC1091
	source "$venv/bin/activate"
	gh="$(grep ^PyGithub== requirements.txt)"
	pip freeze | grep -q '^'"$gh"'$' || pip install --quiet -r requirements.txt 1>/dev/null
}

create_venv

python3 scripts/github_get_file.py \
	--outdir . \
	--token "$gh_token" \
	--owner "${grpc_doc_owner:?}" \
	--repo "${grpc_doc_repo:?}" \
	--branch "${grpc_doc_branch:?}" \
	--file generated/proto.json
mv ./generated/proto.json ./proto.json
rm -rf ./generated

echo "Fetching graphql..."
python3 scripts/github_get_file.py \
	--outdir . \
	--token "$gh_token" \
	--owner "${graphql_doc_owner:?}" \
	--repo "${graphql_doc_repo:?}" \
	--branch "${graphql_doc_branch:?}" \
	--file gateway/graphql/schema.graphql
mv ./gateway/graphql/schema.graphql ./schema.graphql
rm -rf ./gateway

deactivate

# This var is used in docusaurus.config.js.
export VEGA_VERSION="$grpc_doc_branch"

# Create an empty folder to keep the tools happy

yarn install
mkdir -p ./docs/grpc
yarn run generate-graphql
yarn run generate-grpc

# This var is used in GraphQL tidyup
echo "GraphQL: Removing generated on date..."
sed -i -E '/Generated on/d' docs/graphql/generated.md
echo "GraphQL: Updating generated title on date..."
sed -i -E 's/Schema Documentation/GraphQL Schema/g' docs/graphql/generated.md

# GRPC tidyup
echo "GRPC: Do not hide titles"
find . -type f -name '*.mdx' -exec sed -i -E 's/hide_title: true/hide_title: false/g' {} +
echo "GRPC: Fix sidebar links"
sed -i -E 's/"vega\//"grpc\/vega\//g' docs/grpc/sidebar.js

yarn run build
yarn run prettier

rm schema.graphql
