<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

require __DIR__ . '/vendor/autoload.php';

$loader = new Nette\Loaders\RobotLoader;
$loader->addDirectory(__DIR__ . '/vendor/nextcloud/ocp/OCP');
$loader->setTempDirectory(sys_get_temp_dir());
$loader->register();

$loader->rebuild();
$classes = $loader->getIndexedClasses();

$eventFinder = new EventFinder($classes);
$events = $eventFinder->find();

$formatter = new ReStructuredTextFormatter();
$rest = $formatter->format($events);

file_put_contents(
	__DIR__ . '/../../developer_manual/basics/_available_events_ocp.rst',
	$rest
);
