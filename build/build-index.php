<?php
require_once 'server-block.php';

/**
 * Get the GitHub API headers with optional authentication
 */
function get_github_headers(): string {
	$headers = 'User-Agent: Nextcloud Documentation Builder';
	if ($token = getenv('GITHUB_TOKEN')) {
		$headers .= "\r\nAuthorization: token $token";
	}
	return $headers;
}

/**
 * Get the repository name for a given version
 * Nextcloud moved to nextcloud-releases/server starting with version 32
 */
function get_repo_for_version(int $version): string {
	return $version >= 32 ? 'nextcloud-releases/server' : 'nextcloud/server';
}

/**
 * Check if a version is officially released by querying the GitHub tag
 */
function is_version_released(int $version): bool {
	$repo = get_repo_for_version($version);
	$url = sprintf('https://api.github.com/repos/%s/releases/tags/v%d.0.0', $repo, $version);
	
	$context = stream_context_create([
		'http' => [
			'header' => get_github_headers(),
			'timeout' => 5,
			'ignore_errors' => true
		]
	]);
	
	$response = @file_get_contents($url, false, $context);
	
	if (isset($http_response_header) && is_array($http_response_header)) {
		return strpos($http_response_header[0] ?? '', '200') !== false;
	}
	
	return $response !== false;
}

/**
 * Fetch release date for a version from GitHub API
 */
function get_release_date(int $version): ?int {
	$repo = get_repo_for_version($version);
	$url = sprintf('https://api.github.com/repos/%s/releases/tags/v%d.0.0', $repo, $version);
	
	$context = stream_context_create([
		'http' => [
			'header' => get_github_headers(),
			'timeout' => 5
		]
	]);
	
	$response = @file_get_contents($url, false, $context);
	if ($response === false) {
		return null;
	}
	
	$data = json_decode($response, true);
	$publishedAt = $data['published_at'] ?? $data['created_at'] ?? null;
	return $publishedAt ? strtotime($publishedAt) : null;
}

// Parse and validate command-line arguments
/** @var int[] */
$branches = array_slice($argv, 1);
$branches = array_filter($branches, fn($b) => is_numeric($b));
rsort($branches, SORT_NUMERIC);
$branches = array_filter($branches, fn($b) => $b >= 12);

if (empty($branches)) {
	fwrite(STDERR, "Error: No valid stable branches were provided. Please pass at least one numeric branch >= 12.\n");
	exit(1);
}

// Fetch release information from GitHub
$released_branches = [];
$oneYearAgo = time() - (365 * 24 * 60 * 60);
$foundOutOfSupport = null;

foreach ($branches as $branch) {
	if ($foundOutOfSupport !== null) {
		fwrite(STDOUT, "🛑 Version $branch is unsupported (older than version $foundOutOfSupport)\n");
		$released_branches[$branch] = $releaseTime;
		$releaseType = $releaseTime >= $oneYearAgo ? 'stable' : 'unsupported';
		continue;
	}
	
	if (!is_version_released($branch)) {
		fwrite(STDERR, "⏳ Version $branch is not released (tag v$branch.0.0 not found)\n");
		continue;
	}
	
	$releaseTime = get_release_date($branch);
	if ($releaseTime === null) {
		$releaseTime = time();
	}
	
	$released_branches[$branch] = $releaseTime;
	if ($releaseTime < $oneYearAgo) {
		fwrite(STDOUT, "🛑 Version $branch is unsupported (released on " . date('Y-m-d', $releaseTime) . ")\n");
		$foundOutOfSupport = $branch;
	} else {
		fwrite(STDOUT, "✅ Version $branch is supported (released on " . date('Y-m-d', $releaseTime) . ")\n");
	}
}

// Determine development version
if (isset($released_branches[$branches[0]])) {
	$devVersion = $branches[0] + 1;
	$devStatus = 'development';
} else {
	$devVersion = $branches[0];
	$devStatus = 'upcoming';
}

fwrite(STDERR, "➡️ Version $devVersion ($devStatus)\n");

// Collect released stable versions within support window
$stableVersions = [];
foreach ($branches as $branch) {
	if (isset($released_branches[$branch]) && $released_branches[$branch] >= $oneYearAgo) {
		$stableVersions[] = $branch;
	} elseif (isset($released_branches[$branch])) {
		// Once we hit an unsupported version, stop
		break;
	}
}

// Generate sections with proper indices
$supported = [generate_section($devVersion, 0)];
foreach ($stableVersions as $idx => $version) {
	// Index 3 for the oldest supported version if there are multiple
	$index = ($idx + 1 === count($stableVersions) && count($stableVersions) > 1) ? 3 : $idx + 1;
	$supported[] = generate_section($version, $index);
}

// Generate legacy sections (released but outside support window)
$legacy = [];
foreach ($branches as $branch) {
	if (isset($released_branches[$branch]) && !in_array($branch, $stableVersions)) {
		$legacy[] = generate_section($branch, null);
	}
}

// Generate and write final index.html
$index = file_get_contents(__DIR__ . '/index-template.html');
$index = str_replace('<!-- SERVER SUPPORTED BLOCK -->', implode("\n", $supported), $index);
$index = str_replace('<!-- SERVER LEGACY BLOCK -->', implode("\n", $legacy), $index);
$index = str_replace('<!-- CURRENT_YEAR -->', date('Y'), $index);
file_put_contents(__DIR__ . '/index.html', $index);
