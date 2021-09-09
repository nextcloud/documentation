.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>
..  _css:

====
SCSS
====

Nextcloud supports SCSS natively.
You can migrate your files by simply renaming your ``.css`` files to ``.scss``.
The server will automatically compile, cache and serve it.
The SCSS file is prioritized. Having two files with the same name and a ``scss`` & ``css`` extension
will ensure backwards compatibility with <12 versions as scss files will be ignored by the server.

..  _cssvars:


CSS variables
=============

App developers should use CSS4 variables so you get the values which Nextcloud defines. This way you can be sure that the theming and accessibility app can dynamically adjust the values.

A list of available variables is listed in the server repository:
https://github.com/nextcloud/server/blob/master/core/css/css-variables.scss


..  _cssicons:


SCSS icon mixins
================

Some SCSS mixins and functions are employed to add and manage SVG icons.

These functions need to be used to add the icons via background-image. They create a list of every icon used in Nextcloud and create an associated list of variables.
This allows us to invert the colors of the SVGs when using the dark theme.

.. code-block:: scss

	/**
	* SVG COLOR API
	* 
	* @param string $icon the icon filename
	* @param string $dir the icon folder within /core/img if $core or app name
	* @param string $color the desired color in hexadecimal
	* @param int $version the version of the file
	* @param bool [$core] search icon in core
	*
	* @returns string the url to the svg api endpoint
	*/
	@mixin icon-color($icon, $dir, $color, $version: 1, $core: false)

	// Examples
	.icon-menu {
		@include icon-color('menu', 'actions', $color-white, 1, true);
		// --icon-menu: url('/svg/core/actions/menu/ffffff?v=1');
		// background-image: var(--icon-menu)
	}
	.icon-folder {
		@include icon-color('folder', 'files', $color-black);
		// --icon-folder: url('/svg/files/folder/000000?v=1');
		// background-image: var(--icon-folder)
	}

More information about the :ref:`svg color api <svgcolorapi>`.


The ``icon-black-white`` mixin is a shortand for the ``icon-color`` function but it generates two sets of icons with the suffix ``-white`` and without (default black).


.. code-block:: scss

	/**
	* Create black and white icons
	* This will add a default black version of and an additional white version when .icon-white is applied
	*/
	@mixin icon-black-white($icon, $dir, $version, $core: false)

	// Examples
	@include icon-black-white('add', 'actions', 1, true);

	// Will result in
	.icon-add {
		@include icon-color('add', 'actions', $color-black, 1, true);
	}
	.icon-add-white,
	.icon-add.icon-white {
		@include icon-color('add', 'actions', $color-white, 1, true);
	}


