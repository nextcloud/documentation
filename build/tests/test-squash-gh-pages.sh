#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
#
# Tests for build/squash-gh-pages.sh. Run: bash build/tests/test-squash-gh-pages.sh

set -euo pipefail

# shellcheck source-path=SCRIPTDIR source=../squash-gh-pages.sh
source "$(dirname "${BASH_SOURCE[0]}")/../squash-gh-pages.sh"

failures=0

# Unix timestamp of <day> at <hour> UTC (default noon)
ts() {
	date -u -d "$1 ${2:-12}:00:00" +%s
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

test_release_days_keeps_final_releases_grouped_by_utc_day() {
	local actual
	actual=$(printf '%s\n' \
		"v34.0.4 $(ts 2026-09-10 18)" \
		"v33.0.9 $(ts 2026-09-10 9)" \
		"v35.0.0rc1 $(ts 2026-09-11)" \
		"v35.0.0beta2 $(ts 2026-09-12)" \
		"v35.0.0 $(ts 2026-09-15)" \
		"not-a-release $(ts 2026-09-16)" | release_days)
	assert_eq "${FUNCNAME[0]}" \
		"$(($(ts 2026-09-11 0) - 1)) v33.0.9,v34.0.4
$(($(ts 2026-09-16 0) - 1)) v35.0.0" "$actual"
}

# Plan for commits a..d (2026-04-02, 03, 05, 07) and the given "<tag> <timestamp>" lines.
plan_for() {
	local tmp
	tmp=$(mktemp -d)
	printf '%s\n' "a $(ts 2026-04-02)" "b $(ts 2026-04-03)" "c $(ts 2026-04-05)" "d $(ts 2026-04-07)" >"$tmp/commits"
	{ printf '%s\n' "$@" | release_days || true; } >"$tmp/days"
	plan "$tmp/commits" "$tmp/days" | tr '\n' ' '
	rm -rf "$tmp"
}

test_plan_one_snapshot_per_release_then_unreleased() {
	assert_eq "${FUNCNAME[0]}" "b v1.0.0 c v1.0.1 d - " \
		"$(plan_for "v1.0.0 $(ts 2026-04-03 20)" "v1.0.1 $(ts 2026-04-05 20)")"
}

test_plan_releases_without_deploy_in_between_share_a_snapshot() {
	assert_eq "${FUNCNAME[0]}" "b v1.0.0,v2.0.0 c - d - " \
		"$(plan_for "v1.0.0 $(ts 2026-04-03)" "v2.0.0 $(ts 2026-04-04)")"
}

test_plan_release_before_first_deploy_is_ignored() {
	assert_eq "${FUNCNAME[0]}" "a v1.0.0 b - c - d - " \
		"$(plan_for "v0.9.0 $(ts 2026-03-01)" "v1.0.0 $(ts 2026-04-02)")"
}

test_plan_no_release_keeps_everything() {
	assert_eq "${FUNCNAME[0]}" "a - b - c - d - " "$(plan_for)"
}

# End to end on a throwaway repository shaped like gh-pages

repo_write() {
	mkdir -p "$(dirname "$1")"
	printf '%s' "$2" >"$1"
}

repo_env() {
	local date
	date="$(ts "$1" "${2:-12}") +0000"
	export GIT_AUTHOR_NAME=bot GIT_AUTHOR_EMAIL=bot@example.com GIT_AUTHOR_DATE="$date"
	export GIT_COMMITTER_NAME=bot GIT_COMMITTER_EMAIL=bot@example.com GIT_COMMITTER_DATE="$date"
}

repo_commit() {
	(repo_env "$1" && git add -A && git commit -q --allow-empty -m "$2")
}

# Lightweight tag on its own commit, like the release tags pointing at master
repo_tag() {
	(repo_env "$2" "${3:-12}" && git tag "$1" "$(echo release | git commit-tree "$(git mktree </dev/null)")")
}

build_history() {
	git init -q -b gh-pages
	repo_write server/20/index.html 'v20 first'
	repo_write server/33/index.html 'v33 first'
	repo_commit 2026-04-02 migration
	repo_write server/20/index.html 'v20 second'
	repo_write server/33/index.html 'v33 second'
	repo_commit 2026-04-03 'deploy 1'
	repo_tag v33.0.1 2026-04-03 20
	repo_write server/33/index.html 'v33 third'
	repo_commit 2026-04-04 'deploy 2'
	repo_write server/33/index.html 'v33 fourth'
	repo_commit 2026-04-05 'deploy 3'
	repo_tag v33.0.2 2026-04-05 20
	repo_tag v34.0.0rc1 2026-04-06
	repo_write server/20/index.html 'v20 last'
	repo_write server/33/index.html 'v33 unreleased'
	repo_commit 2026-04-07 'deploy 4'
}

# Run test function $1 inside a fresh repository
in_repo() {
	local dir
	dir=$(mktemp -d)
	local status=0
	# shellcheck disable=SC2030 # the subshell counts its own failures, reported through its exit status
	(failures=0 && cd "$dir" && build_history && "$1" && [ "$failures" -eq 0 ]) || status=1
	rm -rf "$dir"
	return "$status"
}

test_rewrite_squashes_per_release_and_keeps_unreleased() {
	local tip
	tip=$(rewrite gh-pages 32)
	assert_eq "${FUNCNAME[0]} (tree)" "$(git rev-parse 'gh-pages^{tree}')" "$(git rev-parse "$tip^{tree}")"
	assert_eq "${FUNCNAME[0]} (log)" \
		"chore: documentation snapshot for v33.0.1|$(ts 2026-04-03)
chore: documentation snapshot for v33.0.2|$(ts 2026-04-05)
deploy 4|$(ts 2026-04-07)" "$(git log --reverse --format='%s|%ct' "$tip")"
}

test_rewrite_frozen_versions_hold_their_current_content_in_every_commit() {
	local tip sha
	tip=$(rewrite gh-pages 32)
	for sha in $(git rev-list "$tip"); do
		assert_eq "${FUNCNAME[0]} ($sha)" 'v20 last' "$(git show "$sha:server/20/index.html")"
	done
	assert_eq "${FUNCNAME[0]} (supported)" 'v33 second' \
		"$(git show "$(git rev-list --max-parents=0 "$tip"):server/33/index.html")"
}

test_rewrite_running_again_on_the_output_changes_nothing() {
	local tip
	tip=$(rewrite gh-pages 32)
	git update-ref refs/heads/gh-pages "$tip"
	assert_eq "${FUNCNAME[0]}" "$tip" "$(rewrite gh-pages 32)"
}

test_rewrite_next_release_squashes_the_unreleased_commits() {
	git update-ref refs/heads/gh-pages "$(rewrite gh-pages 32)"
	git checkout -q -f gh-pages
	repo_write server/33/index.html 'v33 next'
	repo_commit 2026-04-08 'deploy 5'
	repo_tag v33.0.3 2026-04-08 20
	assert_eq "${FUNCNAME[0]}" \
		"chore: documentation snapshot for v33.0.1
chore: documentation snapshot for v33.0.2
chore: documentation snapshot for v33.0.3" "$(git log --reverse --format=%s "$(rewrite gh-pages 32)")"
}

test_release_days_keeps_final_releases_grouped_by_utc_day
test_plan_one_snapshot_per_release_then_unreleased
test_plan_releases_without_deploy_in_between_share_a_snapshot
test_plan_release_before_first_deploy_is_ignored
test_plan_no_release_keeps_everything
for t in $(declare -F | awk '$3 ~ /^test_rewrite_/ { print $3 }'); do
	# shellcheck disable=SC2031
	in_repo "$t" || failures=$((failures + 1))
done

if [ "$failures" -ne 0 ]; then
	echo "$failures failure(s)"
	exit 1
fi
