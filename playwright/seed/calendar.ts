// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SCREENSHOT_PORT } from '../helpers'

const BASE = `http://localhost:${SCREENSHOT_PORT}`

function auth(user: string, password: string) {
	return 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64')
}

function fmtUtc(d: Date): string {
	return d.getUTCFullYear().toString() +
		String(d.getUTCMonth() + 1).padStart(2, '0') +
		String(d.getUTCDate()).padStart(2, '0') + 'T' +
		String(d.getUTCHours()).padStart(2, '0') +
		String(d.getUTCMinutes()).padStart(2, '0') +
		String(d.getUTCSeconds()).padStart(2, '0') + 'Z'
}

function fmtDate(year: number, month: number, day: number): string {
	return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
}

function utcDate(year: number, month: number, day: number, hour = 0, min = 0): Date {
	return new Date(Date.UTC(year, month - 1, day, hour, min, 0))
}

async function calendarExists(user: string, password: string, calName: string): Promise<boolean> {
	const res = await fetch(`${BASE}/remote.php/dav/calendars/${user}/${calName}/`, {
		method: 'PROPFIND',
		headers: { Authorization: auth(user, password), Depth: '0' },
	}).catch(() => null)
	return res?.status === 207
}

async function eventExists(user: string, password: string, calName: string, uid: string): Promise<boolean> {
	const res = await fetch(`${BASE}/remote.php/dav/calendars/${user}/${calName}/${uid}.ics`, {
		method: 'PROPFIND',
		headers: { Authorization: auth(user, password), Depth: '0' },
	}).catch(() => null)
	return res?.status === 207
}

async function createCalendar(user: string, password: string, calName: string, displayName: string, color: string): Promise<void> {
	if (await calendarExists(user, password, calName)) return
	await fetch(`${BASE}/remote.php/dav/calendars/${user}/${calName}/`, {
		method: 'MKCALENDAR',
		headers: {
			Authorization: auth(user, password),
			'Content-Type': 'application/xml; charset=utf-8',
		},
		body: `<?xml version="1.0" encoding="UTF-8"?>
<x1:mkcalendar xmlns:x1="urn:ietf:params:xml:ns:caldav">
    <x0:set xmlns:x0="DAV:">
        <x0:prop>
            <x0:displayname>${displayName}</x0:displayname>
            <x2:calendar-color xmlns:x2="http://apple.com/ns/ical/">${color}</x2:calendar-color>
        </x0:prop>
    </x0:set>
</x1:mkcalendar>`,
	}).catch(() => {})
}

async function putEvent(user: string, password: string, calName: string, uid: string, ics: string): Promise<void> {
	if (await eventExists(user, password, calName, uid)) return
	await fetch(`${BASE}/remote.php/dav/calendars/${user}/${calName}/${uid}.ics`, {
		method: 'PUT',
		headers: {
			Authorization: auth(user, password),
			'Content-Type': 'text/calendar; charset=utf-8',
		},
		body: ics,
	}).catch(() => {})
}

function makeEvent(uid: string, summary: string, opts: {
	start: Date | string
	end: Date | string
	allDay?: boolean
	description?: string
	location?: string
	rrule?: string
	attendees?: string[]
	valarm?: { action: string; trigger: string; description: string }
}): string {
	const lines: string[] = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//NC Docs//Seed//EN',
		'BEGIN:VEVENT',
		`UID:${uid}`,
		`SUMMARY:${summary}`,
	]
	if (opts.allDay) {
		lines.push(`DTSTART;VALUE=DATE:${opts.start}`)
		lines.push(`DTEND;VALUE=DATE:${opts.end}`)
	} else {
		lines.push(`DTSTART:${fmtUtc(opts.start as Date)}`)
		lines.push(`DTEND:${fmtUtc(opts.end as Date)}`)
	}
	if (opts.description) lines.push(`DESCRIPTION:${opts.description}`)
	if (opts.location) lines.push(`LOCATION:${opts.location}`)
	if (opts.rrule) lines.push(`RRULE:${opts.rrule}`)
	if (opts.attendees) {
		for (const uid of opts.attendees) {
			lines.push(`ATTENDEE;CN=${uid};CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION:mailto:${uid}@example.org`)
		}
	}
	if (opts.valarm) {
		lines.push('BEGIN:VALARM')
		lines.push(`ACTION:${opts.valarm.action}`)
		lines.push(`TRIGGER:${opts.valarm.trigger}`)
		lines.push(`DESCRIPTION:${opts.valarm.description}`)
		lines.push('END:VALARM')
	}
	lines.push('END:VEVENT', 'END:VCALENDAR')
	return lines.join('\r\n')
}

export async function seedCalendar(): Promise<void> {
	// ── Create a second calendar so the list looks realistic ──────────────────
	await createCalendar('christine', 'christine', 'work', 'Work', '#0082C9FF')

	// ── Personal calendar events ──────────────────────────────────────────────

	// Future event with attendees + reminder — covers attendees, free/busy, reminders screenshots
	await putEvent('christine', 'christine', 'personal', 'q3-gala-planning', makeEvent(
		'q3-gala-planning-seed',
		'Q3 Gala planning',
		{
			start: utcDate(2026, 6, 10, 14, 0),
			end: utcDate(2026, 6, 10, 15, 0),
			description: 'Confirm venue, catering, and AV. Review ticket sales.',
			location: 'Riverside Pavilion, London',
			attendees: ['amara_w', 'malik_s', 'lila_h'],
			valarm: { action: 'DISPLAY', trigger: '-PT30M', description: 'Reminder' },
		},
	))

	// All-day event — covers the all-day event UI
	await putEvent('christine', 'christine', 'personal', 'board-checkin', makeEvent(
		'board-checkin-seed',
		'Board check-in',
		{ allDay: true, start: fmtDate(2026, 6, 3), end: fmtDate(2026, 6, 4) },
	))

	// Recurring weekly event — covers the repeat settings screenshot
	await putEvent('christine', 'christine', 'personal', 'weekly-team-sync', makeEvent(
		'weekly-team-sync-seed',
		'Weekly team sync',
		{
			start: utcDate(2026, 5, 29, 9, 0),
			end: utcDate(2026, 5, 29, 10, 0),
			rrule: 'FREQ=WEEKLY;BYDAY=FR;COUNT=8',
		},
	))

	// Past event — gives calendar some history
	await putEvent('christine', 'christine', 'personal', 'venue-visit', makeEvent(
		'venue-visit-riverside-seed',
		'Site visit — Riverside Pavilion',
		{
			start: utcDate(2026, 5, 20, 13, 0),
			end: utcDate(2026, 5, 20, 15, 0),
			location: 'Riverside Pavilion, London',
		},
	))

	// Future event mid-July — populates the month view
	await putEvent('christine', 'christine', 'personal', 'budget-review', makeEvent(
		'budget-review-q3-seed',
		'Budget review Q3',
		{
			start: utcDate(2026, 7, 1, 10, 0),
			end: utcDate(2026, 7, 1, 11, 0),
			description: 'Review Q3 event budget with Charlotte.',
			attendees: ['charlotte_m'],
		},
	))

	// ── Work calendar event ───────────────────────────────────────────────────

	await putEvent('christine', 'christine', 'work', 'sponsor-call', makeEvent(
		'sponsor-conf-call-seed',
		'Sponsor conference call',
		{
			start: utcDate(2026, 6, 12, 15, 0),
			end: utcDate(2026, 6, 12, 16, 0),
			description: 'Quarterly check-in with Hartley & Co.',
		},
	))

	// ── Invitation from amara_w to Christine ──────────────────────────────────
	// Needed for invitation-response screenshots (calendar_accept_simple/advanced_editor.png).
	// amara_w creates an event and invites christine so she sees NEEDS-ACTION status.

	const ORGANIZER = 'amara_w'
	const ORGANIZER_PASS = 'amara_w'
	await putEvent(ORGANIZER, ORGANIZER_PASS, 'personal', 'volunteer-briefing', [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//NC Docs//Seed//EN',
		'BEGIN:VEVENT',
		'UID:volunteer-briefing-seed',
		`DTSTART:${fmtUtc(utcDate(2026, 6, 17, 11, 0))}`,
		`DTEND:${fmtUtc(utcDate(2026, 6, 17, 12, 0))}`,
		'SUMMARY:Volunteer briefing',
		'DESCRIPTION:Pre-event briefing for all volunteers.',
		`ORGANIZER;CN=${ORGANIZER}:mailto:${ORGANIZER}@example.org`,
		'ATTENDEE;CN=amara_w;CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED:mailto:amara_w@example.org',
		'ATTENDEE;CN=christine;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:c.schott@example.org',
		'END:VEVENT',
		'END:VCALENDAR',
	].join('\r\n'))
}
