#!/bin/sh

uid=$(stat -c '%u' /work)
gid=$(stat -c '%g' /work)

groupadd -g $gid worker
useradd -u $uid -m -g worker worker

cd /work

sudo -u worker make icons-docs

