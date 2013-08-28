Maintenance Mode Configuration
==============================

If you want to prevent users to login to ownCloud before you start doing
some maintenance work, you need to set the value of the **maintenance**
parameter to *true*. Please keep in mind that users who are already logged-in
are kicked out of ownCloud instantly.




Parameters
----------

.. code-block:: php

  <?php

    "maintenance" => false,

This parameters can be set in the :file:`config/config.php`
