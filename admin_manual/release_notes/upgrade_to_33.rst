=======================
Upgrade to Nextcloud 33
=======================

System requirements
-------------------

* PHP 8.2 is now deprecated but still supported.
* PHP 8.1 is no longer supported.

If you configured restrictions on which domains can be contacted on the internet, you need to add connectivity.nextcloud.com to the allowlist, as it’s now used by default to test internet connectivity instead of www.nextcloud.com. You can also configure any other URL to use in the configuration instead. See :ref:`connections_to_remote_servers`.

Previews
--------

The preview provider for MP3 files, which reads cover images embedded in the files, is disabled by default for performance and stability reasons.
See :doc:`../configuration_files/previews_configuration` for details on how to enable or disable the preview provider.
