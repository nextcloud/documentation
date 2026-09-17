<?php
// Role of a version section on the index page. Each role renders a note naming a single
// version, so each may be used at most once per page.
const SECTION_UPCOMING = 0;
const SECTION_LATEST_STABLE = 1;
const SECTION_LAST_SUPPORTED = 2;

/**
 * Generate the HTML section for a given Nextcloud version,
 * including links to manuals and notes about the version status.
 *
 * @param int|null $role One of the SECTION_* constants, or null for a version that gets
 *                       no note: a legacy release, or a maintained one that is neither
 *                       the newest nor the oldest.
 */
function generate_section(string $version, ?int $role = null): string {
	$note = '';
	$label = $version;
	if ($role === SECTION_UPCOMING) {
		$label = 'latest';
		$note = '<p>This documents the <em>upcoming</em> version of Nextcloud (not released).</p>';
	} else if ($role === SECTION_LATEST_STABLE) {
		$label = 'stable';
		$note = '<p>This documents the <em>latest stable</em> version of Nextcloud.</p>';
	} else if ($role === SECTION_LAST_SUPPORTED) {
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
