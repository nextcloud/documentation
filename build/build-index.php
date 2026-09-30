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
$devStatus = array_key_exists($branches[0], $released_branches) ? 'development' : 'upcoming';

fwrite(STDERR, "➡️ Version $devVersion ($devStatus)\n");

// Maintained stable versions, newest first
$stableVersions = $versions['supported'];

// Generate sections with their roles. Only the newest and the oldest maintained version
// are labelled; the ones between them carry no note.
$lastIdx = count($stableVersions) - 1;
$supported = [generate_section($devVersion, SECTION_UPCOMING)];
foreach ($stableVersions as $idx => $version) {
	if ($idx === 0) {
		$role = SECTION_LATEST_STABLE;
	} elseif ($idx === $lastIdx) {
		$role = SECTION_LAST_SUPPORTED;
	} else {
		$role = null;
	}
	$supported[] = generate_section($version, $role);
}

// Generate legacy sections (released but no longer maintained)
$legacy = [];
foreach ($branches as $branch) {
	if (array_key_exists($branch, $released_branches) && !in_array($branch, $stableVersions)) {
		$legacy[] = generate_section($branch, null);
	}
}

// Generate and write final index.html
$index = file_get_contents(__DIR__ . '/index-template.html');
$index = str_replace('<!-- SERVER SUPPORTED BLOCK -->', implode("\n", $supported), $index);
$index = str_replace('<!-- SERVER LEGACY BLOCK -->', implode("\n", $legacy), $index);
$index = str_replace('<!-- CURRENT_YEAR -->', date('Y'), $index);
file_put_contents(__DIR__ . '/index.html', $index);
