// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

export { seedUsers } from './users'
export { seedTalk, seedNoteToSelf, adjustTalkTimestamps } from './talk'
export { seedFiles } from './files'
export { seedCalendar } from './calendar'
export { seedContacts } from './contacts'

import { seedUsers } from './users'
import { seedTalk, adjustTalkTimestamps } from './talk'
import { seedFiles } from './files'
import { seedCalendar } from './calendar'
import { seedContacts } from './contacts'

/**
 * Run all pre-browser seeding: users, Talk rooms, messages, files, shares,
 * calendar events, and contacts.
 * Returns the "Event planning" group token needed for post-browser seeding.
 */
export async function seed(): Promise<string> {
	await seedUsers()
	const tokens = await seedTalk()
	await seedFiles()
	await seedCalendar()
	await seedContacts()
	await adjustTalkTimestamps(tokens)
	return tokens.event
}
