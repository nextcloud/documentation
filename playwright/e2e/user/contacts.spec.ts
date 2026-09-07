// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as os from 'os'
import * as path from 'path'
import { test, Page } from '@playwright/test'
import { docScreenshot } from '../../helpers'

const DEST = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user')
const dest = (name: string) => path.join(DEST, name + '.png')

async function openContacts(page: Page): Promise<void> {
	await page.goto('/apps/contacts')
	await page.locator('.contacts-list, [class*="contact"], .app-content').first().waitFor({ state: 'visible', timeout: 20000 })
	await page.waitForTimeout(600)
}

test('Contacts — main view (contacts list)', async ({ page }) => {
	await openContacts(page)
	await docScreenshot(page, 'user/contacts_empty')
})

test('Contacts — bottom bar with New Contact button', async ({ page }) => {
	await openContacts(page)
	// The bottom bar / action bar with New Contact button
	const bottomBar = page.locator('.contacts-navigation-new-button, nav .actions, [class*="contact-header"]').first()
	await bottomBar.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	// Fallback: crop to the footer/bottom area of the sidebar
	const sidebar = page.locator('#app-navigation, nav').first()
	const sidebarBox = await sidebar.boundingBox()
	if (sidebarBox) {
		await page.screenshot({
			path: dest('contact_bottombar'),
			clip: {
				x: sidebarBox.x,
				y: sidebarBox.y + sidebarBox.height - 80,
				width: sidebarBox.width,
				height: 80,
			},
		})
	} else {
		await docScreenshot(page, 'user/contact_bottombar')
	}
})

test('Contacts — import/upload button', async ({ page }) => {
	await openContacts(page)
	// The import button is usually in the sidebar header or a "..." action menu
	const importBtn = page.locator('button[aria-label*="import"], button[aria-label*="Import"], a[aria-label*="import"]').first()
	if (!(await importBtn.isVisible())) {
		// Try opening an action menu
		const actionsBtn = page.locator('button[aria-label*="Actions"], button[aria-label*="more"]').first()
		if (await actionsBtn.isVisible()) await actionsBtn.click()
	}
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/contact_uploadbutton')
})

test('Contacts — new contact form', async ({ page }) => {
	await openContacts(page)
	const newContactBtn = page.locator('button', { hasText: /new contact/i }).first()
	await newContactBtn.waitFor({ state: 'visible', timeout: 10000 })
	await newContactBtn.click()
	await page.locator('[class*="contact-detail"], .contact-details, .app-content-details').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	await page.waitForTimeout(500)
	await docScreenshot(page, 'user/contact_new')
})

/** Search for a contact by name so search results render visibly (bypasses virtual scroll). */
async function searchContact(page: Page, name: string): Promise<void> {
	const searchInput = page.locator('input[type="search"], input[placeholder*="earch" i]').first()
	if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
		await searchInput.fill(name)
		await page.waitForTimeout(600)
	}
}

test('Contacts — contact view mode', async ({ page }) => {
	await openContacts(page)
	await searchContact(page, 'James')
	// After search, results are rendered visibly
	const result = page.locator('.list-item__wrapper:visible, .contact-entry:visible').first()
	if (await result.isVisible({ timeout: 5000 }).catch(() => false)) {
		await result.click()
		await page.waitForTimeout(500)
	}
	await docScreenshot(page, 'user/contact_view_mode')
})

test('Contacts — contact picture in view', async ({ page }) => {
	await openContacts(page)
	await searchContact(page, 'Sofia')
	const result = page.locator('.list-item__wrapper:visible, .contact-entry:visible').first()
	if (await result.isVisible({ timeout: 5000 }).catch(() => false)) {
		await result.click()
		await page.waitForTimeout(500)
	}
	// Crop to the contact header / avatar area
	const avatar = page.locator('[class*="contact-avatar"], .avatar, .contact-header').first()
	if (await avatar.isVisible({ timeout: 5000 }).catch(() => false)) {
		const box = await avatar.boundingBox()
		if (box) {
			await page.screenshot({
				path: dest('contact_picture'),
				clip: { x: box.x - 16, y: box.y - 16, width: box.width + 32, height: box.height + 32 },
			})
		} else { await docScreenshot(page, 'user/contact_picture') }
	} else { await docScreenshot(page, 'user/contact_picture') }
})

test('Contacts — contact picture options', async ({ page }) => {
	await openContacts(page)
	await searchContact(page, 'Ben')
	const result = page.locator('.list-item__wrapper:visible, .contact-entry:visible').first()
	if (await result.isVisible({ timeout: 5000 }).catch(() => false)) {
		await result.click()
		await page.waitForTimeout(500)
	}
	// Click on the avatar to open picture options
	const avatar = page.locator('[class*="contact-avatar"], .avatar, .avatar-button').first()
	if (await avatar.isVisible({ timeout: 3000 }).catch(() => false)) await avatar.click()
	const pictureMenu = page.locator('[role="menu"], .action-menu, .popover').filter({ hasText: /upload|photo|camera/i }).first()
	await pictureMenu.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
	if (await pictureMenu.isVisible()) {
		await pictureMenu.screenshot({ path: dest('contact_picture_options') })
		await page.keyboard.press('Escape')
		await page.waitForTimeout(300)
		await docScreenshot(page, 'user/contact_picture_set')
	} else {
		await docScreenshot(page, 'user/contact_picture_options')
		await docScreenshot(page, 'user/contact_picture_set')
	}
})

test('Contacts — multi-select contacts', async ({ page }) => {
	await openContacts(page)
	// NC Contacts 8.x: select all via the "Select all" header checkbox if available,
	// then deselect down to 3 — or use the top header checkbox approach
	const selectAllCb = page.locator('input[type="checkbox"][aria-label*="all" i], .contact-list__select-all input').first()
	if (await selectAllCb.isVisible({ timeout: 3000 }).catch(() => false)) {
		await selectAllCb.click()
		await page.waitForTimeout(400)
		await docScreenshot(page, 'user/contact_multiselect')
		return
	}
	// Fallback: search for contacts to get visible items, then click their checkboxes
	await searchContact(page, 'a') // broad search to get multiple results
	const items = page.locator('.list-item__wrapper:visible')
	const count = await items.count()
	for (let i = 0; i < Math.min(3, count); i++) {
		const item = items.nth(i)
		await item.hover()
		const checkbox = item.locator('input[type="checkbox"]').first()
		if (await checkbox.isVisible({ timeout: 1000 }).catch(() => false)) {
			await checkbox.click()
		}
		await page.waitForTimeout(150)
	}
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/contact_multiselect')
})

test('Contacts — manage address books dialog', async ({ page }) => {
	await openContacts(page)
	// Open the address books management dialog
	// Usually available via a gear/settings button in the sidebar
	const settingsBtn = page.locator('button[aria-label*="Settings"], button[aria-label*="manage"], button[title*="address book"]').first()
	if (await settingsBtn.isVisible()) {
		await settingsBtn.click()
	} else {
		// Try the app navigation action button
		const actionsBtn = page.locator('#app-navigation button[aria-label*="more"], #app-navigation button[aria-label*="action"]').first()
		if (await actionsBtn.isVisible()) await actionsBtn.click()
	}
	await page.waitForTimeout(400)
	const dialog = page.locator('[role="dialog"], .modal, [class*="addressbook"]').filter({ hasText: /address book/i }).first()
	await dialog.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	if (await dialog.isVisible()) {
		await dialog.screenshot({ path: dest('contact_manageaddressbook') })
	} else {
		await docScreenshot(page, 'user/contact_manageaddressbook')
	}
})

test('Contacts — circles/teams view', async ({ page }) => {
	await openContacts(page)
	// Navigate to the Circles/Teams section in the left sidebar
	const circlesLink = page.locator('a, button', { hasText: /circle|team/i }).first()
	if (await circlesLink.isVisible()) await circlesLink.click()
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/circle')
})

test('Contacts — shared items view', async ({ page }) => {
	await openContacts(page)
	// Navigate to "Shared with me" or "Shared items" in the sidebar
	const sharedLink = page.locator('a, button', { hasText: /shared/i }).first()
	if (await sharedLink.isVisible()) await sharedLink.click()
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/shared-items')
})
