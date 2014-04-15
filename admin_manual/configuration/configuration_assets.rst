Asset Management
================

In productive environments JavaScript and CSS files shall be delivered concatenated and minified.

ownCloud will create individual JavaScript and CSS files in a folder names 'assets' in the web root. This
folder has to be owned by the web server user and will be used for static delivery of these files.


Parameters
----------

.. code-block:: php

  <?php

    'asset-pipeline.enabled' => true,


This parameters can be set in the :file:`config/config.php`
