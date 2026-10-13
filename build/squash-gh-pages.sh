#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
#
# Rewrite the gh-pages history to keep it from growing without bounds.
#
# Every deploy commits a full set of rebuilt PDF and ePub files, so the branch
# grows by tens of MiB per deploy even when the docs barely change. The built
# output has no value as history, so this script rebuilds the branch as:
#
# - one snapshot commit per release day (final vX.Y.Z tags only), holding the
#   tree of the last deploy made before the end of that day (UTC),
# - every deploy made after the last release, unchanged,
# - version folders below <frozen-below> (out of support, no more releases)
#   replaced by their current content in every commit, so they are stored once.
#
# The tip tree is never modified, so the published site is identical. The
# rewrite is deterministic: running it again on its own output yields the same
# commits, which makes it safe to run on every release tag.
#
# Usage: squash-gh-pages.sh <branch> <frozen-below> <output-ref>
#
# Prints changed=true|false and tip=<sha> for $GITHUB_OUTPUT, and a commit
# count summary on stderr.

set -euo pipefail

# Group final release tags by UTC day.
# stdin: "<tag> <unix timestamp>" lines
# stdout: "<end of day timestamp> <tag>[,<tag>...]" lines, oldest day first
release_days() {
	grep -E '^v[0-9]+\.[0-9]+\.[0-9]+ ' \
		| awk '{ print int($2 / 86400) * 86400 + 86399, $1 }' \
		| LC_ALL=C sort -k1,1n -k2,2 \
		| awk '$1 == day { tags = tags "," $2; next }
			day { print day, tags }
			{ day = $1; tags = $2 }
			END { if (day) print day, tags }'
}

# Pick the commits to keep.
# $1: file of "<sha> <committer timestamp>" lines, oldest first
# $2: file of release_days output
# stdout: "<sha> <tags>" for a snapshot, "<sha> -" for an unreleased commit
plan() {
	awk 'NR == FNR { sha[NR] = $1; ts[NR] = $2; n = NR; next }
		{
			last = 0
			for (i = 1; i <= n; i++) if (ts[i] <= $1) last = i
			if (!last) next
			if (last in tags) tags[last] = tags[last] "," $2
			else { order[++m] = last; tags[last] = $2 }
		}
		END {
			for (k = 1; k <= m; k++) print sha[order[k]], tags[order[k]]
			for (i = (m ? order[m] + 1 : 1); i <= n; i++) print sha[i], "-"
		}' "$1" "$2"
}

# ls-tree lines of server/<N> folders below $2 in tree-ish $1 (or the others with $3 = keep)
version_entries() {
	git ls-tree "$1" 2>/dev/null | awk -F '\t' -v below="$2" -v keep="${3:-}" '
		{ frozen = $2 ~ /^[0-9]+$/ && $2 + 0 < below }
		frozen != (keep == "keep")'
}

# Tree of commit $1 with every frozen server/<N> folder replaced by its tip content.
frozen_tree() {
	local server
	server=$( { version_entries "$1:server" "$FROZEN_BELOW" keep; printf '%s' "$FROZEN_ENTRIES"; } \
		| awk NF | git mktree)
	{
		git ls-tree "$1^{tree}" | awk -F '\t' '$2 != "server"'
		if [ "$server" != "$(git mktree </dev/null)" ]; then
			printf '040000 tree %s\tserver\n' "$server"
		fi
	} | git mktree
}

# Commit tree $2 on parent $3 (may be empty) with the metadata of commit $1.
# stdin: commit message
commit_like() {
	local header author committer author_email committer_email
	header=$(git cat-file commit "$1" | sed '/^$/q')
	# "Name <email> <timestamp> <tz>"
	author=$(sed -n 's/^author //p' <<<"$header")
	committer=$(sed -n 's/^committer //p' <<<"$header")
	author_email=${author##*<}
	committer_email=${committer##*<}
	GIT_AUTHOR_NAME=${author% <*} GIT_AUTHOR_EMAIL=${author_email%%>*} GIT_AUTHOR_DATE=${author##*> } \
	GIT_COMMITTER_NAME=${committer% <*} GIT_COMMITTER_EMAIL=${committer_email%%>*} GIT_COMMITTER_DATE=${committer##*> } \
		git commit-tree "$2" ${3:+-p "$3"}
}

# Rebuild branch $1 with folders below $2 frozen, print the new tip (the branch is not moved).
rewrite() {
	local branch=$1 tmp parent='' sha tags tree
	FROZEN_BELOW=$2
	FROZEN_ENTRIES=$(version_entries "$branch:server" "$FROZEN_BELOW")
	tmp=$(mktemp -d)

	git log --first-parent --reverse --format='%H %ct' "$branch" >"$tmp/commits"
	git for-each-ref --format='%(refname:short) %(creatordate:unix)' refs/tags \
		| { release_days || true; } >"$tmp/days"

	while read -r sha tags; do
		tree=$(frozen_tree "$sha")
		if [ "$tags" = - ]; then
			parent=$(git cat-file commit "$sha" | sed '1,/^$/d' | commit_like "$sha" "$tree" "$parent")
		else
			parent=$(printf 'chore: documentation snapshot for %s\n\nSquashed gh-pages history up to this release.\n' \
				"${tags//,/, }" | commit_like "$sha" "$tree" "$parent")
		fi
	done < <(plan "$tmp/commits" "$tmp/days")

	rm -rf "$tmp"
	echo "$parent"
}

main() {
	if [ $# -ne 3 ]; then
		echo "Usage: $0 <branch> <frozen-below> <output-ref>" >&2
		exit 1
	fi
	local branch=$1 tip
	tip=$(rewrite "$branch" "$2")

	if [ "$(git rev-parse "$tip^{tree}")" != "$(git rev-parse "$branch^{tree}")" ]; then
		echo "Rewritten tip tree differs from the current branch, aborting" >&2
		exit 1
	fi
	git update-ref "$3" "$tip"

	echo "$branch: $(git rev-list --count --first-parent "$branch") commits -> $(git rev-list --count "$tip") commits" >&2
	if [ "$tip" = "$(git rev-parse "$branch")" ]; then echo changed=false; else echo changed=true; fi
	echo "tip=$tip"
}

if [ "${BASH_SOURCE[0]}" = "$0" ]; then
	main "$@"
fi
