=======================
Nextcloud Documentation
=======================

|build| |netlify| |license|

.. |build| image:: https://img.shields.io/github/actions/workflow/status/nextcloud/documentation/sphinxbuild.yml?branch=master&style=flat-square
   :target: https://github.com/nextcloud/documentation/actions/workflows/sphinxbuild.yml
   :alt: Build status

.. |netlify| image:: https://img.shields.io/badge/Netlify-powered-00C7B7?style=flat-square&logo=netlify
   :target: https://www.netlify.com
   :alt: Netlify

.. |license| image:: https://img.shields.io/badge/license-CC%20BY%203.0-lightgrey?style=flat-square
   :target: https://creativecommons.org/licenses/by/3.0/deed.en_US
   :alt: License: CC BY 3.0

Documentation for Nextcloud, published at `docs.nextcloud.com <https://docs.nextcloud.com>`_.
Written in reStructuredText and built with `Sphinx <https://www.sphinx-doc.org/>`_.

New here? See `Contributing`_ below. We welcome all improvements, big or small.

Manuals
-------

This repository hosts three manuals:

* **User manual**: end-user features and workflows
* **Administration manual**: server installation, configuration, and operations
* **Developer manual**: app development, APIs, and architecture

Use the correct branch for the version you are targeting: ``master`` tracks the latest
release; ``stable<N>`` branches (e.g. ``stable32``) cover specific releases.

.. note::
   ``configuration_server/config_sample_php_parameters.rst`` is auto-generated from
   `config.sample.php in nextcloud/server <https://github.com/nextcloud/server/tree/master/config>`_.
   Do not edit it here; changes must be made upstream in the server repository.

Contributing
------------

Contributions of any size are welcome. Fixing a typo is just as valuable as writing a
new page. See `CONTRIBUTING.md <CONTRIBUTING.md>`_ for the full workflow: local setup,
branch strategy, commit format, DCO sign-off, and review process.

Quick entry points:

* **Report a problem**: `open an issue
  <https://github.com/nextcloud/documentation/issues/new/choose>`_
* **Edit on GitHub**: fork the repo and open a pull request for small fixes
* **Write locally**: set up a build environment (see `Building`_) for larger changes
* **Translate**: `help on Transifex
  <https://explore.transifex.com/nextcloud/nextcloud-user-documentation/>`_

Before writing, read the `style guide <style_guide.rst>`_.

Code of Conduct
---------------

All contributors are expected to follow the `Nextcloud Code of Conduct
<https://nextcloud.com/contribute/code-of-conduct/>`_.

Getting help
------------

* `Nextcloud community forums <https://help.nextcloud.com>`_: general Nextcloud questions
* `Documentation Talk room <https://cloud.nextcloud.com/call/uuz59j6z>`_: real-time chat
  with documentation contributors
* `GitHub Issues <https://github.com/nextcloud/documentation/issues>`_: bug reports and
  documentation gaps

Structure policy
^^^^^^^^^^^^^^^^

Once a page is created, **do not rename or move it** without adding a redirect in that
manual's ``conf.py``. External links and search-engine indexes depend on stable URLs;
treat page paths like a public API.

Spelling conventions
^^^^^^^^^^^^^^^^^^^^

* Nextcloud App Store
* synchronize (not "sync" in prose)
* Web, Web page, Web site (capitalised)

Building
--------

Quick start
^^^^^^^^^^^

.. note::
   The Python version below matches ``master``. If you are building an older
   ``stable<N>`` branch, check that branch's CI configuration for the required version
   and adjust the ``--python`` flag accordingly.

.. code-block:: bash

   git clone https://github.com/nextcloud/documentation.git
   cd documentation
   uv venv --python 3.13 && source .venv/bin/activate    # recommended
   uv pip install -r requirements.txt
   make html                                              # all manuals

Using plain Python instead::

   python3.13 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   make html

Output lands in ``<manual>/_build/html/``. Build a single manual::

   cd user_manual && make html

Autobuilding
^^^^^^^^^^^^

For a live-reloading preview while editing:

.. code-block:: bash

   uv pip install sphinx-autobuild
   cd user_manual
   make SPHINXBUILD=sphinx-autobuild html

Then open http://127.0.0.1:8000.

Translated versions (user manual only)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Build the English version first (see above).
2. Generate translation stubs::

      ../build/change_file_extension.sh

3. Build a specific language, e.g. German::

      make html-lang-de

   Output: ``_build/html/de/index.html``

.. note:: Delete ``_build/`` before switching to a different language.

PDF
^^^

The easiest path is the `VSCode DevContainer
<https://code.visualstudio.com/docs/devcontainers/containers>`_ or GitHub Codespaces;
all LaTeX dependencies are pre-installed. Open the repository in the container and run::

   cd user_manual && make latexpdf

Alternatively, use Docker directly:

.. code-block:: bash

   docker run --platform linux/amd64 \
     --volume .:/docs --interactive --tty \
     ghcr.io/nextcloud/documentation/sphinx-latex:latest bash

   # Inside the container:
   cd /docs && python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   cd user_manual && make latexpdf
   # Output: _build/latex/Nextcloud_User_Manual.pdf

For translated PDFs (user manual only), generate translation stubs first
(``../build/change_file_extension.sh``), then run ``make latexpdf-lang-de``.

.. note::
   Installing LaTeX locally is not recommended due to the large number of system
   dependencies. Use the DevContainer or Docker approach instead.

Translations
------------

`Help translate the documentation on Transifex
<https://explore.transifex.com/nextcloud/nextcloud-user-documentation/>`_.

Translation files under ``locale/`` are managed by Transifex and synced via CI.
Edit source strings in ``.rst`` files only; never edit ``locale/`` directly.

For the Transifex Sphinx integration, see the
`Transifex documentation <https://docs.transifex.com/integrations/sphinx-doc>`_.

License
-------

All documentation in this repository is licensed under the `Creative Commons
Attribution 3.0 Unported license (CC BY 3.0)
<https://creativecommons.org/licenses/by/3.0/deed.en_US>`_.
