// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdavCol, uploadFile, ocsRequest, SCREENSHOT_PORT } from '../helpers'
import * as path from 'path'

const FIXTURES_DIR = path.join(process.cwd(), 'cypress/fixtures')

async function share(path: string, user: string, password: string, shareType: string, opts: Record<string, string> = {}): Promise<void> {
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', user, password, {
		path,
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

export async function seedFiles(): Promise<void> {
	// ── Christine's folder tree ───────────────────────────────────────────────

	await mkdavCol('Documents', 'christine', 'christine')
	await mkdavCol('Projects', 'christine', 'christine')
	await mkdavCol('Projects/Q3 Gala', 'christine', 'christine')

	if (!await davExists('Projects/Q3 Gala/Q2 Project Proposal.pdf', 'christine', 'christine')) {
		await uploadFile(
			`${FIXTURES_DIR}/pdfs/Q2 Project Proposal.pdf`,
			'Projects/Q3 Gala/Q2 Project Proposal.pdf',
			'christine', 'christine',
		)
	}
	if (!await davExists('Projects/Q3 Gala/Team Meeting Notes.pdf', 'christine', 'christine')) {
		await uploadFile(
			`${FIXTURES_DIR}/pdfs/Team Meeting Notes.pdf`,
			'Projects/Q3 Gala/Team Meeting Notes.pdf',
			'christine', 'christine',
		)
	}

	// ── Shares from christine ─────────────────────────────────────────────────

	// Share Projects/Q3 Gala/ folder with amara_w (edit permissions)
	// shareType 0 = user share; permissions 17 = read + create + update (editor on folder)
	await share('/Projects/Q3 Gala', 'christine', 'christine', '0', {
		shareWith: 'amara_w',
		permissions: '17',
	})

	// Share Team Meeting Notes.pdf with lila_h (read-only)
	await share('/Projects/Q3 Gala/Team Meeting Notes.pdf', 'christine', 'christine', '0', {
		shareWith: 'lila_h',
		permissions: '1',
	})

	// Public link share on Q2 Project Proposal.pdf (read-only, no password)
	await share('/Projects/Q3 Gala/Q2 Project Proposal.pdf', 'christine', 'christine', '3', {
		permissions: '1',
	})

	// ── amara_w's files and share back to christine ───────────────────────────

	// amara_w already has files from Talk seeding (Q2 Project Proposal.pdf, Team Meeting Notes.pdf
	// uploaded to her root during DM seeding). Upload them here too in case files seed runs first.
	if (!await davExists('Q2 Project Proposal.pdf', 'amara_w', 'amara_w')) {
		await uploadFile(
			`${FIXTURES_DIR}/pdfs/Q2 Project Proposal.pdf`,
			'Q2 Project Proposal.pdf',
			'amara_w', 'amara_w',
		)
	}

	// Share Q2 Project Proposal.pdf from amara_w back to christine (read-only)
	await share('/Q2 Project Proposal.pdf', 'amara_w', 'amara_w', '0', {
		shareWith: 'christine',
		permissions: '1',
	})
}
