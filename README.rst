ownCloud Documentation
======================

This is the ownCloud documentation. It currently focuses on the server, client manuals are in the respective git repositories. Because of the complexity of the server and the split into the core and apps modules, the manuals are in this separate directory.

License
-------

All documentation in this repository is licensed under the Creative Commons Attribution 3.0 Unported license (`CC BY 3.0`_).

.. _CC BY 3.0: http://creativecommons.org/licenses/by/3.0/deed.en_US

Style
-------

It is using the `Sphinx Documentation Generator <http://sphinx.pocoo.org/>`_. The syntax follows the `reStructuredText <http://docutils.sourceforge.net/rst.html>`_ style, and can also be edited from GitHub.

For PHP documentation you'll need to get the according language domain package. The documenation for PHP source is located at http://packages.python.org/sphinxcontrib-phpdomain/reference.html

Manuals
-------

At this point, this repository hosts three manuals:

* **Users Manual:** Covers topics from an end user's Point of View
* **Administrators Manual:** Setup, Deployment, Best Practices, etc.
* **Developers Manual:** Developing Apps for ownCloud & understanding the core Architecture.

Building
--------
First make sure that these things are installed
 - Python 2
 - Sphinx (e.g. sudo yum install python-sphinx), on Mac: ``sudo easy_install Sphinx``
 - Sphinx PHPDomain (e.g. ``sudo pip install sphinxcontrib-phpdomain``)
 - If you're on Arch Linux, the build script is called sphinx-build2 which will fail. Therefore you have to provide a link::

     sudo ln -s /usr/bin/sphinx-build2 /usr/bin/sphinx-build

then enter any manual directory, then run ``make html``. The result can be found in the ``_build/html`` subdirectory.

