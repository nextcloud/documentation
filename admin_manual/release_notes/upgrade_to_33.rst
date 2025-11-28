=======================
Upgrade to Nextcloud 33
=======================

System requirements
-------------------

* PHP 8.2 is now deprecated but still supported.
* PHP 8.1 is no longer supported.
* Oracle 11g is no longer supported.
* PostgreSQL 13 is no longer supported.

If you configured restrictions on which domains can be contacted on the internet, you need to add connectivity.nextcloud.com to the allowlist, as it’s now used by default to test internet connectivity instead of www.nextcloud.com. You can also configure any other URL to use in the configuration instead. See :ref:`connections_to_remote_servers`.

Previews
--------

The preview provider for MP3 files, which reads cover images embedded in the files, is disabled by default for performance and stability reasons.
See :doc:`../configuration_files/previews_configuration` for details on how to enable or disable the preview provider.

Snowflake IDs
-------------

This version of Nextcloud ships with `Snowflake IDs <https://en.wikipedia.org/wiki/Snowflake_ID>`_. Those IDs include the creation time of object, a sequence ID and a server ID.
The server ID should now be configured in your config.php file or using environment variables. See :doc:`../configuration_server/config_sample_php_parameters` for more information.


Default user agent for outgoing requests changed
------------------------------------------------

Starting with this release, the default user agent for requests done by the instance was changed from ``Nextcloud Server Crawler`` to ``Nextcloud-Server-Crawler/X.Y.Z``, where ``X.Y.Z`` is the current server version.
