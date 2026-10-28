#!/bin/bash
#
# SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
#
# Checks every go.php redirect target against a built documentation folder:
# the target must start with "/" (go.php appends it to the version path), the
# page must exist, and its #anchor, if any, must be an id on that page.
#
# Usage: build/check-go-php-redirects.sh go.php/index.html stage/latest

set -euo pipefail

go_php="$1"
build_dir="$2"
failed=0

fail() {
	echo "::error file=${go_php}::${1}"
	failed=1
}

while read -r key target; do
	if [[ "$target" != /* ]]; then
		fail "'${key}': '${target}' must start with /"
		continue
	fi

	path="${build_dir}${target%%#*}"
	if [[ -d "$path" ]]; then
		path="${path%/}/index.html"
	fi
	if [[ ! -f "$path" ]]; then
		fail "'${key}': ${target%%#*} does not exist in the build"
		continue
	fi

	if [[ "$target" == *#* ]] && ! grep -qF "id=\"${target#*#}\"" "$path"; then
		fail "'${key}': anchor #${target#*#} not found in ${target%%#*}"
	fi
done < <(sed -nE "s/^[[:space:]]*'([a-z0-9-]+)': '([^']*)',?[[:space:]]*$/\1 \2/p" "$go_php")

exit "$failed"
