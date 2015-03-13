JavaScript and CSS Asset Management
===================================

In production environments, JavaScript and CSS files should be delivered in a concatenated and compressed format.

ownCloud can automatically collect all JavaScript and CSS files, aggregate and compress them to then save the result in a folder called 'assets' which can be found in the folder where ownCloud has been installed. 

If your web server has write access to your ownCloud installation, then the 'assets' folder will be automatically created for you, otherwise, you need to create it yourself before enabling that option and you must give write access to your web server user.

Assets found in that folder will from now on be served as static files by your web server and will be automatically updated whenever a change is detected.


Parameters
----------

.. code-block:: php

  <?php
    $CONFIG = array (
      ...
      'asset-pipeline.enabled' => true,
      ...
    );

You can set this parameters in the :file:`config/config.php`
