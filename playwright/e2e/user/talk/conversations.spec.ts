// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test } from '@playwright/test'
import { User } from '@nextcloud/e2e-test-server'
import {
	docScreenshot,
	docElementScreenshot,
	ocsRequest,
	seedChatMessages,
} from '../../../helpers'
import { Page } from '@playwright/test'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs/promises'

test.describe.configure({ mode: 'serial' })

const christine = new User('christine', 'christine')


// Token for the "Event planning" group conversation — populated in beforeAll
let groupToken = ''

// ── Talk OCS helpers ──────────────────────────────────────────────────────────

async function talkApi(method: string, talkPath: string, user: User, body?: Record<string, string>) {
	return ocsRequest(method, `/ocs/v2.php/apps/spreed/api${talkPath}`, user.userId, user.password, body)
}

async function createGroup(name: string, as: User): Promise<string> {
	const res = await talkApi('POST', '/v4/room', as, { roomType: '2', roomName: name })
	const data = await res.json()
	return data.ocs.data.token as string
}

async function addParticipant(token: string, uid: string, as: User): Promise<void> {
	await talkApi('POST', `/v4/room/${token}/participants`, as, { newParticipant: uid, source: 'users' })
}


async function findOrCreateGroup(): Promise<string> {
	const res = await talkApi('GET', '/v4/room', christine)
	const data = await res.json()
	const rooms: Array<{ token: string; displayName: string; isArchived?: boolean }> = data?.ocs?.data ?? []
	const existing = rooms.find((r) => r.displayName === 'Event planning')

	if (existing?.isArchived) {
		await talkApi('DELETE', `/v4/room/${existing.token}/archive`, christine)
		groupToken = existing.token
		return groupToken
	}

	if (existing) {
		groupToken = existing.token
		return groupToken
	}

	const token = await createGroup('Event planning', christine)
	groupToken = token
	await addParticipant(token, 'amara_w', christine)
	await seedChatMessages(token, [
		{ text: "Hi team! I've set up this conversation for coordinating the Q3 fundraising event.", user: 'christine', password: 'christine' },
		{ text: 'Great, thanks for setting this up! I have a few updates to share.', user: 'amara_w', password: 'amara_w' },
		{ text: "Looking forward to hearing them. Let's get started!", user: 'christine', password: 'christine' },
	])
	return groupToken
}

async function getOrCreateGroupToken(): Promise<string> {
	if (groupToken) {
		const res = await talkApi('GET', `/v4/room/${groupToken}`, christine)
		const data = await res.json()
		const room = data?.ocs?.data
		if (res.status === 200 && !room?.isArchived) return groupToken
		if (res.status === 200 && room?.isArchived) {
			await talkApi('DELETE', `/v4/room/${groupToken}/archive`, christine)
			return groupToken
		}
		groupToken = ''
	}
	return findOrCreateGroup()
}

// ── Talk UI helpers ────────────────────────────────────────────────────────────

async function openConversation(page: Page, displayName: string): Promise<void> {
	await page.locator('.conversation .text', { hasText: displayName }).waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.conversation .text', { hasText: displayName }).click()
	await page.locator('.chatView').waitFor({ state: 'visible', timeout: 10000 })
}

async function openGroupConversation(page: Page, token: string): Promise<void> {
	await page.goto(`/call/${token}`)
	await page.locator('.chatView').waitFor({ state: 'visible', timeout: 15000 })
}

async function openSidebar(page: Page): Promise<void> {
	const toggleBtn = page.locator('.app-sidebar__toggle')
	if (await toggleBtn.isVisible()) {
		await toggleBtn.click()
	}
	await page.locator('.app-sidebar').waitFor({ state: 'visible', timeout: 5000 })
}

async function openConversationActions(page: Page): Promise<void> {
	await page.locator('button[aria-label="Conversation actions"]').first().waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('button[aria-label="Conversation actions"]').first().click()
	await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 })
}

async function clearTalkFilter(page: Page): Promise<void> {
	// localStorage is inaccessible on about:blank; silently skip — no filter to clear
	await page.evaluate(() => { try { localStorage.removeItem('nextcloud_per_dGFsaw==_filterEnabled') } catch {} })
}

// ── Provisioning ──────────────────────────────────────────────────────────────

test.beforeAll(async () => {
	// All seeding is done in global-setup. Fetch the group token so per-test
	// helpers that need it (e.g. openGroupConversation) have it available.
	await findOrCreateGroup()
})

// ── Screenshots ───────────────────────────────────────────────────────────────

test('Schedule a meeting', async ({ page }) => {
	// Open the Event planning conversation first to establish the chat context.
	const token = await getOrCreateGroupToken()
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await openConversation(page, 'Event planning')

	// Navigate to the Calendar app to create the meeting event.
	await page.goto('/apps/calendar')
	await page.locator('.fc.fc-media-screen').waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForTimeout(500)

	// Click the "New event" button to open the event editor.
	const newEventBtn = page.locator('button[aria-label="Create new event"], button[aria-label="New event"], button:has-text("Create new event"), button:has-text("New event")').first()
	await newEventBtn.waitFor({ state: 'visible', timeout: 8000 })
	await newEventBtn.click()

	// Wait for the event creation dialog to open — Calendar uses a custom popover
	// whose backdrop is a <dialog> element while the form lives in a sibling element.
	// Anchor on the title input which is reliably present when the form is ready.
	const titleInput = page.getByPlaceholder('Title')
	await titleInput.waitFor({ state: 'visible', timeout: 8000 })
	await page.waitForTimeout(300)

	// Fill in the event title.
	await titleInput.click()
	await titleInput.fill('Event planning catchup')

	// Add a Talk call via the calendar integration.
	// Clicking "Add Talk conversation" opens a "Select a Talk Room" room picker.
	const talkBtn = page.getByRole('button', { name: 'Add Talk conversation' })
	if (await talkBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
		await talkBtn.click()
		const roomPicker = page.getByRole('dialog', { name: 'Select a Talk Room' })
		await roomPicker.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
		// Screenshot shows the room picker with Talk conversations listed.
		await docScreenshot(page, 'user/talk/talk-schedule-meeting')
		// Dismiss the picker. Escape propagates to the parent event editor and
		// triggers a "Discard changes?" dialog — click Cancel to keep the form.
		await page.keyboard.press('Escape')
		const discardDialog = page.getByRole('dialog', { name: 'Discard changes?' })
		if (await discardDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
			await discardDialog.getByRole('button', { name: 'Cancel' }).click()
			await discardDialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {})
		}
		await roomPicker.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {})
		await page.waitForTimeout(300)
	} else {
		await docScreenshot(page, 'user/talk/talk-schedule-meeting')
	}

	// Save the event.
	const saveBtn = page.getByRole('button', { name: 'Save' })
	if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
		await saveBtn.click()
		await page.waitForTimeout(1000)
	}
})

test('Talk dashboard', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await Promise.race([
		page.locator('.dashboard__title, h2:has-text("Hello"), .talk-dashboard').waitFor({ state: 'visible', timeout: 10000 }),
		page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 10000 }),
	]).catch(() => {})
	await page.locator('.icon-loading').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {})
	await page.waitForTimeout(1500)
	await docScreenshot(page, 'user/talk/talk-dashboard')
})

test('Note to self', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('.conversation .text', { hasText: 'Note to self' }).waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.conversation .text', { hasText: 'Note to self' }).click()
	await page.locator('.chatView').waitFor({ state: 'visible', timeout: 10000 })

	const hasTaskList = await page.locator('.chatView').getByText(/Define Project Scope/i).isVisible().catch(() => false)
	if (!hasTaskList) {
		// Fallback: seed via UI if API seeding didn't land. Locator discovered via page snapshot.
		const inputArea = page.getByRole('region', { name: 'Post message' }).getByRole('textbox')
		await inputArea.waitFor({ state: 'visible', timeout: 5000 })
		await inputArea.click()
		const lines = [
			'- [x] Define Project Scope and Objectives',
			'- [x] Develop a Project Plan',
			'- [ ] Coordinate Team Activities',
			'- [ ] Review and finalize budget',
			'- [ ] Schedule kickoff meeting',
		]
		for (let i = 0; i < lines.length; i++) {
			await page.keyboard.type(lines[i])
			if (i < lines.length - 1) await page.keyboard.press('Shift+Enter')
		}
		await page.keyboard.press('Enter')
		await page.locator('.chatView').getByText(/Define Project Scope/i).waitFor({ state: 'visible', timeout: 10000 })
	}
	await page.waitForTimeout(500)
	// Close sidebar if open
	const sidebar = page.locator('.app-sidebar')
	if (await sidebar.isVisible()) {
		await sidebar.locator('button[aria-label="Close sidebar"], button[aria-label="Close"]').filter({ hasNotText: '' }).first().click()
		await sidebar.waitFor({ state: 'hidden' })
	}
	await docScreenshot(page, 'user/talk/note-to-self')
})

test('1:1 conversation with right sidebar', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await openConversation(page, 'Amara Winterbourne')
	await openSidebar(page)
	await page.locator('.app-sidebar', { hasText: 'Event Coordinator' }).waitFor({ state: 'visible', timeout: 8000 })
	const sidebarEl = page.locator('.app-sidebar')
	const sidebarBox = await sidebarEl.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'one-to-one-right-sidebar.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (sidebarBox) {
		await page.screenshot({ path: dest, clip: { x: sidebarBox.x, y: sidebarBox.y, width: sidebarBox.width, height: Math.min(380, sidebarBox.height) } })
	} else {
		await sidebarEl.screenshot({ path: dest })
	}
})

test('1:1 extend to group', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await openConversation(page, 'Amara Winterbourne')
	await page.locator('button[aria-label="Start a group conversation"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('button[aria-label="Start a group conversation"]').click()
	await page.locator('.start-group__content, [role="dialog"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.start-group__content input, [role="dialog"] input[type="text"]').first().fill('Lila')
	await page.locator('[data-nav-id="users_lila_h"]').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
	await docScreenshot(page, 'user/talk/one-to-one-extend')
})

test('Create new conversation button', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.new-conversation .actions .action-item__menutoggle').first().click()
	await page.locator('[role="menuitem"]', { hasText: 'Create a new conversation' }).waitFor({ state: 'visible', timeout: 5000 })
	await docScreenshot(page, 'user/talk/create-new-conversation', { clip: { x: 0, y: 0, width: 500, height: 350 } })
})

test('Creating open conversation (step 1: name + settings)', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('.new-conversation .actions .action-item__menutoggle').first().click()
	await page.locator('[role="menuitem"]', { hasText: 'Create a new conversation' }).click()
	await page.locator('.new-group-conversation').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.new-group-conversation input[type="text"]').first().fill('Product team')

	// Set emoji on the conversation avatar if the picker is available in this Talk version.
	// All clicks use short explicit timeouts — without them, Playwright inherits the full
	// test timeout (60 s) and blocks the whole test when an element isn't present.
	const emojiBtn = page.locator('.new-group-conversation button[aria-label*="moji"], .new-group-conversation .emoji-picker-trigger').first()
	if (await emojiBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
		await emojiBtn.click({ timeout: 3000 }).catch(() => {})
		const emojiInput = page.locator('.emoji-mart-search input, input[placeholder*="Search emoji"]').first()
		if (await emojiInput.isVisible({ timeout: 2000 }).catch(() => false)) {
			// Use pressSequentially so Vue reactivity fires on each keystroke.
			// fill() sets the value in one shot and can bypass reactive watchers.
			await emojiInput.click({ timeout: 2000 }).catch(() => {})
			await emojiInput.pressSequentially('laptop', { delay: 80 })
			// "Frequently used" disappearing means search results have replaced it
			await page.locator('.emoji-mart-category-label').filter({ hasText: /frequently used/i })
				.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {})
			await page.locator('.emoji-mart-emoji').first().click({ timeout: 3000 }).catch(() => {})
		}
	}

	// Fill in description if the field is present
	const descriptionField = page.locator('.new-group-conversation textarea, .new-group-conversation input[placeholder*="escription"]').first()
	if (await descriptionField.isVisible({ timeout: 2000 }).catch(() => false)) {
		await descriptionField.fill('Discuss product priorities, roadmap, and cross-team updates.')
	}

	await docScreenshot(page, 'user/talk/creating-open-conversation')
})

test('Add participants (step 2)', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('.new-conversation .actions .action-item__menutoggle').first().click()
	await page.locator('[role="menuitem"]', { hasText: 'Create a new conversation' }).click()
	await page.locator('.new-group-conversation').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.new-group-conversation input[type="text"]').first().fill('Product team')
	await page.locator('button', { hasText: /add participants/i }).click()
	await page.locator('.new-group-conversation').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.new-group-conversation input[type="text"]').last().fill('l')
	await page.locator('[data-nav-id="users_lila_h"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[data-nav-id="users_lila_h"]').click()
	await docScreenshot(page, 'user/talk/add-participants')
})

test('New room (freshly created conversation)', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('.new-conversation .actions .action-item__menutoggle').first().click()
	await page.locator('[role="menuitem"]', { hasText: 'Create a new conversation' }).click()
	await page.locator('.new-group-conversation').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.new-group-conversation input[type="text"]').first().fill('Product team')
	await page.locator('button', { hasText: /add participants/i }).click()
	const participantsInput = page.locator('.new-group-conversation input[type="text"]').last()
	await participantsInput.waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[data-nav-id="users_amara_w"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[data-nav-id="users_amara_w"]').click()
	await participantsInput.fill('lila')
	await page.locator('[data-nav-id="users_lila_h"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[data-nav-id="users_lila_h"]').click()
	await participantsInput.fill('malik')
	await page.locator('[data-nav-id="users_malik_s"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[data-nav-id="users_malik_s"]').click()
	await page.locator('button', { hasText: /create conversation/i }).click()
	await page.locator('.chatView').waitFor({ state: 'visible', timeout: 15000 })
	// Extract token from URL and seed messages
	const newRoomUrl = page.url()
	const newRoomToken = newRoomUrl.match(/\/call\/([a-z0-9]+)/i)?.[1]
	if (newRoomToken) {
		// Set the laptop emoji to match what the creating-open-conversation screenshot shows
		await talkApi('POST', `/v1/room/${newRoomToken}/avatar/emoji`, christine, { emoji: '💻', color: '0082c9' }).catch(() => {})
		await seedChatMessages(newRoomToken, [
			{ text: "Hey team! Welcome to the Product Team chat 👋", user: 'christine', password: 'christine' },
			{ text: "Thanks for setting this up!", user: 'amara_w', password: 'amara_w' },
			{ text: "Excited to collaborate here — what's our first agenda item?", user: 'lila_h', password: 'lila_h' },
			{ text: "Let's start with the Q3 roadmap review. I'll share the doc shortly.", user: 'christine', password: 'christine' },
			{ text: "I have a few feature requests from the last sprint to add to that.", user: 'malik_s', password: 'malik_s' },
			{ text: "Great, let's go through them all in tomorrow's sync.", user: 'amara_w', password: 'amara_w' },
		])
		await page.reload()
		await page.locator('.chatView').waitFor({ state: 'visible', timeout: 15000 })
		await page.locator('.chatView').getByText(/Hey team! Welcome to the Product Team chat/i).waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	}
	// Avoid waiting generically for .icon-loading — shared-items-tab spinner may persist
	await page.locator('.icon-loading:not(.shared-items-tab__loading)').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {})
	await docScreenshot(page, 'user/talk/new-room')
})

test('Filters menu', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.new-conversation .filters .action-item__menutoggle').first().click()
	await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 })
	await docScreenshot(page, 'user/talk/filters-menu', { clip: { x: 0, y: 0, width: 500, height: 350 } })
})

test('Clear filter', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.new-conversation .filters .action-item__menutoggle').first().click()
	await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[role="menuitemcheckbox"]', { hasText: /unread messages/i }).click()
	await page.locator('.new-conversation .filters .action-item__menutoggle').first().click()
	await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[role="menuitem"]', { hasText: /clear filters/i }).waitFor({ state: 'visible', timeout: 5000 })
	await docScreenshot(page, 'user/talk/clear-filter', { clip: { x: 0, y: 0, width: 500, height: 350 } })
	await page.locator('[role="menuitem"]', { hasText: /clear filters/i }).click()
})

test('Group public settings', async ({ page }) => {
	const token = await getOrCreateGroupToken()
	await openGroupConversation(page, token)
	await openConversationActions(page)
	await page.locator('[role="menuitem"]', { hasText: /conversation settings/i }).click()
	const container = page.locator('#conversation-settings-container')
	await container.waitFor({ state: 'visible', timeout: 10000 })
	// Open/guest-access toggles live in the Moderation section
	await container.locator('.navigation-list__link', { hasText: /moderation/i }).click()
	// #settings-section_conversation-settings is the Moderation panel element
	const moderationSection = page.locator('#settings-section_conversation-settings')
	await moderationSection.waitFor({ state: 'visible', timeout: 10000 })
	await moderationSection.scrollIntoViewIfNeeded()
	await page.waitForTimeout(500)
	// Clip to just the top of the section (open/guest-access toggles) with 20px padding
	const box = await moderationSection.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'group-public-settings.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (box) {
		await page.screenshot({ path: dest, clip: { x: box.x - 20, y: box.y - 20, width: box.width + 40, height: Math.min(box.height, 280) + 40 } })
	} else {
		await moderationSection.screenshot({ path: dest })
	}
	await container.locator('button[aria-label="Close"]').click()
})

test('Participant menu (... on participant)', async ({ page }) => {
	const token = await getOrCreateGroupToken()
	await openGroupConversation(page, token)
	await openSidebar(page)
	await page.locator('#tab-button-participants').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('#tab-button-participants').click()
	await page.locator('#tab-participants').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.participant', { hasText: 'Amara Winterbourne' }).waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('.participant', { hasText: 'Amara Winterbourne' }).locator('button[aria-label*="Settings for participant"]').first().click()
	await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 })
	const menuEl = page.locator('[role="menu"]').first()
	const menuBox = await menuEl.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'participant-menu.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (menuBox) {
		await page.screenshot({ path: dest, clip: { x: menuBox.x - 16, y: menuBox.y - 16, width: menuBox.width + 32, height: menuBox.height + 32 } })
	} else {
		await menuEl.screenshot({ path: dest })
	}
})

test('Open conversation settings menu', async ({ page }) => {
	const token = await getOrCreateGroupToken()
	await openGroupConversation(page, token)
	await openConversationActions(page)
	const menuEl = page.locator('[role="menu"]').first()
	const menuBox = await menuEl.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'open-settings.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (menuBox) {
		await page.screenshot({ path: dest, clip: { x: menuBox.x - 16, y: menuBox.y - 16, width: menuBox.width + 32, height: menuBox.height + 32 } })
	} else {
		await menuEl.screenshot({ path: dest })
	}
})

test('Conversation settings dialog', async ({ page }) => {
	const token = await getOrCreateGroupToken()
	await openGroupConversation(page, token)
	await openConversationActions(page)
	await page.locator('[role="menuitem"]', { hasText: /conversation settings/i }).click()
	await page.locator('#conversation-settings-container').waitFor({ state: 'visible', timeout: 10000 })
	await docElementScreenshot(page, '#conversation-settings-container', 'user/talk/conversation-settings-dialog')
})

test('Message expiration setting', async ({ page }) => {
	const token = await getOrCreateGroupToken()
	await openGroupConversation(page, token)
	await openConversationActions(page)
	await page.locator('[role="menuitem"]', { hasText: /conversation settings/i }).click()
	await page.locator('#conversation-settings-container').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('.navigation-list__link', { hasText: /moderation/i }).click()
	const moderationSection = page.locator('#settings-section_conversation-settings')
	await moderationSection.waitFor({ state: 'visible', timeout: 10000 })
	// Message expiration only appears when backgroundjobs_mode=cron (configured in global-setup)
	const expirationLabel = moderationSection.getByText(/message expiration/i).first()
	await expirationLabel.waitFor({ state: 'visible', timeout: 10000 })
	await expirationLabel.scrollIntoViewIfNeeded()
	await page.waitForTimeout(500)
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'messages-expiration.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	const sectionBox = await moderationSection.boundingBox()
	const labelBox = await expirationLabel.boundingBox()
	if (sectionBox && labelBox) {
		await page.screenshot({ path: dest, clip: {
			x: sectionBox.x - 20, y: labelBox.y - 32,
			width: sectionBox.width + 40, height: Math.min(160, sectionBox.y + sectionBox.height - labelBox.y) + 40,
		} })
	} else {
		await moderationSection.screenshot({ path: dest })
	}
})

test('Ban participant', async ({ page }) => {
	const token = await getOrCreateGroupToken()
	await openGroupConversation(page, token)
	await openSidebar(page)
	await page.locator('#tab-button-participants').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('#tab-button-participants').click()
	await page.locator('.participant', { hasText: 'Amara Winterbourne' }).waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('.participant', { hasText: 'Amara Winterbourne' }).locator('button[aria-label*="Settings for participant"]').first().click()
	await page.locator('[role="menuitem"]', { hasText: /remove participant/i }).waitFor({ state: 'visible', timeout: 5000 })
	const menuEl = page.locator('[role="menu"]').first()
	const menuBox = await menuEl.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'ban-participant.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (menuBox) {
		await page.screenshot({ path: dest, clip: { x: menuBox.x - 16, y: menuBox.y - 16, width: menuBox.width + 32, height: menuBox.height + 32 } })
	} else {
		await menuEl.screenshot({ path: dest })
	}
})

test('Ban participant dialog', async ({ page }) => {
	const token = await getOrCreateGroupToken()

	// Ensure Amara is not already banned
	const banRes = await talkApi('GET', `/v1/ban/${token}`, christine)
	const banData = await banRes.json()
	const bans: Array<{ id: number; actorId: string }> = banData?.ocs?.data ?? []
	const amaraBan = bans.find((b) => b.actorId === 'amara_w')
	if (amaraBan) {
		await talkApi('DELETE', `/v1/ban/${token}/${amaraBan.id}`, christine)
		await addParticipant(token, 'amara_w', christine)
	}

	await openGroupConversation(page, token)
	await openSidebar(page)
	await page.locator('#tab-button-participants').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('#tab-button-participants').click()
	await page.locator('.participant', { hasText: 'Amara Winterbourne' }).waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('.participant', { hasText: 'Amara Winterbourne' }).locator('button[aria-label*="Settings for participant"]').first().click()
	await page.locator('[role="menuitem"]', { hasText: /remove participant/i }).waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[role="menuitem"]', { hasText: /remove participant/i }).click()
	await page.locator('.dialog').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.checkbox-radio-switch input[type="checkbox"]').check({ force: true })
	await docScreenshot(page, 'user/talk/ban-participant-dialog')
	// Confirm the ban so the ban list has content for the next test
	await page.locator('.dialog button', { hasText: /remove/i }).click()
	await page.locator('.dialog').waitFor({ state: 'detached', timeout: 5000 })
})

test('Ban participant list', async ({ page }) => {
	const token = await getOrCreateGroupToken()

	// Pre-ban lila_h and malik_s to populate the ban list
	await talkApi('POST', `/v1/ban/${token}`, christine, { actorType: 'users', actorId: 'lila_h', internalNote: 'Documentation screenshot' }).catch(() => {})
	await talkApi('POST', `/v1/ban/${token}`, christine, { actorType: 'users', actorId: 'malik_s', internalNote: 'Documentation screenshot' }).catch(() => {})

	await openGroupConversation(page, token)
	await openConversationActions(page)
	await page.locator('[role="menuitem"]', { hasText: /conversation settings/i }).click()
	await page.locator('#conversation-settings-container').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('.navigation-list__link', { hasText: /moderation/i }).click()
	await page.locator('#settings-section_conversation-settings').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('#settings-section_conversation-settings').scrollIntoViewIfNeeded()
	await page.locator('button:has-text("Manage bans")').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('button:has-text("Manage bans")').click()
	// "Manage bans" navigates within the settings container to the banned-users view.
	// Wait for the Moderation section to animate out before screenshotting.
	const banDialog = page.getByRole('dialog', { name: /banned users/i })
	await banDialog.waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('#settings-section_conversation-settings').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
	await page.waitForTimeout(400)
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'ban-participant-list.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	await banDialog.screenshot({ path: dest })
	// Close the ban dialog, then the settings
	await banDialog.getByRole('button', { name: 'Close' }).click()
	await banDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
	await page.locator('#conversation-settings-container').locator('button[aria-label="Close"]').first().click()

	// Clean up: fetch all bans, delete all, re-add amara_w + lila_h + malik_s
	const banRes2 = await talkApi('GET', `/v1/ban/${token}`, christine)
	const banData2 = await banRes2.json()
	const bans2: Array<{ id: number; actorId: string }> = banData2?.ocs?.data ?? []
	for (const ban of bans2) {
		await talkApi('DELETE', `/v1/ban/${token}/${ban.id}`, christine).catch(() => {})
	}
	await addParticipant(token, 'amara_w', christine).catch(() => {})
	await addParticipant(token, 'lila_h', christine).catch(() => {})
	await addParticipant(token, 'malik_s', christine).catch(() => {})
})

test('Conversation notifications setting', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForFunction(() => document.querySelectorAll('.conversation').length >= 1, undefined, { timeout: 15000 })
	const conv = page.locator('.conversation[title="Amara Winterbourne"]')
	await conv.waitFor({ state: 'visible', timeout: 15000 })
	await conv.hover()
	await conv.locator('button[aria-label="Conversation actions"]').first().click({ force: true })
	await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[role="menuitem"]', { hasText: /notification/i }).click()
	await page.locator('[role="menu"]').waitFor({ state: 'visible', timeout: 5000 })
	const subMenuEl = page.locator('[role="menu"]').last()
	const subMenuBox = await subMenuEl.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'conversation-notifications.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (subMenuBox) {
		await page.screenshot({ path: dest, clip: { x: subMenuBox.x - 16, y: subMenuBox.y - 16, width: subMenuBox.width + 32, height: subMenuBox.height + 32 } })
	} else {
		await subMenuEl.screenshot({ path: dest })
	}
})

test('Privacy settings (Talk personal settings)', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('button', { hasText: 'App settings' }).waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('button', { hasText: 'App settings' }).click()
	await page.locator('.modal-container').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('.navigation-list__link', { hasText: /^Privacy$/ }).click()
	await page.locator('#settings-section_privacy').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('#settings-section_privacy').scrollIntoViewIfNeeded()
	await docScreenshot(page, 'user/talk/privacy-settings')
	await page.locator('.modal-container button[aria-label="Close"]').first().click()
})

test('Archived conversations button', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	const token = await getOrCreateGroupToken()
	// Use @all so the archived conversation shows an unread-mention badge on the
	// "Archived conversations" button. If the "Unread mentions" navigation button
	// appears above it, clip the screenshot to start just below that button so it
	// is excluded. The dot on the archive button is preserved.
	await seedChatMessages(token, [
		{ text: "@all Don't forget the catering walkthrough is Friday at 10am!", user: 'amara_w', password: 'amara_w' },
	])
	await talkApi('POST', `/v4/room/${token}/archive`, christine)
	await page.reload()
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	const archivedBtn = page.locator('button', { hasText: 'Archived conversations' })
	await archivedBtn.waitFor({ state: 'visible', timeout: 10000 })
	const listEl = page.locator('[aria-label="Conversation list"]')
	const listBox = await listEl.boundingBox()
	const btnBox = await archivedBtn.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'archived-conversations-button.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (listBox && btnBox) {
		// If the "Unread mentions" navigation button is present, start the clip just
		// below it to exclude it. Otherwise fall back to ~80px above the archive button.
		// Use isVisible() (instant, no timeout) before boundingBox() — boundingBox()
		// waits for the element with the full action timeout if it doesn't exist.
		const mentionsBtn = page.locator('button', { hasText: /unread mentions/i })
		const mentionsBox = (await mentionsBtn.isVisible()) ? await mentionsBtn.boundingBox() : null
		const clipTop = mentionsBox
			? mentionsBox.y + mentionsBox.height + 4
			: btnBox.y - 80
		await page.screenshot({ path: dest, clip: { x: listBox.x, y: clipTop, width: listBox.width, height: btnBox.y + btnBox.height - clipTop + 8 } })
	} else {
		await archivedBtn.screenshot({ path: dest })
	}
})

test('Archived conversations list', async ({ page }) => {
	// Relies on "Archived conversations button" test having archived "Event planning".
	// Archive two more rooms so the list looks populated, then unarchive all at the end.
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })

	const allRoomsRes = await talkApi('GET', '/v4/room', christine)
	const allRoomsData = await allRoomsRes.json()
	const rooms: Array<{ token: string; displayName: string }> = allRoomsData?.ocs?.data ?? []
	const designRoom = rooms.find(r => r.displayName === 'Design Team')
	const volunteerRoom = rooms.find(r => r.displayName === 'Volunteer Coordination')
	if (designRoom) await talkApi('POST', `/v4/room/${designRoom.token}/archive`, christine)
	if (volunteerRoom) await talkApi('POST', `/v4/room/${volunteerRoom.token}/archive`, christine)

	await page.reload()
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('button', { hasText: 'Archived conversations' }).waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('button', { hasText: 'Archived conversations' }).click()
	await page.locator('.conversation[title="Event planning"]').first().waitFor({ state: 'visible', timeout: 10000 })

	// Crop to the upper half of the conversation list — the list is long and the
	// bottom half is empty space; three rows give enough context.
	const listEl = page.locator('[aria-label="Conversation list"]')
	const listBox = await listEl.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'archived-conversations-list.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (listBox) {
		await page.screenshot({ path: dest, clip: { x: listBox.x, y: listBox.y, width: listBox.width, height: Math.round(listBox.height / 2) } })
	} else {
		await docElementScreenshot(page, '[aria-label="Conversation list"]', 'user/talk/archived-conversations-list')
	}

	// Unarchive all for clean subsequent runs
	if (groupToken) await talkApi('DELETE', `/v4/room/${groupToken}/archive`, christine)
	if (designRoom) await talkApi('DELETE', `/v4/room/${designRoom.token}/archive`, christine)
	if (volunteerRoom) await talkApi('DELETE', `/v4/room/${volunteerRoom.token}/archive`, christine)
})
