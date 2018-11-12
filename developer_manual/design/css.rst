.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>
..  _css:

=============
SCSS
=============

Since the version 12 of Nextcloud, we support ``SCSS`` natively.
You can migrate your files by simply renaming your ``.css`` files to ``.scss``.
The server will automatically compile, cache and and serve it.
The priority goes to the scss file. So having two file with the same name and a ``scss`` & ``css`` extension
will ensure a retro compatibility with <12 versions as scss files will be ignored by the server.

..  _cssvars:

=============
CSS variables
=============

Since Nextcloud 14 app developers should use CSS4 variables for using the values that Nextcloud defines. This way you can be sure that the theming and accessibility app can dynamically adjust the values to their needs.

A list of available variables is available in the server repo:
https://github.com/nextcloud/server/blob/master/core/css/css-variables.scss


..  _cssicons:

=============
Icons
=============

Since nextcloud 14, we added some scss mixins and functions to add and manage svg icons.

This function need to be use to add a background-image. It create a list of every icons used in nextcloud and create an associated list of variables.
This allow us to revert the colours of the svgs when using the dark theme.

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

More informations about the :ref:`svg color api <svgcolorapi>`.


The ``icon-black-white`` mixin is a shortand to the ``icon-color`` function but it generates twwo set of icons with the suffixe ``-white`` and without (default black).


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


