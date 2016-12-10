#!/bin/sh

PACKAGES=( "" )
ROOT=`pwd`

for FILE in packages/*; do
    [[ -d $FILE ]] && PACKAGES+=("$FILE")
done
