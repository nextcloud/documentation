// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SCREENSHOT_PORT } from '../helpers'

const BASE = `http://localhost:${SCREENSHOT_PORT}`

function auth(user: string, password: string) {
	return 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64')
}

async function contactExists(user: string, password: string, book: string, uid: string): Promise<boolean> {
	const res = await fetch(`${BASE}/remote.php/dav/addressbooks/users/${user}/${book}/${uid}.vcf`, {
		method: 'PROPFIND',
		headers: { Authorization: auth(user, password), Depth: '0' },
	}).catch(() => null)
	return res?.status === 207
}

async function addressBookExists(user: string, password: string, book: string): Promise<boolean> {
	const res = await fetch(`${BASE}/remote.php/dav/addressbooks/users/${user}/${book}/`, {
		method: 'PROPFIND',
		headers: { Authorization: auth(user, password), Depth: '0' },
	}).catch(() => null)
	return res?.status === 207
}

async function createAddressBook(user: string, password: string, book: string, displayName: string): Promise<void> {
	if (await addressBookExists(user, password, book)) return
	await fetch(`${BASE}/remote.php/dav/addressbooks/users/${user}/${book}/`, {
		method: 'MKCOL',
		headers: {
			Authorization: auth(user, password),
			'Content-Type': 'application/xml; charset=utf-8',
		},
		body: `<?xml version="1.0" encoding="UTF-8"?>
<create xmlns="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
    <set>
        <prop>
            <resourcetype>
                <collection/>
                <card:addressbook/>
            </resourcetype>
            <displayname>${displayName}</displayname>
        </prop>
    </set>
</create>`,
	}).catch(() => {})
}

async function putContact(user: string, password: string, book: string, uid: string, vcard: string): Promise<void> {
	if (await contactExists(user, password, book, uid)) return
	await fetch(`${BASE}/remote.php/dav/addressbooks/users/${user}/${book}/${uid}.vcf`, {
		method: 'PUT',
		headers: {
			Authorization: auth(user, password),
			'Content-Type': 'text/vcard; charset=utf-8',
		},
		body: vcard,
	}).catch(() => {})
}

function makeContact(uid: string, opts: {
	fn: string
	n: string
	org?: string
	title?: string
	email?: string
	tel?: string
	note?: string
}): string {
	const lines = [
		'BEGIN:VCARD',
		'VERSION:3.0',
		`UID:${uid}`,
		`FN:${opts.fn}`,
		`N:${opts.n}`,
	]
	if (opts.org) lines.push(`ORG:${opts.org}`)
	if (opts.title) lines.push(`TITLE:${opts.title}`)
	if (opts.email) lines.push(`EMAIL;TYPE=WORK:${opts.email}`)
	if (opts.tel) lines.push(`TEL;TYPE=WORK,VOICE:${opts.tel}`)
	if (opts.note) lines.push(`NOTE:${opts.note}`)
	lines.push('END:VCARD')
	return lines.join('\r\n')
}

export async function seedContacts(): Promise<void> {
	// ── Work Contacts address book ────────────────────────────────────────────
	await createAddressBook('christine', 'christine', 'work', 'Work Contacts')

	// ── Contacts in the default address book ──────────────────────────────────

	const contacts: Parameters<typeof makeContact>[] = [
		['james-harrington', {
			fn: 'James Harrington',
			n: 'Harrington;James;;;',
			org: 'Hartley & Co.',
			title: 'Director of Partnerships',
			email: 'j.harrington@hartley.co',
			tel: '+44 20 7123 4567',
			note: 'Key sponsor contact. Can commit £5k at Supporting level.',
		}],
		['sofia-marchetti', {
			fn: 'Sofia Marchetti',
			n: 'Marchetti;Sofia;;;',
			org: 'Riverside Pavilion',
			title: 'Events Manager',
			email: 'sofia@riversidepavilion.co.uk',
			tel: '+44 20 7946 0200',
		}],
		['ben-fletcher', {
			fn: 'Ben Fletcher',
			n: 'Fletcher;Ben;;;',
			org: 'Greenleaf Catering Co.',
			title: 'Operations Manager',
			email: 'ben@greenleafcatering.co.uk',
			tel: '+44 20 7946 0300',
		}],
		['priya-sharma', {
			fn: 'Priya Sharma',
			n: 'Sharma;Priya;;;',
			org: 'AV Pro Solutions',
			title: 'Senior Technician',
			email: 'priya@avpro.co.uk',
			tel: '+44 20 7946 0400',
		}],
		['tom-okafor', {
			fn: 'Tom Okafor',
			n: 'Okafor;Tom;;;',
			org: 'Creative Print Co.',
			title: 'Account Manager',
			email: 'tom@creativeprint.co.uk',
			tel: '+44 20 7946 0500',
		}],
		['nadia-rousseau', {
			fn: 'Nadia Rousseau',
			n: 'Rousseau;Nadia;;;',
			org: 'Charity Events Foundation',
			title: 'Communications Lead',
			email: 'nadia@charityfoundation.org',
			tel: '+44 20 7946 0002',
		}],
		['grace-fitzgerald', {
			fn: 'Grace Fitzgerald',
			n: 'Fitzgerald;Grace;;;',
			org: 'Charity Events Foundation',
			title: 'Board Member',
			email: 'grace@charityfoundation.org',
		}],
		['victor-huang', {
			fn: 'Victor Huang',
			n: 'Huang;Victor;;;',
			org: 'LexPath Legal',
			title: 'Compliance Officer',
			email: 'v.huang@lexpath.law',
			tel: '+44 20 7946 0600',
		}],
	]

	for (const [uid, opts] of contacts) {
		await putContact('christine', 'christine', 'contacts', uid, makeContact(uid, opts))
	}

	// ── Work Contacts address book — subset for a second address book ─────────

	await putContact('christine', 'christine', 'work', 'james-harrington-work',
		makeContact('james-harrington-work', {
			fn: 'James Harrington',
			n: 'Harrington;James;;;',
			org: 'Hartley & Co.',
			title: 'Director of Partnerships',
			email: 'j.harrington@hartley.co',
			tel: '+44 20 7123 4567',
		}),
	)

	await putContact('christine', 'christine', 'work', 'sofia-marchetti-work',
		makeContact('sofia-marchetti-work', {
			fn: 'Sofia Marchetti',
			n: 'Marchetti;Sofia;;;',
			org: 'Riverside Pavilion',
			title: 'Events Manager',
			email: 'sofia@riversidepavilion.co.uk',
			tel: '+44 20 7946 0200',
		}),
	)

	await putContact('christine', 'christine', 'work', 'ben-fletcher-work',
		makeContact('ben-fletcher-work', {
			fn: 'Ben Fletcher',
			n: 'Fletcher;Ben;;;',
			org: 'Greenleaf Catering Co.',
			title: 'Operations Manager',
			email: 'ben@greenleafcatering.co.uk',
		}),
	)
}
