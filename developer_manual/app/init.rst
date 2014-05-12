====================================
Navigation and Pre-App configuration
====================================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The :file:`appinfo/app.php` is the first file that is loaded and executed in ownCloud. Depending on the purpose of the app it usually just contains the navigation setup, and maybe :doc:`backgroundjobs` and :doc:`hooks` registrations. This is how an example :file:`appinfo/app.php` could look like:

.. code-block:: php
    
    <?php

    \OCP\App::addNavigationEntry(array(

        // the string under which your app will be referenced in owncloud
        'id' => 'myapp',

        // sorting weight for the navigation. The higher the number, the higher
        // will it be listed in the navigation
        'order' => 10,

        // the route that will be shown on startup
        'href' => \OCP\Util::linkToRoute('myapp.page.index'),

        // the icon that will be shown in the navigation
        // this file needs to exist in img/example.png
        'icon' => \OCP\Util::imagePath('myapp', 'app.svg'),

        // the title of your application. This will be used in the
        // navigation or on the settings page of your app
        'name' => \OC_L10N::get('myapp')->t('My App')
    ));

    // execute OCA\MyApp\BackgroundJob\Task::run when cron is called
    \OCP\Backgroundjob::addRegularTask('OCA\MyApp\BackgroundJob\Task', 'run');

    // execute OCA\MyApp\Hooks\User::deleteUser before a user is being deleted
    \OCP\Util::connectHook('OC_User', 'pre_deleteUser', 'OCA\MyApp\Hooks\User', 'deleteUser');


It is also possible to include :doc:`js` or :doc:`css` for other apps by placing the **addScript** or **addStyle** functions inside this file.

.. code-block:: php
    
    <?php

    \OCP\Util::addScript('myapp', 'script');  // include js/script.js for every app
    \OCP\Util::addStyle('myapp', 'style');  // include css/style.css for every app