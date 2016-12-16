#!/bin/bash

source scripts/get-packages.sh

printf "\n🔥  Removing node modules\n"

# Removes packages/*/node_modules directories.
# Runs all commands in parallel/background.
for i in "${PACKAGES[@]}"; do
  NMODS="${ROOT}/${i}/node_modules"
  if [ -d "${NMODS}" ]; then
    echo "👍  Removing ${NMODS}"
    rm -rf "${NMODS}" 2>&1 &
  fi
done

wait

printf "\n✅  Done removing node modules\n"
