// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as os from 'os'
import * as path from 'path'
import { test, Page } from '@playwright/test'
import { docScreenshot } from '../../helpers'

const DEST = path.join(os.homedir(), 'Pictures', 'Screenshots', 'nextcloud-docs', 'user')
const dest = (name: string) => path.join(DEST, name + '.png')

/** Wait for the calendar grid to finish loading. */
async function waitForCalendar(page: Page): Promise<void> {
	await page.locator('.fc-view-harness, .calendar-grid').waitFor({ state: 'visible', timeout: 20000 })
	await page.locator('.loading-indicator, .icon-loading').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {})
	await page.waitForTimeout(500)
}

/** Open the Calendar app in week view and wait for it to load. */
async function openCalendar(page: Page, view: 'week' | 'month' | 'day' = 'week'): Promise<void> {
	await page.goto('/apps/calendar')
	await waitForCalendar(page)
	if (view !== 'week') {
		const viewBtn = page.locator('button', { hasText: new RegExp(view, 'i') })
		if (await viewBtn.isVisible()) await viewBtn.click()
		await page.waitForTimeout(400)
	}
}

test('Calendar — main app view', async ({ page }) => {
	await openCalendar(page)
	await docScreenshot(page, 'user/calendar_application')
})

test('Calendar — create new calendar (sidebar button)', async ({ page }) => {
	await openCalendar(page)
	// NC Calendar 6: the "+ New calendar" button is an NcAppNavigationNewItem.
	// Try text match, aria-label, or the CalDAV settings icon which reveals a new-cal input.
	const newCalBtn =
		page.locator('button[aria-label*="New calendar"], button[aria-label*="new calendar"]').first()
		.or(page.locator('#app-navigation button, #app-navigation a').filter({ hasText: /new calendar/i }).first())
		.or(page.locator('.new-calendar-button, .new-item').first())
	const btnVisible = await newCalBtn.isVisible({ timeout: 5000 }).catch(() => false)
	if (btnVisible) {
		const sidebar = page.locator('#app-navigation, nav[aria-label*="Calendar"]').first()
		const sidebarBox = await sidebar.boundingBox()
		const btnBox = await newCalBtn.boundingBox()
		if (sidebarBox && btnBox) {
			await page.screenshot({
				path: dest('calendar_create_1'),
				clip: { x: sidebarBox.x, y: btnBox.y - 40, width: sidebarBox.width, height: btnBox.height + 56 },
			})
		} else {
			await docScreenshot(page, 'user/calendar_create_1')
		}
	} else {
		// Fallback: screenshot the full sidebar so at least we capture the calendar list
		await page.locator('#app-navigation, nav').first().screenshot({ path: dest('calendar_create_1') })
	}
})

test('Calendar — new calendar name input', async ({ page }) => {
	await openCalendar(page)
	// Try to open new calendar creation — NC Cal 6 uses NcAppNavigationNewItem (inline input on click)
	const newCalBtn =
		page.locator('button[aria-label*="New calendar"], button[aria-label*="new calendar"]').first()
		.or(page.locator('#app-navigation button, #app-navigation a').filter({ hasText: /new calendar/i }).first())
		.or(page.locator('.new-calendar-button, .new-item').first())
	if (await newCalBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
		await newCalBtn.click({ timeout: 5000 }).catch(() => {})
	}
	// Whether or not we found the button, look for a text input that appeared
	const input = page.locator('#app-navigation input[type="text"]').first()
	if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
		await input.fill('Team calendar')
	}
	await page.waitForTimeout(300)
	await page.locator('#app-navigation, nav').first().screenshot({ path: dest('calendar_create_2') })
})

test('Calendar — import calendar dialog', async ({ page }) => {
	await openCalendar(page)
	// Open calendar settings (gear icon at bottom of sidebar)
	const settingsBtn = page.locator('#app-navigation button[aria-label*="Settings"], #app-navigation .settings-button').first()
	if (await settingsBtn.isVisible()) await settingsBtn.click()
	// Alternatively open via the "..." menu on a calendar
	const importSection = page.locator('text=Import calendar, [aria-label*="import"]').first()
	await importSection.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/calendar_importing')
})

test('Calendar — calendar context menu (pen icon)', async ({ page }) => {
	await openCalendar(page)
	// Hover over the "Personal" calendar row to reveal the pen/edit icon
	const calRow = page.locator('.calendar-nav-entry, .app-navigation-entry').filter({ hasText: /personal/i }).first()
	await calRow.waitFor({ state: 'visible', timeout: 10000 })
	await calRow.hover()
	// Click the three-dot or edit button
	const menuBtn = calRow.locator('button[aria-label*="Edit"], button[aria-label*="menu"], .action-item button').first()
	if (await menuBtn.isVisible()) await menuBtn.click()
	await page.waitForTimeout(300)
	const sidebar = page.locator('#app-navigation, nav').first()
	const sidebarBox = await sidebar.boundingBox()
	const rowBox = await calRow.boundingBox()
	if (sidebarBox && rowBox) {
		await page.screenshot({
			path: dest('calendar_dropdown'),
			clip: { x: sidebarBox.x, y: rowBox.y - 8, width: sidebarBox.width, height: rowBox.height + 80 },
		})
	} else {
		await docScreenshot(page, 'user/calendar_dropdown')
	}
})

test('Calendar — calendar settings popup', async ({ page }) => {
	await openCalendar(page)
	// Open the settings for the "Work" calendar (edit its name/color/etc.)
	const workRow = page.locator('.calendar-nav-entry, .app-navigation-entry').filter({ hasText: /^work$/i }).first()
	await workRow.waitFor({ state: 'visible', timeout: 10000 })
	await workRow.hover()
	const editBtn = workRow.locator('button[aria-label*="Edit"], .action-item button').first()
	if (await editBtn.isVisible()) await editBtn.click()
	// The settings popup/modal should open
	const popup = page.locator('[role="dialog"], .popover, .calendar-settings-modal').first()
	await popup.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	await page.waitForTimeout(400)
	if (await popup.isVisible()) {
		await popup.screenshot({ path: dest('calendar_settings') })
	} else {
		await docScreenshot(page, 'user/calendar_settings')
	}
})

test('Calendar — transparency checkbox in settings', async ({ page }) => {
	await openCalendar(page)
	const workRow = page.locator('.calendar-nav-entry, .app-navigation-entry').filter({ hasText: /^work$/i }).first()
	await workRow.waitFor({ state: 'visible', timeout: 10000 })
	await workRow.hover()
	const editBtn = workRow.locator('button[aria-label*="Edit"], .action-item button').first()
	if (await editBtn.isVisible()) await editBtn.click()
	const popup = page.locator('[role="dialog"], .popover, .calendar-settings-modal').first()
	await popup.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	// Scroll down in popup to the transparency checkbox
	const transparencyField = popup.locator('text=busy, input[type="checkbox"]').first()
	await transparencyField.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
	await page.waitForTimeout(300)
	if (await popup.isVisible()) {
		await popup.screenshot({ path: dest('calendar_transparency') })
	} else {
		await docScreenshot(page, 'user/calendar_transparency')
	}
})

test('Calendar — calendar sharing (empty)', async ({ page }) => {
	await openCalendar(page)
	const personalRow = page.locator('.calendar-nav-entry, .app-navigation-entry').filter({ hasText: /personal/i }).first()
	await personalRow.waitFor({ state: 'visible', timeout: 10000 })
	await personalRow.hover()
	// Find the share button (icon or button with "Share" aria-label)
	const shareBtn = personalRow.locator('button[aria-label*="Share"], button[aria-label*="share"]').first()
	if (await shareBtn.isVisible()) await shareBtn.click()
	const sharePopup = page.locator('[role="dialog"], .sharing-modal, .popover').filter({ hasText: /share/i }).first()
	await sharePopup.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	await page.waitForTimeout(400)
	if (await sharePopup.isVisible()) {
		await sharePopup.screenshot({ path: dest('calendar_sharing_1') })
	} else {
		await docScreenshot(page, 'user/calendar_sharing_1')
	}
})

test('Calendar — calendar sharing (with users)', async ({ page }) => {
	await openCalendar(page)
	const personalRow = page.locator('.calendar-nav-entry, .app-navigation-entry').filter({ hasText: /personal/i }).first()
	await personalRow.waitFor({ state: 'visible', timeout: 10000 })
	await personalRow.hover()
	const shareBtn = personalRow.locator('button[aria-label*="Share"], button[aria-label*="share"]').first()
	if (await shareBtn.isVisible()) await shareBtn.click()
	const sharePopup = page.locator('[role="dialog"], .sharing-modal, .popover').filter({ hasText: /share/i }).first()
	await sharePopup.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	// Type a user to share with
	const shareInput = sharePopup.locator('input[type="search"], input[placeholder*="user"]').first()
	if (await shareInput.isVisible()) {
		await shareInput.pressSequentially('amara', { delay: 60 })
		await sharePopup.locator('li, [role="option"]').filter({ hasText: /amara/i }).first().click({ timeout: 5000 }).catch(() => {})
		await page.waitForTimeout(600)
	}
	if (await sharePopup.isVisible()) {
		await sharePopup.screenshot({ path: dest('calendar_sharing_2') })
	} else {
		await docScreenshot(page, 'user/calendar_sharing_2')
	}
})

test('Calendar — new event popup (week view)', async ({ page }) => {
	await openCalendar(page, 'week')
	// Click in an empty slot on the next day row (avoid existing events)
	const emptySlot = page.locator('.fc-timegrid-slot:not(.fc-timegrid-slot-label)').nth(20)
	await emptySlot.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	if (await emptySlot.isVisible()) await emptySlot.click()
	await page.waitForTimeout(500)
	const popup = page.locator('.new-event-dialog, .popover, [class*="event-editor"]').first()
	await popup.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	await page.waitForTimeout(300)
	await docScreenshot(page, 'user/calendar_new-event_week')
})

test('Calendar — new event popup (month view)', async ({ page }) => {
	await openCalendar(page, 'month')
	// Click on a day cell in the future that has no events
	const dayCell = page.locator('.fc-daygrid-day:not(.fc-day-past)').nth(5)
	await dayCell.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	if (await dayCell.isVisible()) await dayCell.click()
	await page.waitForTimeout(500)
	const popup = page.locator('.new-event-dialog, .popover, [class*="event-editor"]').first()
	await popup.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	await page.waitForTimeout(300)
	await docScreenshot(page, 'user/calendar_new-event_month')
})

test('Calendar — event detail modal', async ({ page }) => {
	await openCalendar(page, 'week')
	// Navigate to June 2026 to see our seeded events
	const todayBtn = page.locator('button', { hasText: /today/i })
	await todayBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
	// Click Next week a few times to reach the Q3 Gala planning event (2026-06-10)
	for (let i = 0; i < 2; i++) {
		await page.locator('button[aria-label*="Next"], button.next').click().catch(() => {})
		await page.waitForTimeout(300)
	}
	const event = page.locator('.fc-event', { hasText: /gala|planning|sync/i }).first()
	await event.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	if (await event.isVisible()) await event.click()
	const modal = page.locator('.event-popover, [class*="event-editor"], [role="dialog"]').first()
	await modal.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/calendar_event_menu_modal')
})

test('Calendar — event three-dot menu', async ({ page }) => {
	await openCalendar(page, 'week')
	for (let i = 0; i < 2; i++) {
		await page.locator('button[aria-label*="Next"], button.next').click().catch(() => {})
		await page.waitForTimeout(300)
	}
	const event = page.locator('.fc-event', { hasText: /gala|planning|sync/i }).first()
	await event.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	if (await event.isVisible()) await event.click()
	// Open three-dot menu inside the event popover
	const moreBtn = page.locator('[role="dialog"] button[aria-label*="more"], .event-popover button[aria-label*="more"], .event-popover .action-item button').first()
	if (await moreBtn.isVisible()) await moreBtn.click()
	await page.waitForTimeout(300)
	await docScreenshot(page, 'user/calendar_event_menu')
})

test('Calendar — advanced editor (Talk room, reminders, repeat)', async ({ page }) => {
	await openCalendar(page, 'week')
	// Click in an empty slot to open the simple editor
	const emptySlot = page.locator('.fc-timegrid-slot:not(.fc-timegrid-slot-label)').nth(24)
	if (await emptySlot.isVisible()) await emptySlot.click()
	await page.waitForTimeout(400)
	// Open the advanced editor
	const moreOptionsBtn = page.locator('button', { hasText: /more options|advanced/i }).first()
	if (await moreOptionsBtn.isVisible()) {
		await moreOptionsBtn.click()
	} else {
		// Direct navigation to a new event in the editor
		await page.goto('/apps/calendar/new')
		await page.waitForTimeout(1000)
	}
	const editor = page.locator('.editor, [class*="event-editor"], .app-content').first()
	await editor.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await page.waitForTimeout(500)
	await docScreenshot(page, 'user/calendar_accept_simple_editor')

	// Add Talk room
	const talkBtn = page.locator('button', { hasText: /talk|conversation/i }).first()
	if (await talkBtn.isVisible()) {
		await talkBtn.scrollIntoViewIfNeeded()
		await docScreenshot(page, 'user/add-talk-room')
	}

	// Reminders section
	const remindersSection = page.locator('[class*="reminder"]').or(page.getByText('Reminders', { exact: false })).first()
	if (await remindersSection.isVisible()) {
		await remindersSection.scrollIntoViewIfNeeded()
		await page.waitForTimeout(200)
		const box = await remindersSection.boundingBox()
		if (box) {
			await page.screenshot({ path: dest('calendar_event_reminders'), clip: { x: box.x - 16, y: box.y - 16, width: box.width + 32, height: box.height + 40 } })
		}
	}

	// Repeat section
	const repeatSection = page.locator('[class*="repeat"]').or(page.getByText('Repeat', { exact: false })).first()
	if (await repeatSection.isVisible()) {
		await repeatSection.scrollIntoViewIfNeeded()
		await page.waitForTimeout(200)
		const box = await repeatSection.boundingBox()
		if (box) {
			await page.screenshot({ path: dest('calendar_event_repeat'), clip: { x: box.x - 16, y: box.y - 16, width: box.width + 32, height: box.height + 40 } })
		}
	}
})

test('Calendar — attendees and invitation level', async ({ page }) => {
	await openCalendar(page, 'week')
	for (let i = 0; i < 2; i++) {
		await page.locator('button[aria-label*="Next"], button.next').click().catch(() => {})
		await page.waitForTimeout(300)
	}
	const galaEvent = page.locator('.fc-event', { hasText: /gala planning/i }).first()
	if (await galaEvent.isVisible()) {
		await galaEvent.click()
		const editBtn = page.locator('button', { hasText: /edit|pencil/i }).first()
		if (await editBtn.isVisible()) await editBtn.click()
		await page.waitForTimeout(500)
		// Scroll to attendees section
		const attendeesSection = page.locator('[class*="attendee"]').or(page.getByText('Attendees', { exact: false })).first()
		if (await attendeesSection.isVisible()) {
			await attendeesSection.scrollIntoViewIfNeeded()
			await page.waitForTimeout(200)
			// Click invitation level dropdown for an attendee
			const levelBtn = page.locator('[class*="participation"] button, [class*="role"] button').first()
			if (await levelBtn.isVisible()) await levelBtn.click()
			await page.waitForTimeout(300)
		}
		await docScreenshot(page, 'user/calendar_event_invitation_level')
	} else {
		await docScreenshot(page, 'user/calendar_event_invitation_level')
	}
})

test('Calendar — free/busy modal', async ({ page }) => {
	await openCalendar(page, 'week')
	for (let i = 0; i < 2; i++) {
		await page.locator('button[aria-label*="Next"], button.next').click().catch(() => {})
		await page.waitForTimeout(300)
	}
	const galaEvent = page.locator('.fc-event', { hasText: /gala planning/i }).first()
	if (await galaEvent.isVisible()) {
		await galaEvent.click()
		const editBtn = page.locator('button', { hasText: /edit/i }).first()
		if (await editBtn.isVisible()) await editBtn.click()
		await page.waitForTimeout(500)
		// Click "Find a time" / free-busy button
		const findTimeBtn = page.locator('button', { hasText: /find a time|free.?busy/i }).first()
		if (await findTimeBtn.isVisible()) {
			await findTimeBtn.click()
			await page.waitForTimeout(800)
			await docScreenshot(page, 'user/calendar_free_busy_modal')
		} else {
			await docScreenshot(page, 'user/calendar_free_busy_modal')
		}
	} else {
		await docScreenshot(page, 'user/calendar_free_busy_modal')
	}
})

test('Calendar — attachments section in editor', async ({ page }) => {
	await openCalendar(page, 'week')
	// Open new event advanced editor
	const emptySlot = page.locator('.fc-timegrid-slot:not(.fc-timegrid-slot-label)').nth(28)
	if (await emptySlot.isVisible()) await emptySlot.click()
	await page.waitForTimeout(400)
	const moreOptionsBtn = page.locator('button', { hasText: /more options|advanced/i }).first()
	if (await moreOptionsBtn.isVisible()) await moreOptionsBtn.click()
	else await page.goto('/apps/calendar/new')
	await page.waitForTimeout(800)
	// Scroll to attachments section
	const attachSection = page.locator('[class*="attachment"]').or(page.getByText('Attachment', { exact: false })).first()
	if (await attachSection.isVisible()) {
		await attachSection.scrollIntoViewIfNeeded()
		await page.waitForTimeout(300)
		const box = (await attachSection.isVisible()) ? await attachSection.boundingBox() : null
		if (box) {
			await page.screenshot({ path: dest('calendar_adding_attachments'), clip: { x: box.x - 16, y: box.y - 16, width: box.width + 32, height: box.height + 48 } })
		} else {
			await docScreenshot(page, 'user/calendar_adding_attachments')
		}
	} else {
		await docScreenshot(page, 'user/calendar_adding_attachments')
	}
})

test('Calendar — attachments default folder in settings', async ({ page }) => {
	await openCalendar(page)
	// Open calendar settings panel
	const settingsBtn = page.locator('#app-navigation button[aria-label*="Settings"], #app-navigation .settings-button').first()
	if (await settingsBtn.isVisible()) await settingsBtn.click()
	const settingsSection = page.locator('[class*="calendar-settings"], .settings-section').first()
	await settingsSection.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
	// Scroll to attachments location setting
	const attachLoc = page.locator('text=attachments location, text=attachment folder').first()
	if (await attachLoc.isVisible()) await attachLoc.scrollIntoViewIfNeeded()
	await page.waitForTimeout(400)
	if (await settingsSection.isVisible()) {
		await settingsSection.screenshot({ path: dest('calendar_attachments_location') })
	} else {
		await docScreenshot(page, 'user/calendar_attachments_location')
	}
})

test('Calendar — trash bin', async ({ page }) => {
	await page.goto('/apps/calendar/trashbin')
	await page.waitForTimeout(1000)
	// If there's no trash bin route, open via the settings panel link
	const trashLink = page.locator('a, button', { hasText: /trash/i }).first()
	if (await trashLink.isVisible()) await trashLink.click()
	await page.waitForTimeout(500)
	await docScreenshot(page, 'user/calendar_trash_bin')
})

test('Calendar — accept invitation (simple editor)', async ({ page }) => {
	await openCalendar(page, 'week')
	// Navigate forward until we see the "Volunteer briefing" event (2026-06-17)
	for (let i = 0; i < 3; i++) {
		await page.locator('button[aria-label*="Next"], button.next').click().catch(() => {})
		await page.waitForTimeout(300)
	}
	const inviteEvent = page.locator('.fc-event', { hasText: /volunteer briefing/i }).first()
	if (await inviteEvent.isVisible()) {
		await inviteEvent.click()
		await page.waitForTimeout(500)
		// The popover should show RSVP buttons (Accept / Tentative / Decline)
		const popover = page.locator('.event-popover, [class*="event-editor"], [role="dialog"]').first()
		await popover.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
		await page.waitForTimeout(300)
		await docScreenshot(page, 'user/calendar_accept_simple_editor')
		// Open advanced editor to screenshot RSVP there too
		const editBtn = popover.locator('button', { hasText: /edit|pencil/i }).first()
		if (await editBtn.isVisible()) {
			await editBtn.click()
			await page.waitForTimeout(800)
			await docScreenshot(page, 'user/calendar_accept_advanced_editor')
		}
	} else {
		await docScreenshot(page, 'user/calendar_accept_simple_editor')
		await docScreenshot(page, 'user/calendar_accept_advanced_editor')
	}
})

test('Calendar — CalDAV availability settings', async ({ page }) => {
	// CalDAV availability is in Settings > Groupware
	await page.goto('/settings/user/groupware')
	await page.locator('.section, #app-content').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await page.waitForTimeout(600)
	await docScreenshot(page, 'user/caldav_availability')
})

// ── Appointment slots ─────────────────────────────────────────────────────────

test('Calendar — new appointment slot (sidebar)', async ({ page }) => {
	await openCalendar(page)
	// Appointments section in the left sidebar
	const apptSection = page.locator('#app-navigation, nav').locator('text=Appointment, [aria-label*="Appointment"]').first()
	if (await apptSection.isVisible()) await apptSection.click()
	await page.waitForTimeout(300)
	const newApptBtn = page.locator('button', { hasText: /new appointment|add appointment/i }).first()
	await newApptBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	const sidebar = page.locator('#app-navigation, nav').first()
	const sidebarBox = await sidebar.boundingBox()
	const btnBox = (await newApptBtn.isVisible()) ? await newApptBtn.boundingBox() : null
	if (sidebarBox && btnBox) {
		await page.screenshot({
			path: dest('appointment_new'),
			clip: { x: sidebarBox.x, y: btnBox.y - 40, width: sidebarBox.width, height: btnBox.height + 80 },
		})
	} else {
		await docScreenshot(page, 'user/appointment_new')
	}
})

/** Create a new appointment slot config and return to the list page. Returns the config URL slug if readable. */
async function createAppointmentConfig(page: Page): Promise<string | null> {
	await openCalendar(page)
	const apptSection = page.locator('#app-navigation, nav').locator('text=Appointment').first()
	if (await apptSection.isVisible()) await apptSection.click()
	const newApptBtn = page.locator('button', { hasText: /new appointment/i }).first()
	if (!(await newApptBtn.isVisible())) return null
	await newApptBtn.click()
	// Fill in the name field
	const nameInput = page.locator('input[placeholder*="name"], input[aria-label*="name"]').first()
	await nameInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	if (await nameInput.isVisible()) await nameInput.fill('Q3 Planning session')
	await page.waitForTimeout(200)
	return 'created'
}

test('Calendar — appointment config basics', async ({ page }) => {
	const ok = await createAppointmentConfig(page)
	if (!ok) { await docScreenshot(page, 'user/appointment_config_basics'); return }
	// Screenshot the basics section (name, duration, description visible at top)
	const form = page.locator('.appointment-config-form, [class*="appointment"], .app-content').first()
	await form.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/appointment_config_basics')
})

test('Calendar — appointment config calendar settings', async ({ page }) => {
	const ok = await createAppointmentConfig(page)
	if (!ok) { await docScreenshot(page, 'user/appointment_config_calendar_settings'); return }
	// Scroll to / click the Calendar Settings section
	const calSection = page.locator('text=Calendar settings, [aria-label*="calendar settings"]').first()
	if (await calSection.isVisible()) {
		await calSection.scrollIntoViewIfNeeded()
		if ((await calSection.getAttribute('role')) === 'button' || (await calSection.evaluate(el => el.tagName)) === 'BUTTON') {
			await calSection.click()
		}
	}
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/appointment_config_calendar_settings')
})

test('Calendar — appointment config booking hours', async ({ page }) => {
	const ok = await createAppointmentConfig(page)
	if (!ok) { await docScreenshot(page, 'user/appointment_config_booking_hours'); return }
	const hoursSection = page.locator('text=Booking hours, text=Available hours, [aria-label*="booking hours"]').first()
	if (await hoursSection.isVisible()) {
		await hoursSection.scrollIntoViewIfNeeded()
		if ((await hoursSection.evaluate(el => el.tagName)) === 'BUTTON') await hoursSection.click()
	}
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/appointment_config_booking_hours')
})

test('Calendar — appointment config limits', async ({ page }) => {
	const ok = await createAppointmentConfig(page)
	if (!ok) { await docScreenshot(page, 'user/appointment_config_limits'); return }
	const limitsSection = page.locator('text=Limits, text=Restrictions, [aria-label*="limit"]').first()
	if (await limitsSection.isVisible()) {
		await limitsSection.scrollIntoViewIfNeeded()
		if ((await limitsSection.evaluate(el => el.tagName)) === 'BUTTON') await limitsSection.click()
	}
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/appointment_config_limits')
})

test('Calendar — appointment config additional options', async ({ page }) => {
	const ok = await createAppointmentConfig(page)
	if (!ok) { await docScreenshot(page, 'user/appointment_config_options'); return }
	const optSection = page.locator('text=Additional options, text=Options, [aria-label*="option"]').first()
	if (await optSection.isVisible()) {
		await optSection.scrollIntoViewIfNeeded()
		if ((await optSection.evaluate(el => el.tagName)) === 'BUTTON') await optSection.click()
	}
	await page.waitForTimeout(400)
	await docScreenshot(page, 'user/appointment_config_options')
})

test('Calendar — appointment public booking page', async ({ page, browser }) => {
	// Create a config via UI, save it, then visit the public booking URL as anonymous
	const ok = await createAppointmentConfig(page)
	if (!ok) {
		await docScreenshot(page, 'user/appointment_booking_1')
		await docScreenshot(page, 'user/appointment_booking_2')
		await docScreenshot(page, 'user/appointment_booking_3')
		await docScreenshot(page, 'user/appointment_booking_confirmation_dialogue')
		await docScreenshot(page, 'user/appointment_calendar_prep')
		return
	}
	// Save the appointment config
	const saveBtn = page.locator('button', { hasText: /save|create/i }).first()
	if (await saveBtn.isVisible()) await saveBtn.click()
	await page.waitForTimeout(1000)

	// After saving, the appointment should appear in the list — find a "copy link" or "share" button
	const linkBtn = page.locator('button[aria-label*="link"], button[aria-label*="copy"], a[href*="appointment"]').first()
	let bookingUrl: string | null = null
	if (await linkBtn.isVisible()) {
		const href = await linkBtn.getAttribute('href')
		if (href) bookingUrl = href.startsWith('http') ? href : `http://localhost:${process.env.SCREENSHOT_PORT || '8093'}${href}`
	}

	// Fallback: find from OCS API
	if (!bookingUrl) {
		// Try to find the appointment booking URL from the page source
		const allLinks = await page.locator('a[href*="appointment"]').all()
		for (const link of allLinks) {
			const href = await link.getAttribute('href')
			if (href && href.includes('/appointment/')) {
				bookingUrl = href.startsWith('http') ? href : `http://localhost:${process.env.SCREENSHOT_PORT || '8093'}${href}`
				break
			}
		}
	}

	if (!bookingUrl) {
		await docScreenshot(page, 'user/appointment_booking_1')
		return
	}

	// Visit the public booking page as an anonymous user
	const anonCtx = await browser.newContext({ baseURL: `http://localhost:${process.env.SCREENSHOT_PORT || '8093'}` })
	const anonPage = await anonCtx.newPage()
	await anonPage.goto(bookingUrl)
	await anonPage.locator('.appointment-booking, [class*="booking"], main').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
	await anonPage.waitForTimeout(600)
	await anonPage.screenshot({ path: dest('appointment_booking_1') })

	// Click a time slot to advance to step 2
	const timeSlot = anonPage.locator('.time-slot, button[class*="slot"], .fc-event').first()
	if (await timeSlot.isVisible()) {
		await timeSlot.click()
		await anonPage.waitForTimeout(500)
		await anonPage.screenshot({ path: dest('appointment_booking_2') })
	}

	// Fill in attendee details and advance to step 3
	const nameField = anonPage.locator('input[placeholder*="name"], input[aria-label*="name"]').first()
	const emailField = anonPage.locator('input[type="email"], input[placeholder*="email"]').first()
	if (await nameField.isVisible()) await nameField.fill('Grace Fitzgerald')
	if (await emailField.isVisible()) await emailField.fill('grace@charityfoundation.org')
	const nextBtn = anonPage.locator('button', { hasText: /next|confirm|book/i }).first()
	if (await nextBtn.isVisible()) {
		await nextBtn.click()
		await anonPage.waitForTimeout(600)
		await anonPage.screenshot({ path: dest('appointment_booking_3') })
	}

	// Confirmation dialogue
	const confirmBtn = anonPage.locator('button', { hasText: /confirm|book now/i }).first()
	if (await confirmBtn.isVisible()) {
		await confirmBtn.click()
		await anonPage.waitForTimeout(800)
		await anonPage.screenshot({ path: dest('appointment_booking_confirmation_dialogue') })
	} else {
		await anonPage.screenshot({ path: dest('appointment_booking_confirmation_dialogue') })
	}
	await anonCtx.close()
})

test('Calendar — appointment calendar prep view', async ({ page }) => {
	// After booking, the organizer sees a "prep" event before the appointment.
	// We show the calendar week view with the booked appointment visible.
	await openCalendar(page, 'week')
	// Navigate forward to find appointment events
	for (let i = 0; i < 2; i++) {
		await page.locator('button[aria-label*="Next"], button.next').click().catch(() => {})
		await page.waitForTimeout(300)
	}
	await docScreenshot(page, 'user/appointment_calendar_prep')
})

test('Calendar — appointment resulting event in calendar', async ({ page }) => {
	await openCalendar(page, 'week')
	for (let i = 0; i < 3; i++) {
		await page.locator('button[aria-label*="Next"], button.next').click().catch(() => {})
		await page.waitForTimeout(300)
	}
	await docScreenshot(page, 'user/appointment_calendar_event')
})

// ── Meeting proposals ─────────────────────────────────────────────────────────

test('Calendar — proposals list', async ({ page }) => {
	await openCalendar(page)
	// Proposals section may appear in sidebar (Calendar v6+)
	const proposalsLink = page.locator('#app-navigation a, nav a').filter({ hasText: /proposal/i }).first()
	if (await proposalsLink.isVisible()) await proposalsLink.click()
	await page.waitForTimeout(500)
	await docScreenshot(page, 'user/calendar_proposal_list')
})

test('Calendar — create proposal', async ({ page }) => {
	await openCalendar(page)
	const proposalsLink = page.locator('#app-navigation a, nav a').filter({ hasText: /proposal/i }).first()
	if (await proposalsLink.isVisible()) await proposalsLink.click()
	const newProposalBtn = page.locator('button', { hasText: /new proposal|create proposal/i }).first()
	if (await newProposalBtn.isVisible()) {
		await newProposalBtn.click()
		await page.waitForTimeout(500)
	}
	await docScreenshot(page, 'user/calendar_proposal_create')
})

test('Calendar — view proposal', async ({ page }) => {
	await openCalendar(page)
	const proposalsLink = page.locator('#app-navigation a, nav a').filter({ hasText: /^Proposals?$/i }).first()
	if (await proposalsLink.isVisible()) {
		await proposalsLink.click()
		await page.waitForTimeout(500)
	}
	await docScreenshot(page, 'user/calendar_proposal_view')
})

test('Calendar — respond to proposal', async ({ page }) => {
	await openCalendar(page)
	const proposalsLink = page.locator('#app-navigation a, nav a').filter({ hasText: /^Proposals?$/i }).first()
	if (await proposalsLink.isVisible()) {
		await proposalsLink.click()
		await page.waitForTimeout(400)
		// Click a time slot in the proposal if one exists — strict text match avoids false positives
		const voteSlot = page.locator('button[aria-label*="slot"], [data-cy*="slot"]').first()
		if (await voteSlot.isVisible({ timeout: 2000 }).catch(() => false)) await voteSlot.click()
		await page.waitForTimeout(400)
	}
	await docScreenshot(page, 'user/calendar_proposal_respond')
})
