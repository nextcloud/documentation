=============
Bootstrapping
=============

Every php process has a relatively short lifespan that lasts as long as the HTTP request or the invokation of the command
line program. At the beginning of this lifespan, Nextcloud initializes its services. At the same time, any additional apps
might want to register their services to Nextcloud as well. This event is called the *bootstrapping* and this chapter
shall shed some light on how to hook into this with an app.


.. _app-php:

app.php
-------

Nextcloud will ``require_once`` every installed and enabled app's ``appinfo/app.php`` file if it exists. The app can use
this file to run registrations of services, event listeners and similar.

To leverage the advantages of object-oriented programming, it's recommended to put the logic into an :ref:`application-php`
class and query an instance like

.. code-block:: php

    <?php

    declare(strict_types=1);

    $app = \OC::$server->query(\OCA\MyApp\AppInfo\Application::class);
    $app->registerHooks();


.. _application-php:

Application
-----------

An `Application` class shall serve as central initialization point of an app.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCP\AppFramework\App;

    class Application extends App {

        public function registerHooks(): void {
            \OCP\Util::connectHook('OC_User', 'pre_deleteUser', 'OCA\MyApp\Hooks\User', 'deleteUser');
        }

    }

.. note:: Nextcloud does not load this class for every request. You should query an instance inside your :ref:`app-php` to
          load for every request, if desired.
