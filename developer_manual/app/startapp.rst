=============
Create an app
=============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

After :doc:`you've set up the development environment and installed the dev tool <../general/devenv>` change into the Nextcloud apps directory::

    cd /var/www/nextcloud/apps

Then run::

    ocdev startapp MyApp --email mail@example.com --author "Your Name" --description "My first app" --nextcloud 8

This will create all the needed files in the current directory. For more information on how to customize the generated app, see the `Project's GitHub page <https://github.com/nextcloud/ocdev>`_ or run::

    ocdev startapp -h

Enable the app
--------------
The app can now be enabled on the Nextcloud apps page

App architecture
----------------
The following directories have now been created:

* **appinfo/**: Contains app metadata and configuration
* **css/**: Contains the CSS
* **js/**: Contains the JavaScript files
* **lib/Controller/**: Contains the controllers
* **lib/**: Contains the other class files of your app
* **templates/**: Contains the templates
* **tests/**: Contains the tests

