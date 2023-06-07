=======================
Upgrade to Nextcloud 26
=======================

System requirements
-------------------

* PHP 8.2 is now supported, but 8.1 is recommended.
* PHP7.4 is no longer supported.

System email
------------

The software component to send system emails (notifications, invites, password reset, etc) had to be replaced. The new library should work without any changes out of the box for most setups. Only NTLM/Exchange is kown to be no longer supported. See :ref:`email-smtp-config`.

Web server configuration
------------------------

* The recommended :ref:`nginx configuration<nginx-config>` changed.
