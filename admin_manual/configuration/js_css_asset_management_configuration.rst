JavaScript and CSS Asset Management
===================================

In production environments, JavaScript and CSS files are delivered in a concatenated and compressed format.

ownCloud creates individual JavaScript and CSS files and saves them in a folder called 'assets' in the web root. This folder must be owned by the web server user and is used for static delivery of these files.


Parameters
----------

.. code-block:: php

  <?php

    'asset-pipeline.enabled' => true,


You can set this parameters in the :file:`config/config.php`
