// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test, Cookie } from '@playwright/test'
import { User } from '@nextcloud/e2e-test-server'
import { login } from '@nextcloud/e2e-test-server/playwright'
import {
	docScreenshot,
	docElementScreenshot,
	tryOcc,
	uploadAvatar,
	uploadFile,
	mkdavCol,
	ocsRequest,
} from '../../helpers'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import { execSync } from 'child_process'

test.describe.configure({ mode: 'serial' })

const user = new User('christine', 'christine')

let authCookies: Cookie[] = []

const AVATAR_DIR = '/home/anna/Downloads/tp/avatar'
const WALLPAPERS = '/home/anna/Downloads/wallpapers'
const FIXTURES_PDFS = path.join(__dirname, '../../fixtures/pdfs')

/** Write a temp file and return its path. */
function tmpFile(name: string, content: string): string {
	const p = path.join(os.tmpdir(), name)
	fs.writeFileSync(p, content, 'utf8')
	return p
}

/** Create a .docx via LibreOffice headless conversion from a plain-text source. */
function createDocx(baseName: string, content: string): string {
	const txt = tmpFile(`${baseName}.txt`, content)
	execSync(`libreoffice --headless --convert-to docx --outdir "${os.tmpdir()}" "${txt}"`, { timeout: 60000 })
	return path.join(os.tmpdir(), `${baseName}.docx`)
}

function d(isoDate: string): number {
	return Math.floor(new Date(isoDate).getTime() / 1000)
}

test.beforeAll(async ({ browser }) => {
	await tryOcc('user:add --password-from-env --display-name="Christine" christine', { OC_PASS: 'christine' })
	await uploadAvatar(`${AVATAR_DIR}/christine/avatar.png`, 'christine', 'christine')

	// Peer users for sharing — tryOcc is idempotent
	await tryOcc('user:add --password-from-env --display-name="Amara Winterbourne" amara_w', { OC_PASS: 'amara_w' })
	await uploadAvatar(`${AVATAR_DIR}/amara_w/avatar.png`, 'amara_w', 'amara_w')
	await tryOcc('user:add --password-from-env --display-name="Malik Santiago" malik_s', { OC_PASS: 'malik_s' })
	await uploadAvatar(`${AVATAR_DIR}/Malik_Santiago/avatar.png`, 'malik_s', 'malik_s')

	await mkdavCol('Documents', 'christine', 'christine')
	await mkdavCol('Photos', 'christine', 'christine')
	await mkdavCol('Projects', 'christine', 'christine')

	// Photos
	await uploadFile(`${WALLPAPERS}/forest-green.jpg`,     'Photos/Forest.jpg',        'christine', 'christine', d('2026-03-15'))
	await uploadFile(`${WALLPAPERS}/milky-way.jpg`,         'Photos/Milky Way.jpg',     'christine', 'christine', d('2026-02-08'))
	await uploadFile(`${WALLPAPERS}/city-night-purple.jpg`, 'Photos/City at night.jpg', 'christine', 'christine', d('2026-01-22'))
	await uploadFile(`${WALLPAPERS}/red-desert.jpg`,        'Photos/Red desert.jpg',    'christine', 'christine', d('2026-01-05'))

	// Root-level files — mix of types for a realistic file list
	await uploadFile(`${WALLPAPERS}/ocean-golden.jpg`,   'Ocean sunset.jpg',   'christine', 'christine', d('2026-04-10'))
	await uploadFile(`${WALLPAPERS}/snowy-mountain.jpg`, 'Snowy mountain.jpg', 'christine', 'christine', d('2025-12-28'))
	await uploadFile(`${FIXTURES_PDFS}/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf', 'christine', 'christine', d('2026-04-14'))
	await uploadFile(
		tmpFile('nc-seed-pitch.md', [
			'# Autumn Gala — Fundraising Pitch',
			'',
			'## Objective',
			'Raise £40,000 for the community arts centre restoration fund.',
			'',
			'## Key asks',
			'- Headline sponsor: £10,000 (naming rights, table of 10)',
			'- Supporting sponsor: £5,000 (logo on materials, 4 tickets)',
			'- Friend of the Gala: £1,000 (2 tickets, programme credit)',
			'',
			'## Timeline',
			'- 2 June: venue confirmed',
			'- 15 June: sponsor packs out',
			'- 1 September: event date',
		].join('\n')),
		'Fundraising Pitch.md', 'christine', 'christine', d('2026-05-02'),
	)

	// Documents
	await uploadFile(`${FIXTURES_PDFS}/Team Meeting Notes.pdf`, 'Documents/Team Meeting Notes.pdf', 'christine', 'christine', d('2026-04-28'))
	await uploadFile(
		tmpFile('nc-seed-agenda.md', [
			'# Q3 Event Planning — Meeting Agenda',
			'',
			'**Date:** 14 May 2026  **Location:** Video call',
			'',
			'1. Review Q2 fundraising results',
			'2. Confirm venue for autumn gala',
			'3. Assign catering and AV responsibilities',
			'4. Set sponsor outreach targets',
			'5. AOB',
		].join('\n')),
		'Documents/Q3 Meeting Agenda.md', 'christine', 'christine', d('2026-05-14'),
	)
	await uploadFile(
		tmpFile('nc-seed-budget.csv', [
			'Category,Budgeted (£),Actual (£),Variance (£)',
			'Venue,5000,4800,200',
			'Catering,3000,3200,-200',
			'Marketing,1500,1200,300',
			'AV Equipment,800,800,0',
			'Miscellaneous,500,320,180',
			'Total,10800,10320,480',
		].join('\n')),
		'Documents/Event Budget.csv', 'christine', 'christine', d('2026-05-10'),
	)

	// Word documents — created via LibreOffice for proper .docx format
	await uploadFile(
		createDocx('nc-seed-proposal', [
			'Project Proposal: Autumn Gala 2026',
			'',
			'Prepared by: Christine',
			'Date: 1 May 2026',
			'',
			'Executive Summary',
			'This proposal outlines the plan for the autumn fundraising gala, targeting',
			'a net raise of £40,000 for the community arts centre restoration fund.',
			'',
			'Objectives',
			'1. Secure a minimum of 8 sponsors at Supporting level or above',
			'2. Sell 180 of 200 available seats',
			'3. Run a silent auction with a minimum of 20 lots',
			'',
			'Timeline',
			'2 June    Venue confirmed',
			'15 June   Sponsor packs distributed',
			'1 July    Ticket sales open',
			'1 September  Event date',
		].join('\n')),
		'Documents/Gala Proposal 2026.docx', 'christine', 'christine', d('2026-05-01'),
	)
	await uploadFile(
		createDocx('nc-seed-agreement', [
			'Volunteer Agreement',
			'',
			'Organisation: Community Arts Centre',
			'Event: Autumn Gala, 1 September 2026',
			'',
			'By signing this agreement the volunteer confirms they are available on the',
			'event date and agree to follow all health and safety guidelines.',
			'',
			'Roles available: Registration desk, Auction assistant, Front-of-house',
			'',
			'Contact: Christine (events@example.org)',
		].join('\n')),
		'Volunteer Agreement.docx', 'christine', 'christine', d('2026-05-18'),
	)

	// Second upload of Q2 Proposal creates a version entry (needed for Versions tab screenshot)
	await uploadFile(`${FIXTURES_PDFS}/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf', 'christine', 'christine', d('2026-04-28'))

	// Outgoing shares — Christine → others
	// Documents folder shared with Amara and admin (Shared badge; also populates sharing panel)
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'christine', 'christine', {
		path: '/Documents', shareType: '0', shareWith: 'admin',
	})
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'christine', 'christine', {
		path: '/Documents', shareType: '0', shareWith: 'amara_w',
	})
	// Q2 Proposal shared with Malik (shows Shared badge on file)
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'christine', 'christine', {
		path: '/Q2 Project Proposal.pdf', shareType: '0', shareWith: 'malik_s',
	})
	// Ocean sunset.jpg via public link (chain-link icon)
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'christine', 'christine', {
		path: '/Ocean sunset.jpg', shareType: '3',
	})

	// Incoming share — Amara shares a file with Christine (populates Shared with you)
	await uploadFile(
		tmpFile('nc-seed-venue.md', [
			'# Venue Scouting Notes — Autumn Gala',
			'',
			'## Riverside Pavilion',
			'- Capacity: 200 seated, 280 standing',
			'- Rate: £3,800 for Saturday evening',
			'- Catering: preferred supplier list, external allowed +15%',
			'- Parking: 80 spaces, free after 18:00',
			'',
			'## City Hall Great Room',
			'- Capacity: 150 seated',
			'- Rate: £5,200 all-in',
			'- Note: booking window closes 31 May',
		].join('\n')),
		'Venue Scouting Notes.md', 'amara_w', 'amara_w', d('2026-05-16'),
	)
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'amara_w', 'amara_w', {
		path: '/Venue Scouting Notes.md', shareType: '0', shareWith: 'christine',
	})

	// Set Christine's user status so profile screenshots show it
	await ocsRequest('PUT', '/ocs/v2.php/apps/user_status/api/v1/user_status/status', 'christine', 'christine', {
		statusType: 'online',
	})
	await ocsRequest('PUT', '/ocs/v2.php/apps/user_status/api/v1/user_status/message/custom', 'christine', 'christine', {
		message: 'Working on Q3 event planning',
		statusIcon: '',
	})

	// Login once and cache the session cookies — restored in beforeEach to avoid
	// triggering NC brute-force protection with repeated POST /login calls.
	const ctx = await browser.newContext()
	const pg = await ctx.newPage()
	await login(pg.request, user)
	authCookies = await ctx.cookies()
	await ctx.close()
})

test.beforeEach(async ({ page }) => {
	await page.context().addCookies(authCookies)
})

// ── access_webgui.rst ────────────────────────────────────────────────────────

test('Files — main view (users-files)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-content]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/users-files')
})

test('Files — new file/upload menu (files_page-1)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-upload-picker] button').first().click()
	await page.locator('[role="menuitem"]').first().waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/files_page-1')
})

test('Files — file row with actions menu (files_page-3)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-files-list-row]').first().locator('button[aria-label="Actions"]').click()
	await page.locator('[data-cy-files-list-row-action]').first().waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/files_page-3')
})

test('Files — details sidebar (files_page-4)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-files-list-row][data-cy-files-list-row-name="Q2 Project Proposal.pdf"]')
		.locator('button[aria-label="Actions"]').click({ force: true })
	await page.locator('[data-cy-files-list-row-action="details"]').first().click()
	await page.locator('[data-cy-sidebar]').waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/files_page-4')
})

test('Files — left navigation panel (files_page-5)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-navigation]').waitFor({ state: 'visible' })
	await docElementScreenshot(page, '[data-cy-files-navigation]', 'user/files_page-5')
})

test('Files — breadcrumbs inside a folder (files_page-6)', async ({ page }) => {
	await page.goto('/apps/files/files?dir=/Documents')
	await page.locator('[data-cy-files-content-breadcrumbs]').waitFor({ state: 'visible' })
	await docElementScreenshot(page, '[data-cy-files-content-breadcrumbs]', 'user/files_page-6')
})

test('Files — search / filter (files_page-7)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-navigation]').waitFor({ state: 'visible' })
	await page.locator('.app-navigation-search input, [data-cy-app-navigation-search] input').waitFor({ state: 'visible' })
	await page.locator('.app-navigation-search input, [data-cy-app-navigation-search] input').fill('Document')
	await page.waitForTimeout(500)
	await docScreenshot(page, 'user/files_page-7')
})

test('Files — grid view (files_page-8)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await page.locator('.files-list__header-grid-button').click()
	await page.locator('.files-list--grid').waitFor({ state: 'attached' })
	// Move focus away so the button outline doesn't appear
	await page.locator('[data-cy-files-list]').click({ force: true })
	await docScreenshot(page, 'user/files_page-8')
	// Reset to list view
	await page.locator('.files-list__header-grid-button').click()
})

test('Files — comment in sidebar (file_menu_comments_2)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-files-list-row]').first().locator('button[aria-label="Actions"]').click({ force: true })
	await page.locator('[data-cy-files-list-row-action="details"]').first().click()
	await page.locator('[data-cy-sidebar]').waitFor({ state: 'visible' })
	await page.locator('[role="tab"]', { hasText: 'Activity' }).click()
	await page.locator('[role="tabpanel"].app-sidebar__tab--active').waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/file_menu_comments_2')
})

test('Files — selecting multiple files (files_page-9)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-files-list-row]').nth(0).locator('[data-cy-files-list-row-checkbox]').click()
	await page.locator('[data-cy-files-list-row]').nth(1).locator('[data-cy-files-list-row-checkbox]').click()
	await page.locator('[data-cy-files-list-row]').nth(2).locator('[data-cy-files-list-row-checkbox]').click()
	await page.locator('[data-cy-files-list-selection-actions]').waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/files_page-9')
})

test('Files — sharing status icons (files_sharing_status)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	// Wait until all provisioned files appear
	await page.waitForFunction(() => document.querySelectorAll('[data-cy-files-list-row]').length > 3, undefined, { timeout: 15000 })
	await page.waitForTimeout(500)
	await docScreenshot(page, 'user/files_sharing_status')
})

// ── sharing.rst ───────────────────────────────────────────────────────────────

test('Files — sharing panel (sharing_internal)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-files-list-row]').first().locator('button[aria-label="Actions"]').click({ force: true })
	await page.locator('[data-cy-files-list-row-action="details"]').first().click()
	await page.locator('[data-cy-sidebar]').waitFor({ state: 'visible' })
	await page.locator('[role="tab"]', { hasText: 'Sharing' }).click()
	await page.locator('[role="tabpanel"].app-sidebar__tab--active').waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/sharing_internal')
})

test('Files — public link share (sharing_public_file)', async ({ page }) => {
	await page.goto('/apps/files/files?dir=/')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible' })

	// Close sidebar if NC's router restored it from a previous state
	const sidebar = page.locator('[data-cy-sidebar]')
	if (await sidebar.isVisible()) {
		await page.keyboard.press('Escape')
		await sidebar.waitFor({ state: 'hidden' })
	}

	await page.locator('[data-cy-files-list-row]').first().locator('button[aria-label="Actions"]').waitFor({ state: 'visible' })
	await page.locator('[data-cy-files-list-row]').first().locator('button[aria-label="Actions"]').click()
	await page.locator('[data-cy-files-list-row-action="details"]').first().click()
	await page.locator('[data-cy-sidebar]').waitFor({ state: 'visible' })
	await page.locator('[role="tab"]', { hasText: 'Sharing' }).click()
	await page.locator('[role="tabpanel"].app-sidebar__tab--active').waitFor({ state: 'visible' })
	await page.locator('button[aria-label="Create a new share link"]').click()
	await page.locator('.sharing-entry.sharing-entry--share').waitFor({ state: 'visible' })

	// Dismiss toasts
	const toastBtns = page.locator('button.toast-close')
	for (let i = 0; i < await toastBtns.count(); i++) {
		await toastBtns.nth(i).click({ force: true }).catch(() => {})
	}
	await page.locator('.toastify').waitFor({ state: 'detached' }).catch(() => {})

	await docScreenshot(page, 'user/sharing_public_file')
})

// ── quota.rst ─────────────────────────────────────────────────────────────────

test('Files — quota display (quota1)', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-navigation-settings-quota]').waitFor({ state: 'visible' })
	await docElementScreenshot(page, '[data-cy-files-navigation-settings-quota]', 'user/quota1')
})
