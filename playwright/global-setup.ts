// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { configureNextcloud, runOcc, startNextcloud, waitOnNextcloud } from '@nextcloud/e2e-test-server/docker'
import { SCREENSHOT_PORT } from '../playwright.config'

const SCREENSHOT_APPS = [
	'activity',
	'calendar',
	'comments',
	'deck',
	'files_versions',
	'notes',
	'notifications',
	'spreed',
	'tasks',
	'viewer',
]

export default async function globalSetup() {
	await startNextcloud('stable33', false, { exposePort: SCREENSHOT_PORT })
	await waitOnNextcloud(`localhost:${SCREENSHOT_PORT}`)
	await configureNextcloud(SCREENSHOT_APPS)

	// Enable pretty URLs so the e2e-test-server login() helper can verify
	// authentication via /apps/files/ after login. Without this, the catch-all
	// RewriteRule forwarding to index.php is missing from .htaccess and the
	// URL is not routed through NC's front controller.
	await runOcc(['config:system:set', 'htaccess.RewriteBase', '--value', '/'])
	await runOcc(['maintenance:update:htaccess'])
	// Disable brute-force protection so rapid login calls in beforeAll don't get
	// throttled. Note: the key is all-lowercase "bruteforce", not camelCase.
	await runOcc(['config:system:set', 'auth.bruteforce.protection.enabled', '--value', 'false', '--type', 'boolean'])
	// Talk hides the "Message expiration" setting in conversation settings unless
	// background jobs are in cron mode. Set it so the feature appears in the UI.
	await runOcc(['config:app:set', 'core', 'backgroundjobs_mode', '--value', 'cron'])
}
