<?php
/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
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
 *  along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

include __DIR__ . '/vendor/autoload.php';

use Leafo\ScssPhp\Compiler;
use Leafo\ScssPhp\Formatter\Crunched;

function command_exist($cmd) {
    $return = shell_exec(sprintf("which %s", escapeshellarg($cmd)));
    return !empty($return);
}

// You need svgexport to run this script
if (!command_exist('svgexport')) {
	print("\n\nYou need svgexport to run this script.  Please install it with `npm install svgexport -g`\n\n");
	exit(1);
}

$sourceDirectory = __DIR__ . '/server';
$destinationDirectory = __DIR__ . '/../developer_manual/html_css_design/';

// Init scss compiler
$scss = new Compiler();
$scss->setImportPaths([
	__DIR__ . '/server/core/css'
]);

// Continue after throw
$scss->setIgnoreErrors(true);
$scss->setFormatter(Crunched::class);

$compiledScss = $scss->compile(
	'@import "variables.scss";' .
	'@import "functions.scss";' .
	// override the path generator function
	'@function icon-color-path($icon, $dir, $color, $version: 1, $core: false) {
		$color: remove-hash-from-color($color);
		@if $core {
			@return "/core/img/#{$dir}/#{$icon}";
		} @else {
			@return "/apps/#{$dir}/img/#{$icon}";
		}
	}'.
	'@import "icons.scss";'
);

$icons = [];
$lines = explode('}', $compiledScss);
$reIcon = '/^\.(icon-[a-z-]+)/i';
$reUrl = '/url\(\"([a-z0-9-.\/]+)/i';

print("\nParsing icons... \n");

// get all icons and urls
foreach($lines as $line) {
	if (preg_match($reIcon, $line, $matches)) {
		$icon = $matches[1];
		if (preg_match($reUrl, $line, $matches)) {
			$icons[$icon] = $matches[1];
		}
	}
}

$count = count($icons);
print(" - $count icons found!\n");
print("\nFormating rst file and converting icons... \n");

// format rst
$rst = '';
foreach($icons as $class => $icon) {
	/**
	 * removing unwanted path and removing last slash
	 * /core/img/actions/caret -> actions/caret
	 */
	$path = implode('/', array_slice(explode('/', $icon), 3, 2));
	$inPath = $sourceDirectory . $icon . '.svg';

	if (file_exists($inPath)) {
		$isWhite = substr($class, -strlen('white')) === 'white';
		if ($isWhite) {
			$path .= '-white'; //adding white suffix
		}
		$outPath = $destinationDirectory . 'img/' . $path . '.png';

		// filling the rst file
		$rst .= ".. figure:: img/$path.*\n";
		if ($isWhite) {
			$rst .= "   :class: white-icon\n";
		}
		$rst .= "   :height: 32\n";
		$rst .= "   :width: 32\n\n";
		$rst .= "   $class\n\n";

		// create directory
		$dir = implode('/', array_slice(explode('/', $destinationDirectory . 'img/' . $path), 0, -1));
		if (!file_exists($dir)) {
			print(" - creating dir $dir \n");
			mkdir($dir, 0777, true);
		}
		
		// ! can't use svg in rst
		// copy original icon
		// if (!@copy($sourceDirectory . $icon . '.svg', $destinationDirectory . 'img/' . $path . '.svg')) {
		// 	print(' - error while copying ' . $sourceDirectory . $icon . '.svg' . "\n");
		// }

		// converting
		if ($isWhite) {
			exec("svgexport $sourceDirectory$icon.svg $outPath 64: '
				circle:not([fill='none']),
				rect:not([fill=\"none\"]),
				path:not([fill=\"none\"]) {
					fill: white;
				}
				circle[stroke],
				rect[stroke],
				path[stroke] {
					stroke: white;
				}
			'");
		} else {
			exec("svgexport $sourceDirectory$icon.svg $outPath 64:");
		}
	} else {
		print(" - error while converting $inPath\n");
	}

}

print("\nWriting rst file... \n");

// write file
$file = fopen($destinationDirectory . 'icons.txt', 'w');
fwrite($file, $rst);
fclose($file);

print(" - done! \n");

// path = path.split('/')
// 	localpath = '/'.join(path[3:5])
// 	result += ".. figure:: img/" + localpath + ".*\n   :height: 32\n   :width: 32\n\n   " + icon[1:] + "\n\n"
// 	os.system('inkscape -z img/' + localpath + '.svg -e img/' + localpath + '.png')


