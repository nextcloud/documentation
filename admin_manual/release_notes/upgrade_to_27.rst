=======================
Upgrade to Nextcloud 27
=======================

System requirements
-------------------

* PHP8.2 is recommended over PHP8.1.
* PHP8.0 is deprecated and will be removed in Nextcloud 28.

Exposed system address book
---------------------------

Nextcloud 27 exposes the :ref:`system address book<system-address-book>`. Restrict the enumeration settings if your users should not see other users.

Web server configuration
------------------------

* The recommended :ref:`nginx configuration<nginx-config>` changed as Nextcloud now supports module javascript with the ``.mjs`` extension, make sure to add this extension to the list of static files.
