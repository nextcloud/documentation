// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

export { seedUsers } from './users'
export { seedTalk, seedNoteToSelf } from './talk'
export { seedFiles } from './files'

import { seedUsers } from './users'
import { seedTalk } from './talk'
import { seedFiles } from './files'

/**
 * Run all pre-browser seeding: users, Talk rooms, messages, files, shares.
 * Returns the "Event planning" group token needed for post-browser seeding.
 */
export async function seed(): Promise<string> {
	await seedUsers()
	const eventToken = await seedTalk()
	await seedFiles()
	return eventToken
}
