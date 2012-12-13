Code Reviews on github
======================

``We will start with a test phase for the next 2 month (until end of December).
The test phase will ONLY apply for the `core repository`_ at the moment.
(Other repositories are welcome to join   )
Let's see if we get any benefit from this approach.``

Linus' Law: *"given enough eyeballs, all bugs are shallow"*

Introduction
------------

In order to increase the code quality within ownCloud, developers are requested to perform code reviews.
As we are now heavily using the github platform these code review shall take place on github as well.

Precondition
------------

From now on no direct commits/pushes to master or any of the stable branches are allowed in general.
**Every code** change - **even one liners** - have to be reviewed!

How will it work?
-----------------

#. A developer will submit his changes on github via a pull request. `github:help - using pull requests`_
#. Within the pull request the developer could already name other developers (using @githubusername) and ask them for review.
#. Other developers (either named or at free will) have a look at the changes and are welcome to write comments within the comment field.
#. In case the reviewer is okay with the changes and thinks all his comments and suggestions have been take into account a :+1 on the comment will signal a positive review.
#. Before a pull request will be merged into master or the corresponding branch at least 2 reviewers need to give :+1 score.
#. In the near future we will have the `continuous integration server`_ set up to monitor pull request as well which will give an additional indicator for the quality.

Examples
--------

Please find the first good examples below!
https://github.com/owncloud/core/pull/121
https://github.com/owncloud/core/pull/146

Questions?
----------

Feel free to drop a line on the `mailing list`_ or join us on `IRC`_.

.. _core repository: https://github.com/owncloud/core
.. _github:help - using pull requests: https://help.github.com/articles/using-pull-requests
.. _continuous integration server: https://ci.tmit.eu/
.. _mailing list: https://mail.kde.org/mailman/listinfo/owncloud
.. _IRC: http://webchat.freenode.net/?channels=owncloud-dev
