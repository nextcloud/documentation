=======================
Upgrade to Nextcloud 31
=======================

System requirements
-------------------

* PHP 8.1 is now deprecated but still supported.
* PHP 8.4 is now supported, but 8.3 is recommended.

PHP configuration
-----------------

We have a new setup warning to check if the memory reserved for APCu is high enough.
If you see this warning, you should increase the memory reserved for APCu.
You can do this by increasing the value of the ``apc.shm_size`` directive in your ``php.ini`` file.
It is generally advised to review this value and increase it if necessary depending on your instance size.

Nextcloud configuration
-----------------------

Maximum chunk size
^^^^^^^^^^^^^^^^^^

We have adjusted the default maximum chunk size for big file uploading.
Previously it was set to 10MiB, it is now increased to 100MiB.

Also the configuration was moved from an app configuration to the system configuration (``config.php``).
If you set up a custom value previously the value will be automatically migrated to the system configuration during the update.
But if you need to set a new custom value you need now to use the system configuration, see also :ref:`files_configure_max_chunk_size`.
