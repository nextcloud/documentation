// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as os from 'os'
import * as path from 'path'
import { test } from '@playwright/test'
import { docScreenshot } from '../../helpers'

const DEST = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user')
const dest = (name: string) => path.join(DEST, name + '.png')

test('Security — connected sessions list', async ({ page }) => {
	await page.goto('/settings/user/security')
	await page.locator('.section, #app-content').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(500)
	// The sessions list shows connected browsers
	const sessionsSection = page.locator('[class*="sessions"], .section').filter({ hasText: /browser|session/i }).first()
	if (await sessionsSection.isVisible()) {
		await sessionsSection.scrollIntoViewIfNeeded()
		await page.waitForTimeout(300)
		await sessionsSection.screenshot({ path: dest('settings_sessions') })
	} else {
		await docScreenshot(page, 'user/settings_sessions')
	}
})

test('Security — app passwords / device credentials list', async ({ page }) => {
	await page.goto('/settings/user/security')
	await page.locator('.section, #app-content').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(400)
	// Scroll to the app passwords / device credentials section
	const devicesSection = page.locator('[class*="app-password"], .section').filter({ hasText: /app password|device/i }).first()
	if (await devicesSection.isVisible()) {
		await devicesSection.scrollIntoViewIfNeeded()
		await page.waitForTimeout(300)
		await devicesSection.screenshot({ path: dest('settings_devices') })
	} else {
		await docScreenshot(page, 'user/settings_devices')
	}
})

test('Security — add app password', async ({ page }) => {
	await page.goto('/settings/user/security')
	await page.locator('.section, #app-content').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(400)
	// Find the "Create new app password" input / button
	const devicesSection = page.locator('[class*="app-password"], .section').filter({ hasText: /app password|device/i }).first()
	if (await devicesSection.isVisible()) await devicesSection.scrollIntoViewIfNeeded()
	const nameInput = page.locator('input[placeholder*="device name"], input[placeholder*="app name"], input[aria-label*="app password"]').first()
	if (await nameInput.isVisible()) {
		await nameInput.fill('Documentation screenshots')
		await page.waitForTimeout(200)
	}
	// Screenshot the form in filled state before generating
	const section = page.locator('[class*="app-password"], .section').filter({ hasText: /app password|device/i }).first()
	if (await section.isVisible()) {
		await section.screenshot({ path: dest('settings_devices_add') })
	} else {
		await docScreenshot(page, 'user/settings_devices_add')
	}
})

test('Security — enable TOTP 2FA', async ({ page }) => {
	await page.goto('/settings/user/security')
	await page.locator('.section, #app-content').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(400)
	// Find the "Two-Factor Auth" / TOTP section
	const totpSection = page.locator('[class*="two-factor"], .section').filter({ hasText: /TOTP|two.factor|2FA|authenticator/i }).first()
	if (await totpSection.isVisible()) {
		await totpSection.scrollIntoViewIfNeeded()
		await page.waitForTimeout(400)
		await totpSection.screenshot({ path: dest('totp_enable') })
	} else {
		// May be under a separate settings page
		await page.goto('/settings/user/security')
		await docScreenshot(page, 'user/totp_enable')
	}
})

test('Security — generate backup codes (step 1)', async ({ page }) => {
	await page.goto('/settings/user/security')
	await page.locator('.section, #app-content').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(400)
	// Find "Backup codes" section and click "Generate backup codes"
	const backupSection = page.locator('[class*="backup"], .section').filter({ hasText: /backup code/i }).first()
	if (await backupSection.isVisible()) {
		await backupSection.scrollIntoViewIfNeeded()
		await page.waitForTimeout(300)
		await backupSection.screenshot({ path: dest('2fa_backupcode_1') })
		// Click generate to show the codes
		const generateBtn = backupSection.locator('button', { hasText: /generate/i }).first()
		if (await generateBtn.isVisible()) {
			await generateBtn.click()
			await page.waitForTimeout(800)
			await backupSection.screenshot({ path: dest('2fa_backupcode_2') })
		} else {
			await backupSection.screenshot({ path: dest('2fa_backupcode_2') })
		}
	} else {
		await docScreenshot(page, 'user/2fa_backupcode_1')
		await docScreenshot(page, 'user/2fa_backupcode_2')
	}
})
