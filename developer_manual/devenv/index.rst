.. _devenv:

=======================
Development Environment
=======================

Please follow the steps on this page to set up your development environment.

Set up web server and database
------------------------------

First `set up your webserver and database <http://doc.owncloud.org/server/5.0/admin_manual/installation.html>`_ (**Section**: Manual Installation - Prerequisites).

Get the source
--------------

There are two ways to obtain ownCloud sources: 

* Using the `stable version <http://doc.owncloud.org/server/5.0/admin_manual/installation.html>`_
* Using the developement version from `GitHub`_ which will be explained below.

To check out the source from `GitHub`_ you will need to install git (see `Setting up git <https://help.github.com/articles/set-up-git>`_ from the GitHub help)

Identify the web server's directories
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To get started the basic git repositories need to cloned into the webserver's directory. Depending on the distro this will either be 

* **/var/www**
* **/var/www/html** 
* **/srv/http** 

Identify the user and group the web server is running as
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

and the apache user and group for the **chown** command will either be 

* **http**
* **www-data** 
* **apache**

Check out the code
~~~~~~~~~~~~~~~~~~

The following commands are using "/var/www" as the web server's directory and "www-data" as user name and group.

.. code-block:: bash

  sudo chmod o+rw /var/www
  cd /var/www
  git clone https://github.com/owncloud/core.git owncloud
  git clone https://github.com/owncloud/apps.git
  cd owncloud/
  git submodule init
  git submodule update
  mkdir data
  sudo chown -R www-data:www-data config/
  sudo chown -R www-data:www-data data/
  sudo chown -R www-data:www-data apps/
  sudo chmod -R o-rw /var/www

Now **restart the web server**.

Check out code from additional apps (optional)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you would like to develop on non-core apps, you can check them out into the `apps` directory as well.
For example for the calendar, contact and notes apps:

.. code-block:: bash

  cd /var/www
  git clone https://github.com/owncloud/calendar.git
  git clone https://github.com/owncloud/contacts.git
  git clone https://github.com/owncloud/notes.git

Set up ownCloud
~~~~~~~~~~~~~~~

Open http://localhost/owncloud (or the corresponding URL) in your web browser to set up your instance.

Start developing
~~~~~~~~~~~~~~~~

* :doc:`App Development<../app/index>`
* :doc:`Core Development<../core/index>`


.. _debugmode:

Enabling debug mode
-------------------
.. note:: Do not enable this for production! This can create security problems and is only meant for debugging and development!

To disable JavaScript and CSS caching debugging has to be enabled in :file:`owncloud/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);


This is often overwritten after a **git pull** from core. Always check :file:`owncloud/config/config.php` afterwards.

.. _GitHub: https://github.com/owncloud
.. _GitHub Help Page: https://help.github.com/
.. _set up ownCloud: http://doc.owncloud.org/server/5.0/admin_manual/installation.html

