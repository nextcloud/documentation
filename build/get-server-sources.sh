#!/bin/bash
#
# Clone Nextcloud server repo into $CWD/server
# if it already exists the latest commits from 
# the specified branch will be fetched

NC_BRANCH="${1:-master}"

printf "\n\n"
echo Fetching source for $NC_BRANCH
printf "\n"

if [ -d server/.git ]; then
    cd server
    git remote set-branches --add origin $NC_BRANCH
    git fetch --depth 1
    git checkout $NC_BRANCH
    git reset --hard origin/$NC_BRANCH 
else
    git clone https://github.com/nextcloud/server server --depth 1 --single-branch --branch $NC_BRANCH
fi;
