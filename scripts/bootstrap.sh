#!/bin/bash

source scripts/remove-modules.sh
source scripts/install-modules.sh

cd packages/kyt-cli && npm link && printf "\n👍  linked kyt-cli\n"

printf "\n✅  Strapped\n"
