=======================
Upgrade to Nextcloud 30
=======================

System requirements
-------------------

* PHP 8.1 is now deprecated but still supported.
* PHP 8.0 is no longer supported.
* PostgreSQL 9.4 is no longer supported.
* MariaDB 10.3 and 10.5 are no longer supported.

Web server configuration
------------------------

Make sure that your web server is serving files with the ``webp`` extension (WebP images) correctly as static assets.
This is included in the shipped ``.htaccess`` file but if you use another web server or custom configuration you need to check this manually.

Nextcloud configuration
-----------------------

Changes to the available options in ``config.php``.

* The option ``blacklisted_files`` is now deprecated and replaced with ``forbidden_filenames``
* The option ``forbidden_chars`` is now deprecated and replaced with ``forbidden_filename_characters``
* The option ``forbidden_filename_basenames`` was added to allow bocking files with specific basenames (the filename without extension (before the first dot))
* The option ``forbidden_filename_extensions`` was added to allow blocking extensions from being used on filenames

Previews for PDF files with Imaginary
-------------------------------------

The preview provider ``OC\Preview\Imaginary`` is no longer generating previews for PDF files.
Add the new preview provider ``OC\Preview\ImaginaryPDF`` to ``enabledPreviewProviders`` to enable preview generation with Imaginary for PDF files.

Automated clean-up of app password
----------------------------------

Nextcloud 30 will :ref:`clean-up unused app passwords<authentication-app-password-clean-up>`.
