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
	ocsRequest,
	seedChatMessages,
	reactToMessage,
} from '../../../helpers'
import { Page } from '@playwright/test'
import * as path from 'path'
import * as os from 'os'

test.describe.configure({ mode: 'serial' })

const christine = new User('christine', 'christine')
const amara = new User('amara_w', 'amara_w')

const AVATAR_DIR = '/home/anna/Downloads/tp/avatar'
const FIXTURES_DIR = path.join(process.cwd(), 'cypress/fixtures')

// Token for the "Event planning" group conversation — lazily populated
let groupToken = ''
let authCookies: Cookie[] = []

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

/** Create a 1:1 DM via the Talk OCS API. */
async function createTalkDm(actor: User, target: string): Promise<string> {
	const res = await talkApi('POST', '/v4/room', actor, { roomType: '1', invite: target })
	const data = await res.json()
	return data.ocs.data.token as string
}

/** Set a profile field via the OCS provisioning API. */
async function setProfileField(userId: string, key: string, value: string): Promise<void> {
	await ocsRequest('PUT', `/ocs/v2.php/cloud/users/${userId}`, userId, userId, { key, value })
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

test.beforeAll(async ({ browser }) => {
	await tryOcc('user:add --password-from-env --display-name="Christine" christine', { OC_PASS: 'christine' })
	await uploadAvatar(`${AVATAR_DIR}/christine/avatar.png`, 'christine', 'christine')

	await tryOcc('user:add --password-from-env --display-name="Amara Winterbourne" amara_w', { OC_PASS: 'amara_w' })
	await uploadAvatar(`${AVATAR_DIR}/amara_w/avatar.png`, 'amara_w', 'amara_w')
	await setProfileField('amara_w', 'organisation', 'Development Committee')
	await setProfileField('amara_w', 'role', 'Event Coordinator')

	await tryOcc('user:add --password-from-env --display-name="Lila Hawthorne" lila_h', { OC_PASS: 'lila_h' })
	await uploadAvatar(`${AVATAR_DIR}/Lila_Hawthorne/avatar.png`, 'lila_h', 'lila_h')

	await tryOcc('user:add --password-from-env --display-name="Malik Santiago" malik_s', { OC_PASS: 'malik_s' })
	await uploadAvatar(`${AVATAR_DIR}/Malik_Santiago/avatar.png`, 'malik_s', 'malik_s')

	await tryOcc('user:add --password-from-env --display-name="Kieran Patel" kieran_p', { OC_PASS: 'kieran_p' })
	await uploadAvatar(`${AVATAR_DIR}/Kieran_Patel/avatar.png`, 'kieran_p', 'kieran_p')

	await tryOcc('user:add --password-from-env --display-name="Seraphina Delgado" seraphina_d', { OC_PASS: 'seraphina_d' })
	await uploadAvatar(`${AVATAR_DIR}/Seraphina_Delgado/avatar.png`, 'seraphina_d', 'seraphina_d')

	// Create 1:1 DM and seed messages
	const dmToken = await createTalkDm(christine, 'amara_w')

	await uploadFile(`${FIXTURES_DIR}/pdfs/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf', 'amara_w', 'amara_w')
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'amara_w', 'amara_w', {
		shareType: '10', path: '/Q2 Project Proposal.pdf', shareWith: dmToken,
	})
	await uploadFile(`${FIXTURES_DIR}/pdfs/Team Meeting Notes.pdf`, 'Team Meeting Notes.pdf', 'amara_w', 'amara_w')
	await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'amara_w', 'amara_w', {
		shareType: '10', path: '/Team Meeting Notes.pdf', shareWith: dmToken,
	})

	// Seed 1:1 DM messages (only if conversation is empty)
	const chatRes = await talkApi('GET', `/v1/chat/${dmToken}?lookIntoFuture=0&limit=1`, christine)
	const chatData = await chatRes.json()
	const msgs: unknown[] = chatData?.ocs?.data ?? []
	if (msgs.length === 0) {
		await seedChatMessages(dmToken, [
			{ text: 'Do you have a minute?', user: 'amara_w', password: 'amara_w' },
			{ text: "Absolutely, what's up?", user: 'christine', password: 'christine' },
			{ text: "The client got back to me — they're considering joining the fundraising next Thursday if we can secure a round table. Can you help?", user: 'amara_w', password: 'amara_w' },
			{ text: "Great news! Have you already spoken to Marlene at the venue about adding a round table?", user: 'christine', password: 'christine' },
			{ text: "Marlene said it'd be tricky this close to the date but she'll try. Might need an escalation.", user: 'amara_w', password: 'amara_w' },
			{ text: "I'll contact them straight away to make sure we can accommodate the client. Thanks for looping me in!", user: 'christine', password: 'christine' },
			{ text: "Wonderful, thank you so much! 🙌", user: 'amara_w', password: 'amara_w' },
			{ text: "Happy to help! Let me know how it goes.", user: 'christine', password: 'christine' },
			{ text: "Will do. Also — I've shared the Q2 proposal and meeting notes in this chat for your reference.", user: 'amara_w', password: 'amara_w' },
			{ text: "Perfect, I'll review them before our call.", user: 'christine', password: 'christine' },
		])
		// Add emoji reactions to a few DM messages
		const allMsgsRes = await talkApi('GET', `/v1/chat/${dmToken}?lookIntoFuture=0&limit=20`, christine)
		const allMsgsData = await allMsgsRes.json()
		const allMsgs: Array<{ id: number; message: string }> = allMsgsData?.ocs?.data ?? []
		for (const msg of allMsgs) {
			if (msg.message.includes('Great news')) {
				await reactToMessage(dmToken, msg.id, '👍', 'amara_w', 'amara_w').catch(() => {})
				await reactToMessage(dmToken, msg.id, '❤️', 'lila_h', 'lila_h').catch(() => {})
			}
			if (msg.message.includes("Happy to help")) {
				await reactToMessage(dmToken, msg.id, '🙏', 'amara_w', 'amara_w').catch(() => {})
			}
		}
	}

	// Seed note-to-self with a task list so the screenshot shows the task counter
	const noteRes = await talkApi('GET', '/v1/note-to-self', christine)
	const noteData = await noteRes.json()
	const noteToken = noteData.ocs.data.token as string
	const noteChatRes = await talkApi('GET', `/v1/chat/${noteToken}?lookIntoFuture=0&limit=1`, christine)
	const noteChatData = await noteChatRes.json()
	const noteMsgs: unknown[] = noteChatData?.ocs?.data ?? []
	if (noteMsgs.length === 0) {
		await seedChatMessages(noteToken, [{
			text: '- [x] Define Project Scope and Objectives\n- [x] Develop a Project Plan\n- [ ] Coordinate Team Activities\n- [ ] Review and finalize budget\n- [ ] Schedule kickoff meeting',
			user: 'christine',
			password: 'christine',
		}])
	}

	// Pre-create the "Event planning" group so participant membership is synced
	// before the tests start — avoids a race on the participants tab.
	const eventToken = await findOrCreateGroup()

	// Set an emoji icon on "Event planning"
	await talkApi('POST', `/v1/conversation/${eventToken}/avatar/emoji`, christine, { emoji: '🎪', color: '0082c9' }).catch(() => {})

	// Seed messages in the group (only if empty beyond the initial 3)
	const grpChatRes = await talkApi('GET', `/v1/chat/${eventToken}?lookIntoFuture=0&limit=20`, christine)
	const grpChatData = await grpChatRes.json()
	const grpMsgs: Array<{ id: number; message: string }> = grpChatData?.ocs?.data ?? []
	if (grpMsgs.filter(m => m.message && !m.message.startsWith('{')).length <= 3) {
		await seedChatMessages(eventToken, [
			{ text: "Quick update: Riverside Pavilion confirmed for 1 September! 🎉", user: 'christine', password: 'christine' },
			{ text: "Amazing! I've already started the sponsor outreach — three leads so far.", user: 'amara_w', password: 'amara_w' },
			{ text: "That's great progress. Malik, can you handle the AV quote this week?", user: 'christine', password: 'christine' },
			{ text: "On it — I'll have something to you by Thursday.", user: 'malik_s', password: 'malik_s' },
			{ text: "Thanks everyone. Reminder: catering walkthrough is Friday at 10am.", user: 'christine', password: 'christine' },
			{ text: "I'll be there!", user: 'amara_w', password: 'amara_w' },
			{ text: "Me too 👍", user: 'malik_s', password: 'malik_s' },
		])
		// React to the venue confirmation message
		const freshGrpRes = await talkApi('GET', `/v1/chat/${eventToken}?lookIntoFuture=0&limit=20`, christine)
		const freshGrpData = await freshGrpRes.json()
		const freshGrpMsgs: Array<{ id: number; message: string }> = freshGrpData?.ocs?.data ?? []
		for (const msg of freshGrpMsgs) {
			if (msg.message.includes('Riverside Pavilion confirmed')) {
				await reactToMessage(eventToken, msg.id, '🎉', 'amara_w', 'amara_w').catch(() => {})
				await reactToMessage(eventToken, msg.id, '🎉', 'malik_s', 'malik_s').catch(() => {})
				await reactToMessage(eventToken, msg.id, '👏', 'lila_h', 'lila_h').catch(() => {})
			}
		}
	}

	// Additional rooms for a realistic conversation list
	const allRoomsRes = await talkApi('GET', '/v4/room', christine)
	const allRoomsData = await allRoomsRes.json()
	const existingNames: string[] = (allRoomsData?.ocs?.data ?? []).map((r: { displayName: string }) => r.displayName)

	if (!existingNames.includes('Design Team')) {
		const designToken = await createGroup('Design Team', christine)
		await talkApi('POST', `/v1/conversation/${designToken}/avatar/emoji`, christine, { emoji: '🎨', color: 'a3174b' }).catch(() => {})
		await addParticipant(designToken, 'lila_h', christine)
		await addParticipant(designToken, 'kieran_p', christine)
		await seedChatMessages(designToken, [
			{ text: "Hey team! Sharing the updated brand kit for the gala — new colour palette and logo lockups.", user: 'christine', password: 'christine' },
			{ text: "Love the new palette! The deep teal works really well for the event signage.", user: 'lila_h', password: 'lila_h' },
			{ text: "Agreed. Kieran, can you update the social templates once you have a moment?", user: 'christine', password: 'christine' },
			{ text: "Sure, I'll have the Instagram and LinkedIn versions ready by end of day.", user: 'kieran_p', password: 'kieran_p' },
		])
	}

	if (!existingNames.includes('Project Updates')) {
		const updatesToken = await createGroup('Project Updates', christine)
		// Open conversation (roomType 3) would require a different create path; keep as group but add more members
		await talkApi('POST', `/v1/conversation/${updatesToken}/avatar/emoji`, christine, { emoji: '📢', color: 'e9a227' }).catch(() => {})
		await addParticipant(updatesToken, 'amara_w', christine)
		await addParticipant(updatesToken, 'malik_s', christine)
		await addParticipant(updatesToken, 'lila_h', christine)
		await addParticipant(updatesToken, 'seraphina_d', christine)
		await seedChatMessages(updatesToken, [
			{ text: "📅 Gala planning is on track. Key milestone: venue confirmed for 1 Sep.", user: 'christine', password: 'christine' },
			{ text: "Ticket sales open 1 July — please share the link with your networks!", user: 'christine', password: 'christine' },
			{ text: "Will do! Already have a few colleagues who are interested.", user: 'seraphina_d', password: 'seraphina_d' },
			{ text: "Sponsor pack v2 is out — thanks Amara for the quick turnaround.", user: 'christine', password: 'christine' },
			{ text: "Happy to help. Three warm leads already replied!", user: 'amara_w', password: 'amara_w' },
		])
	}

	const ctx = await browser.newContext()
	const pg = await ctx.newPage()
	await login(pg.request, christine)
	authCookies = await ctx.cookies()
	await ctx.close()
})

test.beforeEach(async ({ page }) => {
	await page.context().addCookies(authCookies)
})

// ── Screenshots ───────────────────────────────────────────────────────────────

test('Talk dashboard (conversation list)', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.waitForFunction(() => document.querySelectorAll('.conversation').length >= 1, undefined, { timeout: 10000 })
	await page.locator('.icon-loading').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {})
	await docScreenshot(page, 'user/talk/talk-dashboard')
})

test('Note to self', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('.conversation .text', { hasText: 'Note to self' }).waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('.conversation .text', { hasText: 'Note to self' }).click()
	await page.locator('.chatView').waitFor({ state: 'visible', timeout: 10000 })
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
	await docElementScreenshot(page, '.app-sidebar', 'user/talk/one-to-one-right-sidebar')
})

test('1:1 extend to group', async ({ page }) => {
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await openConversation(page, 'Amara Winterbourne')
	await page.locator('button[aria-label="Start a group conversation"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('button[aria-label="Start a group conversation"]').click()
	await page.locator('.start-group__content, [role="dialog"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('.start-group__content input, [role="dialog"] input[type="text"]').first().fill('l')
	await page.locator('[data-nav-id="users_lila_h"]').waitFor({ state: 'visible', timeout: 5000 })
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
	await page.locator('[data-nav-id="users_amara_w"]').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('[data-nav-id="users_amara_w"]').click()
	await page.locator('button', { hasText: /create conversation/i }).click()
	await page.locator('.chatView').waitFor({ state: 'visible', timeout: 15000 })
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
	// Click General if present — scoped to the dialog to avoid matching page-level nav links
	const generalLink = container.locator('.navigation-list__link', { hasText: /general/i })
	if (await generalLink.isVisible()) await generalLink.click()
	await page.waitForTimeout(500)
	// Find the open/guest-access section by content
	const accessSection = container.locator('.settings-section').filter({ hasText: /open conversation to registered/i }).first()
	await accessSection.waitFor({ state: 'visible', timeout: 15000 })
	await accessSection.scrollIntoViewIfNeeded()
	await page.waitForTimeout(300)
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'group-public-settings.png')
	await accessSection.screenshot({ path: dest })
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
	await docScreenshot(page, 'user/talk/participant-menu')
})

test('Open conversation settings menu', async ({ page }) => {
	const token = await getOrCreateGroupToken()
	await openGroupConversation(page, token)
	await openConversationActions(page)
	await docScreenshot(page, 'user/talk/open-settings')
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
	await page.locator('#settings-section_conversation-settings').waitFor({ state: 'visible', timeout: 10000 })
	const expirationSection = page.locator('.settings-section').filter({ hasText: /message expiration/i }).first()
	await expirationSection.waitFor({ state: 'visible', timeout: 10000 })
	await expirationSection.scrollIntoViewIfNeeded()
	await page.waitForTimeout(500)
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'messages-expiration.png')
	await expirationSection.screenshot({ path: dest })
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
	await docScreenshot(page, 'user/talk/ban-participant')
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
	await openGroupConversation(page, token)
	await openConversationActions(page)
	await page.locator('[role="menuitem"]', { hasText: /conversation settings/i }).click()
	await page.locator('#conversation-settings-container').waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('.navigation-list__link', { hasText: /moderation/i }).click()
	await page.locator('#settings-section_conversation-settings').waitFor({ state: 'visible', timeout: 5000 })
	await page.locator('#settings-section_conversation-settings').scrollIntoViewIfNeeded()
	await page.locator('#settings-section_conversation-settings', { hasText: /banned/i }).waitFor({ state: 'visible', timeout: 10000 })
	await docElementScreenshot(page, '#conversation-settings-container', 'user/talk/ban-participant-list')
	await page.locator('#conversation-settings-container').locator('button[aria-label="Close"]').click()

	// Unban Amara and re-add as participant
	const banRes2 = await talkApi('GET', `/v1/ban/${token}`, christine)
	const banData2 = await banRes2.json()
	const bans2: Array<{ id: number; actorId: string }> = banData2?.ocs?.data ?? []
	const amaraBan2 = bans2.find((b) => b.actorId === 'amara_w')
	if (amaraBan2) {
		await talkApi('DELETE', `/v1/ban/${token}/${amaraBan2.id}`, christine)
		await addParticipant(token, 'amara_w', christine)
	}
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
	await docScreenshot(page, 'user/talk/conversation-notifications')
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
	await talkApi('POST', `/v4/room/${token}/archive`, christine)
	await page.reload()
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('button', { hasText: 'Archived conversations' }).waitFor({ state: 'visible', timeout: 10000 })
	await docElementScreenshot(page, '[aria-label="Conversation list"]', 'user/talk/archived-conversations-button')
})

test('Archived conversations list', async ({ page }) => {
	// Relies on "Archived conversations button" test having archived "Event planning"
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('button', { hasText: 'Archived conversations' }).waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('button', { hasText: 'Archived conversations' }).click()
	await page.locator('.conversation .text', { hasText: 'Event planning' }).waitFor({ state: 'visible', timeout: 10000 })
	await docElementScreenshot(page, '[aria-label="Conversation list"]', 'user/talk/archived-conversations-list')
	// Unarchive for clean subsequent runs
	if (groupToken) {
		await talkApi('DELETE', `/v4/room/${groupToken}/archive`, christine)
	}
})
