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

Structure
---------

Of course, think about structure. Keep in mind that we try NOT to move or rename
pages once they are created! Lots of external sources link to our documentation,
including the indexing by search engines of course. So once you create a page with a certain
name, it has to stay in that location and with that name. Think of it as API stability
- we have to ensure things stay as they are as much as possible. Renaming or moving
is only allowed in exceptional circumstances and only when a redirect is put in place.

Editing
-------

Contributing to the documentation requires a GitHub account. Make sure you are
working in the correct branch for your version of Nextcloud or client apps.
If your edits pertain to multiple manual versions, be prepared to backport as
needed.

To edit a document, you can edit the .rst files on your local system, or work
directly on GitHub. The latter is only suitable for small fixes and improvements
because substantial editing efforts can better be controlled on your local PC.

The best way is to install a complete Sphinx build environment and work on your
local PC. You will be able to make your own local builds, which is the fastest
and best way to preview for errors. Sphinx will report syntax errors, missing
images, and formatting errors. The GitHub preview is not complete and misses
many mistakes. Create a new branch against the master or stable branch you are
editing, make your edits, then push your new branch to GitHub and open a new PR.

To edit on GitHub, fork the repository (see top-right of the screen, under
your username). You will then be able to make changes easily. Once done,
you can create a pull request and get the changes reviewed and back into
the official repository.

When editing either on your own local PC or on GitHub, be sure to sign of
commits, to certify adherence to the Developer Certificate of Origin,
see https://github.com/probot/dco . Your commit messages need to have,
the name and email address of the contributor.

  Signed-off-by: Awesome Contributor <awesome.contributor@reach.me>

If using the command line and your name and email are configured, you can use

  git commit -s -m 'Commit message'

In both settings be sure that your email address matches that in your GitHub profile,
which if you have privacy enabled will be github.username@users.noreply.github.com


Translations
------------

`Help translate the documentation <https://www.transifex.com/nextcloud/nextcloud-user-documentation/dashboard/>`_.

For developers that want to ease the translation process, please read `this documentation <https://docs.transifex.com/integrations/sphinx-doc>`_.

Building
--------

Nightly Automated Build Steps
=============================

1.  **Fetch sources**
   1.  ``git clone https://github.com/nextcloud/documentation.git``
   2.  ``cd documentation``
   3.  ``git checkout <branch name>``
2.  **Install**
   1.  ``npm install svgexport -g --unsafe-perm=true``
   2.  ``pip3 install -r requirements.txt``
   3.  ``make all``


Building HTML
=============

Using pipenv
^^^^^^^^^^^^

1. Install ``pipenv`` - https://pipenv.readthedocs.io/en/latest/
2. Change into the environment: ``pipenv shell``
3. Install the dependencies ``pip install -r requirements.txt``
4. Now you can use ``make ...`` to build all the stuff - for example ``make html`` to build the HTML flavor of all manuals
   The build assets will be put into the individual documentation subdirectories like ``developer_manual/_build/html/com``

To change into this environment you need to run ``pipenv shell`` to launch the shell and to exit you can use either ``exit`` or ``Ctrl`` + ``D``.

Using venv
^^^^^^^^^^

1. Install ``python3-venv``
2. Only once: Create a venv (typically inside this repository): ``python -m venv venv``
3. Activate the environment (inside this repository): ``source venv/bin/activate``
4. Install the dependencies ``pip install -r requirements.txt``
5. Now you can use ``make ...`` to build all the stuff - for example ``make html`` to build the HTML flavor of all manuals
   The build assets will be put into the individual documentation subdirectories like ``developer_manual/_build/html/com``

Autobuilding
^^^^^^^^^^^^

When editing the documentation installing ``sphinx-autobuild`` though pip can be helpful. This will watch file changes and automatically reload the html preview:

1. Install ``pip install sphinx-autobuild``
2. When building the developer documentation make sure to execute ``make openapi-spec`` in the repository root
3. Enter the documentation section ``cd user_manual``
4. Watch for file changes ``make SPHINXBUILD=sphinx-autobuild html``
5. Open http://127.0.0.1:8000 in the browser and start editing

Building PDF
============

1. Follow instructions for "Building HTML" above
2. Install ``latexmk`` and ``texlive-latex-extra`` - https://pipenv.readthedocs.io/en/latest/
3. Create a Python environment (typically inside this repository): ``pipenv --python 3.9``
4. Change into the environment: ``pipenv shell``
5. Install the dependencies ``pip install -r requirements.txt``
6. Now you can use ``make ...`` to build all the stuff - for example ``make pdf`` to build the PDF flavor of all manuals

Using the VSCode DevContainer
=============================

This repository contains a full-featured `VSCode DevContainer <https://code.visualstudio.com/docs/devcontainers/containers>`_.
You can use it in your local development environment or via `GitHub Codespaces <https://github.com/features/codespaces>`_.
Just open the container an use one of the commands from above to build the project. For example ``make`` to build the full
documentation, ``make html`` to build the HTML documentation or ``make pdf`` to build the PDF documentation. You can also use
``make SPHINXBUILD=sphinx-autobuild html`` in combination with `port forwarding <https://code.visualstudio.com/docs/devcontainers/containers#_forwarding-or-publishing-a-port>`_
to  watch file changes and automatically reload the html preview.

Icons
-----

To compile and update the icons list in the designer manual, you will also need

1. inkscape
2. sass
3. unzip
4. wget

.. _CC BY 3.0: https://creativecommons.org/licenses/by/3.0/deed.en_US
.. _`Xcode command line tools`: https://stackoverflow.com/questions/9329243/xcode-install-command-line-tools
