Backporting
===========

.. sectionauthor:: Morris Jobke, Jos Poortvliet

General
-------

We backport important fixes and improvements from the current master release to get them to our users faster.

Process
-------

We mostly consider bug fixes for back porting. Occasionally, important changes to the API can be backported to make it easier for developers to keep their apps working between major releases. If you think a PR is relevant for the stable release, go through these steps:

1. Make sure the PR is merged to master
2. ask Frank @karlitschek and Craig @craigpg if the code should be backported and add the label `Backport-Request <https://github.com/owncloud/core/labels/Backport-Request>`_ to the pull request
3. Frank or Craig say yes -> remove the backport-request label and add the `7.0-current <https://github.com/owncloud/core/labels/7.0-current>`_ (or 8.0-current, ...) label so the QA team can find the backported items for testing
4. backport the commits via cherry-picking and add the commit sha sum within the PR

The QA team will try to reproduce all the issues with the X.0-current tag on the relevant release and verify it is fixed by the patch release (and doesn't cause new problems). Once the patch release is out, the X.0-current label is renamed to the patch release number and a new label X.0-next is created so if you look up the issues and PRs you directly see if they were backported and to what version.

.. note:: After the 7.0.4 release, the 7.0-current label was renamed to 7.0.4 so you can now find all issues backported to that release with `this search <https://github.com/owncloud/core/issues?q=label%3A7.0.4+is%3Aclosed>`_. Everything waiting to go into 7.0.5 (with the 7.0-next tag) became tagged with 7.0-current and a new 7.0-next was created for things to go in 7.0.6.

