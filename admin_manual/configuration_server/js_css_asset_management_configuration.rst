JavaScript and CSS Asset Management
===================================

In production environments, JavaScript and CSS files should be delivered in a concatenated and compressed format.

ownCloud can automatically collect all JavaScript and CSS files, aggregate and compress them to then save the result in a folder called 'assets' which can be found in the folder where ownCloud has been installed. 
This folder must be owned by the web server user and will be used for static delivery of these files.


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
