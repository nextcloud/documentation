Owncloud Documentation
======================

This is the ownCloud documentation. It currently focuses on the server, client manuals are in the respective git repositories. Because of the complexity of the server and the split into the core and apps modules, the manuals are in this separate directory.

Style
-------

It's using the `Sphinx Documentation Generator <http://sphinx.pocoo.org/>`_. The syntax follows the `reStructuredText <http://docutils.sourceforge.net/rst.html>`_ style, and can also be edited from GitHub.

Manuals
-------

At this point, this repository hosts three manuals:

* **Users Manual:** Covers topics from an end users Point of View
* **Administrators Manual:** Setup, Deployment, Best Practices, etc.
* **Developers Manual:** Developing Apps for ownCloud & understanding the core Architecture.

Versioning
----------

The ``master`` branch is always the development branch. If a new server version is being released, the documentation is branched.

Building
--------
First make sure that these things are installed
 - Python 2
 - Sphinx (e.g. sudo yum install python-sphinx)
 - Sphinx PHPDomain (e.g. easy_install -U sphinxcontrib-phpdomain)

then enter any manual directory, then run ``make html``. The result can be found in the ``_build/html`` subdirectory.

