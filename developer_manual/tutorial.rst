App Tutorial
============

This will teach you how to get develop your own owncloud app.

Before you start, please check if there already is a similar app you could contribute to. Also, feel free to communicate your idea and plans to the mailing list so other contributors might join in (https://mail.kde.org/mailman/listinfo/owncloud).


Getting Started
---------------
To get started you'll need to clone the basic git repositories into your web directory. Depending on your distro this will either be :file:`/var/www or` :file:`/srv/http`

.. code-block:: bash
  
  sudo chmod a+rw /var/www  # only do this on your dev machine!
  cd /var/www
  git clone https://github.com/owncloud/core.git owncloud
  git clone https://github.com/owncloud/apps.git apps
  git clone https://github.com/owncloud/3rdparty.git 3rdparty

Now restart your apache server and get ready to set up owncloud at http://localhost/owncloud


Enable debugging mode
---------------------
To disable caching of JavaScript and CSS you'll have to turn on debugging in the :file:`/var/www/owncloud/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);


Create your app
---------------
The best way to create your application is to simply use and modify the app template.

To do that execute:

.. code-block:: bash

  cd /var/www/apps
  sudo cp -r apptemplate yourappname
  sudo chown -R youruser:yourgroup yourappname

To enable your app, simply link it into the apps directory:


.. code-block:: bash

  ln -s /var/www/apps/yourappname /var/www/owncloud/apps/yourappname

or set the apps directory in your :file:`/var/www/owncloud/config.php` (see :doc:`configfile`)

Don't forget to enable it on the apps settings page!

Now change into your app directory::

  cd /var/www/apps/yourappname


Remove/Replace apptemplate specific things
------------------------------------------
Certain things are still apptemplate specific that you will have to replace for your app.

.. todo::

  Provide some sed commands for simple transformation

The following things will need to be changed:

* AGPL Headers and copyright
* **\\OC_App::getAppPath('apptemplate')** to **\\OC_App::getAppPath('yourappname')**
* **namespace OCA\\AppTemplate** to **namespace OCA\\YourAppName**
* The Classpaths in :file:`appinfo/bootstrap.php`

Metainformation
---------------
You will want to set certain metainformation for your application. To do that open the :file:`appinfo/app.php`

