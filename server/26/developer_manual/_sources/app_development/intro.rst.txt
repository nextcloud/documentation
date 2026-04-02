============
Introduction
============

Create an app
-------------

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

After :doc:`you've set up the development environment <../getting_started/devenv>` change into the Nextcloud apps directory::

    cd /var/www/nextcloud/apps

Then create a skeleton app in the `app store <https://apps.nextcloud.com/developer/apps/generate>`_. This doesn't publish anything on the appstore yet, it just gives you a download.

Edit an existing app
--------------------

Alternatively, if you would like to contribute to an existing app instead of creating a new one, first :doc:`set up the development environment <../getting_started/devenv>`, then create an `apps-extra` folder in the Nextcloud root directory::

    cd /var/www/nextcloud/apps-extra
    
You can then configure Nextcloud to run apps from this directory, by changing your `app_paths` system config in your `config.php`

.. code-block:: php

    'apps_paths' => array (
        0 => array (
            'path' => '/var/www/html/apps',
            'url' => '/apps',
            'writable' => false,
        ),
        1 => array (
            'path' => '/var/www/html/apps-extra',
            'url' => '/apps-extra',
            'writable' => false,
        ),
    ),
    
Finally, clone the app to which you would like to contribute inside the `apps-extra` folder. For example:

    git clone https://github.com/nextcloud/cookbook.git 

Enable the app
--------------
The app can now be enabled on the Nextcloud apps page.

App architecture
----------------
The following directories have now been created:

* **appinfo/**: Contains app metadata and configuration
* **css/**: Contains the CSS
* **img/**: Contains icons and images
* **js/**: Contains the JavaScript files
* **lib/**: Contains the PHP class files of your app
* **src/**: Contains the source code of your vue.js app
* **templates/**: Contains the templates
* **tests/**: Contains the tests
