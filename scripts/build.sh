#!/usr/bin/env bash

set -e

vega_owner=vegaprotocol
vega_api_repo=api
vega_api_branch="v0.39.0"

# Use token, if possible. Without a token, rate limiting may kick in.
gh_token="${GITHUB_API_TOKEN:-}"

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

not_found='We could not find what you were looking for'
not_found_count="$(find build -type f -print0 | xargs -0 grep "$not_found" |wc -l)"
if test "$not_found_count" -gt 0 ; then
	echo
	echo "ERROR: Found $not_found_count files containing: $not_found"
	exit 1
fi
