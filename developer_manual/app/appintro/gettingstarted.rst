Getting Started
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `mailing list <https://mail.kde.org/mailman/listinfo/owncloud>`_ so other contributors might join in.

This tutorial uses the App Framework app, a small framework that makes developing apps easier. To use it, it has to be enabled on the apps settings page.


Get the sources
---------------
There are two ways to obtain ownCloud: 

* Using the stable version
* Using the developement version from `GitHub`_

Using stable
~~~~~~~~~~~~
`Install the current version of ownCloud <http://doc.owncloud.org/server/5.0/admin_manual/installation.html>`_.

Using development version (recommended)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

First `set up your webserver and database <http://doc.owncloud.org/server/5.0/admin_manual/installation.html>`_ (**Section**: Manual Installation - Prerequisites).

ownCloud's source is hosted on `GitHub`_. To be able to participate or check out the code You will have to sign up on `GitHub`_ and install Git. For help on git, contact the `GitHub Help Page`_.

To get started the basic git repositories need to cloned into the webserver's directory. Depending on the distro this will either be 

* **/var/www**
* **/var/www/html** 
* **/srv/http** 

and the apache user and group for the **chown** command will either be 

* **http**
* **www-data** 
* **apache**

.. code-block:: bash

  sudo chmod o+rw /var/www
  cd /var/www
  git clone https://github.com/owncloud/core.git owncloud
  git clone https://github.com/owncloud/apps.git apps
  git clone https://github.com/owncloud/3rdparty.git 3rdparty
  mkdir owncloud/data
  sudo chown -R www-data:www-data owncloud/config
  sudo chown -R www-data:www-data owncloud/data
  sudo chown -R www-data:www-data owncloud/apps
  sudo chmod -R o-rw /var/www

Now restart the apache server and get ready to `set up ownCloud`_ at http://localhost/owncloud. 

Enable debugging mode
---------------------
.. note:: Do not enable this for production! This can create security problems and is only meant for debugging and development!

To disable JavaScript and CSS caching debugging has to be enabled in :file:`owncloud/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);


This is often overwritten after a **git pull** from core. Always check :file:`owncloud/config/config.php` afterwards.

.. _GitHub: https://github.com/owncloud
.. _GitHub Help Page: https://help.github.com/
.. _set up ownCloud: http://doc.owncloud.org/server/5.0/admin_manual/installation.html


