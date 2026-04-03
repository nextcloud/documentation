Backporting
===========

.. sectionauthor:: Morris Jobke, Jos Poortvliet

General
-------

We backport important fixes and improvements from the current master release to get them to our users faster.

Process
-------

We mostly consider bug fixes for back porting. Occasionally, important changes to the API can be backported to make it easier for developers to keep their apps working between major releases. If you think a pull request (PR) is relevant for the stable release, go through these steps:

1. Make sure the PR is merged to master
2. Ask Frank (**@karlitschek**), if the code should be backported and add the label `backport-request <https://github.com/nextcloud/server/labels/backport-request>`_ to the PR
3. If Frank approves, create a new branch based on the respective stable branch (stable10 for the 10.0.x series), cherry-pick the needed commits to that branch and create a PR on GitHub.
4. Specify the corresponding milestone for that series (10.0.x-next-maintenance for the 10.0.x series) to this PR and reference the original PR in there. This enables the QA team to find the backported items for testing and having the original PR with detailed description linked.

.. note:: Before each patch release there is a freeze to be able to test everything as a whole without pulling in new changes. While this freeze is active a backport isn't allowed and has to wait for the next patch release.

The QA team will try to reproduce all the issues with the X.Y.Z-next-maintenance milestone on the relevant release and verify it is fixed by the patch release (and doesn't cause new problems). Once the patch release is out, the post-fix -next-maintenance is removed and a new -next-maintenance milestone is created for that series.
