// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Page } from '@playwright/test'
import { runOcc } from '@nextcloud/e2e-test-server/docker'
import { readFileSync } from 'fs'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'

export const SCREENSHOT_PORT = 8093
export const BASE_URL = `http://localhost:${SCREENSHOT_PORT}/index.php`
const OCS_BASE = `http://localhost:${SCREENSHOT_PORT}`
const SCREENSHOT_DIR = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs')

// ── Screenshot helpers ────────────────────────────────────────────────────────

async function suppressFocusRings(page: Page): Promise<void> {
	await page.addStyleTag({ content: [
		'*:focus, *:focus-visible, *:focus-within, *:has(:focus-visible) { outline: none !important; box-shadow: none !important; }',
		'*:focus-visible + * { outline: none !important; box-shadow: none !important; }',
		'::-webkit-scrollbar { display: none !important; }',
		'* { scrollbar-width: none !important; }',
	].join('\n') })
}

/**
 * Take a named viewport screenshot for documentation.
 * Name mirrors the destination path relative to the manual root,
 * e.g. 'user/files/sharing-dialog' → user_manual/files/images/sharing-dialog.png
 */
export async function docScreenshot(
	page: Page,
	name: string,
	options: { clip?: { x: number; y: number; width: number; height: number } } = {},
): Promise<void> {
	await suppressFocusRings(page)
	await page.waitForTimeout(500)
	const dest = path.join(SCREENSHOT_DIR, `${name}.png`)
	await fs.mkdir(path.dirname(dest), { recursive: true })
	await page.screenshot({ path: dest, fullPage: false, ...options })
}

/** Take a screenshot of a specific element only. */
export async function docElementScreenshot(page: Page, selector: string, name: string): Promise<void> {
	await suppressFocusRings(page)
	await page.waitForTimeout(500)
	const dest = path.join(SCREENSHOT_DIR, `${name}.png`)
	await fs.mkdir(path.dirname(dest), { recursive: true })
	const element = page.locator(selector)
	await element.waitFor({ state: 'visible' })
	await element.screenshot({ path: dest })
}

// ── OCC wrapper ───────────────────────────────────────────────────────────────

/** Run an occ command. Throws on non-zero exit. */
export async function occ(cmd: string, env: Record<string, string> = {}): Promise<string> {
	const envArray = Object.entries(env).map(([k, v]) => `${k}=${v}`)
	return runOcc(cmd.split(' '), { env: envArray })
}

/** Like occ() but swallows errors (e.g. "user already exists"). */
export async function tryOcc(cmd: string, env: Record<string, string> = {}): Promise<string | null> {
	try { return await occ(cmd, env) } catch { return null }
}

// ── WebDAV / HTTP helpers ─────────────────────────────────────────────────────

function basicAuth(user: string, password: string): string {
	return 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64')
}

export async function mkdavCol(dest: string, user: string, password: string): Promise<void> {
	await fetch(`${OCS_BASE}/remote.php/dav/files/${user}/${dest}`, {
		method: 'MKCOL',
		headers: { Authorization: basicAuth(user, password) },
	})
}

export async function uploadFile(
	src: string,
	dest: string,
	user: string,
	password: string,
	mtime?: number,
): Promise<void> {
	const content = readFileSync(src)
	const headers: Record<string, string> = { Authorization: basicAuth(user, password) }
	if (mtime) headers['X-OC-MTime'] = String(mtime)
	await fetch(`${OCS_BASE}/remote.php/dav/files/${user}/${dest}`, {
		method: 'PUT',
		headers,
		body: content,
	})
}

export async function uploadAvatar(src: string, user: string, password: string): Promise<void> {
	const content = readFileSync(src)
	const boundary = `----AvatarBoundary${Date.now()}`
	const body = Buffer.concat([
		Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="files[]"; filename="avatar.png"\r\nContent-Type: image/png\r\n\r\n`),
		content,
		Buffer.from(`\r\n--${boundary}--\r\n`),
	])
	await fetch(`${OCS_BASE}/index.php/avatar`, {
		method: 'POST',
		headers: {
			Authorization: basicAuth(user, password),
			'Content-Type': `multipart/form-data; boundary=${boundary}`,
			'OCS-APIREQUEST': 'true',
		},
		body,
	})
}

export async function ocsRequest(
	method: string,
	path: string,
	user: string,
	password: string,
	body?: Record<string, string>,
): Promise<Response> {
	const headers: Record<string, string> = {
		Authorization: basicAuth(user, password),
		'OCS-APIRequest': 'true',
		Accept: 'application/json',
	}
	const init: RequestInit = { method, headers }
	if (body) {
		headers['Content-Type'] = 'application/x-www-form-urlencoded'
		init.body = new URLSearchParams(body)
	}
	return fetch(`${OCS_BASE}${path}`, init)
}

export async function seedChatMessages(
	token: string,
	messages: Array<{ text: string; user: string; password: string }>,
): Promise<void> {
	for (const msg of messages) {
		await ocsRequest('POST', `/ocs/v2.php/apps/spreed/api/v1/chat/${token}`, msg.user, msg.password, {
			message: msg.text,
		})
	}
}
