Backporting
===========

.. sectionauthor:: Morris Jobke, Jos Poortvliet

General
-------

We backport important fixes and improvements from the current master release

Process
-------

1. PR needs to be merged (to master)
2. If also valid for stable version and a bug fix: ask Frank if the backport permission is granted -> add the label Backport-Request to this once the question is asked
3. Frank say yes -> remove the backport-request label and add the 7.0-current (or 8.0-current, ...) label -> this is for the testing of the next patch release
4. backport the commits via cherry-picking and add the commit sha sum within the PR
5. jennifermarks will then try to reproduce all those issues with the previous version and verify it is fixed with the next version
6. the 7.0-current is then renamed to 7.0.5 for example and the 7.0-next is renamed to 7.0-current and a new label 7.0-next is created
so if you look up the issues/PRs you directly see if they are backported and to what version



* When you ``git pull``, always ``git pull --rebase`` to avoid generating extra commits like: *merged master into master*
