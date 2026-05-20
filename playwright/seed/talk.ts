// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ocsRequest, seedChatMessages, reactToMessage, uploadFile, SCREENSHOT_PORT } from '../helpers'
import { runExec } from '@nextcloud/e2e-test-server/docker'
import * as path from 'path'

const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures')

const SEC = 1
const DAY = 86400 * SEC
const daysAgo = (n: number) => Math.floor(Date.now() / 1000 - n * DAY)

// ── Low-level helpers ─────────────────────────────────────────────────────────

function talkCall(method: string, talkPath: string, user: string, password: string, body?: Record<string, string>) {
	return ocsRequest(method, `/ocs/v2.php/apps/spreed/api${talkPath}`, user, password, body)
}

async function createGroup(name: string): Promise<string> {
	const res = await talkCall('POST', '/v4/room', 'christine', 'christine', { roomType: '2', roomName: name })
	const data = await res.json()
	return data.ocs.data.token as string
}

async function addParticipant(token: string, uid: string): Promise<void> {
	await talkCall('POST', `/v4/room/${token}/participants`, 'christine', 'christine', { newParticipant: uid, source: 'users' })
}

async function createDm(target: string): Promise<string> {
	const res = await talkCall('POST', '/v4/room', 'christine', 'christine', { roomType: '1', invite: target })
	const data = await res.json()
	return data.ocs.data.token as string
}

/**
 * Spread the creation_timestamp of all user messages in a room across a time
 * range. Uses PHP PDO to write directly to the SQLite database, which is the
 * only reliable way to backdate Talk messages (the API offers no timestamp param).
 * SQL is base64-encoded to avoid any shell-escaping issues.
 */
async function spreadTimestamps(token: string, startTs: number, endTs: number): Promise<void> {
	const res = await talkCall('GET', `/v1/chat/${token}?lookIntoFuture=0&limit=200`, 'christine', 'christine')
	const data = await res.json()
	const messages: Array<{ id: number; systemMessage?: string }> = data?.ocs?.data ?? []
	const userMsgs = messages
		.filter(m => !m.systemMessage)
		.sort((a, b) => a.id - b.id)

	if (userMsgs.length === 0) return

	const interval = userMsgs.length > 1
		? Math.floor((endTs - startTs) / (userMsgs.length - 1))
		: 0
	const cases = userMsgs.map((m, i) => `WHEN ${m.id} THEN ${startTs + i * interval}`).join(' ')
	const ids = userMsgs.map(m => m.id).join(',')
	const sql = `UPDATE oc_talk_chat_messages SET creation_timestamp = CASE id ${cases} END WHERE id IN (${ids})`

	const b64 = Buffer.from(sql).toString('base64')
	const php = `$db=new PDO('sqlite:/var/www/html/data/owncloud.db');$db->exec(base64_decode('${b64}'));`
	await runExec(['php', '-r', php]).catch(() => {})
}

// ── Seed functions ────────────────────────────────────────────────────────────

interface DmTokens {
	amara: string
	charlotte: string
	orion: string
	adrian: string
}

async function seedDms(): Promise<DmTokens> {
	// amara_w ↔ christine
	const amara = await createDm('amara_w')
	const chatRes = await talkCall('GET', `/v1/chat/${amara}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
	const chatData = await chatRes.json()
	const msgs: Array<{ systemMessage?: string }> = chatData?.ocs?.data ?? []
	if (msgs.filter(m => !m.systemMessage).length === 0) {
		await seedChatMessages(amara, [
			{ text: 'Do you have a minute?', user: 'amara_w', password: 'amara_w' },
			{ text: "Absolutely, what's up?", user: 'christine', password: 'christine' },
			{ text: "The client got back to me — they're considering joining the fundraising next Thursday if we can secure a round table. Can you help?", user: 'amara_w', password: 'amara_w' },
			{ text: "Great news! Have you already spoken to Marlene at the venue about adding a round table?", user: 'christine', password: 'christine' },
			{ text: "Marlene said it'd be tricky this close to the date but she'll try. Might need an escalation.", user: 'amara_w', password: 'amara_w' },
			{ text: "I'll contact them straight away to make sure we can accommodate the client. Thanks for looping me in!", user: 'christine', password: 'christine' },
			{ text: "Wonderful, thank you so much! 🙌", user: 'amara_w', password: 'amara_w' },
			{ text: "Happy to help! Let me know how it goes.", user: 'christine', password: 'christine' },
			{ text: "Will do. Also — I've shared the Q2 proposal and meeting notes in this chat for your reference.", user: 'amara_w', password: 'amara_w' },
		])
		await uploadFile(`${FIXTURES_DIR}/pdfs/Q2 Project Proposal.pdf`, 'Q2 Project Proposal.pdf', 'amara_w', 'amara_w')
		await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'amara_w', 'amara_w', {
			shareType: '10', path: '/Q2 Project Proposal.pdf', shareWith: amara,
		})
		await uploadFile(`${FIXTURES_DIR}/pdfs/Team Meeting Notes.pdf`, 'Team Meeting Notes.pdf', 'amara_w', 'amara_w')
		await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', 'amara_w', 'amara_w', {
			shareType: '10', path: '/Team Meeting Notes.pdf', shareWith: amara,
		})
		await seedChatMessages(amara, [
			{ text: "Perfect, I'll review them before our call.", user: 'christine', password: 'christine' },
		])
		const allMsgsRes = await talkCall('GET', `/v1/chat/${amara}?lookIntoFuture=0&limit=30`, 'christine', 'christine')
		const allMsgsData = await allMsgsRes.json()
		const allMsgs: Array<{ id: number; message: string }> = allMsgsData?.ocs?.data ?? []
		for (const msg of allMsgs) {
			if (msg.message.includes('Great news')) {
				await reactToMessage(amara, msg.id, '👍', 'amara_w', 'amara_w').catch(() => {})
				await reactToMessage(amara, msg.id, '❤️', 'lila_h', 'lila_h').catch(() => {})
			}
			if (msg.message.includes('Happy to help')) {
				await reactToMessage(amara, msg.id, '🙏', 'amara_w', 'amara_w').catch(() => {})
			}
		}
	}

	// charlotte_m ↔ christine
	const charlotte = await createDm('charlotte_m')
	const charlotteChatRes = await talkCall('GET', `/v1/chat/${charlotte}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
	const charlotteChatData = await charlotteChatRes.json()
	const charlotteMsgs: Array<{ systemMessage?: string }> = charlotteChatData?.ocs?.data ?? []
	if (charlotteMsgs.filter(m => !m.systemMessage).length === 0) {
		await seedChatMessages(charlotte, [
			{ text: "Hi Christine — the venue is asking for the £2,500 deposit by end of week. Shall I go ahead and authorise it?", user: 'charlotte_m', password: 'charlotte_m' },
			{ text: "Yes, please go ahead — I've already confirmed it with finance.", user: 'christine', password: 'christine' },
			{ text: "Perfect. I'll send the invoice to accounts once it's done.", user: 'charlotte_m', password: 'charlotte_m' },
		])
	}

	// orion_g ↔ christine
	const orion = await createDm('orion_g')
	const orionChatRes = await talkCall('GET', `/v1/chat/${orion}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
	const orionChatData = await orionChatRes.json()
	const orionMsgs: Array<{ systemMessage?: string }> = orionChatData?.ocs?.data ?? []
	if (orionMsgs.filter(m => !m.systemMessage).length === 0) {
		await seedChatMessages(orion, [
			{ text: "Just saw your post about the gala — looks amazing! 🎉", user: 'orion_g', password: 'orion_g' },
			{ text: "Thanks Orion! It's shaping up really well. Tickets go on sale next month.", user: 'christine', password: 'christine' },
			{ text: "@christine are you free Thursday for a quick call on ticketing?", user: 'orion_g', password: 'orion_g' },
		])
	}

	// adrian_l ↔ christine
	const adrian = await createDm('adrian_l')
	const adrianChatRes = await talkCall('GET', `/v1/chat/${adrian}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
	const adrianChatData = await adrianChatRes.json()
	const adrianMsgs: Array<{ systemMessage?: string }> = adrianChatData?.ocs?.data ?? []
	if (adrianMsgs.filter(m => !m.systemMessage).length === 0) {
		await seedChatMessages(adrian, [
			{ text: "Christine, just confirming — are the decorators booked for the 1st?", user: 'adrian_l', password: 'adrian_l' },
		])
	}

	return { amara, charlotte, orion, adrian }
}

interface GroupTokens {
	event: string
	design: string
	updates: string
	board: string
	volunteer: string
}

async function seedEventPlanningGroup(): Promise<string> {
	const listRes = await talkCall('GET', '/v4/room', 'christine', 'christine')
	const listData = await listRes.json()
	const rooms: Array<{ token: string; displayName: string; isArchived?: boolean }> = listData?.ocs?.data ?? []
	const existing = rooms.find(r => r.displayName === 'Event planning')

	let token: string
	if (existing) {
		if (existing.isArchived) {
			await talkCall('DELETE', `/v4/room/${existing.token}/archive`, 'christine', 'christine')
		}
		token = existing.token
	} else {
		token = await createGroup('Event planning')
		await addParticipant(token, 'amara_w')
		await seedChatMessages(token, [
			{ text: "Hi team! I've set up this conversation for coordinating the Q3 fundraising event.", user: 'christine', password: 'christine' },
			{ text: 'Great, thanks for setting this up! I have a few updates to share.', user: 'amara_w', password: 'amara_w' },
			{ text: "Looking forward to hearing them. Let's get started!", user: 'christine', password: 'christine' },
		])
	}

	await talkCall('POST', `/v1/room/${token}/avatar/emoji`, 'christine', 'christine', { emoji: '🎪', color: '0082c9' }).catch(() => {})

	const grpChatRes = await talkCall('GET', `/v1/chat/${token}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
	const grpChatData = await grpChatRes.json()
	const grpMsgs: Array<{ id: number; message: string; systemMessage?: string }> = grpChatData?.ocs?.data ?? []
	if (grpMsgs.filter(m => !m.systemMessage && m.message && !m.message.startsWith('{')).length <= 3) {
		await seedChatMessages(token, [
			{ text: "Quick update: Riverside Pavilion confirmed for 1 September! 🎉", user: 'christine', password: 'christine' },
			{ text: "Amazing! I've already started the sponsor outreach — three leads so far.", user: 'amara_w', password: 'amara_w' },
			{ text: "That's great progress. Malik, can you handle the AV quote this week?", user: 'christine', password: 'christine' },
			{ text: "On it — I'll have something to you by Thursday.", user: 'malik_s', password: 'malik_s' },
			{ text: "Thanks everyone. Reminder: catering walkthrough is Friday at 10am.", user: 'christine', password: 'christine' },
			{ text: "I'll be there!", user: 'amara_w', password: 'amara_w' },
			{ text: "Me too 👍", user: 'malik_s', password: 'malik_s' },
		])
		const freshRes = await talkCall('GET', `/v1/chat/${token}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
		const freshData = await freshRes.json()
		const freshMsgs: Array<{ id: number; message: string }> = freshData?.ocs?.data ?? []
		for (const msg of freshMsgs) {
			if (msg.message.includes('Riverside Pavilion confirmed')) {
				await reactToMessage(token, msg.id, '🎉', 'amara_w', 'amara_w').catch(() => {})
				await reactToMessage(token, msg.id, '🎉', 'malik_s', 'malik_s').catch(() => {})
				await reactToMessage(token, msg.id, '👏', 'lila_h', 'lila_h').catch(() => {})
			}
		}
	}

	return token
}

async function seedAdditionalGroups(existingRooms: Array<{ displayName: string; token: string }>): Promise<Omit<GroupTokens, 'event'>> {
	const byName = Object.fromEntries(existingRooms.map(r => [r.displayName, r.token]))

	let design = byName['Design Team'] ?? ''
	if (!design) {
		design = await createGroup('Design Team')
		await talkCall('POST', `/v1/room/${design}/avatar/emoji`, 'christine', 'christine', { emoji: '🎨', color: 'a3174b' }).catch(() => {})
		await addParticipant(design, 'lila_h')
		await addParticipant(design, 'kieran_p')
		await seedChatMessages(design, [
			{ text: "Hey team! Sharing the updated brand kit for the gala — new colour palette and logo lockups.", user: 'christine', password: 'christine' },
			{ text: "Love the new palette! The deep teal works really well for the event signage.", user: 'lila_h', password: 'lila_h' },
			{ text: "Agreed. Kieran, can you update the social templates once you have a moment?", user: 'christine', password: 'christine' },
			{ text: "Sure, I'll have the Instagram and LinkedIn versions ready by end of day.", user: 'kieran_p', password: 'kieran_p' },
		])
	}

	let updates = byName['Project Updates'] ?? ''
	if (!updates) {
		updates = await createGroup('Project Updates')
		await talkCall('POST', `/v1/room/${updates}/avatar/emoji`, 'christine', 'christine', { emoji: '📢', color: 'e9a227' }).catch(() => {})
		await addParticipant(updates, 'amara_w')
		await addParticipant(updates, 'malik_s')
		await addParticipant(updates, 'lila_h')
		await addParticipant(updates, 'seraphina_d')
		await seedChatMessages(updates, [
			{ text: "📅 Gala planning is on track. Key milestone: venue confirmed for 1 Sep.", user: 'christine', password: 'christine' },
			{ text: "Ticket sales open 1 July — please share the link with your networks!", user: 'christine', password: 'christine' },
			{ text: "Will do! Already have a few colleagues who are interested.", user: 'seraphina_d', password: 'seraphina_d' },
			{ text: "Sponsor pack v2 is out — thanks Amara for the quick turnaround.", user: 'christine', password: 'christine' },
			{ text: "Happy to help. Three warm leads already replied!", user: 'amara_w', password: 'amara_w' },
		])
	}

	let board = byName['Board Updates'] ?? ''
	if (!board) {
		board = await createGroup('Board Updates')
		await talkCall('POST', `/v1/room/${board}/avatar/emoji`, 'christine', 'christine', { emoji: '📋', color: '003b6f' }).catch(() => {})
		await addParticipant(board, 'analise_l')
		await addParticipant(board, 'orion_g')
		await addParticipant(board, 'charlotte_m')
		await seedChatMessages(board, [
			{ text: "Minutes from the last board meeting have been uploaded to the shared folder.", user: 'christine', password: 'christine' },
			{ text: "Charlotte, can you confirm the financials are signed off before the next session?", user: 'charlotte_m', password: 'charlotte_m' },
			{ text: "Reviewed and signed off ✅", user: 'analise_l', password: 'analise_l' },
		])
	}

	let volunteer = byName['Volunteer Coordination'] ?? ''
	if (!volunteer) {
		volunteer = await createGroup('Volunteer Coordination')
		await talkCall('POST', `/v1/room/${volunteer}/avatar/emoji`, 'christine', 'christine', { emoji: '🤝', color: '00a75c' }).catch(() => {})
		await addParticipant(volunteer, 'analise_l')
		await addParticipant(volunteer, 'seraphina_d')
		await seedChatMessages(volunteer, [
			{ text: "34 volunteers confirmed for the event day — great response!", user: 'seraphina_d', password: 'seraphina_d' },
			{ text: "@christine we still need 6 more for the morning setup shift.", user: 'analise_l', password: 'analise_l' },
		])
	}

	return { design, updates, board, volunteer }
}

function fmtUtc(d: Date): string {
	return d.getUTCFullYear().toString() +
		String(d.getUTCMonth() + 1).padStart(2, '0') +
		String(d.getUTCDate()).padStart(2, '0') + 'T' +
		String(d.getUTCHours()).padStart(2, '0') +
		String(d.getUTCMinutes()).padStart(2, '0') +
		String(d.getUTCSeconds()).padStart(2, '0') + 'Z'
}

async function seedCalendarEvent(eventToken: string): Promise<void> {
	const meetStart = new Date(Date.now() + 24 * 3600 * 1000)
	meetStart.setUTCHours(10, 0, 0, 0)
	const meetEnd = new Date(meetStart.getTime() + 3600000)
	const ics = [
		'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NC Docs//Seed//EN',
		'BEGIN:VEVENT',
		'UID:event-planning-catchup-docs-seed',
		`DTSTART:${fmtUtc(meetStart)}`,
		`DTEND:${fmtUtc(meetEnd)}`,
		'SUMMARY:Event planning catchup',
		`LOCATION:http://localhost:${SCREENSHOT_PORT}/call/${eventToken}`,
		'END:VEVENT', 'END:VCALENDAR',
	].join('\r\n')
	await fetch(`http://localhost:${SCREENSHOT_PORT}/remote.php/dav/calendars/christine/personal/event-planning-catchup-docs-seed.ics`, {
		method: 'PUT',
		headers: {
			Authorization: 'Basic ' + Buffer.from('christine:christine').toString('base64'),
			'Content-Type': 'text/calendar; charset=utf-8',
		},
		body: ics,
	}).catch(() => {})
}

/**
 * Backdate message timestamps for all seeded rooms so that conversations
 * appear to have taken place over realistic timeframes rather than all
 * within the same second. Must run after all messages are seeded.
 */
export async function adjustTalkTimestamps(tokens: GroupTokens & DmTokens): Promise<void> {
	await spreadTimestamps(tokens.amara,     daysAgo(14), daysAgo(2))
	await spreadTimestamps(tokens.charlotte,  daysAgo(6),  daysAgo(4))
	await spreadTimestamps(tokens.orion,      daysAgo(3),  daysAgo(2))
	await spreadTimestamps(tokens.adrian,     daysAgo(1),  daysAgo(1))
	await spreadTimestamps(tokens.event,      daysAgo(21), daysAgo(1))
	await spreadTimestamps(tokens.design,     daysAgo(8),  daysAgo(5))
	await spreadTimestamps(tokens.updates,    daysAgo(6),  daysAgo(3))
	await spreadTimestamps(tokens.board,      daysAgo(15), daysAgo(9))
	await spreadTimestamps(tokens.volunteer,  daysAgo(4),  daysAgo(1))
}

/**
 * Seed all Talk data that can be created via API before any browser session.
 * Returns all room tokens for use in adjustTalkTimestamps and seedNoteToSelf.
 */
export async function seedTalk(): Promise<GroupTokens & DmTokens> {
	const dmTokens = await seedDms()
	const event = await seedEventPlanningGroup()

	// Fetch room list once for seedAdditionalGroups to look up existing tokens
	const allRoomsRes = await talkCall('GET', '/v4/room', 'christine', 'christine')
	const allRoomsData = await allRoomsRes.json()
	const allRooms: Array<{ displayName: string; token: string }> = allRoomsData?.ocs?.data ?? []
	const groupTokens = await seedAdditionalGroups(allRooms)

	await seedCalendarEvent(event)

	return { event, ...dmTokens, ...groupTokens }
}

/**
 * Seed data that requires the browser to have visited /apps/spreed first.
 * Call this in global-setup after the browser has navigated to Talk.
 */
export async function seedNoteToSelf(eventToken: string): Promise<void> {
	// Note-to-self task list
	const noteRes = await talkCall('GET', '/v1/note-to-self', 'christine', 'christine')
	const noteData = await noteRes.json()
	const noteToken = noteData?.ocs?.data?.token as string | undefined
	if (noteToken) {
		const noteChatRes = await talkCall('GET', `/v1/chat/${noteToken}?lookIntoFuture=0&limit=50`, 'christine', 'christine')
		const noteChatData = await noteChatRes.json()
		const noteMsgs: Array<{ message?: string; systemMessage?: string }> = noteChatData?.ocs?.data ?? []
		if (!noteMsgs.some(m => m.message?.includes('Define Project Scope'))) {
			await seedChatMessages(noteToken, [{
				text: '- [x] Define Project Scope and Objectives\n- [x] Develop a Project Plan\n- [ ] Coordinate Team Activities\n- [ ] Review and finalize budget\n- [ ] Schedule kickoff meeting',
				user: 'christine',
				password: 'christine',
			}])
		}
	}

	// Reminders on DM and group messages for the Talk dashboard panel
	const dmToken = await createDm('amara_w')
	const dmChatRes = await talkCall('GET', `/v1/chat/${dmToken}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
	const dmChatData = await dmChatRes.json()
	const dmMsgs: Array<{ id: number; message?: string; systemMessage?: string }> = dmChatData?.ocs?.data ?? []
	const dmReminderMsg = dmMsgs.find(m => !m.systemMessage && m.message?.includes('Q2 proposal'))
	if (dmReminderMsg) {
		const inTwoDays = Math.floor(Date.now() / 1000) + 2 * 24 * 3600
		await talkCall('POST', `/v1/chat/${dmToken}/${dmReminderMsg.id}/reminder`, 'christine', 'christine', { timestamp: String(inTwoDays) }).catch(() => {})
	}

	const grpChatRes = await talkCall('GET', `/v1/chat/${eventToken}?lookIntoFuture=0&limit=20`, 'christine', 'christine')
	const grpChatData = await grpChatRes.json()
	const grpMsgs: Array<{ id: number; message?: string; systemMessage?: string }> = grpChatData?.ocs?.data ?? []
	const grpReminderMsg = grpMsgs.find(m => !m.systemMessage && m.message?.includes('catering walkthrough'))
	if (grpReminderMsg) {
		const tomorrow = Math.floor(Date.now() / 1000) + 24 * 3600
		await talkCall('POST', `/v1/chat/${eventToken}/${grpReminderMsg.id}/reminder`, 'christine', 'christine', { timestamp: String(tomorrow) }).catch(() => {})
	}
}
