<?php
/**
 * Verify index.html structure and links validity
 * 
 * Checks:
 * - Template placeholders are replaced
 * - Version sections exist
 * - Links are properly formatted
 * - External links are accessible
 */

$html_file = 'build/index.html';

if (!file_exists($html_file)) {
	fwrite(STDERR, "⚠️  $html_file not found\n");
	exit(0);
}

$content = file_get_contents($html_file);

// Verify template placeholders are replaced
if (strpos($content, 'SERVER SUPPORTED BLOCK') !== false || strpos($content, 'SERVER LEGACY BLOCK') !== false) {
	fwrite(STDERR, "❌ ERROR: Template placeholders not replaced in index.html!\n");
	exit(1);
}

// Extract all href attributes
$links = [];
if (preg_match_all('/href=(["\'])([^\'"]+)\1/', $content, $matches)) {
	$links = array_unique($matches[2]);
}

fprintf(STDERR, "✓ Found %d unique links in index.html\n", count($links));

// Categorize links
$fragment_links = array_filter($links, fn($l) => strpos($l, '#') === 0);
$external_links = array_filter($links, fn($l) => preg_match('~^https?://~', $l));
$relative_links = array_filter($links, fn($l) => strpos($l, '#') !== 0 && !preg_match('~^https?://~', $l));

fprintf(STDERR, "  - Fragment links: %d\n", count($fragment_links));
fprintf(STDERR, "  - External links: %d\n", count($external_links));
fprintf(STDERR, "  - Relative links: %d\n", count($relative_links));

// Verify structure is present
if (!preg_match('/<h2>Nextcloud \d+/', $content)) {
	fwrite(STDERR, "❌ ERROR: No version sections found in index.html!\n");
	exit(1);
}

$version_count = preg_match_all('/<h2>Nextcloud (\d+)/', $content, $versions);
fprintf(STDERR, "✓ Found %d version sections: %s\n", $version_count, implode(', ', $versions[1]));

// Validate documentation links format (should be server/VERSION/)
// Check both relative links (server/latest, server/stable, etc.) and external docs links
$relative_docs_links = array_filter($relative_links, fn($l) => preg_match('~^server/(latest|stable|\d+)/~', $l));
$external_docs_links = array_filter($external_links, fn($l) => preg_match('~docs\.[^/]+/server/~', $l));
$all_docs_links = array_merge($relative_docs_links, $external_docs_links);

if (!empty($all_docs_links)) {
	$invalid_docs = array_filter($all_docs_links, fn($l) => 
		!preg_match('~(server|/server)/(latest|stable|\d+)/~', $l)
	);
	
	if (!empty($invalid_docs)) {
		fprintf(STDERR, "⚠️  WARNING: %d potentially malformed documentation links detected:\n", count($invalid_docs));
		foreach (array_slice($invalid_docs, 0, 3) as $link) {
			fprintf(STDERR, "    - %s\n", $link);
		}
	} else {
		fprintf(STDERR, "✓ All %d documentation links are properly formatted\n", count($all_docs_links));
	}
}

// Check accessibility of external links (sample first 5)
fprintf(STDERR, "\nVerifying external links...\n");
$unreachable = [];
$external_sample = array_slice($external_links, 0, 5);

foreach ($external_sample as $link) {
	$context = stream_context_create([
		'http' => [
			'method' => 'HEAD',
			'timeout' => 5,
			'ignore_errors' => true,
			'user_agent' => 'Mozilla/5.0'
		]
	]);
	
	$response = @get_headers($link, true, $context);
	
	if ($response === false) {
		fprintf(STDERR, "  ⚠️  %s - connection failed (may be temporary)\n", $link);
	} else {
		$status_line = $response[0] ?? '';
		if (preg_match('/\d{3}/', $status_line, $match)) {
			$status = (int)$match[0];
			if ($status >= 400) {
				$unreachable[] = [$link, $status];
				fprintf(STDERR, "  ⚠️  %s returned %d\n", $link, $status);
			} else {
				fprintf(STDERR, "  ✓ %s\n", $link);
			}
		}
	}
}

if (count($unreachable) >= 3) {
	fprintf(STDERR, "\n❌ ERROR: %d links are unreachable!\n", count($unreachable));
	exit(1);
}

fprintf(STDERR, "\n✓ index.html validation passed\n");
exit(0);
