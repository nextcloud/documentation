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
import * as fs from 'fs/promises'

test.describe.configure({ mode: 'serial' })

const christine = new User('christine', 'christine')

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

	await tryOcc('user:add --password-from-env --display-name="Adrian Lelievre" adrian_l', { OC_PASS: 'adrian_l' })
	await uploadAvatar(`${AVATAR_DIR}/Adrian_Lelievre/avatar.png`, 'adrian_l', 'adrian_l')

	await tryOcc('user:add --password-from-env --display-name="Charlotte McGraw" charlotte_m', { OC_PASS: 'charlotte_m' })
	await uploadAvatar(`${AVATAR_DIR}/CharlotteMcGraw/avatar.png`, 'charlotte_m', 'charlotte_m')

	await tryOcc('user:add --password-from-env --display-name="Orion Gallagher" orion_g', { OC_PASS: 'orion_g' })
	await uploadAvatar(`${AVATAR_DIR}/Orion_Gallagher/avatar.png`, 'orion_g', 'orion_g')

	await tryOcc('user:add --password-from-env --display-name="Analise Laviss" analise_l', { OC_PASS: 'analise_l' })
	await uploadAvatar(`${AVATAR_DIR}/Analise_Laviss/avatar.png`, 'analise_l', 'analise_l')

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

	// Seed 1:1 DM messages — filter out system messages (Talk always adds "You created the conversation")
	const chatRes = await talkApi('GET', `/v1/chat/${dmToken}?lookIntoFuture=0&limit=20`, christine)
	const chatData = await chatRes.json()
	const msgs: Array<{ systemMessage?: string }> = chatData?.ocs?.data ?? []
	if (msgs.filter(m => !m.systemMessage).length === 0) {
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

	// Seed charlotte_m ↔ christine DM (only if empty)
	const charlotteDmToken = await createTalkDm(christine, 'charlotte_m')
	const charlotteChatRes = await talkApi('GET', `/v1/chat/${charlotteDmToken}?lookIntoFuture=0&limit=20`, christine)
	const charlotteChatData = await charlotteChatRes.json()
	const charlotteMsgs: Array<{ systemMessage?: string }> = charlotteChatData?.ocs?.data ?? []
	if (charlotteMsgs.filter(m => !m.systemMessage).length === 0) {
		await seedChatMessages(charlotteDmToken, [
			{ text: "Hi Christine — the venue is asking for the £2,500 deposit by end of week. Shall I go ahead and authorise it?", user: 'charlotte_m', password: 'charlotte_m' },
			{ text: "Yes, please go ahead — I've already confirmed it with finance.", user: 'christine', password: 'christine' },
			{ text: "Perfect. I'll send the invoice to accounts once it's done.", user: 'charlotte_m', password: 'charlotte_m' },
		])
	}

	// Seed orion_g ↔ christine DM (only if empty)
	const orionDmToken = await createTalkDm(christine, 'orion_g')
	const orionChatRes = await talkApi('GET', `/v1/chat/${orionDmToken}?lookIntoFuture=0&limit=20`, christine)
	const orionChatData = await orionChatRes.json()
	const orionMsgs: Array<{ systemMessage?: string }> = orionChatData?.ocs?.data ?? []
	if (orionMsgs.filter(m => !m.systemMessage).length === 0) {
		await seedChatMessages(orionDmToken, [
			{ text: "Just saw your post about the gala — looks amazing! 🎉", user: 'orion_g', password: 'orion_g' },
			{ text: "Thanks Orion! It's shaping up really well. Tickets go on sale next month.", user: 'christine', password: 'christine' },
			{ text: "@christine are you free Thursday for a quick call on ticketing?", user: 'orion_g', password: 'orion_g' },
		])
	}

	// Seed adrian_l ↔ christine DM (only if empty)
	const adrianDmToken = await createTalkDm(christine, 'adrian_l')
	const adrianChatRes = await talkApi('GET', `/v1/chat/${adrianDmToken}?lookIntoFuture=0&limit=20`, christine)
	const adrianChatData = await adrianChatRes.json()
	const adrianMsgs: Array<{ systemMessage?: string }> = adrianChatData?.ocs?.data ?? []
	if (adrianMsgs.filter(m => !m.systemMessage).length === 0) {
		await seedChatMessages(adrianDmToken, [
			{ text: "Christine, just confirming — are the decorators booked for the 1st?", user: 'adrian_l', password: 'adrian_l' },
		])
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

	if (!existingNames.includes('Board Updates')) {
		const boardToken = await createGroup('Board Updates', christine)
		await talkApi('POST', `/v1/conversation/${boardToken}/avatar/emoji`, christine, { emoji: '📋', color: '003b6f' }).catch(() => {})
		await addParticipant(boardToken, 'analise_l', christine)
		await addParticipant(boardToken, 'orion_g', christine)
		await addParticipant(boardToken, 'charlotte_m', christine)
		await seedChatMessages(boardToken, [
			{ text: "Minutes from the last board meeting have been uploaded to the shared folder.", user: 'christine', password: 'christine' },
			{ text: "Charlotte, can you confirm the financials are signed off before the next session?", user: 'charlotte_m', password: 'charlotte_m' },
			{ text: "Reviewed and signed off ✅", user: 'analise_l', password: 'analise_l' },
		])
	}

	if (!existingNames.includes('Volunteer Coordination')) {
		const volunteerToken = await createGroup('Volunteer Coordination', christine)
		await talkApi('POST', `/v1/conversation/${volunteerToken}/avatar/emoji`, christine, { emoji: '🤝', color: '00a75c' }).catch(() => {})
		await addParticipant(volunteerToken, 'analise_l', christine)
		await addParticipant(volunteerToken, 'seraphina_d', christine)
		await seedChatMessages(volunteerToken, [
			{ text: "34 volunteers confirmed for the event day — great response!", user: 'seraphina_d', password: 'seraphina_d' },
			{ text: "@christine we still need 6 more for the morning setup shift.", user: 'analise_l', password: 'analise_l' },
		])
	}

	const ctx = await browser.newContext()
	const pg = await ctx.newPage()
	await login(pg.request, christine)
	authCookies = await ctx.cookies()

	// Navigate to Talk so the full client initialises — this is required for the
	// note-to-self room to accept API chat posts (API-only seeding silently fails
	// until the browser has visited /apps/spreed at least once).
	await pg.goto('/apps/spreed')
	await pg.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 20000 }).catch(() => {})

	// Seed note-to-self task list (must be after browser nav — Talk requires it)
	const noteRes = await talkApi('GET', '/v1/note-to-self', christine)
	const noteData = await noteRes.json()
	const noteToken = noteData?.ocs?.data?.token as string | undefined
	if (noteToken) {
		const noteChatRes = await talkApi('GET', `/v1/chat/${noteToken}?lookIntoFuture=0&limit=50`, christine)
		const noteChatData = await noteChatRes.json()
		const noteMsgsList: Array<{ message?: string; systemMessage?: string }> = noteChatData?.ocs?.data ?? []
		if (!noteMsgsList.some(m => m.message?.includes('Define Project Scope'))) {
			await seedChatMessages(noteToken, [{
				text: '- [x] Define Project Scope and Objectives\n- [x] Develop a Project Plan\n- [ ] Coordinate Team Activities\n- [ ] Review and finalize budget\n- [ ] Schedule kickoff meeting',
				user: 'christine',
				password: 'christine',
			}])
		}
	}

	// Seed reminders for the Talk dashboard panel — one on the Amara DM and one on the group
	const reminderDmToken = await createTalkDm(christine, 'amara_w')
	const reminderDmRes = await talkApi('GET', `/v1/chat/${reminderDmToken}?lookIntoFuture=0&limit=20`, christine)
	const reminderDmData = await reminderDmRes.json()
	const reminderDmMsgs: Array<{ id: number; message?: string; systemMessage?: string }> = reminderDmData?.ocs?.data ?? []
	const reminderDmMsg = reminderDmMsgs.find(m => !m.systemMessage && m.message?.includes('Q2 proposal'))
	if (reminderDmMsg) {
		const inTwoDays = Math.floor(Date.now() / 1000) + 2 * 24 * 3600
		await talkApi('POST', `/v1/chat/${reminderDmToken}/${reminderDmMsg.id}/reminder`, christine, { timestamp: String(inTwoDays) }).catch(() => {})
	}
	if (groupToken) {
		const reminderGrpRes = await talkApi('GET', `/v1/chat/${groupToken}?lookIntoFuture=0&limit=20`, christine)
		const reminderGrpData = await reminderGrpRes.json()
		const reminderGrpMsgs: Array<{ id: number; message?: string; systemMessage?: string }> = reminderGrpData?.ocs?.data ?? []
		const reminderGrpMsg = reminderGrpMsgs.find(m => !m.systemMessage && m.message?.includes('catering walkthrough'))
		if (reminderGrpMsg) {
			const tomorrow = Math.floor(Date.now() / 1000) + 24 * 3600
			await talkApi('POST', `/v1/chat/${groupToken}/${reminderGrpMsg.id}/reminder`, christine, { timestamp: String(tomorrow) }).catch(() => {})
		}
	}

	await pg.close()
	await ctx.close()
})

test.beforeEach(async ({ page }) => {
	await page.context().addCookies(authCookies)
})

// ── Screenshots ───────────────────────────────────────────────────────────────

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
	// Extract token from URL and seed messages
	const newRoomUrl = page.url()
	const newRoomToken = newRoomUrl.match(/\/call\/([a-z0-9]+)/i)?.[1]
	if (newRoomToken) {
		await seedChatMessages(newRoomToken, [
			{ text: "Hey team! Welcome to the Product Team chat 👋", user: 'christine', password: 'christine' },
			{ text: "Thanks for setting this up!", user: 'amara_w', password: 'amara_w' },
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
	// Seed a message before archiving so the preview is meaningful
	await seedChatMessages(token, [
		{ text: "@all Don't forget the catering walkthrough is Friday at 10am!", user: 'amara_w', password: 'amara_w' },
	])
	await talkApi('POST', `/v4/room/${token}/archive`, christine)
	await page.reload()
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	const archivedBtn = page.locator('button', { hasText: 'Archived conversations' })
	await archivedBtn.waitFor({ state: 'visible', timeout: 10000 })
	// Clip from 2 conversations above the button down to include the button itself.
	// Avoids capturing the "Unread mentions" tooltip that appears above the button
	// when @mention messages are unread.
	const listEl = page.locator('[aria-label="Conversation list"]')
	const listBox = await listEl.boundingBox()
	const btnBox = await archivedBtn.boundingBox()
	const dest = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user', 'talk', 'archived-conversations-button.png')
	await fs.mkdir(path.dirname(dest), { recursive: true })
	if (listBox && btnBox) {
		const clipTop = btnBox.y - 80
		await page.screenshot({ path: dest, clip: { x: listBox.x, y: clipTop, width: listBox.width, height: btnBox.y + btnBox.height - clipTop + 8 } })
	} else {
		await archivedBtn.screenshot({ path: dest })
	}
})

test('Archived conversations list', async ({ page }) => {
	// Relies on "Archived conversations button" test having archived "Event planning"
	await clearTalkFilter(page)
	await page.goto('/apps/spreed')
	await page.locator('[aria-label="Conversation list"]').waitFor({ state: 'visible', timeout: 15000 })
	await page.locator('button', { hasText: 'Archived conversations' }).waitFor({ state: 'visible', timeout: 10000 })
	await page.locator('button', { hasText: 'Archived conversations' }).click()
	await page.locator('.conversation[title="Event planning"]').first().waitFor({ state: 'visible', timeout: 10000 })
	await docElementScreenshot(page, '[aria-label="Conversation list"]', 'user/talk/archived-conversations-list')
	// Unarchive for clean subsequent runs
	if (groupToken) {
		await talkApi('DELETE', `/v4/room/${groupToken}/archive`, christine)
	}
})
