// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdavCol, uploadFile, ocsRequest, SCREENSHOT_PORT } from '../helpers'
import * as path from 'path'

const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures')
const daysAgo = (n: number) => Math.floor(Date.now() / 1000 - n * 86400)

async function share(filePath: string, user: string, password: string, shareType: string, opts: Record<string, string> = {}): Promise<void> {
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', user, password, {
		path: filePath,
		shareType,
		...opts,
	}).catch(() => {})
}

async function davExists(davPath: string, user: string, password: string): Promise<boolean> {
	const res = await fetch(`http://localhost:${SCREENSHOT_PORT}/remote.php/dav/files/${user}/${davPath}`, {
		method: 'PROPFIND',
		headers: {
			Authorization: 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64'),
			Depth: '0',
		},
	})
	return res.status === 207
}

async function uploadIfMissing(src: string, dest: string, user: string, password: string, mtime?: number): Promise<void> {
	if (!await davExists(dest, user, password)) {
		await uploadFile(src, dest, user, password, mtime)
	}
}

export async function seedFiles(): Promise<void> {
	// ── Christine's folder tree ───────────────────────────────────────────────

	await mkdavCol('Documents', 'christine', 'christine')
	await mkdavCol('Photos', 'christine', 'christine')
	await mkdavCol('Projects', 'christine', 'christine')
	await mkdavCol('Projects/Q3 Gala', 'christine', 'christine')

	// Documents — text, spreadsheet, contacts, calendar
	await uploadIfMissing(
		`${FIXTURES_DIR}/documents/Event Brief.md`,
		'Documents/Event Brief.md',
		'christine', 'christine',
		daysAgo(7),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/documents/Budget Overview.csv`,
		'Documents/Budget Overview.csv',
		'christine', 'christine',
		daysAgo(12),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/documents/Volunteer List.csv`,
		'Documents/Volunteer List.csv',
		'christine', 'christine',
		daysAgo(5),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/contacts/team-contacts.vcf`,
		'Documents/team-contacts.vcf',
		'christine', 'christine',
		daysAgo(20),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/calendar/q3-gala.ics`,
		'Documents/q3-gala.ics',
		'christine', 'christine',
		daysAgo(18),
	)

	// Photos — landscape JPEGs for gallery / image preview screenshots
	await uploadIfMissing(
		`${FIXTURES_DIR}/images/forest-green.jpg`,
		'Photos/forest-green.jpg',
		'christine', 'christine',
		daysAgo(14),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/images/ocean-golden.jpg`,
		'Photos/ocean-golden.jpg',
		'christine', 'christine',
		daysAgo(11),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/images/city-night-purple.jpg`,
		'Photos/city-night-purple.jpg',
		'christine', 'christine',
		daysAgo(9),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/images/milky-way.jpg`,
		'Photos/milky-way.jpg',
		'christine', 'christine',
		daysAgo(9),
	)

	// Projects — PDFs
	await uploadIfMissing(
		`${FIXTURES_DIR}/pdfs/Q2 Project Proposal.pdf`,
		'Projects/Q3 Gala/Q2 Project Proposal.pdf',
		'christine', 'christine',
		daysAgo(21),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/pdfs/Team Meeting Notes.pdf`,
		'Projects/Q3 Gala/Team Meeting Notes.pdf',
		'christine', 'christine',
		daysAgo(3),
	)

	// ── Shares from christine ─────────────────────────────────────────────────

	// Share Projects/Q3 Gala/ folder with amara_w (editor: read + create + update)
	await share('/Projects/Q3 Gala', 'christine', 'christine', '0', {
		shareWith: 'amara_w',
		permissions: '17',
	})

	// Share Documents/ folder with malik_s (read-only)
	await share('/Documents', 'christine', 'christine', '0', {
		shareWith: 'malik_s',
		permissions: '1',
	})

	// Share Team Meeting Notes.pdf with lila_h (read-only)
	await share('/Projects/Q3 Gala/Team Meeting Notes.pdf', 'christine', 'christine', '0', {
		shareWith: 'lila_h',
		permissions: '1',
	})

	// Public link share on Q2 Project Proposal.pdf (read-only)
	await share('/Projects/Q3 Gala/Q2 Project Proposal.pdf', 'christine', 'christine', '3', {
		permissions: '1',
	})

	// ── amara_w's files ───────────────────────────────────────────────────────

	// amara_w may already have these from Talk DM seeding; upload if missing
	await uploadIfMissing(
		`${FIXTURES_DIR}/pdfs/Q2 Project Proposal.pdf`,
		'Q2 Project Proposal.pdf',
		'amara_w', 'amara_w',
		daysAgo(21),
	)
	await uploadIfMissing(
		`${FIXTURES_DIR}/documents/Budget Overview.csv`,
		'Budget Overview.csv',
		'amara_w', 'amara_w',
		daysAgo(12),
	)

	// Share Q2 Project Proposal.pdf from amara_w back to christine (read-only)
	// so christine's "Shared with you" view has content
	await share('/Q2 Project Proposal.pdf', 'amara_w', 'amara_w', '0', {
		shareWith: 'christine',
		permissions: '1',
	})

	// amara_w also shares the budget CSV with lila_h — gives lila_h a realistic
	// "Shared with you" list for her own account
	await share('/Budget Overview.csv', 'amara_w', 'amara_w', '0', {
		shareWith: 'lila_h',
		permissions: '1',
	})
}
