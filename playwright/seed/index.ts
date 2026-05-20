// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

export { seedUsers } from './users'
export { seedTalk, seedNoteToSelf } from './talk'

import { seedUsers } from './users'
import { seedTalk } from './talk'

/**
 * Run all pre-browser seeding: users, Talk rooms, messages, calendar event.
 * Returns the "Event planning" group token needed for post-browser seeding.
 */
export async function seed(): Promise<string> {
	await seedUsers()
	return seedTalk()
}
