<?php
/**
 * @copyright Copyright (c) 2017 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license GNU AGPL version 3 or any later version
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * This is a short example on how you can generate the API documentation for Nextcloud
 */

include __DIR__ . '/vendor/autoload.php';

use JuliusHaertl\PHPDocToRst\ApiDocBuilder;

$nextcloudSource = [
    __DIR__ . '/server/lib/public',
    __DIR__ . '/server/lib/private',
];
$destinationDirectory = __DIR__ . '/../developer_manual/api';

$apiDocBuilder = new ApiDocBuilder($nextcloudSource, $destinationDirectory);
$apiDocBuilder->setVerboseOutput(true);
$apiDocBuilder->addExtension(\JuliusHaertl\PHPDocToRst\Extension\InterfaceImplementors::class);
$apiDocBuilder->addExtension(\JuliusHaertl\PHPDocToRst\Extension\NoPrivateExtension::class);
$apiDocBuilder->addExtension(\JuliusHaertl\PHPDocToRst\Extension\GithubLocationExtension::class, [__DIR__ . '/server/', 'https://github.com/nextcloud/server', 'stable13']);
$apiDocBuilder->build();

