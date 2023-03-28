=======================
Nextcloud Documentation
=======================

.. TODO README: Add project logo

.. TODO README: Add badges

This is the documentation project for `Nextcloud server <https://github.com/nextcloud/server>`_, the safe home for all your data.

These manuals are published on `<https://docs.nextcloud.com>`_, together with the `desktop client <https://github.com/nextcloud/desktop>`_ documentation.

**Table of content**

.. contents::
   :local:
   :depth: 1
   :backlinks: top

Manuals
-------

This repository hosts the three Nextcloud server manuals:

* **Users' Manual**: `<https://github.com/nextcloud/documentation/blob/master/user_manual/>`_
* **Administration Manual**: `<https://github.com/nextcloud/documentation/blob/master/admin_manual/>`_
* **Developers' Manual**: `<https://github.com/nextcloud/documentation/blob/master/developer_manual/>`_


License
-------

All documentation in this repository is licensed under the Creative Commons Attribution 3.0 Unported license (`CC BY 3.0`_).

.. _CC BY 3.0: https://creativecommons.org/licenses/by/3.0/deed.en_US


Style
-----

Source files are written and managed using the `reStructuredText <http://docutils.sourceforge.net/rst.html>`_ markup language and the `Sphinx Documentation Generator <https://www.sphinx-doc.org/en/master/>`_.

Nextcloud has its own `Style Guide <https://github.com/nextcloud/documentation/blob/master/style_guide.rst>`_ for writing and formatting conventions that complements and adjusts basic rST and Sphinx rules.
Please read it thoroughly before submitting a contribution to the documentation as it may be rejected if it doesn't comply with the style guide.


Structure
---------

Of course, think about structure.

Keep in mind that we try NOT to move or rename pages once they are created! Lots of external sources link to our documentation, including the indexing by search engines of course.
So once you create a page with a certain name, it has to stay in that location and with that name.
Think of it as API stability - we have to ensure things stay as they are as much as possible.

Renaming or moving is only allowed in exceptional circumstances and only when a redirect is put in place.


Editing
-------

Contributing to the documentation requires a GitHub account and a bit of tinkering with `Git and GitHub <https://docs.github.com/en/get-started/quickstart/git-and-github-learning-resources>`_, as well as Sphinx.

To modify a document, there are two ways you can edit the ``.rst`` files:

* Directly on GitHub

  This is by far the easiest way as GitHub's online editing features handle most of the burden.
  By not leaving GitHub it notably automates the forking, branching, and pushing steps described below.
  But it is only suitable for small fixes and improvements.
  The GitHub preview is not complete, misses many mistakes, and substantial editing efforts can better be controlled on your local PC.

* On your local system

  The best way is to clone your GitHub fork and install a complete Sphinx build environment to work on your local PC.
  Editing files on your computer will make all the development and writing tools available to ease, speed, and improve the quality of your work.
  Building your work locally allows you to get an actual preview of it and to find errors early as Sphinx will report syntax and formatting issues, missing images, etc.

Local development workflow
^^^^^^^^^^^^^^^^^^^^^^^^^^

#. **Fork the documentation repository**

   The first thing to do is to `fork the repository <https://docs.github.com/en/get-started/quickstart/fork-a-repo>`_ to get yourself a copy with write access where you will be able to make modifications before proposing them back for merging into the upstream repository.

   .. note:: You may have to rename your fork, e.g. ``nextcloud-documentation``, if you already have a repository named 'documentation'. Anyway, this may be a good idea to keep your repository list tidy and well-sorted.

#. **Clone your fork locally**

   To leverage your toolbox, and build the documentation to preview and check your work, you have to download your fork on your local computer using the Git ``clone`` command::

      git clone https://github.com/<your_gh_username>/<fork_name>.git

   This creates a ``<fork_name>`` directory in the current folder, holding a copy of the repository with your GitHub fork set as the ``origin`` remote.

#. **Configure the upstream remote**

   To keep your work in sync with the original ``nextcloud/documentation`` repository, the latter has to be configured as the ``upstream`` remote.
   To do so, you have to run the following command::

      git remote add upstream https://github.com/nextcloud/documentation.git

   After that, you can use `git fetch upstream` to fetch any changes made to the original repository, and then merge these or rebase your work on the last commit of the base branch.

#. **Create a development branch**

   First, always make sure you are working based on the correct branch for the version of Nextcloud or the client apps you target.
   ``stable<nn>`` branches are for the respective releases (e.g. 26 or 25), and ``master`` is the latest, development version.
   If your edits pertain to multiple manual versions, be prepared to backport them to the corresponding branches as needed.

   After changing to your local clone directory, create a new branch against the master or stable branch you want to edit, and switch to it::

      cd <fork_name>
      git branch <new_branch> <base_branch>
      git checkout <new_branch>

   You can immediately upload the just-created branch to your fork on GitHub::

      git push -u origin <new_branch>

   This also sets the ``origin/<new_branch>`` as the tracking branch for your development branch so, for the following pushes, you will only have to run a simple ``git push`` to upload the commits to come.

#. **Make your edits**

   You can now make changes easily using your editor or IDE of choice, enjoying the goodness of syntax highlighting, spell checking, and other fancy features modern tools have to offer.

   .. note:: The ``admin_manual/configuration_server/config_sample_php_parameters.rst`` file is auto-generated.
      To modify this file, changes must be made to the `<https://github.com/nextcloud/server/tree/master/config/config.sample.php>`_ core file.

#. **Test and preview your modifications**

   Before committing your changes, it is good practice to build the relevant docs to verify that no build errors were introduced and that output looks like expected in the different target formats. See the Building section below to learn how to do so.

#. **Commit your work**

   When editing, either on your local PC or on GitHub, be sure to sign off commits to certify your adherence to the `Developer Certificate of Origin <https://github.com/probot/dco>`_. For this, your commit messages need to have the ``Signed-off-by`` footer with the name and email address of the contributor::

      Signed-off-by: Awesome Contributor <awesome.contributor@reach.me>

   If using GitHub directly, this must be added by hand at the bottom of the commit message.

   If working locally, using the command line and your git name and email are configured, you can use the command::

      git commit -s -m 'Commit message'

   .. note:: Your editor or IDE may have helpful settings to enable automatic sign-off globally or on a per-repository/workspace basis.

   In both settings be sure that your email address matches the one `set in your GitHub profile <https://github.com/settings/emails>`_ which, if you have private email enabled, will be ``[ID+]github.username@users.noreply.github.com``.

   .. note:: Follow the GitHub's documentation about `setting your commit email address <https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address>`_ and `blocking command line pushes that expose your personal email address <https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/blocking-command-line-pushes-that-expose-your-personal-email-address>`_ for guaranteed privacy

#. **Push your new branch to GitHub**

   Now is the time to upload your changes to GitHub by pushing your development branch up there.

   Nevertheless, work from other contributors may have been merged into the upstream branch while you were working on your local computer.
   These commits first have to be merged into your development branch before a pull request holding your own modifications can be created.
   For this, you have to:

   #. Fetch changes from upstream::

         git fetch upstream

   #. Bring changes made upstream into your development branch using Git ``rebase`` `command <https://docs.github.com/en/get-started/using-git/about-git-rebase>`_::
   
         git rebase upstream/<upstream_branch>

      .. note:: Rebasing a branch can alter the Git history, which can cause issues if other contributors have already cloned and worked on the original branch

   #. Resolve any conflicts that may arise during the rebase process and, once resolved, continue the rebase::

         git rebase --continue

   #. Finally, force push the rebased local branch to your forked repository::

         git push --force

      .. note:: Force pushing can be dangerous as it can overwrite other changes made to the remote branch by other contributors.

#. **Open a new Pull Request**

   Now that your development branch, rebased on fresh upstream, is available in your GitHub fork repository, you can `open a Pull Request <https://docs.github.com/en/pull-requests>`_ for the base branch into the ``nextcloud/documentation`` upstream repository.
   Once done, wait for your changes to be reviewed and merged into the official repository.

   If a reviewer asks for a modification, you only have to do the edit/commit/push steps again to update your branch and the attached pull request.


Translating
-----------

`Help translate the documentation <https://www.transifex.com/nextcloud/nextcloud-user-documentation/dashboard/>`_.

For developers that want to ease the translation process, please read `this documentation <https://docs.transifex.com/integrations/sphinx-doc>`_.


Building
--------

If you haven't followed the previous procedure to contribute to the documentation and, for any reason, just want to build the documentation, you first have to get its sources on your local computer::

   git clone https://github.com/nextcloud/documentation.git
   cd documentation

Setup build environment
^^^^^^^^^^^^^^^^^^^^^^^

.. FIXME README: Is setup.cmd still useful? Document usage or remove.

#. Install ``pipenv`` either using your system package manager or, as `recommended <https://pipenv.pypa.io/en/latest/installation/>`_, using ``pip``::

      pip install pipenv --user

#. If you are planning to build PDF documents, you also need to `install a TeX/LaTeX distribution <https://en.wikibooks.org/wiki/LaTeX/Installation>`_, like `TeX Live <https://www.tug.org/texlive/>`_, with the ``texlive-latex-extra`` packages collection and the ``latexmk`` utility script package.

   * Linux users can do this using their usual package managers
   * Windows users can follow the instructions given in the preceding links or, using `Chocolatey <https://chocolatey.org>`_, with a single command::

      choco install texlive --params="'/collections:latexextra /extraPackages:latexmk'"

   * macOS users can install the `MacTeX <https://tug.org/mactex/>`_ distribution, or the TeX Live distribution using Fink or MacPorts.

#. Create a Python environment (typically inside this repository)::

      pipenv --python 3.9

   .. FIXME README: Py3.9 seems old for building env!? Document pyenv usage if needed?

#. Change into the created environment::

      pipenv shell

   Modern command line prompts should now indicate the environment name.
   To exit the virtual environment, you can either type ``exit`` or ``Ctrl`` + ``D``.

#. Install the Python build dependencies::

      pip install -r requirements.txt

#. Install ``svgexport`` tool for exporting SVG files to PNG/JPEG::

      npm install svgexport -g --unsafe-perm=true

Build the docs
^^^^^^^^^^^^^^

#. Change into the environment: ``pipenv shell``
#. Switch to the docs branch you want to build ``git checkout <branch name>``
#. Now you can use the ``make <output_format>`` command to build the manuals in the different formats available. For example:

   * ``make html`` to build the HTML documentation,
   * ``make pdf`` to build the PDF flavor of all manuals, or
   * ``make all`` to build documentation in all formats

.. note:: To build a specific manual only, change into its directory instead of the repository root and run the previous commands.

Autobuild
^^^^^^^^^

When editing the documentation, ``sphinx-autobuild`` can be very helpful.
This will allow Sphinx to watch for file changes, automatically build the documentation, and reload the HTML preview:

#. If not already in there, change into the build environment::

      pipenv shell

#. Install ``sphinx-autobuild`` using ``pip``::

      pip install sphinx-autobuild

#. Change into the directory of the manual you want to build automatically::

      cd user_manual

#. Launch autobuild::

      make SPHINXBUILD=sphinx-autobuild html

#. Open http://127.0.0.1:8000 in your browser

#. Start editing and see your pages automatically updated

Using the VSCode DevContainer
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. TODO README: Extend dev container usage section

This repository contains a full-featured `VSCode DevContainer <https://code.visualstudio.com/docs/devcontainers/containers>`_ you can use in your local development environment or via `GitHub Codespaces <https://github.com/features/codespaces>`_.
Just open the container and use one of the commands from above to build the project.

You can also use ``sphinx-autobuild`` into the container in combination with `port forwarding <https://code.visualstudio.com/docs/devcontainers/containers#_forwarding-or-publishing-a-port>`_ to watch file changes and automatically reload the HTML preview.


Icons
-----

.. TODO README: Add whys and how to update the icons list

To compile and update the icons list in the designer manual, you will also need:

1. Inkscape
2. sass
3. unzip
4. wget

.. _CC BY 3.0: https://creativecommons.org/licenses/by/3.0/deed.en_US
.. _`Xcode command line tools`: https://stackoverflow.com/questions/9329243/xcode-install-command-line-tools
