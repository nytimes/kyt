#!/bin/bash

PACKAGES=( "" "packages/babel-presets/babel-preset-kyt-core" "packages/babel-presets/babel-preset-kyt-react" )
ROOT=`pwd`

for DIR in packages/*; do
    [[ -d $DIR ]] && PACKAGES+=("$DIR")
done
