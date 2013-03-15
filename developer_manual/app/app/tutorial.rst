App Tutorial
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

This tutorial contains the traditional approach to write an app and continues where :doc:`../intro/createapp` left off.

Navigation entry
~~~~~~~~~~~~~~~~
To add a navigation entry 

:file:`appinfo/app.php`

.. code-block:: php

  <?php

  \OCP\App::addNavigationEntry(array( 
      'id' => 'myapp',
      'order' => 74,
      'href' => \OCP\Util::linkToRoute('myapp_index'),
      'icon' => \OCP\Util::imagePath('myapp', 'nav-icon.png'),
      'name' => 'My App'
  ));

Create the main route
~~~~~~~~~~~~~~~~~~~~~

:file:`appinfo/routes.php`:

.. code-block:: php

  <?php

  $this->create('myapp_index', '/')->action(
      function($params){ 
          require __DIR__ . '/../index.php'; 
      }
  );


Write the logic
~~~~~~~~~~~~~~~

:file:`index.php`:

.. code-block:: php

  <?php

  // Look up other security checks in the docs!
  \OCP\User::checkLoggedIn();
  \OCP\App::checkAppEnabled('myapp');

  $tpl = new OCP\Template("myapp", "main", "user");
  $tpl->assign('msg', 'Hello World');
  $tpl->printPage();




Write the HTML in the template
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

:file:`templates/main.php`:
        
.. code-block:: php

  <p><?php p($_['msg']); ?></p>



