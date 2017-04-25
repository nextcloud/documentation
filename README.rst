=======================
Nextcloud Documentation
=======================

Documentation is published on `<https://docs.nextcloud.com>`_.

The `documentation Wiki <https://github.com/nextcloud/documentation/wiki>`_ is
available for tips, tricks, edge cases, and anyone who wants to contribute more
easily, without having to learn Git and Sphinx.

See the `Style Guide <https://github.com/nextcloud/documentation/blob/master/style_guide.rst>`_ for formatting and style conventions.

Manuals
-------

This repository hosts four manuals:

* **Users' Manual**
* **Administration Manual**
* **Developers Manual**

Please work in the appropriate branch: ``stable9`` is 9.0, ``stable10`` is 10.0, ``stable11`` is 11.0 and ``master`` is version 12.0.

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

.. _CC BY 3.0: http://creativecommons.org/licenses/by/3.0/deed.en_US

Style
-----

Source files are written using the `Sphinx Documentation Generator
<http://sphinx.pocoo.org/>`_. The syntax follows the `reStructuredText
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

Building
--------

Linux / OS X
^^^^^^^^^^^^

First, make sure that the following are installed:

* Python 2 (2.6.0 or better, Python 3 is not yet supported!)
* Python Image Library (PIL) - (the package is called something like ``python-pillow``)
* Sphinx (e.g. ``sudo yum install python-sphinx``),
  on Mac: ``sudo easy_install Sphinx``
* Sphinx PHPDomain (e.g. ``sudo easy_install sphinxcontrib-phpdomain``)
* rst2pdf (e.g. ``sudo easy_install rst2pdf``)
* If you're on Arch Linux, the build script is called sphinx-build2 which
  will fail. You will need to provide a link to the expected script name::

     sudo ln -s /usr/bin/sphinx-build2 /usr/bin/sphinx-build

...then enter any manual directory, then run ``make html``. The result can
be found in the ``_build/html`` subdirectory.  PDFs can be built with the
``make latexpdf`` command and are found in _build/latex/ directory.

The openSUSE way
~~~~~~~~~~~~~~~~
* sudo zypper in python-Sphinx
* sudo zypper in python-rst2pdf
* sudo zypper in python-sphinxcontrib-phpdomain # requires repository "devel:languages:python"
* sudo zypper in pdfjam   # pull in latexpdf and all of texlive
* sudo zypper in texlive-threeparttable
* sudo zypper in texlive-wrapfig
* sudo zypper in texlive-multirow
* cd user_manual
* make latexpdf
* okular _build/latex/NextcloudUserManual.pdf

The Debian/Ubuntu way
~~~~~~~~~~~~~~~~~~~~~
* sudo apt-get install python-pil
* sudo apt-get install python-sphinx
* sudo apt-get install python-sphinxcontrib.phpdomain
* sudo apt-get install rst2pdf
* sudo apt-get install texlive-fonts-recommended
* sudo apt-get install texlive-latex-extra
* sudo apt-get install texlive-latex-recommended
* cd user_manual
* make latexpdf
* evince _build/latex/NextcloudUserManual.pdf

The Arch Linux way
~~~~~~~~~~~~~~~~~~
* sudo pacman -S community/python2-rst2pdf
* sudo pacman -S community/python2-sphinx
* aur/sphinxcontrib-phpdomain from AUR
* sudo pacman -S extra/texlive-core texlive-latexextra
* cd user_manual
* make latexpdf
* PDFVIEWER _build/latex/NextcloudUserManual.pdf

Windows
^^^^^^^

Running ``setup.cmd`` will install Python 2.7 and install all dependencies.

Enter any manual and clicking the "Build HTML" shortcut will create a HTML
build. Likewise, "Build PDF" will build the PDF using the more lightweight,
but feature-incomplete RST2PDF tool. The results are in ``_build/html`` and
``_build/pdf`` respectively.

Importing Word and OpenDocument files
-------------------------------------

Sometimes, existing documentation might be in Word or LibreOffice documents. To
make it part of this documentation collection, follow these steps:

Prerequisites
^^^^^^^^^^^^^

1. Install Python 2.x
2. Install odt2sphinx (``easy_install odt2sphinx``)
3. Install GCC/clang (`Xcode command line tools`_ required on Mac OS)

Process
^^^^^^^

1. ``doc/docx`` files need to be stored as odt first
2. Run ``odt2sphinx my.docx``
3. Move the resulting ``rst`` files in place and reference them
4. Wrap text lines at 80 chars, apply markup fixes

.. _CC BY 3.0: http://creativecommons.org/licenses/by/3.0/deed.en_US
.. _`Xcode command line tools`: http://stackoverflow.com/questions/9329243/xcode-4-4-and-later-install-command-line-tools
