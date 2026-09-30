<?php
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Detect Nextcloud version metadata from a list of stable branch numbers.
 *
 * Shared helpers are used by build-index.php. When run as a CLI script,
 * outputs KEY=VALUE pairs (highest_stable, lowest_stable, dev_version)
 * suitable for appending to $GITHUB_OUTPUT or for eval in bash.
 *
 * Usage: php detect-versions.php <branch1> <branch2> ...
 * Example: php detect-versions.php 32 33 34
 */

/**
 * The end of life dates the updater serves to every instance. A major is listed
 * from its release, and carries an "eol" date once one is announced; the current
 * major has none yet.
 *
 * This is the same source the release tooling derives maintenance from, so the
 * index cannot disagree with the updater about what is still supported.
 *
 * @see https://github.com/nextcloud-releases/updater_server/blob/master/config/major_versions.json
 */
const MAJOR_VERSIONS_URL = 'https://raw.githubusercontent.com/nextcloud-releases/updater_server/master/config/major_versions.json';

/**
 * Get the GitHub API headers with optional authentication.
 */
function get_github_headers(): string {
	$headers = 'User-Agent: Nextcloud Documentation Builder';
	if ($token = getenv('GITHUB_TOKEN')) {
		$headers .= "\r\nAuthorization: token $token";
	}
	return $headers;
}

/**
 * Fetch the released majors and their end of life dates.
 *
 * Exits with code 1 when the file cannot be fetched or parsed, rather than
 * silently generating an index that claims every version is out of support.
 *
 * @return array<int, ?string> major => end of life date (Y-m-d), null while none is announced
 */
function fetch_major_versions(): array {
	$context = stream_context_create([
		'http' => [
			'header' => get_github_headers(),
			'timeout' => 10,
		]
	]);

	$response = @file_get_contents(MAJOR_VERSIONS_URL, false, $context);
	if ($response === false) {
		fwrite(STDERR, 'Error: could not fetch ' . MAJOR_VERSIONS_URL . " — aborting\n");
		exit(1);
	}

	$data = json_decode($response, true);
	if (!is_array($data) || empty($data)) {
		fwrite(STDERR, 'Error: could not parse ' . MAJOR_VERSIONS_URL . " — aborting\n");
		exit(1);
	}

	$majors = [];
	foreach ($data as $major => $info) {
		$majors[(int)$major] = $info['eol'] ?? null;
	}
	krsort($majors, SORT_NUMERIC);

	return $majors;
}

/**
 * Detect version metadata from a list of stable branch numbers.
 *
 * @param int[] $branches  All known stable branch numbers (any order)
 * @return array{
 *   highest_stable: int|null,
 *   lowest_stable:  int,
 *   dev_version:    int,
 *   released:       array<int, ?string>,
 *   supported:      int[]
 * }
 */
function detect_versions(array $branches): array {
	rsort($branches, SORT_NUMERIC);
	$majors = fetch_major_versions();
	$today = gmdate('Y-m-d');

	// A branch with no entry has not been released yet. Dates are compared as
	// Y-m-d strings, which orders correctly because the parts are zero-padded.
	$released = [];
	$supportedVersions = [];
	foreach ($branches as $branch) {
		if (!array_key_exists($branch, $majors)) {
			fwrite(STDERR, "⏳ Version $branch is not released\n");
			continue;
		}

		$eol = $majors[$branch];
		$released[$branch] = $eol;

		if ($eol === null) {
			fwrite(STDERR, "✅ Version $branch is maintained (no end of life announced)\n");
			$supportedVersions[] = $branch;
		} elseif ($eol >= $today) {
			fwrite(STDERR, "✅ Version $branch is maintained (end of life on $eol)\n");
			$supportedVersions[] = $branch;
		} else {
			fwrite(STDERR, "🛑 Version $branch reached end of life on $eol\n");
		}
	}

	// highest_stable: highest released branch
	$highestStable = !empty($released) ? max(array_keys($released)) : null;

	// dev_version: if the highest branch is released, dev = highest + 1;
	// otherwise the branch exists but isn't released yet (upcoming).
	$devVersion = array_key_exists($branches[0], $released) ? $branches[0] + 1 : $branches[0];

	// lowest_stable: lowest maintained version. Using min($branches) would include ancient
	// branches (e.g. stable10) that still exist on the remote but are long out of support.
	$lowestStable = !empty($supportedVersions) ? min($supportedVersions) : $highestStable;

	return [
		'highest_stable' => $highestStable,
		'lowest_stable'  => $lowestStable,
		'dev_version'    => $devVersion,
		'released'       => $released,
		'supported'      => $supportedVersions,
	];
}

// CLI entry point — only runs when invoked directly, not when require_once'd.
if (basename(__FILE__) === basename($argv[0])) {
	$branches = array_values(array_filter(
		array_map('intval', array_slice($argv, 1)),
		fn($b) => $b >= 12
	));

	if (empty($branches)) {
		fwrite(STDERR, "Error: No valid stable branches provided (expected numeric args >= 12).\n");
		exit(1);
	}

	$result = detect_versions($branches);

	if ($result['highest_stable'] === null) {
		fwrite(STDERR, "Error: No released stable branch found.\n");
		exit(1);
	}

	fwrite(STDERR, "➡️ Version {$result['dev_version']} (development)\n");

	echo "highest_stable={$result['highest_stable']}\n";
	echo "lowest_stable={$result['lowest_stable']}\n";
	echo "dev_version={$result['dev_version']}\n";
}
