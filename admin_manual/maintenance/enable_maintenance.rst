==============================
Maintenance Mode Configuration
==============================

You must put your ownCloud server into maintenance mode before performing 
updates or upgrades, and for performing troubleshooting and maintenance. Please 
see :doc:`../configuration_server/occ_command` to learn how to put your server into 
the various maintenance modes (``maintenance:mode, maintenance:singleuser``, 
and ``maintenance:repair``) with the ``occ`` command.

``maintenance:mode`` locks the sessions of logged-in users and prevents new 
logins. This is the mode to use for updates and upgrades. You may also put your 
server into this mode by editing :file:`config/config.php`. Change 
``"maintenance" => false`` to ``"maintenance" => true``:

.. code-block:: php

   <?php

    "maintenance" => true,

Then change it back to ``false`` when you are finished.
