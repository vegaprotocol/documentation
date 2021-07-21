#!/usr/bin/env bash

set -e

vega_owner=vegaprotocol
vega_api_repo=api
vega_api_branch="v0.39.0"

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
	--owner "$vega_owner" \
	--repo "$vega_api_repo" \
	--branch "$vega_api_branch" \
	--file grpc/doc/doc.json
mv ./grpc/doc/doc.json ./proto.json
rm -rf ./grpc

deactivate

# This var is used in docusaurus.config.js.
export VEGA_VERSION="$vega_api_branch"

yarn install
yarn run create-dirs
yarn run generate-graphql
yarn run generate-grpc
yarn run build
yarn run prettier
