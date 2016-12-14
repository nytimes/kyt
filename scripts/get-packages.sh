#!/bin/sh

PACKAGES=( "" )
ROOT=`pwd`

for DIR in packages/*; do
    [[ -d $DIR ]] && PACKAGES+=("$DIR")
done
