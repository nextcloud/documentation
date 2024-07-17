=======================
Upgrade to Nextcloud 30
=======================

System requirements
-------------------

* PHP 8.1 is now deprecated but still supported.
* PHP 8.0 is no longer supported.
* PostgreSQL 9.4 is no longer supported.

Nextcloud configuration
-----------------------

Changes to the available options in ``config.php``.

* The option ``blacklisted_files`` is now deprecated and replaced with ``forbidden_filenames``
* The option ``forbidden_chars`` is now deprecated and replaced with ``forbidden_filename_characters``
* The option ``forbidden_filename_basenames`` was added to allow bocking files with specific basenames (the filename without extension (before the first dot))
* The option ``forbidden_filename_extensions`` was added to allow blocking extensions from being used on filenames
