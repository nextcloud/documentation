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


Initialization events
---------------------

Often apps do not need to load their JavaScript and CSS on every page. For this
purpose there are several events emitted that an app can act upon.

* `OCA\Files::loadAdditionalScripts` (string): loaded on the files list page
* `OCA\Files_Sharing::loadAdditionalScripts` (string): loaded on the public sharing page
* `OCA\Files_Sharing::loadAdditionalScripts::publicShareAuth` (string): loaded on the public share authentication page
* `OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS` (constant): loaded when a template response is finished
* `OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS_LOGGEDIN` (constant): loaded when a template response is finished for a logged in user

.. code-block:: php

    <?php

    $dispatcher = \OC::$server->getEventDispatcher();

    $dispatcher->addListener(
        OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS,
        function() {
            \OCP\Util::addScript('myapp', 'script');
            \OCP\Util::addStyle('myapp', 'style');
        }
    );
