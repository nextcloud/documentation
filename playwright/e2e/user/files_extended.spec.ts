// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as os from 'os'
import * as path from 'path'
import { test, Page } from '@playwright/test'
import { docScreenshot, ocsRequest, SCREENSHOT_PORT } from '../../helpers'

const DEST = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user')
const dest = (name: string) => path.join(DEST, name + '.png')

/** Open Files app at an optional subfolder and wait for the file list. */
async function openFiles(page: Page, subPath = ''): Promise<void> {
	await page.goto(`/apps/files${subPath ? '?dir=' + encodeURIComponent(subPath) : ''}`)
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(400)
}

/** Open the sidebar for a file by name using NC33 data-cy attributes. */
async function openFileSidebar(page: Page, fileName: string): Promise<void> {
	await page.locator(`[data-cy-files-list-row][data-cy-files-list-row-name="${fileName}"]`)
		.locator('button[aria-label="Actions"]').click({ force: true })
	await page.locator('[data-cy-files-list-row-action="details"]').first().click()
	await page.locator('[data-cy-sidebar]').waitFor({ state: 'visible', timeout: 10000 })
	await page.waitForTimeout(400)
}

/** Get the public link token for a path from the OCS shares API. */
async function getPublicShareToken(davPath: string): Promise<string | null> {
	try {
		const res = await ocsRequest(
			'GET',
			`/ocs/v2.php/apps/files_sharing/api/v1/shares?path=${encodeURIComponent(davPath)}&shareType=3`,
			'christine', 'christine',
		)
		const json = await res.json()
		const shares = json?.ocs?.data
		if (Array.isArray(shares) && shares.length > 0) return shares[0].token as string
	} catch (_) { /* ignore */ }
	return null
}

// ── Version control ───────────────────────────────────────────────────────────

test('Files — version history sidebar', async ({ page }) => {
	await openFiles(page)
	await openFileSidebar(page, 'Q2 Project Proposal.pdf')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /version/i }).click()
	await page.waitForTimeout(600)
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('files_versioning') })
})

test('Files — version actions menu', async ({ page }) => {
	await openFiles(page)
	await openFileSidebar(page, 'Q2 Project Proposal.pdf')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /version/i }).click()
	await page.waitForTimeout(600)
	// Hover the first version entry to reveal its actions button
	const versionEntry = page.locator('[data-cy-sidebar] li').first()
	await versionEntry.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	if (await versionEntry.isVisible()) {
		await versionEntry.hover()
		const actionsBtn = versionEntry.locator('button[aria-label*="Actions"], button[aria-label*="more"]').first()
		if (await actionsBtn.isVisible()) {
			await actionsBtn.click()
			await page.waitForTimeout(300)
		}
	}
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('files_versions_actions') })
})

test('Files — version naming', async ({ page }) => {
	await openFiles(page)
	await openFileSidebar(page, 'Q2 Project Proposal.pdf')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /version/i }).click()
	await page.waitForTimeout(600)
	const versionEntry = page.locator('[data-cy-sidebar] li').first()
	if (await versionEntry.isVisible()) {
		await versionEntry.hover()
		const actionsBtn = versionEntry.locator('button[aria-label*="Actions"], button[aria-label*="more"]').first()
		if (await actionsBtn.isVisible()) {
			await actionsBtn.click()
			await page.waitForTimeout(200)
			await page.locator('[role="menuitem"]').filter({ hasText: /name/i }).first()
				.click({ timeout: 3000 }).catch(() => {})
			await page.waitForTimeout(400)
		}
	}
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('files_versions_naming') })
})

// ── Sharing — advanced panels ─────────────────────────────────────────────────

test('Files — public folder share options', async ({ page }) => {
	// sharing_public_folder: sharing sidebar on a folder, public link section open
	await openFiles(page)
	await openFileSidebar(page, 'Documents')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /shar/i }).click()
	await page.waitForTimeout(500)
	// Expand the public link section if there's a toggle
	const linkToggle = page.locator('[data-cy-sidebar] button').filter({ hasText: /link|public/i }).first()
	if (await linkToggle.isVisible()) await linkToggle.click()
	await page.waitForTimeout(400)
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('sharing_public_folder') })
})

test('Files — share acceptance notification', async ({ page }) => {
	// Create a fresh share so a notification appears
	await ocsRequest(
		'POST',
		'/ocs/v2.php/apps/files_sharing/api/v1/shares',
		'amara_w', 'amara_w',
		{ path: '/Event Budget.csv', shareType: '0', shareWith: 'christine', permissions: '1' },
	).catch(() => {})
	await openFiles(page)
	await page.waitForTimeout(600)
	const notifBtn = page.locator('button[aria-label*="Notifications"]').first()
	if (await notifBtn.isVisible()) {
		await notifBtn.click()
		await page.waitForTimeout(500)
		const panel = page.locator('[class*="notification"], .notifications-popover').first()
		await panel.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
		const shareNotif = panel.locator('li').filter({ hasText: /shared/i }).first()
		if (await shareNotif.isVisible()) {
			const box = await shareNotif.boundingBox()
			if (box) {
				await page.screenshot({ path: dest('sharing_internal_acceptNotification'),
					clip: { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 } })
			} else {
				await panel.screenshot({ path: dest('sharing_internal_acceptNotification') })
			}
		} else {
			await panel.screenshot({ path: dest('sharing_internal_acceptNotification') })
		}
	} else {
		await docScreenshot(page, 'user/sharing_internal_acceptNotification')
	}
})

test('Files — auto-accept shares setting', async ({ page }) => {
	await page.goto('/settings/user/sharing')
	await page.locator('.section, #app-content').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await page.waitForTimeout(500)
	const autoAccept = page.locator('input[type="checkbox"]').filter({ hasText: /auto/i })
		.or(page.locator('label').filter({ hasText: /auto.*accept/i })).first()
	if (await autoAccept.isVisible()) await autoAccept.scrollIntoViewIfNeeded()
	await page.waitForTimeout(300)
	await docScreenshot(page, 'user/sharing_autoAcceptSetting')
})

test('Files — others with access (collapsed)', async ({ page }) => {
	// File inside a shared parent folder — sidebar shows "Others with access"
	await openFiles(page, '/Documents')
	await openFileSidebar(page, 'Q3 Meeting Agenda.md')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /shar/i }).click()
	await page.waitForTimeout(500)
	// Scroll to the "Others with access" panel at the bottom
	const othersPanel = page.locator('[data-cy-sidebar]').locator('text=Others with access').first()
	if (await othersPanel.isVisible()) await othersPanel.scrollIntoViewIfNeeded()
	await page.waitForTimeout(300)
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('sharing_others-with-access__collapsed') })
})

test('Files — others with access (expanded)', async ({ page }) => {
	await openFiles(page, '/Documents')
	await openFileSidebar(page, 'Q3 Meeting Agenda.md')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /shar/i }).click()
	await page.waitForTimeout(500)
	const othersPanel = page.locator('[data-cy-sidebar]').locator('text=Others with access').first()
	if (await othersPanel.isVisible()) {
		await othersPanel.scrollIntoViewIfNeeded()
		await othersPanel.click().catch(() => {})
		await page.waitForTimeout(400)
	}
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('sharing_others-with-access__details') })
})

// ── File drop (anonymous upload) ──────────────────────────────────────────────

test('Files — file drop sharing panel', async ({ page }) => {
	await openFiles(page)
	await openFileSidebar(page, 'File Drop')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /shar/i }).click()
	await page.waitForTimeout(600)
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('anonym_click_sharing') })
})

test('Files — file drop hide listing option', async ({ page }) => {
	await openFiles(page)
	await openFileSidebar(page, 'File Drop')
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /shar/i }).click()
	await page.waitForTimeout(400)
	// Expand the public link options
	const linkToggle = page.locator('[data-cy-sidebar] button').filter({ hasText: /link|public/i }).first()
	if (await linkToggle.isVisible()) await linkToggle.click()
	await page.waitForTimeout(400)
	const hideOption = page.locator('[data-cy-sidebar]').locator('text=Hide file listing').first()
	if (await hideOption.isVisible()) await hideOption.scrollIntoViewIfNeeded()
	await page.waitForTimeout(300)
	await page.locator('[data-cy-sidebar]').screenshot({ path: dest('anonym_hide_file_listing') })
})

test('Files — anonymous upload page', async ({ page, browser }) => {
	const token = await getPublicShareToken('/File Drop')
	if (!token) {
		await docScreenshot(page, 'user/anonym_upload')
		await docScreenshot(page, 'user/anonym_uploaded_files')
		return
	}
	const anonCtx = await browser.newContext({ baseURL: `http://localhost:${SCREENSHOT_PORT}` })
	const anonPage = await anonCtx.newPage()
	await anonPage.goto(`/s/${token}`)
	await anonPage.locator('main, .public-upload-view, [class*="upload"]').first()
		.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await anonPage.waitForTimeout(600)
	await anonPage.screenshot({ path: dest('anonym_upload') })
	// Upload a small file to show the confirmation state
	const uploadInput = anonPage.locator('input[type="file"]').first()
	if (await uploadInput.isVisible({ timeout: 3000 }).catch(() => false)) {
		await uploadInput.setInputFiles({ name: 'test-upload.txt', mimeType: 'text/plain', buffer: Buffer.from('test') })
		await anonPage.waitForTimeout(1500)
	}
	await anonPage.screenshot({ path: dest('anonym_uploaded_files') })
	await anonCtx.close()
})

// ── Transfer ownership ────────────────────────────────────────────────────────

test('Files — transfer ownership accept dialog', async ({ page }) => {
	await openFiles(page)
	await page.waitForTimeout(500)
	// Check notification bell for a pending transfer
	const notifBtn = page.locator('button[aria-label*="Notifications"]').first()
	if (await notifBtn.isVisible()) {
		await notifBtn.click()
		await page.waitForTimeout(500)
		const panel = page.locator('[class*="notification"], .notifications-popover').first()
		await panel.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
		const transferNotif = panel.locator('li').filter({ hasText: /transfer/i }).first()
		if (await transferNotif.isVisible()) {
			await transferNotif.click()
			await page.waitForTimeout(800)
		}
	}
	await docScreenshot(page, 'user/transfer_ownership-accept')
})
