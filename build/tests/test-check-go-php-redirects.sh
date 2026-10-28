#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
#
# Tests for build/check-go-php-redirects.sh. Run: bash build/tests/test-check-go-php-redirects.sh

set -euo pipefail

check="$(dirname "${BASH_SOURCE[0]}")/../check-go-php-redirects.sh"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

failures=0

mkdir -p "$tmp/build/admin_manual/ai"
echo '<html></html>' > "$tmp/build/admin_manual/index.html"
echo '<section id="improve-ai-task-pickup-speed"></section>' > "$tmp/build/admin_manual/ai/overview.html"

# Runs the check on a go.php holding the given mapping lines, prints exit code and errors
run_check() {
	printf '        const mapping = {\n' > "$tmp/go.html"
	printf '            %s\n' "$@" >> "$tmp/go.html"
	printf '        }\n' >> "$tmp/go.html"
	local output status=0
	output=$(bash "$check" "$tmp/go.html" "$tmp/build") || status=$?
	echo "$status ${output//"$tmp/go.html"/go.html}"
}

assert_eq() {
	if [ "$2" = "$3" ]; then
		echo "ok - $1"
	else
		echo "not ok - $1"
		printf '  expected: %s\n  actual:   %s\n' "$2" "$3"
		failures=$((failures + 1))
	fi
}

assert_eq "valid page, directory and anchor targets pass" "0 " "$(run_check \
	"'admin': '/admin_manual'," \
	"'admin-ai-pickup-speed': '/admin_manual/ai/overview.html#improve-ai-task-pickup-speed'")"

assert_eq "target without leading slash fails" \
	"1 ::error file=go.html::'admin-ai-pickup-speed': 'admin_manual/ai/overview.html' must start with /" \
	"$(run_check "'admin-ai-pickup-speed': 'admin_manual/ai/overview.html',")"

assert_eq "missing page fails" \
	"1 ::error file=go.html::'admin-sso': /admin_manual/sso.html does not exist in the build" \
	"$(run_check "'admin-sso': '/admin_manual/sso.html',")"

assert_eq "missing anchor fails" \
	"1 ::error file=go.html::'admin-ai': anchor #gone not found in /admin_manual/ai/overview.html" \
	"$(run_check "'admin-ai': '/admin_manual/ai/overview.html#gone',")"

exit $((failures > 0))
