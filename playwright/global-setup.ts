// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { configureNextcloud, startNextcloud, waitOnNextcloud } from '@nextcloud/e2e-test-server/docker'
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
}
