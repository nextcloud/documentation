====================================
Navigation and pre-app configuration
====================================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>


Adding a navigation entry
-------------------------

Navigation entries for apps can be created by adding a navigation section to the :file:`appinfo/info.xml` file, containing the name, order and route the navigation entry should link to. For details on the XML schema check the `app store documentation <https://nextcloudappstore.readthedocs.io/en/latest/developer.html#info-xml>`_.

.. code-block:: xml

    <navigation>
        <name>MyApp</name>
        <route>myapp.page.index</route>
        <order>0</order>
    </navigation>


Further pre-app configuration
-----------------------------

The :file:`appinfo/app.php` is the first file that is loaded and executed in Nextcloud. Depending on the purpose of the app it is usually used to setup things that need to be available on every request to the server, like :doc:`backgroundjobs` and :doc:`hooks` registrations. This is how an example :file:`appinfo/app.php` could look like:

.. code-block:: php
    
    <?php

    // execute OCA\MyApp\BackgroundJob\Task::run when cron is called
    \OC::$server->getJobList()->add('OCA\MyApp\BackgroundJob\Task');

    // execute OCA\MyApp\Hooks\User::deleteUser before a user is being deleted
    \OCP\Util::connectHook('OC_User', 'pre_deleteUser', 'OCA\MyApp\Hooks\User', 'deleteUser');


Although it is also possible to include :doc:`js` or :doc:`css` for other apps by placing the **addScript** or **addStyle** functions inside this file, it is strongly discouraged, because the file is loaded on each request (also such requests that do not return HTML, but e.g. json or webdav).

.. code-block:: php

    <?php

    \OCP\Util::addScript('myapp', 'script');  // include js/script.js for every app
    \OCP\Util::addStyle('myapp', 'style');  // include css/style.css for every app

Best practice
-------------

A common way to have a cleaner code structure is to create a class Application in :file:`lib/AppInfo/Application.php` that will then execute your setup of hooks or background tasks. You can then just call it in your :file:`appinfo/app.php`. That way you can also make use of Nextclouds dependency injection feature and properly test those methods.


appinfo/app.php
^^^^^^^^^^^^^^^

.. code-block:: php

    <?php

    $app = new \OCA\MyApp\AppInfo\Application();
    $app->registerHooks();


lib/AppInfo/Application.php
^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;
    
    use OCP\AppFramework\App;

    class Application extends App {
        
        public function registerHooks() {
            \OCP\Util::connectHook('OC_User', 'pre_deleteUser', 'OCA\MyApp\Hooks\User', 'deleteUser');
        }

    }
