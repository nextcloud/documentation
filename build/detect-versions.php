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
 * Get the repository name for a given version.
 * Nextcloud moved to nextcloud-releases/server starting with version 32.
 */
function get_repo_for_version(int $version): string {
	return $version >= 32 ? 'nextcloud-releases/server' : 'nextcloud/server';
}

/**
 * Parse the HTTP status code from the response headers populated by file_get_contents.
 *
 * @param array $headers The $http_response_header array
 */
function parse_http_status(array $headers): int {
	preg_match('/HTTP\/[\d.]+ (\d+)/', $headers[0] ?? '', $matches);
	return (int)($matches[1] ?? 0);
}

/**
 * Fetch release info for a given version from the GitHub API.
 *
 * Returns an array ['date' => int] if the release exists (HTTP 200).
 * Returns null if the release does not exist (HTTP 404).
 * Exits with code 1 on any other HTTP status (rate limit, server error, etc.)
 * to prevent silently generating empty or incorrect output.
 */
function fetch_release_info(int $version): ?array {
	$repo = get_repo_for_version($version);
	$url = sprintf('https://api.github.com/repos/%s/releases/tags/v%d.0.0', $repo, $version);

	$context = stream_context_create([
		'http' => [
			'header' => get_github_headers(),
			'timeout' => 10,
			'ignore_errors' => true
		]
	]);

	$response = @file_get_contents($url, false, $context);

	// FIXME: function_exists conditional can be dropped once we don't need to support <8.4.0
	if (function_exists('http_get_last_response_headers')) {
		/** @var array|null */
		$http_response_header = \http_get_last_response_headers();
	}

	$status = isset($http_response_header) && is_array($http_response_header)
		? parse_http_status($http_response_header)
		: 0;

	if ($status === 200) {
		$data = json_decode($response, true);
		$publishedAt = $data['published_at'] ?? $data['created_at'] ?? null;
		return ['date' => $publishedAt ? strtotime($publishedAt) : time()];
	}

	if ($status === 404) {
		return null;
	}

	fwrite(STDERR, "GitHub API error (HTTP $status) checking v$version.0.0 — aborting\n");
	exit(1);
}

/**
 * Detect version metadata from a list of stable branch numbers.
 *
 * @param int[] $branches  All known stable branch numbers (any order)
 * @return array{
 *   highest_stable: int|null,
 *   lowest_stable:  int,
 *   dev_version:    int,
 *   released:       array<int, int>
 * }
 */
function detect_versions(array $branches): array {
	rsort($branches, SORT_NUMERIC);
	$oneYearAgo = time() - (365 * 24 * 60 * 60);
	$released = [];
	$firstOutOfSupportTime = null;

	foreach ($branches as $branch) {
		if ($firstOutOfSupportTime !== null) {
			// Older than the first out-of-support version — skip API call,
			// store with the same timestamp (also out of support).
			fwrite(STDERR, "🛑 Version $branch is unsupported\n");
			$released[$branch] = $firstOutOfSupportTime;
			continue;
		}

		$info = fetch_release_info($branch);
		if ($info === null) {
			fwrite(STDERR, "⏳ Version $branch is not released (tag v$branch.0.0 not found)\n");
			continue;
		}

		$released[$branch] = $info['date'];
		if ($info['date'] < $oneYearAgo) {
			fwrite(STDERR, "🛑 Version $branch is unsupported (released on " . date('Y-m-d', $info['date']) . ")\n");
			$firstOutOfSupportTime = $info['date'];
		} else {
			fwrite(STDERR, "✅ Version $branch is supported (released on " . date('Y-m-d', $info['date']) . ")\n");
		}
	}

	// highest_stable: highest branch with a confirmed release
	$highestStable = null;
	foreach ($branches as $b) {
		if (isset($released[$b])) {
			$highestStable = $b;
			break;
		}
	}

	// dev_version: if the highest branch has a release, dev = highest + 1;
	// otherwise the branch exists but isn't released yet (upcoming).
	$devVersion = isset($released[$branches[0]]) ? $branches[0] + 1 : $branches[0];

	return [
		'highest_stable' => $highestStable,
		'lowest_stable'  => min($branches),
		'dev_version'    => $devVersion,
		'released'       => $released,
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
