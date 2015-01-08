=============
Create an app
=============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

After :doc:`you've set up the development environment and installed the dev tool <../general/devenv>` change into the ownCloud apps directory::

    cd /var/www/core/apps

Then run::

    ocdev startapp MyApp --mail mail@example.com --author "Your Name" --description "My first app" --owncloud 8

This will create all the needed files in the current directory. For more information on how to customize the generated app, see the `Project's GitHub page <https://github.com/owncloud/ocdev>`_ or run::

    ocdev startapp -h

Enable the app
--------------
The app can now be enabled on the ownCloud apps page

App architecture
----------------
The following directories have now been created:

* **appinfo/**: Contains app metadata and configuration
* **controller/**: Contains the controllers
* **css/**: Contains the CSS
* **js/**: Contains the JavaScript files
* **templates/**: Contains the templates
* **tests/**: Contains the tests

