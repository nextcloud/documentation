uploading big files > 512MB (as set by default)
===============================================
It's usefull to know limiting factors, that make it impossible to exceed the values given to the ownCloud-system:
Non ownCloud cuased upload limits:
----------------------------------
< 2GB on 32Bit OS-architecture
< 2GB with IE6 - IE8
< 2GB with Server Version 4.5 or older
< 4GB with IE9 - IE10



Parameters
----------

.. code-block:: php

  <?php

    "default_language" => "en",

This parameters can be set in the :file:`config/config.php`
