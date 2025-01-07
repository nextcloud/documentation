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

Whenever a critical bug (i.e. security vulnerability) is fixed, it is backported to all applicable major releases and - once merged - published in the next set of maintenance releases for all still supported majors (e.g. 28.0.3 -> 28.0.4). 

Backporting Considerations
**************************

Major releases that have already been published do not need necessarily need every bug fix. Deciding what to backport is not obvious. There is some judgement involved here.

Here are some things to consider:

- Any major release that has not reached end-of-life status usually receives these backported fixes.
- Backporting even the simpliest changes has some level of risk.
- Differences among stable branches - including of shipped and third-pary apps - means there are additional variables outside of the main branch (or even versus the latest stable).
- Fixes often do not have a lot of time in the field (< 4 weeks and it's possible no one has directly interacted with the new code outside of the original developer).

Showstoppers (never backport things that cause these):

- API changes [security related matters will be handled on a case-by-case basis since they have a unique priority]

When assessing whether a bug is critical enough to backport, here are some possible questions to ask yourself:

- Is this really a bug fix? Or is it more an enhancement or a general improvement?
- Is it even applicable to a previously published major release train?
- Is that major release train still supported?
- Is it a security vulnerability? [Yes, backport it without question.]
- How well can the change be tested?
- How confident are we in the fix?
- Is the bug likely to impact many users/environments?
- Is there *any* likelihood this change could inadvertenly introduce data loss?
- Is there *any* likelihood this change could inadvertenly introduce a security matter?
- How "hairy" is the change in general?
- Are we willing to support the backport if the change breaks something unexpected in a prior release?
- Can the change be backported as-is or will it require significant reworking?
- Is the bug causing a lot of support requests or bug reports?
- Does the main tracking Issue have a lot of upvotes/subscribers/comments?
- Is it possible to take a "wait and see" attitude about backporting (i.e. continue to test the fix in main/master branch and wait one maintenance cycle to re-evaluate and only backport if further data from the field suggests its important enough and/or low-risk enough to do so)?

Use your best judgement. 

If appropriate, mention any major concerns in the backport PR so other code reviewers can consider them.

Ideally, when triggering/requesting a backport, also explain *why* the backport is necessary (if it's not obvious). This will further help reviewers.

TLDR: Backporting bug fixes to older versions of code can have unintended side effects. Not every fix needs to be backported. Use caution.

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
