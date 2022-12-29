#!/usr/bin/env bash

find 'specs' -name '*_temp.json' -exec rm {} +

# Mac SED workaround - delete remnant files (not required with gsed)
find . -name "*-E" -exec rm -rf {} +

