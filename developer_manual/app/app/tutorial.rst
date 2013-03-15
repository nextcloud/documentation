App Tutorial
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

This tutorial contains the traditional approach to write an app and continues where :doc:`../intro/createapp` left off. The result will be a simple "Hello World" app.

Navigation entry
----------------
This file will always loaded for every app and can for instance be used to load additional JavaScript for the files app. Therefore the navigation entry has to be registered in this file.

:file:`appinfo/app.php`:

.. code-block:: php

  <?php

  \OCP\App::addNavigationEntry(array( 
      
      // the string under which your app will be referenced in owncloud
      'id' => 'myapp',

      // sorting weight for the navigation. The higher the number, the higher
      // will it be listed in the navigation
      'order' => 74,

      // the route that will be shown on startup
      'href' => \OCP\Util::linkToRoute('myapp_index'),

      // the icon that will be shown in the navigation
      // this file needs to exist in img/example.png
      'icon' => \OCP\Util::imagePath('myapp', 'nav-icon.png'),

      // the title of your application. This will be used in the
      // navigation or on the settings page of your app
      'name' => 'My App'
  ));

Create the main route
---------------------
:doc:`routes` map the URL to functions and allow to extract values. To show the content when the navigation entry is clicked, the index route which was defined in the :file:`appinfo/app.php` needs to be created:

:file:`appinfo/routes.php`:

.. code-block:: php

  <?php

  $this->create('myapp_index', '/')->action(
      function($params){ 
          require __DIR__ . '/../index.php'; 
      }
  );


Write the logic
---------------
In this example the logic is written procedurally in a PHP file. This file contains database queries and security checks and prints the final template:

:file:`index.php`:

.. code-block:: php

  <?php

  // Look up other security checks in the docs!
  \OCP\User::checkLoggedIn();
  \OCP\App::checkAppEnabled('myapp');

  $tpl = new OCP\Template("myapp", "main", "user");
  $tpl->assign('msg', 'Hello World');
  $tpl->printPage();


Create the template
-------------------
The last thing that needs to be done is to create the :doc:`templates` file which was used in the :file:`index.php`.

:file:`templates/main.php`:
        
.. code-block:: php

  <p><?php p($_['msg']); ?></p>


Congratulations! The message "Hello World" can now be seen on the main page of your app.