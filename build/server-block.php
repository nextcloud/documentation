<?php
function generate_section(string $version, int $index): string {
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
	$userManualUrl = "https://docs.skjnldsv.com/server/$label/user_manual/";
	if ($version >= 20) {
		$userManualUrl .= 'en/';
	}

	return <<<HTML
		<div class="section" id="nextcloud-$label">
			<h2>Nextcloud $version<a class="headerlink" href="#nextcloud-$label" title="Permalink to this headline">¶</a></h2>
			$note
			<ul class="simple">
				<li><a class="reference external" href="$userManualUrl">User Manual</a>
					(<a class="reference external" href="https://docs.skjnldsv.com/server/$label/Nextcloud_User_Manual.pdf">Download PDF</a>)</li>
				<li><a class="reference external" href="https://docs.skjnldsv.com/server/$label/admin_manual/">Administration Manual</a>
					(<a class="reference external" href="https://docs.skjnldsv.com/server/$label/Nextcloud_Server_Administration_Manual.pdf">Download PDF</a>)</li>
				<li><a class="reference external" href="https://docs.skjnldsv.com/server/$label/developer_manual/">Developer Manual</a></li>
			</ul>
		</div>
HTML;
}
