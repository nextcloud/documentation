====================================
Navigation and Pre-App configuration
====================================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The :file:`appinfo/app.php` is the first file that is loaded and executed in Nextcloud. Depending on the purpose of the app it usually just contains the navigation setup, and maybe :doc:`backgroundjobs` and :doc:`hooks` registrations. This is how an example :file:`appinfo/app.php` could look like:

.. code-block:: php
    
    <?php

    \OC::$server->getNavigationManager()->add(function () {
        $urlGenerator = \OC::$server->getURLGenerator();
        return [
            // the string under which your app will be referenced in Nextcloud
            'id' => 'myapp',

            // sorting weight for the navigation. The higher the number, the higher
            // will it be listed in the navigation
            'order' => 10,

            // the route that will be shown on startup
            'href' => $urlGenerator->linkToRoute('myapp.page.index'),

            // the icon that will be shown in the navigation
            // this file needs to exist in img/
            'icon' => $urlGenerator->imagePath('myapp', 'app.svg'),

            // the title of your application. This will be used in the
            // navigation or on the settings page of your app
            'name' => \OC::$server->getL10N('myapp')->t('My App'),
        ];
    });

    // execute OCA\MyApp\BackgroundJob\Task::run when cron is called
    \OC::$server->getJobList()->add('OCA\MyApp\BackgroundJob\Task');

    // execute OCA\MyApp\Hooks\User::deleteUser before a user is being deleted
    \OCP\Util::connectHook('OC_User', 'pre_deleteUser', 'OCA\MyApp\Hooks\User', 'deleteUser');


Although it is also possible to include :doc:`js` or :doc:`css` for other apps by placing the **addScript** or **addStyle** functions inside this file, it is strongly discouraged, because the file is loaded on each request (also such requests that do not return HTML, but e.g. json or webdav).

.. code-block:: php

    <?php

    \OCP\Util::addScript('myapp', 'script');  // include js/script.js for every app
    \OCP\Util::addStyle('myapp', 'style');  // include css/style.css for every app
