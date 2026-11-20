// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { stopNextcloud } from '@nextcloud/e2e-test-server/docker'
import { execSync } from 'child_process'
import * as os from 'os'
import * as path from 'path'

export default async function globalTeardown() {
	await stopNextcloud()

	// Compress screenshots with pngquant after all tests complete.
	const screenshotDir = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs')
	try {
		const { default: pngquantBin } = await import('pngquant-bin')
		execSync(
			`find "${screenshotDir}" -name '*.png' -exec "${pngquantBin}" --quality=70-85 --force --ext .png --strip {} \\;`,
			{ stdio: 'inherit' },
		)
	} catch {
		console.warn('pngquant compression failed — screenshots not compressed')
	}
}
