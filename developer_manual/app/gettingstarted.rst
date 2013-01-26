Getting Started
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `mailing list <https://mail.kde.org/mailman/listinfo/owncloud>`_ so other contributors might join in.

This tutorial uses the appframework app, a small framework that makes developing apps easier. To use it, it has to be enabled on the apps settings page.


Getting Started
---------------
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

Now restart your apache server and get ready to set up ownCloud at http://localhost/owncloud

Enable debugging mode
---------------------
To disable JavaScript and CSS caching you'll have to turn on debugging in :file:`/var/www/owncloud/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);


.. _GitHub: https://github.com/owncloud
.. _GitHub Help Page: https://help.github.com/


Create your app
---------------
The best way to create your application is to simply modify the `apptemplateadvanced app <https://github.com/owncloud/apps/tree/master/apptemplateadvanced>`_.

To do that execute:

.. code-block:: bash

  cd /var/www/apps
  sudo cp -r apptemplateadvanced yourappname
  sudo chown -R youruser:yourgroup yourappname

To enable your app, simply link it into the apps directory:


.. code-block:: bash

  sudo ln -s /var/www/apps/yourappname /var/www/owncloud/apps/yourappname

or create a second apps directory in your :file:`/var/www/owncloud/config/config.php` (see :doc:`../core/configfile`)

.. note:: The classloader in the **tests/** directory assumes that the appframework folder is in the same directory as the yourapp. If you run your app in a different apps folder, you will need to link the appframework into the same folder where your app folder resides.

.. note:: Don't forget to enable your app and the appframework app on the apps settings page!

Now change into your app directory::

  cd /var/www/apps/yourappname


Adjust apptemplate
------------------
Certain things are still apptemplate specific and you will have to convert them to match your app.

.. todo::

  Provide some sed commands for simple transformation

The following things will need to be changed:

* In every file: AGPL Headers
* In every file: **namespace OCA\\AppTemplateAdvanced** to **namespace OCA\\YourAppName**
* :file:`dependencyinjection/dicontainer.php`: The **parent::__construct('apptemplateadvanced')** to **parent::__construct('yourappname')**
* :file:`appinfo/info.xml`: Your data
* :file:`appinfo/app.php`: the correct navigation settings
* :file:`appinfo/routes.php`: the name of the routes
* :file:`coffee/app.coffee`: the route names