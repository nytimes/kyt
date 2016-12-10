#!/bin/sh

source scripts/remove-modules.sh
source scripts/install-modules.sh

cd packages/kyt-cli && npm link && echo "👍  linked kyt-cli"
