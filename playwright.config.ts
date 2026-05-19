// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineConfig } from '@playwright/test'

export const SCREENSHOT_PORT = 8093
export const BASE_URL = `http://localhost:${SCREENSHOT_PORT}/index.php`

// NC 33 requires Chrome 142+. Headless Chromium ships a lower version string
// by default, which triggers the browser-compatibility warning. Override it here
// so we never need CDP workarounds in individual specs.
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'

export default defineConfig({
	testDir: './playwright/e2e',
	outputDir: './playwright/results',

	timeout: 60_000,
	expect: { timeout: 15_000 },

	// One worker — screenshot automation is not parallel (one Docker container).
	workers: 1,
	retries: 1,
	fullyParallel: false,

	use: {
		baseURL: BASE_URL,
		viewport: { width: 1440, height: 900 },
		userAgent: USER_AGENT,
		video: 'off',
		screenshot: 'off',
	},

	projects: [
		{
			name: 'chromium',
			use: { channel: 'chromium' },
		},
	],

	globalSetup: './playwright/global-setup.ts',
	globalTeardown: './playwright/global-teardown.ts',
})
