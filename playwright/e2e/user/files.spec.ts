// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test, Cookie } from '@playwright/test'
import { User } from '@nextcloud/e2e-test-server'
import { login } from '@nextcloud/e2e-test-server/playwright'
import { runExec } from '@nextcloud/e2e-test-server/docker'
import { docScreenshot, docElementScreenshot } from '../../helpers'

test.describe.configure({ mode: 'serial' })

const user = new User('christine', 'christine')

let authCookies: Cookie[] = []

function d(isoDate: string): number {
	return Math.floor(new Date(isoDate).getTime() / 1000)
}

/**
 * Backdate a folder's mtime so the Files app shows a realistic date instead of
 * "a few seconds ago". Updates both oc_filecache (what NC serves) and the real
 * directory on disk (which NC re-reads on page load and would otherwise overwrite
 * the DB value).
 */
async function backdateFolderMtime(folderPath: string, user: string, mtime: number): Promise<void> {
	// Update oc_filecache — NC stores paths as 'files/<folder>' in the home storage
	const sql = `UPDATE oc_filecache SET mtime = ${mtime}, storage_mtime = ${mtime} WHERE path = 'files/${folderPath}' AND storage = (SELECT numeric_id FROM oc_storages WHERE id = 'home::${user}')`
	const b64 = Buffer.from(sql).toString('base64')
	const php = `try{$db=new PDO('sqlite:/var/www/html/data/owncloud.db');$db->exec(base64_decode('${b64}'));echo"ok";}catch(Exception $e){echo"ERR:".$e->getMessage();}`
	await runExec(['php', '-r', php]).catch(() => {})

	// Touch the real directory too — NC's lazy scanner reads the filesystem mtime
	// and would overwrite our DB value if they diverged.
	await runExec(['touch', '-m', '-d', `@${mtime}`, `/var/www/html/data/${user}/files/${folderPath}`]).catch(() => {})
}

test.beforeAll(async ({ browser }) => {
	// Login once and cache the session cookies — restored in beforeEach to avoid
	// triggering NC brute-force protection with repeated POST /login calls.
	const ctx = await browser.newContext()
	const pg = await ctx.newPage()
	await login(pg.request, user)
	authCookies = await ctx.cookies()
	await ctx.close()

	// Backdate folder mtimes after login (Talk initialises on first login and would
	// overwrite its mtime if we ran earlier). Updates both oc_filecache and the
	// filesystem so NC's lazy scanner doesn't revert the values.
	// Note: the Talk folder mtime is also intercepted at PROPFIND time in the
	// "main view" test because NC's in-process Sabre/DAV cache ignores the DB.
	await backdateFolderMtime('Documents', 'christine', d('2026-05-14'))
	await backdateFolderMtime('Photos',    'christine', d('2026-03-15'))
	await backdateFolderMtime('Projects',  'christine', d('2026-04-01'))
	await backdateFolderMtime('Notes',     'christine', d('2026-04-20'))
	await backdateFolderMtime('Talk',      'christine', d('2026-05-15'))
})

test.beforeEach(async ({ page }) => {
	await page.context().addCookies(authCookies)
	// NC's in-process Sabre/DAV cache serves today's mtime for the Talk folder
	// regardless of what oc_filecache or the filesystem contains — the value is
	// cached from first use within the Apache worker's lifetime. Intercept the
	// root PROPFIND and rewrite Talk's getlastmodified to the backdated value.
	await page.route('**/remote.php/dav/files/christine/', async (route, request) => {
		if (request.method() !== 'PROPFIND') { await route.continue(); return }
		try {
			const response = await route.fetch()
			const body = await response.text()
			const patched = body.replace(
				/(<d:href>[^<]*\/Talk\/<\/d:href>[\s\S]*?<d:getlastmodified>)(.*?)(<\/d:getlastmodified>)/,
				'$1Thu, 15 May 2026 00:00:00 GMT$3',
			)
			await route.fulfill({ response, body: patched, contentType: response.headers()['content-type'] || 'application/xml' })
		} catch (_) {
			await route.continue().catch(() => {})
		}
	})
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
	// Ensure we start in list view, then switch to grid
	const inGrid = await page.locator('.files-list--grid').isVisible()
	if (!inGrid) {
		await page.locator('.files-list__header-grid-button').click()
		await page.locator('.files-list--grid').waitFor({ state: 'attached', timeout: 5000 })
	}
	// Wait for thumbnails to render, then blur focus into a safe area (header)
	// so button outlines don't appear. Avoid clicking the file area which opens the Viewer.
	await page.waitForTimeout(1000)
	await page.locator('[data-cy-files-content-breadcrumbs]').click({ force: true })
	await docScreenshot(page, 'user/files_page-8')
	// Reset to list view — Escape first in case the breadcrumb click opened anything
	await page.keyboard.press('Escape')
	await page.locator('.files-list__header-grid-button').click()
	await page.locator('.files-list--grid').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {})
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
	// Select three named user files so the screenshot shows file checkboxes,
	// not the system folders that happen to be first in alphabetical order.
	for (const name of ['Q2 Project Proposal.pdf', 'Volunteer Agreement.docx', 'Fundraising Pitch.md']) {
		await page.locator(`[data-cy-files-list-row][data-cy-files-list-row-name="${name}"]`)
			.locator('[data-cy-files-list-row-checkbox]').click()
	}
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
