==============================
Maintenance Mode Configuration
==============================

If you want to prevent users to login to ownCloud before you start doing
some maintenance work, you need to set the value of the **maintenance**
parameter to *true*. Users who are already logged-in will remain logged-in, but 
blocked from the server. When maintenance mode is turned off users can return 
to work.




Parameters
----------

.. code-block:: php

  <?php

    "maintenance" => false,

This parameters can be set in the :file:`config/config.php`
