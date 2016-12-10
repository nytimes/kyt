#!/bin/sh

source scripts/get-packages.sh

# Installs node modules for packages/*.
for i in "${PACKAGES[@]}"; do :
  cd "${ROOT}/${i}"
  echo "Installing package ${ROOT}/${i}/package.json"
  npm i 2>&1
  cd "${ROOT}"
done

echo "👍  packages installed"
