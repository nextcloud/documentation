=======================
Upgrade to Nextcloud 27
=======================

System requirements
-------------------

* PHP 8.2 is recommended over PHP 8.1.
* PHP 8.0 is deprecated and might be removed in Nextcloud 28.

Exposed system address book
---------------------------

Nextcloud 27 exposes the :ref:`system address book<system-address-book>`. Restrict the enumeration settings if your users should not see other users.

Web server configuration
------------------------

* The recommended :ref:`nginx configuration<nginx-config>` changed as Nextcloud now supports module javascript with the ``.mjs`` and audio files with ``.ogg`` / ``.flac`` extension, make sure to add these extensions to the list of static files.
