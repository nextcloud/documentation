// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test, Cookie } from '@playwright/test'
import { User } from '@nextcloud/e2e-test-server'
import { login } from '@nextcloud/e2e-test-server/playwright'
import { docScreenshot, docElementScreenshot, occ, tryOcc, uploadAvatar } from '../../helpers'

const user = new User('christine', 'christine')
const AVATAR_DIR = '/home/anna/Downloads/tp/avatar'

let authCookies: Cookie[] = []

test.beforeAll(async ({ browser }) => {
	await tryOcc('user:add --password-from-env --display-name="Christine" christine', { OC_PASS: 'christine' })
	await uploadAvatar(`${AVATAR_DIR}/christine/avatar.png`, 'christine', 'christine')
	await tryOcc('user:setting christine dashboard layout files-favorites,calendar,deck,notes')
	await tryOcc('user:setting christine dashboard firstRun 0')

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
