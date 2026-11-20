// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test } from '@playwright/test'
import { docScreenshot, docElementScreenshot } from '../../helpers'

test('Activity stream — all activities', async ({ page }) => {
	await page.goto('/apps/activity')
	await page.locator('.activity-entry, [data-id], .virtualScrolling').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/activity-stream-all')
})

test('Activity stream — by you', async ({ page }) => {
	await page.goto('/apps/activity')
	await page.locator('.activity-entry, [data-id]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await page.locator('[aria-label="Activity navigation"] a, .app-navigation a').filter({ hasText: /by you/i }).click()
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/activity-stream-self')
})

test('Activity stream — file changes', async ({ page }) => {
	await page.goto('/apps/activity')
	await page.locator('.activity-entry, [data-id]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await page.locator('[aria-label="Activity navigation"] a, .app-navigation a').filter({ hasText: /file change/i }).click()
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/activity-stream-file-changes')
})

test('Activity sidebar in Files', async ({ page }) => {
	await page.goto('/apps/files')
	await page.locator('[data-cy-files-list]').waitFor({ state: 'visible', timeout: 15000 })
	// Open sidebar via Actions > Details on a specific file
	await page.locator('[data-cy-files-list-row][data-cy-files-list-row-name="Q2 Project Proposal.pdf"]')
		.locator('button[aria-label="Actions"]').click({ force: true })
	await page.locator('[data-cy-files-list-row-action="details"]').first().click()
	await page.locator('[data-cy-sidebar]').waitFor({ state: 'visible', timeout: 10000 })
	// Click the Activity tab in the sidebar
	await page.locator('[data-cy-sidebar] [role="tab"]').filter({ hasText: /activity/i }).click()
	await page.waitForTimeout(800)
	await docElementScreenshot(page, '[data-cy-sidebar]', 'user/activity-sidebar')
})

test('Activity notification settings', async ({ page }) => {
	await page.goto('/settings/user/notifications')
	await page.locator('#app-content, .section').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/activity-settings-personal')
})
