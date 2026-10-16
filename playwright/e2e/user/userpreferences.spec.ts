// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as os from 'os'
import * as path from 'path'
import { test } from '@playwright/test'
import { docScreenshot, docElementScreenshot } from '../../helpers'

const DEST = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user')
const dest = (name: string) => path.join(DEST, name + '.png')

test('Personal settings dropdown', async ({ page }) => {
	await page.goto('/apps/dashboard')
	await page.locator('header#header').waitFor({ state: 'visible' })
	await page.locator('#settings button, #user-menu button, header .user-status__status button, .user-status-menu-item button').first().click()
	await page.locator('text=Log out').waitFor({ state: 'visible' })
	await page.waitForTimeout(200)
	// Take a full-page screenshot with the dropdown open — same as webinterface_profile_menu
	await docScreenshot(page, 'user/oc_personal_settings_dropdown')
})

test('Personal settings page', async ({ page }) => {
	await page.goto('/settings/user')
	await page.locator('#app-content, .section').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/personal_settings')
})

test('User data scope dropdown', async ({ page }) => {
	await page.goto('/settings/user')
	await page.locator('.section').first().waitFor({ state: 'visible', timeout: 15000 })
	// NC Settings profile fields have a scope picker button (lock icon / dropdown).
	// Try common patterns used by NC Settings components.
	const scopeBtn = page.locator([
		'button[aria-label*="change scope"]',
		'button[aria-label*="Change scope"]',
		'.account__property__info button',
		'.account__property .scope-select button',
		'[class*="property"] [class*="scope"] button',
		'[class*="scope-menu"] button',
	].join(', ')).first()
	const found = await scopeBtn.isVisible({ timeout: 5000 }).catch(() => false)
	if (found) {
		await scopeBtn.click()
		await page.waitForTimeout(400)
		// Look for a visible dropdown (not the hidden day-of-week listbox)
		const dropdown = page.locator('[role="listbox"]:visible, [role="menu"]:visible').first()
		if (await dropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
			const btnBox = await scopeBtn.boundingBox()
			const dropBox = await dropdown.boundingBox()
			if (btnBox && dropBox) {
				await page.screenshot({
					path: dest('userdata-scope'),
					clip: {
						x: Math.min(btnBox.x, dropBox.x) - 8,
						y: btnBox.y - 8,
						width: Math.max(btnBox.x + btnBox.width, dropBox.x + dropBox.width) - Math.min(btnBox.x, dropBox.x) + 16,
						height: dropBox.y + dropBox.height - btnBox.y + 16,
					},
				})
			} else { await docScreenshot(page, 'user/userdata-scope') }
		} else { await docScreenshot(page, 'user/userdata-scope') }
	} else {
		// Fallback: screenshot the profile section as-is
		await docScreenshot(page, 'user/userdata-scope')
	}
})

test('Profile visibility toggle', async ({ page }) => {
	await page.goto('/settings/user')
	await page.locator('.section').first().waitFor({ state: 'visible', timeout: 15000 })
	// The profile visibility toggle appears in the profile section
	const toggle = page.locator('[class*="profile-visibility"], button[aria-label*="visibility"], [class*="visibilityToggle"]').first()
	await toggle.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	if (await toggle.isVisible()) {
		await toggle.scrollIntoViewIfNeeded()
		const box = await toggle.boundingBox()
		if (box) {
			await page.screenshot({
				path: require('path').join(require('os').homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'userdata-visibility-toggle.png'),
				clip: { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 },
			})
		} else {
			await docScreenshot(page, 'user/userdata-visibility-toggle')
		}
	} else {
		await docScreenshot(page, 'user/userdata-visibility-toggle')
	}
})

test('Profile visibility settings', async ({ page }) => {
	await page.goto('/settings/user')
	await page.locator('.section').first().waitFor({ state: 'visible', timeout: 15000 })
	// Click the visibility toggle to open the visibility config panel
	const toggle = page.locator('[class*="profile-visibility"], button[aria-label*="visibility"], [class*="visibilityToggle"]').first()
	if (await toggle.isVisible()) {
		await toggle.click()
		await page.waitForTimeout(400)
	}
	await docScreenshot(page, 'user/userdata-visibility')
})
