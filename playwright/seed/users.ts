// SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

import { tryOcc, uploadAvatar, ocsRequest } from '../helpers'

const AVATAR_DIR = '/home/anna/Downloads/tp/avatar'

async function setProfileField(userId: string, key: string, value: string): Promise<void> {
	await ocsRequest('PUT', `/ocs/v2.php/cloud/users/${userId}`, userId, userId, { key, value })
}

export async function seedUsers(): Promise<void> {
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
}
