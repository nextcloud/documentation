=======================
Upgrade to Nextcloud 32
=======================

System requirements
-------------------

* PHP 8.1 is now deprecated but still supported.
* PHP 8.4 is now supported, but 8.3 is recommended.

Web server configuration
------------------------

* Setup checks do not check for the ``X-XSS-Protection`` response header anymore. It has been removed from Nextcloud's ``.htaccess`` and you may want to adjust your webserver config to not serve it anymore.
  XSS filtering was supported only until Chromium 78 and similarly old browsers, but had been found to cause more issues, including attack vectors, than it solved.
  Nowadays, aside of not serving the header at all, the only generally recommended value is ``0``. More context can be found in the `OWASP Cheat Sheet Series <https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-xss-protection>`_.

Monitoring: Counting of active users
------------------------------------

The monitoring app was adjusted to count the active users in the same way as occ user:report and the support app.

System address book
--------------------

During the upgrade to Nextcloud 32 the system address book might become disabled if the amount of system users exceeds the default limit of 5000 users. This is to prevent performance issues. You can re-enable the system address book using the command line or administration interface.

For more information about the system address book, see the documentation. :ref:`System Address Book <system-address-book>`

Previews
--------

Starting with Nextcloud 32.0.1, the preview provider for MP3 files, which reads cover images embedded in the files, is disabled by default for performance and stability reasons.
See :doc:`../configuration_files/previews_configuration` for details on how to enable or disable the preview provider.

AppAPI (app_api) setup checks expanded
--------------------------------------

Starting with Nextcloud 30.0.1, the AppAPI app is included and enabled by default. See :doc:`../exapps_management/index` for details. Additionally, as of version 32.0.0, the AppAPI has expanded its setup checks.

You can disable this app in the standard manner via the *Apps* menu if you do not expect to use AppAPI integrations in the near future.

If AppAPI is disabled, other apps that depend on it will not be visible in the app store. AppAPI-related setup checks will also be deactivated.

S3 integrity protections enabled, configuration update may be needed
--------------------------------------------------------------------

The AWS SDK for PHP was updated and now enables the default integrity protections for S3. If your S3 backend does not support the default integrity protection yet, you can disable it since Nextcloud 32.0.2 by adding ``'request_checksum_calculation' => 'when_required',`` and ``'response_checksum_validation' => 'when_required',`` to the object store configuration.

If your S3 backend does not support this, you may see an error such as ``Checksum Type mismatch occurred, expected checksum Type: null, actual checksum Type: crc32`` in your logs when uploading files.

More details about S3 integrity protection can be found at https://docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html and https://github.com/aws/aws-sdk-php/discussions/3100.
