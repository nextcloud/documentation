// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { configureNextcloud, runOcc, startNextcloud, waitOnNextcloud } from '@nextcloud/e2e-test-server/docker'
import { login } from '@nextcloud/e2e-test-server/playwright'
import { User } from '@nextcloud/e2e-test-server'
import { chromium } from '@playwright/test'
import * as path from 'path'
import { SCREENSHOT_PORT } from '../playwright.config'
import { seed, seedNoteToSelf } from './seed'

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

const AUTH_FILE = path.join(__dirname, '.auth', 'state.json')

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

	// Seed all users and Talk data via API.
	// seedTalk() returns the "Event planning" group token needed for post-browser seeding.
	const eventToken = await seed()

	// Launch a browser to initialise Talk (note-to-self requires a prior browser
	// visit to /apps/spreed), seed post-browser data, then capture storageState so
	// every test starts pre-authenticated without calling login() in beforeEach.
	const browser = await chromium.launch()
	const context = await browser.newContext({
		baseURL: `http://localhost:${SCREENSHOT_PORT}`,
		userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
	})
	const page = await context.newPage()
	const christine = new User('christine', 'christine')
	await login(page.request, christine)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 20000 }).catch(() => {})
	await seedNoteToSelf(eventToken)
	await context.storageState({ path: AUTH_FILE })
	await browser.close()
}
