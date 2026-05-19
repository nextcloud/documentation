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

test.describe.configure({ mode: 'serial' })

const user = new User('christine', 'christine')

let authCookies: Cookie[] = []

const AVATAR_DIR = '/home/anna/Downloads/tp/avatar'
const WALLPAPERS = '/home/anna/Downloads/wallpapers'
const FIXTURES_PDFS = path.join(process.cwd(), 'cypress/fixtures/pdfs')

function d(isoDate: string): number {
	return Math.floor(new Date(isoDate).getTime() / 1000)
}

test.beforeAll(async ({ browser }) => {
	await tryOcc('user:add --password-from-env --display-name="Christine" christine', { OC_PASS: 'christine' })
	await uploadAvatar(`${AVATAR_DIR}/christine/avatar.png`, 'christine', 'christine')

	await mkdavCol('Documents', 'christine', 'christine')
	await mkdavCol('Photos', 'christine', 'christine')

	await uploadFile(`${WALLPAPERS}/forest-green.jpg`,     'Photos/Forest.jpg',        'christine', 'christine', d('2026-03-15'))
	await uploadFile(`${WALLPAPERS}/milky-way.jpg`,         'Photos/Milky Way.jpg',     'christine', 'christine', d('2026-02-08'))
	await uploadFile(`${WALLPAPERS}/city-night-purple.jpg`, 'Photos/City at night.jpg', 'christine', 'christine', d('2026-01-22'))

	await uploadFile(`${WALLPAPERS}/ocean-golden.jpg`,   'Ocean sunset.jpg',   'christine', 'christine', d('2026-04-10'))
	await uploadFile(`${WALLPAPERS}/snowy-mountain.jpg`, 'Snowy mountain.jpg', 'christine', 'christine', d('2025-12-28'))

	await uploadFile(`${FIXTURES_PDFS}/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf',          'christine', 'christine', d('2026-04-14'))
	await uploadFile(`${FIXTURES_PDFS}/Team Meeting Notes.pdf`,   'Documents/Team Meeting Notes.pdf', 'christine', 'christine', d('2026-04-28'))
	// Second upload creates a version entry (needed for the Versions tab screenshot)
	await uploadFile(`${FIXTURES_PDFS}/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf',          'christine', 'christine', d('2026-04-28'))

	// Share Documents folder with admin (shows Shared badge)
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'christine', 'christine', {
		path: '/Documents', shareType: '0', shareWith: 'admin',
	})
	// Share Ocean sunset.jpg via public link (shows chain-link icon)
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'christine', 'christine', {
		path: '/Ocean sunset.jpg', shareType: '3',
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
