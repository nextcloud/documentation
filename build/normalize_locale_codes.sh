#!/bin/bash
#
# Nextcloud server, apps and clients use "de_DE" for formal German in Transifex.
# These docs historically used "de", causing translator confusion and a fragmented
# translation memory (see https://github.com/nextcloud/documentation/issues/13370).
#
# Transifex is being reconfigured to sync German as "de_DE" like every other
# Nextcloud project, but the published docs URL must stay "de" (it's linked from
# many external sites). This folds "de_DE" into "de" right before Sphinx builds,
# so the sync stays de_DE-native while the published path is unaffected.
#
# No-op until locale/de_DE actually exists.

if [ -d ./locale/de_DE ]; then
    mkdir -p ./locale/de
    rsync -a ./locale/de_DE/ ./locale/de/
    rm -rf ./locale/de_DE
fi
