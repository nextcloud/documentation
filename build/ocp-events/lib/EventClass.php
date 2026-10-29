<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

class EventClass {
	public function __construct(
		public readonly string $className,
		public readonly string $summary,
		public readonly string $description,
		public readonly array $sinceTags,
	) {
	}
}
