#!/usr/bin/env bash

set -e

vega_owner=vegaprotocol
vega_api_repo=api
vega_api_branch="develop" # or vX.Y.Z

gh_token="${GITHUB_API_TOKEN:?}"

create_venv() {
	venv="$(mktemp -d)"
	# Find python binary in a way which works on Netlify and elsewhere
	python="$(command -v python3.7 || command -v python3)"
	if test -z "$python" ; then
		echo "Failed to find Python"
		exit 1
	fi
	virtualenv --quiet -p "$python" "$venv" 1>/dev/null
	# shellcheck disable=SC1091
	source "$venv/bin/activate"
	pip install --quiet -r requirements.txt 1>/dev/null
	cleanup() {
		rm -rf "${venv:?}"
	}
	trap cleanup EXIT
}

create_venv

python3 scripts/github_get_file.py \
	--outdir site \
	--token "$gh_token" \
	--owner "$vega_owner" \
	--repo "$vega_api_repo" \
	--branch "$vega_api_branch" \
	--file grpc/doc/doc.json
mv site/grpc/doc/doc.json site/proto.json
rm -rf site/grpc

deactivate

(cd site && yarn install && yarn run generate)
