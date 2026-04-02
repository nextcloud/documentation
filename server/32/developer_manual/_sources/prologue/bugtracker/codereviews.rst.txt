.. _Code-reviews:

======================
Code reviews on GitHub
======================

  Given enough eyeballs, all bugs are shallow

  -- Linus' Law

Introduction
------------

In order to increase the code quality within Nextcloud, developers are requested
to perform code reviews.  As we are now heavily using the GitHub platform these
code reviews shall take place on GitHub as well.

Precondition
------------

From now on no direct commits/pushes to the main or any of the stable branches are
allowed in general.  **Every code** change - **even one liners** - have to be
reviewed!

How will it work?
-----------------

#. A developer will submit their changes on GitHub via a pull request (PR).
   `GitHub:help - using pull requests <https://help.GitHub.com/articles/using-pull-requests>`_
#. Within the pull request the developer could already name other developers (using
   @GitHubusername) and ask them for review.
#. Using Labels section on the right side, they add *"3 - To review"* label if the patch is
   complete. If they have no permission to do that, other developers may add this Label in case
   PR author had indicated.
#. Other developers (either named or at free will) have a look at the changes
   and are welcome to write comments within the comment field.
#. In case the reviewer is okay with the changes and thinks all their comments and
   suggestions have been taken into account a :+1 on the comment will signal a positive
   review.
#. Before a pull request will be merged into the main corresponding stable branch
   at least 2 reviewers need to give :+1 score.
#. Our continuous integration server will give an additional indicator for
   the quality of the pull request (the results can be accessed from the GitHub
   interface for that pull request).

Examples
--------
Read our documentation about :doc:`../../getting_started/coding_standards/index` for information
on what a good pull request and good Nextcloud code looks like.

These are two examples that are considered to be good examples of how pull
requests should be handled

* https://github.com/owncloud/core/pull/121
* https://github.com/owncloud/core/pull/146

Questions?
----------

Feel free to drop a line on the `forums`.

.. _forums: https://help.nextcloud.com/
