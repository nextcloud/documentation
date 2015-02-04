.. _devenv:

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

=======================
Development Environment
=======================

Please follow the steps on this page to set up your development environment.

Set up web server and database
==============================

First `set up your web server and database <http://doc.owncloud.org/server/8.0/admin_manual/#installation>`_ (**Section**: Manual Installation - Prerequisites).
.. TODO ON RELEASE: Update version number above on release

Get the source
==============

There are two ways to obtain ownCloud sources: 

* Using the `stable version <http://doc.owncloud.org/server/8.0/admin_manual/#installation>`_
.. TODO ON RELEASE: Update version number above on release
* Using the development version from `GitHub`_ which will be explained below.

To check out the source from `GitHub`_ you will need to install git (see `Setting up git <https://help.github.com/articles/set-up-git>`_ from the GitHub help)

Gather information about server setup
-------------------------------------

To get started the basic git repositories need to cloned into the web server's directory. Depending on the distribution this will either be

* **/var/www**
* **/var/www/html** 
* **/srv/http** 


Then identify the user and group the web server is running as and the Apache user and group for the **chown** command will either be

* **http**
* **www-data** 
* **apache**
* **wwwrun**

Check out the code
------------------

The following commands are using **/var/www** as the web server's directory and **www-data** as user name and group.

Install the `development tool <https://github.com/owncloud/ocdev/blob/master/README.rst#installation>`_

After the development tool installation make the directory writable::

  sudo chmod o+rw /var/www
  
Then install ownCloud from git::

  ocdev setup base

Adjust rights::

  sudo chown -R www-data:www-data /var/www/core/data/
  sudo chmod o-rw /var/www


Finally restart the web server (this might vary depending on your distribution)::

  sudo systemctl restart httpd.service

or::

  sudo /etc/init.d/apache2 restart

After the clone Open http://localhost/core (or the corresponding URL) in your web browser to set up your instance.

Enabling debug mode
-------------------
.. _debugmode:

.. note:: Do not enable this for production! This can create security problems and is only meant for debugging and development!

To disable JavaScript and CSS caching debugging has to be enabled in :file:`core/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);

Keep the code up-to-date
------------------------

If you have more than one repository cloned, it can be time consuming to do the same the action to all repositories one by one. To solve this, you can use the following command template::

  find . -maxdepth <DEPTH> -type d -name .git -exec sh -c 'cd "{}"/../ && pwd && <GIT COMMAND>' \;

then, e.g. to pull all changes in all repositories, you only need this::

  find . -maxdepth 3 -type d -name .git -exec sh -c 'cd "{}"/../ && pwd && git pull --rebase' \;

or to prune all merged branches, you would execute this::

  find . -maxdepth 3 -type d -name .git -exec sh -c 'cd "{}"/../ && pwd && git remote prune origin' \;

It is even easier if you create alias from these commands in case you want to avoid retyping those each time you need them.


.. _GitHub: https://github.com/owncloud
.. _GitHub Help Page: https://help.github.com/

