// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdavCol, uploadFile, ocsRequest, SCREENSHOT_PORT } from '../helpers'
import * as path from 'path'

const F = path.join(__dirname, '..', 'fixtures')
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

	// Root-level files — mix of types for a realistic file list
	await uploadIfMissing(`${F}/images/ocean-golden.jpg`,           'Ocean sunset.jpg',           'christine', 'christine', daysAgo(47))
	await uploadIfMissing(`${F}/documents/Fundraising Pitch.md`,    'Fundraising Pitch.md',        'christine', 'christine', daysAgo(25))
	await uploadIfMissing(`${F}/documents/Volunteer Agreement.docx`, 'Volunteer Agreement.docx',   'christine', 'christine', daysAgo(9))
	// Double-upload creates a version history entry (needed for the Versions sidebar tab)
	if (!await davExists('Q2 Project Proposal.pdf', 'christine', 'christine')) {
		await uploadFile(`${F}/pdfs/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf', 'christine', 'christine', daysAgo(43))
		await uploadFile(`${F}/pdfs/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf', 'christine', 'christine', daysAgo(14))
	}

	// Photos — four landscape JPEGs with human-readable names
	await uploadIfMissing(`${F}/images/forest-green.jpg`,      'Photos/Forest.jpg',              'christine', 'christine', daysAgo(73))
	await uploadIfMissing(`${F}/images/ocean-golden.jpg`,      'Photos/Ocean at golden hour.jpg', 'christine', 'christine', daysAgo(60))
	await uploadIfMissing(`${F}/images/city-night-purple.jpg`, 'Photos/City at night.jpg',        'christine', 'christine', daysAgo(55))
	await uploadIfMissing(`${F}/images/milky-way.jpg`,         'Photos/Milky Way.jpg',            'christine', 'christine', daysAgo(108))

	// Documents — proposal, budget, agenda, PDF, contacts, calendar
	await uploadIfMissing(`${F}/documents/Gala Proposal 2026.docx`, 'Documents/Gala Proposal 2026.docx', 'christine', 'christine', daysAgo(26))
	await uploadIfMissing(`${F}/documents/Event Budget.csv`,         'Documents/Event Budget.csv',        'christine', 'christine', daysAgo(17))
	await uploadIfMissing(`${F}/documents/Q3 Meeting Agenda.md`,     'Documents/Q3 Meeting Agenda.md',    'christine', 'christine', daysAgo(13))
	await uploadIfMissing(`${F}/pdfs/Team Meeting Notes.pdf`,        'Documents/Team Meeting Notes.pdf',  'christine', 'christine', daysAgo(29))
	await uploadIfMissing(`${F}/contacts/team-contacts.vcf`,         'Documents/team-contacts.vcf',       'christine', 'christine', daysAgo(50))
	await uploadIfMissing(`${F}/calendar/q3-gala.ics`,               'Documents/q3-gala.ics',             'christine', 'christine', daysAgo(48))

	// Projects/Q3 Gala
	await uploadIfMissing(`${F}/pdfs/Q2 Project Proposal.pdf`, 'Projects/Q3 Gala/Q2 Project Proposal.pdf', 'christine', 'christine', daysAgo(43))
	await uploadIfMissing(`${F}/pdfs/Team Meeting Notes.pdf`,   'Projects/Q3 Gala/Team Meeting Notes.pdf',  'christine', 'christine', daysAgo(29))

	// Remove NC's auto-generated welcome file
	await fetch(`http://localhost:${SCREENSHOT_PORT}/remote.php/dav/files/christine/welcome.txt`, {
		method: 'DELETE',
		headers: { Authorization: 'Basic ' + Buffer.from('christine:christine').toString('base64') },
	}).catch(() => {})

	// ── Shares from Christine ─────────────────────────────────────────────────

	// Documents/ — amara_w (editor) + malik_s (read-only): populates sharing panel
	await share('/Documents', 'christine', 'christine', '0', { shareWith: 'amara_w', permissions: '17' })
	await share('/Documents', 'christine', 'christine', '0', { shareWith: 'malik_s', permissions: '1' })
	// Q2 Project Proposal.pdf — shared with malik_s + public link: badge + link share screenshots
	await share('/Q2 Project Proposal.pdf', 'christine', 'christine', '0', { shareWith: 'malik_s', permissions: '1' })
	await share('/Q2 Project Proposal.pdf', 'christine', 'christine', '3', { permissions: '1' })
	// Ocean sunset.jpg — public link only
	await share('/Ocean sunset.jpg', 'christine', 'christine', '3', { permissions: '1' })
	// Projects/Q3 Gala — amara_w (editor)
	await share('/Projects/Q3 Gala', 'christine', 'christine', '0', { shareWith: 'amara_w', permissions: '17' })

	// ── amara_w's files ───────────────────────────────────────────────────────

	// amara_w may already have Q2 Proposal from Talk DM seeding; upload if missing
	await uploadIfMissing(`${F}/pdfs/Q2 Project Proposal.pdf`,       'Q2 Project Proposal.pdf',  'amara_w', 'amara_w', daysAgo(43))
	await uploadIfMissing(`${F}/documents/Event Budget.csv`,          'Event Budget.csv',          'amara_w', 'amara_w', daysAgo(17))
	await uploadIfMissing(`${F}/documents/Venue Scouting Notes.md`,   'Venue Scouting Notes.md',   'amara_w', 'amara_w', daysAgo(11))

	// amara_w → christine: incoming shares so "Shared with you" has content
	await share('/Q2 Project Proposal.pdf',  'amara_w', 'amara_w', '0', { shareWith: 'christine', permissions: '1' })
	await share('/Venue Scouting Notes.md',  'amara_w', 'amara_w', '0', { shareWith: 'christine', permissions: '1' })
	// amara_w → lila_h: gives lila_h a realistic "Shared with you" list
	await share('/Event Budget.csv', 'amara_w', 'amara_w', '0', { shareWith: 'lila_h', permissions: '1' })
}
