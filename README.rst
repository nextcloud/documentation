=======================
Nextcloud Documentation
=======================

Documentation is published on `<https://docs.nextcloud.com>`_.
To edit it yourself, you need to tinker a bit with Git and Sphinx.
See the `Style Guide <https://github.com/nextcloud/documentation/blob/master/style_guide.rst>`_ for formatting and style conventions.

Manuals
-------

This repository hosts three manuals:

* **Users' Manual**
* **Administration Manual**
* **Developers Manual**

Please work in the appropriate branch: ``stable``-branches are for the respective release (e.g. 14.0 or 15.0), ``master`` is the latest version.

Please wrap lines at 80 characters.

.. note:: ``configuration_server/config_sample_php_parameters.rst`` is auto-generated from the core
   config.sample.php file; changes to this file must be made in core `<https://github.com/nextcloud/server/tree/master/config>`_

Spelling and Capitalization Conventions
---------------------------------------

As this grows it may be moved to its own page.

* Nextcloud App Store
* synchronize
* Web (Web page, Web site)

License
-------

All documentation in this repository is licensed under the Creative Commons
Attribution 3.0 Unported license (`CC BY 3.0`_).

.. _CC BY 3.0: https://creativecommons.org/licenses/by/3.0/deed.en_US

Style
-----

Source files are written using the `Sphinx Documentation Generator
<https://www.sphinx-doc.org/en/master/>`_. The syntax follows the `reStructuredText
<http://docutils.sourceforge.net/rst.html>`_ style, and can also be edited
from GitHub.

Editing
-------

Contributing to the documentation requires a Github account. Make sure you are
working in the correct branch for your version of Nextcloud or client apps.
If your edits pertain to multiple manual versions, be prepared to backport as
needed.

To edit a document, you can edit the .rst files on your local system, or work
directly on Github. The latter is only suitable for small fixes and improvements
because substantial editing efforts can better be controlled on your local PC.

The best way is to install a complete Sphinx build environment and work on your
local PC. You will be able to make your own local builds, which is the fastest
and best way to preview for errors. Sphinx will report syntax errors, missing
images, and formatting errors. The Github preview is not complete and misses
many mistakes. Create a new branch against the master or stable branch you are
editing, make your edits, then push your new branch to Github and open a new PR.

To edit on Github, fork the repository (see top-right of the screen, under
your username). You will then be able to make changes easily. Once done,
you can create a pull request and get the changes reviewed and back into
the official repository.

Translations
------------

[Help translate the documentation](https://www.transifex.com/indiehosters/nextcloud-user-documentation/dashboard/).

For developers that want to ease the translation process, please read [this documentation](https://docs.transifex.com/integrations/sphinx-doc).

Building
--------

1. Install `pipenv` - https://pipenv.readthedocs.io/en/latest/
2. Create a Python environment (typically inside this repository): `pipenv --three`
3. Change into the environment: `pipenv shell`
4. Install the dependencies `pip install -r requirements.txt`
5. Now you can use `make ...` to build all the stuff - for example `make html` to build the HTML flavor of all manuals

To change into this environment you need to run `pipenv shell` to launch the shell and to exit you can use either `exit` or `Ctrl` + `D`.

When editing the documentation installing `sphinx-autobuild` though pip can be helpful. This will watch file changes and automatically reload the html preview:

1. Install `pip install sphinx-autobuild`
2. Enter the documentation section `cd user_manual`
3. Watch for file changes `make SPHINXBUILD=sphinx-autobuild html`
4. Open http://127.0.0.1:8000 in the browser and start editing

Icons
-----

To compile and update the icons list in the designer manual, you will also need

1. inkscape
2. sass
3. unzip
4. wget

.. _CC BY 3.0: https://creativecommons.org/licenses/by/3.0/deed.en_US
.. _`Xcode command line tools`: https://stackoverflow.com/questions/9329243/xcode-install-command-line-tools
