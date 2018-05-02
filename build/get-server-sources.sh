#!/bin/bash
#
# Clone Nextcloud server repo into $CWD/server
# if it already exists the latest commits from 
# the specified branch will be fetched

NC_BRANCH="${1:-master}"

if [ -d server/.git ]; then
    cd server && git fetch &&  git checkout $NC_BRANCH && git reset --hard origin/$NC_BRANCH 
else
    git clone https://github.com/nextcloud/server server --depth 1
fi;
