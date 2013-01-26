Contribution Guidelines
=======================

How you can contribute:
-----------------------

* `Report an issue on our bug tracker`_
* :ref:`Translate ownCloud to your language<translation>` 
* Help coding (see below) and check the `Junior Jobs`_
* :ref:`Develop Apps<getting_started>`, if you're looking for ideas you can
  check what users reported at the `App Opportunities Page`_.  Help out with the
  website and write documentation (contact tpn or deryo in the irc channel)
* Spread the word, tell your friends about it, write a blog post!

If you have any questions, `we are happy to help you`_.

Set up your development environment
-----------------------------------

#. Install git, for example by: ``sudo apt-get install git``
#. The following folder structure is suggested:

   .. code-block:: bash
  
      /path/to/webserver/owncloud - core repo
      /path/to/webserver/apps - apps repo
      /path/to/webserver/3rdparty - 3rdparty repo

   - Open a terminal and:

   .. code-block:: bash

      cd /path/to/webserver
      git clone https://github.com/owncloud/core ./owncloud
      git clone https://github.com/owncloud/apps
      git clone https://github.com/owncloud/3rdparty

   - ownCloud will automatically detect the 3rdparty folder if it's either in /path/to/webserver/owncloud or in /path/to/webserver/.
#. If you want to use an app from the app repository, you have to `setup multiple app directories`_ or symlink each app like e.g.
   
   .. code-block:: bash
     
      ln -s /path/to/webserver/apps/news /path/to/webserver/owncloud/apps/news
#. `Install ownCloud`_
#. Dive into the code!

If you are new to git, do the `git crash course`_.

Contribution guidelines
-----------------------

* We use `Github`_, get an account there and clone the ownCloud repository
* Please check `our planning page`_ and ideally communicate your ideas to the `mailing list`_
* fixes go directly to master, nevertheless they need to be tested thoroughly
* new features are always developed in a branch and only merged to master once they are fully done
* when you are finished, use the merge request function on Gitorious. The other developers will look at it and give you feedback. Ideally also post your merge request to the mailing list to let people know.
* when you ``git pull``, always git ``pull --rebase`` to not generate extra commits like: *merged master into master*
* We need a signed contributor agreement from you to commit into the core repository. But no worries. It' a nice one.  All the information is `here`_

Design guidelines
-----------------

* Software should work. Only put features into master when they are complete. It's better to not have a feature instead of having one that works poorly.
* Software should get out of the way. Do things automatically instead of offering configuration options.
* Software should be easy to use. Show only the most important elements. Secondary elements only on hover or via Advanced function.
* User data is sacred. Provide undo instead of asking for confirmation `which might be dismissed`_.
* The state of the application should be clear. If something loads, provide feedback.
* Do not adapt broken concepts (for example design of desktop apps) just for the sake of consistency. We provide a better interface.
* Regularly reset your installation to see how the first-run experience is like. And improve it.
* Ideally do `usability testing`_ to know how people use the software.
* For further UX principles, read `Alex Faaborg from Mozilla`_.

Coding guidelines
-----------------

* use tabs, not spaces
* java doc style documentation always required!
* function names in camelCase starting with a lower character
* class names are CamelCase starting with an upper case character
* opening brackets in the same line as the statement
* closing brackets in a sepearate line
* no global variables
* no global functions
* double quotes in HTML, single quotes in JavaScript & PHP
* HTML should be HTML5 compliant
* CSS in single-line notation
* provide unit tests


.. _Report an issue on our bug tracker: https://github.com/owncloud/core/issues
.. _Junior Jobs: http://owncloud.org/dev/junior-jobs/
.. _App Opportunities Page: http://bugs.owncloud.org/thebuggenie/owncloud/issues/find/saved_search/4/search/1
.. _we are happy to help you: http://owncloud.org/contact/
.. _setup multiple app directories: https://github.com/owncloud/documentation/blob/master/developer_manual/configfile.rst
.. _git crash course: http://git-scm.com/course/svn.html
.. _Github: https://github.com/owncloud
.. _our planning page: http://gitorious.org/owncloud/pages/Home
.. _mailing list: https://mail.kde.org/mailman/listinfo/owncloud
.. _here: http://owncloud.org/about/contributor-agreement/
.. _which might be dismissed: http://www.alistapart.com/articles/neveruseawarning/
.. _usability testing: http://jancborchardt.net/usability-in-free-software
.. _Alex Faaborg from Mozilla: http://uxmag.com/articles/quantifying-usability
.. _Install ownCloud: http://doc.owncloud.org/server/4.5/admin_manual/installation.html 
