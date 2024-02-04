===================
Development process
===================

This page gives an overview of how Nextcloud code is developed.

Source Code Version Control
---------------------------

Nextcloud uses `git <https://git-scm.com/>`_ to manage revisions of the code. Software components have their own repositories.

Branch Names
^^^^^^^^^^^^

Default branches of Nextcloud and its app repositories are named ``main`` or ``master``. Additionally, there are *stable branches* whenever a major version of Nextcloud is released. Those are named ``stableX``, where X refers to the version. For Nextcloud 25, for example, the stable branch is named ``stable25``.

Target Branches for Contributions
---------------------------------

Any changes made to the source code go into the default branch of a repository through a `pull request <https://docs.github.com/en/pull-requests>`_.

.. code-block:: bash

  # Switch to the default branch and update it
  git checkout main
  git pull origin main

  # Create the new feature branch
  git checkout -b feature/foo-bar

  # Add and commit the changes
  git add file1 file2
  git commit --signoff -m 'Add foo bar'

  # Push the new commit to the remote repository and open a pull request
  git push origin feature/foo-bar

Bugfixes
^^^^^^^^

If a contribution fixes a bug that also affects older Nextcloud or app releases, it may qualify for a *backport*. Backporting a fix means applying the change on an older version of the code. Git calls this operation *cherry picking*.

Automatic Backport
******************

In many cases the cherry pick results in a clean apply of the patch and git is able to resolve any small conflicts. In those cases it's easiest to let the `backport bot <https://github.com/nextcloud/backportbot>`_ do the backport.

See the `bot usage <https://github.com/nextcloud/backportbot#usage>`_ for its commands.

Manual Backport
***************

More complex changes may require the developer to do the backport manually. This can be done as follows:

.. code-block:: bash

  # Switch to the target branch and update it
  git checkout stable25
  git pull origin stable25

  # Create the new backport branch
  git checkout -b fix/foo-stable25

  # Cherry pick the change from the commit sha1 of the change against the default branch
  # This might cause conflicts. Resolve them.
  git cherry-pick abc123

  # Push the cherry pick commit to the remote repository and open a pull request
  git push origin fix/foo-stable25
