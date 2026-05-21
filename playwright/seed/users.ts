// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { tryOcc, uploadAvatar, ocsRequest } from '../helpers'

const AVATAR_DIR = '/home/anna/Downloads/tp/avatar'

/** Set a profile field (org, role, phone, etc.) as the user themselves. */
async function setProfileField(userId: string, key: string, value: string): Promise<void> {
	await ocsRequest('PUT', `/ocs/v2.php/cloud/users/${userId}`, userId, userId, { key, value })
}

/** Set email via admin — users cannot change their own email through the OCS API. */
async function setEmail(userId: string, email: string): Promise<void> {
	await ocsRequest('PUT', `/ocs/v2.php/cloud/users/${userId}`, 'admin', 'admin', { key: 'email', value: email })
}

export async function seedUsers(): Promise<void> {
	await tryOcc('user:add --password-from-env --display-name="Christine Schott" christine', { OC_PASS: 'christine' })
	await uploadAvatar(`${AVATAR_DIR}/christine/avatar.png`, 'christine', 'christine')
	await setEmail('christine', 'c.schott@example.org')
	await setProfileField('christine', 'organisation', 'Charity Events Foundation')
	await setProfileField('christine', 'role', 'Event Manager')
	await setProfileField('christine', 'phone', '+44 20 7946 0001')

	await tryOcc('user:add --password-from-env --display-name="Amara Winterbourne" amara_w', { OC_PASS: 'amara_w' })
	await uploadAvatar(`${AVATAR_DIR}/amara_w/avatar.png`, 'amara_w', 'amara_w')
	await setEmail('amara_w', 'amara@example.org')
	await setProfileField('amara_w', 'organisation', 'Development Committee')
	await setProfileField('amara_w', 'role', 'Event Coordinator')
	await setProfileField('amara_w', 'phone', '+44 20 7946 0100')

	await tryOcc('user:add --password-from-env --display-name="Lila Hawthorne" lila_h', { OC_PASS: 'lila_h' })
	await uploadAvatar(`${AVATAR_DIR}/Lila_Hawthorne/avatar.png`, 'lila_h', 'lila_h')
	await setEmail('lila_h', 'lila@example.org')
	await setProfileField('lila_h', 'organisation', 'Greenleaf Catering Co.')
	await setProfileField('lila_h', 'role', 'Account Manager')

	await tryOcc('user:add --password-from-env --display-name="Malik Santiago" malik_s', { OC_PASS: 'malik_s' })
	await uploadAvatar(`${AVATAR_DIR}/Malik_Santiago/avatar.png`, 'malik_s', 'malik_s')
	await setEmail('malik_s', 'malik@example.org')
	await setProfileField('malik_s', 'organisation', 'AV Solutions Ltd')
	await setProfileField('malik_s', 'role', 'Senior Technician')

	await tryOcc('user:add --password-from-env --display-name="Kieran Patel" kieran_p', { OC_PASS: 'kieran_p' })
	await uploadAvatar(`${AVATAR_DIR}/Kieran_Patel/avatar.png`, 'kieran_p', 'kieran_p')
	await setEmail('kieran_p', 'kieran@example.org')
	await setProfileField('kieran_p', 'organisation', 'Charity Events Foundation')
	await setProfileField('kieran_p', 'role', 'Graphic Designer')

	await tryOcc('user:add --password-from-env --display-name="Seraphina Delgado" seraphina_d', { OC_PASS: 'seraphina_d' })
	await uploadAvatar(`${AVATAR_DIR}/Seraphina_Delgado/avatar.png`, 'seraphina_d', 'seraphina_d')
	await setEmail('seraphina_d', 'seraphina@example.org')
	await setProfileField('seraphina_d', 'organisation', 'Charity Events Foundation')
	await setProfileField('seraphina_d', 'role', 'Volunteer Coordinator')

	await tryOcc('user:add --password-from-env --display-name="Adrian Lelievre" adrian_l', { OC_PASS: 'adrian_l' })
	await uploadAvatar(`${AVATAR_DIR}/Adrian_Lelievre/avatar.png`, 'adrian_l', 'adrian_l')
	await setEmail('adrian_l', 'adrian@example.org')
	await setProfileField('adrian_l', 'organisation', 'Riverside Pavilion')
	await setProfileField('adrian_l', 'role', 'Venue Decorator')

	await tryOcc('user:add --password-from-env --display-name="Charlotte McGraw" charlotte_m', { OC_PASS: 'charlotte_m' })
	await uploadAvatar(`${AVATAR_DIR}/CharlotteMcGraw/avatar.png`, 'charlotte_m', 'charlotte_m')
	await setEmail('charlotte_m', 'charlotte@example.org')
	await setProfileField('charlotte_m', 'organisation', 'Charity Events Foundation')
	await setProfileField('charlotte_m', 'role', 'Finance Officer')

	await tryOcc('user:add --password-from-env --display-name="Orion Gallagher" orion_g', { OC_PASS: 'orion_g' })
	await uploadAvatar(`${AVATAR_DIR}/Orion_Gallagher/avatar.png`, 'orion_g', 'orion_g')
	await setEmail('orion_g', 'orion@example.org')
	await setProfileField('orion_g', 'organisation', 'Charity Events Foundation')
	await setProfileField('orion_g', 'role', 'Ticketing Lead')

	await tryOcc('user:add --password-from-env --display-name="Analise Laviss" analise_l', { OC_PASS: 'analise_l' })
	await uploadAvatar(`${AVATAR_DIR}/Analise_Laviss/avatar.png`, 'analise_l', 'analise_l')
	await setEmail('analise_l', 'analise@example.org')
	await setProfileField('analise_l', 'organisation', 'Charity Events Foundation')
	await setProfileField('analise_l', 'role', 'Board Secretary')
}
