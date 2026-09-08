<?php
require_once 'server-block.php';
require_once 'detect-versions.php';

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

// Detect version metadata (API calls happen here)
$versions = detect_versions($branches);
$released_branches = $versions['released'];
$devVersion = $versions['dev_version'];
$devStatus = isset($released_branches[$branches[0]]) ? 'development' : 'upcoming';

fwrite(STDERR, "➡️ Version $devVersion ($devStatus)\n");

// Collect released stable versions within support window
$oneYearAgo = time() - (365 * 24 * 60 * 60);
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
