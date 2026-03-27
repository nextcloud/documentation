<?php
require_once 'server-block.php';

/** @var int[] */
$branches = array_slice($argv, 1);
$branches = array_filter($branches, fn($b) => is_numeric($b));
rsort($branches, SORT_NUMERIC);

// We added this script when we had only 12 and above.
$branches = array_filter($branches, fn($b) => $b >= 12);

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

file_put_contents(__DIR__ . '/index.html', $index);
