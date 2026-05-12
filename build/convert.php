<?php

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Morris Jobke <hey@morrisjobke.de>
 * Copyright (c) 2025 Josh Richards <josh.t.richards@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * This tool extracts the code comments out of Nextcloud's
 * config/config.sample.php and creates an RST document
 */


require 'vendor/autoload.php';

//
// Defaults
//

// tag which can be invoked to copy a config description to the current position
$COPY_TAG = 'see';
// sample config file which should be parsed
$CONFIG_SAMPLE_FILE = $argv[1] ?? '../server/config/config.sample.php';
// sample config documentation file update with the processed content
$OUTPUT_FILE = $argv[2] ?? 'admin_manual/configuration/config_sample_php_parameters.rst';

/**
 * h - help
 * i - input file
 * o - output file
 * t - tag
 */
$options = getopt(
	'ht::i::o::',
	array('help', 'input-file::', 'output-file::', 'tag::'));

if (array_key_exists('h', $options) || array_key_exists('help', $options)) {
	$helptext = $argv[0] . " [OPTION] ... (all options are optional)\n\n" .
	" -h, --help                   Print this help text\n".
	" -iFILE, --input-file=FILE    Specify the input file (Default: ../server/config/config.sample.php)\n".
	" -oFILE, --output-file=FILE   Specify the output file (Default: admin_manual/configuration/config_sample_php_parameters.rst)\n".
	" -tNAME, --tag=NAME           Tag to use for copying a config entry (default: see)\n".
	"\n";
	echo $helptext;
	exit(0);
}

if (array_key_exists('t', $options)){
	$COPY_TAG = $options['t'];
} elseif (array_key_exists('tag', $options)) {
	$COPY_TAG = $options['tag'];
}

if (array_key_exists('i', $options)){
	$CONFIG_SAMPLE_FILE = $options['i'];
} elseif (array_key_exists('input-file', $options)) {
	$CONFIG_SAMPLE_FILE = $options['input-file'];
}

if (array_key_exists('o', $options)){
	$OUTPUT_FILE = $options['o'];
} elseif (array_key_exists('output-file', $options)) {
	$OUTPUT_FILE = $options['output-file'];
}

// load sample config file for processing
$sampleConfig = file_get_contents($CONFIG_SAMPLE_FILE);

// verify there is a `$CONFIG` assignment (at least the start of one) in the sample config file
$start = '$CONFIG = array('; // accept standard array syntax
if (strpos($sampleConfig, $start) === false) {
	$start = '$CONFIG = ['; // accept short array syntax
	if (strpos($sampleConfig, $start) === false) {
		echo "Could not find head of \$CONFIG array in the sample config file ($SAMPLE_CONFIG_FILE)\n";
		exit(1);
	}
}

// trim everything above the `$CONFIG` assignment (including itself) from the sample config file
$sampleConfig = substr($sampleConfig, strpos($sampleConfig, $start) + strlen($start));

// verify there is a complete `$CONFIG` assignment (at least the appearance of one) in the sample config file
$end = ');'; // accept standard array syntax
if (strrpos($sampleConfig, $end) === false) {
	$end = '];'; // accept short array syntax
	if (strpos($sampleConfig, $end) === false) {
		print "Could not find tail of \$CONFIG array in the sample config file ($SAMPLE_CONFIG_FILE)\n";
		exit(1);
	}
}

// trim the end of the `$CONFIG` assignment from the sample config file
$sampleConfig = substr($sampleConfig, 0, strrpos($sampleConfig, $end));

// split on the opener ('/**') to isolate each DocBlock in the sample config file
$blocks = explode('/**', $sampleConfig);

// output that gets written to the file
$outputDefaultSection = ''; // content for first (default) section
$outputAllOtherSections = ''; // content for all other sections

// array that holds all RST representations of all config options to copy them
$lookup = [];

// track if the current processed block is part of the DEFAULT section (first call sets
// this to true and all other sections to false)
$isDefaultSection = null;

// process each Docblock
foreach ($blocks as $block) {
	$configKey = null; // name of the config key described in the current block (if applicable)
	$doc = '';
	$code = '';

	if (trim($block) === '') {
		continue;
	}

	// add back the opener to the current block
	$block = '/**' . $block;
	$parts = explode(' */', $block);
	
	// should be exactly two parts after the split - otherwise there are
	// mistakes in the parsed block
	if (count($parts) !== 2) {
		echo "Uncommon part count found in the sample config file ($CONFIG_SAMPLE_FILE)!\n";
  		echo '<pre>';
		print_r($parts);
		echo '</pre>';
	} else {
		$doc = $parts[0] . ' */';
		$code = $parts[1];
	}

	// check if there is a config option below the comment (should be one if
	// there is a config option or none if the comment is just a heading of
	// the next section
	preg_match('!^\\s*\'([^\']*)\'!m', $block, $matches);
	if (!in_array(count($matches), array(0, 2))) {
		echo "Uncommon matches count found in the sample config file ($CONFIG_SAMPLE_FILE)!\n";
		echo '<pre>';
		print_r($matches);
		echo '</pre>';
	}

	// if there are two matches a config key was found -> set it as configKey
	if (count($matches) === 2) {
		$configKey = $matches[1];
	}

	// parse the doc block
	$factory  = \phpDocumentor\Reflection\DocBlockFactory::createInstance();
	$phpdoc = $factory->create($doc);

	// check for tagged elements to replace the tag with the actual config description
	// NOTE: Only applicable to the ALL_OTHER_SECTIONS
	$references = $phpdoc->getTagsByName($COPY_TAG);
	if (!empty($references)) {
		foreach ($references as $reference) {
			$name = $reference->getName();
			if (array_key_exists($name, $lookup)) {
				// append the element at the current position
				$outputAllOtherSections .= $lookup[$name];
			}
		}
	}
	
	// generate RST output for the current block
	$RSTRepresentation = '';
	// process section heading content blocks (i.e. categories of related config keys)
	if (is_null($configKey)) {
		// use the summary (short description) of the DocBlock as the section heading
		$heading = $phpdoc->getSummary();
		$RSTRepresentation .= "\n" . $heading . "\n";
		$RSTRepresentation .= str_repeat('-', strlen($heading)) . "\n\n";
		// use the description (long description) of the DocBlock as the section body
		$longDescription = (string) $phpdoc->getDescription();
		if (trim($longDescription) !== '') {
			$RSTRepresentation .= $longDescription . "\n\n";
		}

		/** XXX: Not really sure we need to have a DEFAULT_SECTION section versus ALL_OTHER_SECTIONS at this point
		 * (they all just use their own section header block anyhow so there isn't a real difference between them)
		 * (only difference I see: the ALL_OTHER_SECTIONS gets it own label: 
		 *   https://github.com/nextcloud/documentation/blob/4a7cb4b2ed58f11cb7b567d026588a55a506cd31/admin_manual/configuration_server/config_sample_php_parameters.rst?plain=1#L456
		 * (but also doesn't hurt to keep this for now)
   		 */
		if($isDefaultSection === null) {
			$isDefaultSection = true;
		} else {
			$isDefaultSection = false;
		}
	// process individual configKey documentation entry blocks
	} else {
		$RSTRepresentation .= "\n" . $configKey . "\n";
		$RSTRepresentation .= str_repeat('^', strlen($configKey)) . "\n\n";

		// mark as literal (code block)
		$RSTRepresentation .= "\n::\n\n";
		// trim whitespace
		$code = trim($code);
		// indent every line by 4 spaces - also trim whitespace
		// (for example: empty lines at the end)
		foreach (explode("\n", trim($code)) as $line) {
			$RSTRepresentation .= "    " . $line . "\n";
		}
		$RSTRepresentation .= "\n";

		$fullDocBlock = $phpdoc->getSummary();
		$longDescription = $phpdoc->getDescription()->render();
		if ($longDescription !== '') {
			if (str_ends_with($fullDocBlock, '::') && !str_starts_with($longDescription, '-')) {
				$fullDocBlock .=  "\n\n    " . $longDescription;
			} else {
				$fullDocBlock .=  "\n\n" . $longDescription;
			}
		}

		$deprecated = $phpdoc->getTagsByName('deprecated');
		if ($deprecated) {
			foreach ($deprecated as $deprecation) {
				$fullDocBlock .= "\n\n.. deprecated:: " . str_replace("\n", ' ', $deprecation);
			}
		}

		$fullDocBlock = formatBlocks($fullDocBlock, 'WARNING', 'warning');
		$fullDocBlock = formatBlocks($fullDocBlock, 'NOTE', 'note');

		// print description
		$RSTRepresentation .= escapeRST($fullDocBlock);
		// empty line
		$RSTRepresentation .= "\n";

		$lookup[$configKey] = $RSTRepresentation;
	}

	// place RST output for current block in the appropriate section
	if ($isDefaultSection) {
		$outputDefaultSection .= $RSTRepresentation;
	} else {
		$outputAllOtherSections .= $RSTRepresentation;
	}
}

// load existing sample config RST document for updating with new (post-processed) block content
$sampleConfigDoc = file_get_contents($OUTPUT_FILE);
$sampleConfigDocOutput = '';

$tmp = explode('DEFAULT_SECTION_START', $sampleConfigDoc);
if (count($tmp) !== 2) {
	echo "There are not exactly one DEFAULT_SECTION_START in the config doc ($OUTPUT_FILE)\n";
	exit(1);
}

// retain everything before the DEFAULT_SECTION_START
$sampleConfigDocOutput .= $tmp[0];

// append start placeholder
$sampleConfigDocOutput .= "DEFAULT_SECTION_START\n\n";

// append default section
$sampleConfigDocOutput .= $outputDefaultSection;

// append end placeholder
$sampleConfigDocOutput .= "\n.. DEFAULT_SECTION_END";

$tmp = explode('DEFAULT_SECTION_END', $tmp[1]);

if (count($tmp) !== 2) {
	echo "There are not exactly one DEFAULT_SECTION_END in the config documentation\n";
	exit(1);
}

// drop the first part (old generated documentation which should be overwritten by this script) and just process
$tmp  = explode('ALL_OTHER_SECTIONS_START', $tmp[1]);
if (count($tmp) !== 2) {
	print("There are not exactly one ALL_OTHER_SECTIONS_START in the config documentation\n");
	exit(1);
}

// retain existing middle part between DEFAULT_SECTION_END and ALL_OTHER_SECTIONS_START
$sampleConfigDocOutput .= $tmp[0];

// append start placeholder
$sampleConfigDocOutput .= "ALL_OTHER_SECTIONS_START\n\n";

// append rest of generated code
$sampleConfigDocOutput .= $outputAllOtherSections;

// drop the first part (old generated documentation which should be overwritten by this script) and just process
$tmp  = explode('ALL_OTHER_SECTIONS_END', $tmp[1]);
if (count($tmp) !== 2) {
	print("There are not exactly one ALL_OTHER_SECTIONS_END in the config documentation\n");
	exit(1);
}

// append end placeholder
$sampleConfigDocOutput .= "\n.. ALL_OTHER_SECTIONS_END";

// retain everything after the ALL_OTHERS_SECTION_END
$sampleConfigDocOutput .= $tmp[1];

// save the updated sample config RST document
file_put_contents($OUTPUT_FILE, $sampleConfigDocOutput);

/**
 */
function escapeRST(string $content): string {
	// replace all \ by \\ and return if there is no code block present
	if (strpos($content, '``') === false) {
		return str_replace('\\', '\\\\', $content);
	}

	$parts = explode('``', $content);
	foreach ($parts as $key => &$part) {
		/** just even parts are outside the code block
		* example:
		*
		* 	Test code: ``$my = $code + 5;`` shows that ...
		*
		* The code part has the id 1 and is an odd number
		*/
		if ($key % 2 == 0) {
			str_replace('\\', '\\\\', $part);
		}
	}

	return implode('``', $parts);
}

function formatBlocks(string $fullDocBlock, string $markdown, string $rst): string {
	for ($i = 0; $i < 10; $i++) {
		if (!str_contains($fullDocBlock, $markdown . ': ')) {
			break;
		}
		$offset = strpos($fullDocBlock, $markdown . ': ');

		// Check if the warning line ends with colon, indicating a list follows
		$endOfLine = strpos($fullDocBlock, "\n", $offset);
		$endOfWarningOffset = $offset;
		if ($endOfLine !== false && $fullDocBlock[$endOfLine - 1] === ':') {
			$endOfWarningOffset = $endOfLine + strlen(":\n\n");
		}


		// End of a list block
		$end = strpos($fullDocBlock, "\n\n", $endOfWarningOffset);
		if ($end === false) {
			// End of the description
			$end = strlen($fullDocBlock);
		}

		$before = substr($fullDocBlock, 0, $offset);
		$warning = substr($fullDocBlock, $offset, $end - $offset);
		$after = substr($fullDocBlock, $end);

		$warning = str_replace("\n", "\n  ", $warning);

		$fullDocBlock = $before;
		$fullDocBlock .= str_replace($markdown . ': ', "\n\n.. $rst::\n\n  ", $warning);
		$fullDocBlock .= $after;
	}
	return $fullDocBlock;
}
