Getting Started With App Development
====================================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `mailing list <https://mail.kde.org/mailman/listinfo/owncloud>`_ so other contributors might join in.

This tutorial uses the App Framework app, a small framework that makes developing apps easier. To use it, it has to be enabled on the apps settings page.


Getting Started
---------------
There are two ways to obtain ownCloud: 

* Using the stable version
* Using the developement version from `GitHub`_

Using ownCloud stable
~~~~~~~~~~~~~~~~~~~~~
`Install the current version of ownCloud <http://doc.owncloud.org/server/5.0/admin_manual/installation.html>`_ and create a new directory in the **apps/** folder.  

Using ownCloud development version
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ownCloud uses `GitHub`_ for developing its code. To be able to participate or check out the code You will have to sign up on `GitHub`_ and install Git.

If you need help with Git, contact the `GitHub Help Page`_.

To get started you'll need to clone the basic git repositories into your web directory. Depending on your distro this will either be **/var/www** or **/srv/http**

.. code-block:: bash

  sudo chmod o+rw /var/www
  cd /var/www
  git clone https://github.com/owncloud/core.git owncloud
  git clone https://github.com/owncloud/apps.git apps
  git clone https://github.com/owncloud/3rdparty.git 3rdparty
  sudo chmod o-rw /var/www

Now restart your apache server and get ready to `set up ownCloud`_ at http://localhost/owncloud. 

Enable debugging mode
---------------------
To disable JavaScript and CSS caching you'll have to turn on debugging in :file:`owncloud/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);


.. note:: This is often overwritten after a **git pull** from core. Always check your :file:`owncloud/config/config.php` afterwards.

.. _GitHub: https://github.com/owncloud
.. _GitHub Help Page: https://help.github.com/
.. _set up ownCloud: http://doc.owncloud.org/server/5.0/admin_manual/installation.html


Create your app
---------------
The best way to create your application is to simply modify the `Advanced Apptemplate <https://github.com/owncloud/apps/tree/master/apptemplateadvanced>`_.

To do that simply make a copy and :ref:`modify <modify>` the Advanced Apptemplate:

.. code-block:: bash

  cd /var/www/apps
  sudo cp -r apptemplateadvanced yourappname
  sudo chown -R youruser:yourgroup yourappname

To enable your app, simply link it into the apps directory:


.. code-block:: bash

  sudo ln -s /var/www/apps/yourappname /var/www/owncloud/apps/yourappname

or create a second apps directory in your :file:`owncloud/config/config.php` (see :doc:`../core/configfile`)

.. note:: Don't forget to enable your app and the App Framework app on the apps settings page!

Now change into your app directory::

  cd /var/www/apps/yourappname


.. _modify:

Modify Advanced Apptemplate
---------------------------
You will want to replace the boilerplate code in the Apptemplate.

The following things will need to be changed:

* In every file: AGPL Headers
* In every file: **namespace OCA\\AppTemplateAdvanced** to **namespace OCA\\YourAppName**
* :file:`dependencyinjection/dicontainer.php`: The **parent::__construct('apptemplateadvanced')** to **parent::__construct('yourappname')**
* :file:`appinfo/info.xml`: :ref:`your personal settings <xml>`
* :file:`appinfo/app.php`: the correct navigation settings
* :file:`appinfo/routes.php`: the name of the routes
* :file:`coffee/app.coffee`: the route names

.. todo::

  Provide some sed commands for simple transformation
