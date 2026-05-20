<?php
/**
 * Generate the HTML section for a given Nextcloud version,
 * including links to manuals and notes about the version status.
 * The $index parameter is used to determine if the version is latest, stable, previous stable, or last supported stable.
 * If $index is null, it means it's a legacy version (released but outside support window).
 */
function generate_section(string $version, ?int $index = null): string {
	$note = '';
	$label = $version;
	if ($index === 0) {
		$label = 'latest';
		$note = '<p>This documents the <em>upcoming</em> version of Nextcloud (not released).</p>';
	} else if ($index === 1) {
		$label = 'stable';
		$note = '<p>This documents the <em>latest stable</em> version of Nextcloud.</p>';
	} else if ($index === 2) {
		$note = '<p>This documents the <em>previous stable</em> (still supported) version of Nextcloud.</p>';
	} else if ($index === 3) {
		$note = '<p>This documents the <em>last supported stable</em> version of Nextcloud.</p>';
	}

	// We added the translation of the documentation in 20
	$userManualUrl = "server/$label/user_manual/";
	if ($version >= 20) {
		$userManualUrl .= 'en/';
	}

	$hasEpub = $version >= 32;
	$userManualDownloads = '<a class="reference external" href="server/' . $label . '/Nextcloud_User_Manual.pdf">PDF</a>';
	$adminManualDownloads = '<a class="reference external" href="server/' . $label . '/Nextcloud_Server_Administration_Manual.pdf">PDF</a>';
	$developerManualDownloads = '';
	if ($hasEpub) {
		$userManualDownloads .= ', <a class="reference external" href="server/' . $label . '/Nextcloud_User_Manual.epub">ePub</a>';
		$adminManualDownloads .= ', <a class="reference external" href="server/' . $label . '/Nextcloud_Server_Administration_Manual.epub">ePub</a>';
		$developerManualDownloads = ' (<a class="reference external" href="server/' . $label . '/Nextcloud_Developer_Manual.epub">ePub</a>)';
	}

	return <<<HTML
		<div class="section" id="nextcloud-$label">
			<h2>Nextcloud $version<a class="headerlink" href="#nextcloud-$label" title="Permalink to this headline">¶</a></h2>
			$note
			<ul class="simple">
				<li><a class="reference external" href="$userManualUrl">User Manual</a>
					($userManualDownloads)</li>
				<li><a class="reference external" href="server/$label/admin_manual/">Administration Manual</a>
					($adminManualDownloads)</li>
				<li><a class="reference external" href="server/$label/developer_manual/">Developer Manual</a>$developerManualDownloads</li>
			</ul>
		</div>
HTML;
}
