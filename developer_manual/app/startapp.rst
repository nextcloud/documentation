=============
Create an app
=============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

After :doc:`you've set up the development environment <../general/devenv>` change into the Nextcloud apps directory::

    cd /var/www/nextcloud/apps

Then create a skeleton app in the `app store <https://apps.nextcloud.com/developer/apps/generate>`_.

Enable the app
--------------
The app can now be enabled on the Nextcloud apps page.

App architecture
----------------
The following directories have now been created:

* **appinfo/**: Contains app metadata and configuration
* **css/**: Contains the CSS
* **js/**: Contains the JavaScript files
* **lib/**: Contains the PHP class files of your app
* **templates/**: Contains the templates
* **tests/**: Contains the tests
