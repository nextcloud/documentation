// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test, Cookie } from '@playwright/test'
import { User } from '@nextcloud/e2e-test-server'
import { login } from '@nextcloud/e2e-test-server/playwright'
import { docScreenshot, docElementScreenshot, occ, tryOcc, uploadAvatar, ocsRequest } from '../../helpers'

const user = new User('christine', 'christine')
const AVATAR_DIR = '/home/anna/Downloads/tp/avatar'

let authCookies: Cookie[] = []

test.beforeAll(async ({ browser }) => {
	await tryOcc('user:add --password-from-env --display-name="Christine" christine', { OC_PASS: 'christine' })
	await uploadAvatar(`${AVATAR_DIR}/christine/avatar.png`, 'christine', 'christine')
	await tryOcc('user:setting christine dashboard layout files-favorites,calendar,deck,notes')
	await tryOcc('user:setting christine dashboard firstRun 0')

	// Seed Notes so the Notes dashboard widget shows content
	const notesBase = 'http://localhost:8093'
	const auth = 'Basic ' + Buffer.from('christine:christine').toString('base64')
	const existingNotes = await fetch(`${notesBase}/apps/notes/api/v1/notes`, {
		headers: { Authorization: auth, Accept: 'application/json' },
	}).then(r => r.json()).catch(() => [])
	if (!Array.isArray(existingNotes) || existingNotes.length === 0) {
		for (const [title, content] of [
			['Autumn Gala ideas', '- Jazz quartet for the reception\n- Photobooth with charity frame\n- Silent auction: local artwork\n- Ask Riverside if they can do late bar'],
			['Sponsor call — follow-up', 'Spoke to Hartley & Co. on 12 May.\nThey can commit £5k at Supporting level.\nSend contract by end of week.'],
			['Q3 action items', '1. Confirm venue by 2 June\n2. Send sponsor packs by 15 June\n3. Book catering walkthrough\n4. Brief comms team on social plan'],
		]) {
			await fetch(`${notesBase}/apps/notes/api/v1/notes`, {
				method: 'POST',
				headers: { Authorization: auth, 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, content }),
			}).catch(() => {})
		}
	}

	const ctx = await browser.newContext()
	const pg = await ctx.newPage()
	await login(pg.request, user)
	authCookies = await ctx.cookies()
	await ctx.close()
})

test.beforeEach(async ({ page }) => {
	await page.context().addCookies(authCookies)
})

test('Login page', async ({ page }) => {
	await page.context().clearCookies()
	await page.goto('/')
	await page.locator('form[name="login"]').waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/login_page')
})

test('Dashboard', async ({ page }) => {
	await page.goto('/apps/dashboard')
	await page.locator('.panel--header, .dashboard-widget-content').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.icon-loading').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
	await docScreenshot(page, 'user/webinterface_dashboard')
})

test('Navigation bar', async ({ page }) => {
	await page.goto('/apps/dashboard')
	await page.locator('header#header').waitFor({ state: 'visible' })
	await docElementScreenshot(page, 'header#header', 'user/webinterface_nav')
})

test('Unified search', async ({ page }) => {
	await page.goto('/apps/dashboard')
	await page.locator('header#header').waitFor({ state: 'visible' })
	await page.locator('#unified-search').click()
	await page.locator('[data-cy-unified-search-filters]').waitFor({ state: 'visible', timeout: 10000 })
	await docScreenshot(page, 'user/webinterface_search')
})

test('Profile menu', async ({ page }) => {
	await page.goto('/apps/dashboard')
	await page.locator('header#header').waitFor({ state: 'visible' })
	await page.locator('#settings button, #user-menu button, header .user-status__status button, .user-status-menu-item button').first().click()
	await page.locator('text=Log out').waitFor({ state: 'visible' })
	await docScreenshot(page, 'user/webinterface_profile_menu')
})

// Customise button (dashboard settings)
test('Customize button', async ({ page }) => {
	await page.goto('/apps/dashboard')
	await page.locator('.panel--header, .dashboard-widget-content').first().waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.icon-loading').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
	const customiseBtn = page.locator('button', { hasText: /custom[iz]/i }).first()
	await customiseBtn.waitFor({ state: 'attached', timeout: 25000 })
	await customiseBtn.scrollIntoViewIfNeeded()
	await customiseBtn.screenshot({ path: require('path').join(require('os').homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'webinterface_customize_button.png') })
})
