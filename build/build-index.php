<?php
require_once 'server-block.php';

/** @var int[] */
$branches = array_slice($argv, 1);
$branches = array_filter($branches, fn($b) => is_numeric($b));
rsort($branches, SORT_NUMERIC);

// We added this script when we had only 12 and above.
$branches = array_filter($branches, fn($b) => $b >= 12);

if (empty($branches)) {
	fwrite(STDERR, "Error: No valid stable branches were provided. Please pass at least one numeric branch >= 12.\n");
	exit(1);
}

// Generate current development version section
$sections = [generate_section(($branches[0] + 1), 0)];

// Generate stable version section
foreach ($branches as $index => $v) {
	$sections[] = generate_section($v, $index + 1);
}

// Insert into index.html
$index = file_get_contents(__DIR__ . '/index-template.html');

$supported = array_slice($sections, 0, 4);
$legacy = array_slice($sections, 4);

$index = str_replace(
	'<!-- SERVER SUPPORTED BLOCK -->',
	implode("\n", $supported),
	$index
);

$index = str_replace(
	'<!-- SERVER LEGACY BLOCK -->',
	implode("\n", $legacy),
	$index
);

$index = str_replace(
	'<!-- CURRENT_YEAR -->',
	date('Y'),
	$index
);

file_put_contents(__DIR__ . '/index.html', $index);
