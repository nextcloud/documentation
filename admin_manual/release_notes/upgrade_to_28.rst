=======================
Upgrade to Nextcloud 28
=======================

System requirements
-------------------

* PHP 8.3 is now supported, but 8.2 is recommended.


Web server configuration
------------------------

* The recommended :ref:`nginx configuration<nginx-config>` changed as Nextcloud Talk now serves audio files with ``.ogg`` / ``.flac`` extension, make sure to add these extensions to the list of static files.
* As some core app now make use of JavaScript modules, make sure your web server is not rewriting requests to ``.mjs`` files, but serves them with ``text/javascript`` MIME type and proper ``Cache-Control`` header, like ``.js`` and other static file extensions.

  * When using Apache with ``.htaccess`` configuration, this will be done automatically.
  * For Nginx, please refer to our recommended :ref:`Nginx configuration<nginx-config>`.
  * For other setups, make sure to add ``.mjs`` to the list of static file extensions in web server configs and in case define its MIME type in ``/etc/mime.types``.

Setup Checks
------------

The setup checks (the ones visible under *Administration settings->Overview*) that previously ran from the web browser now run server-side rather than from the browser. 

This means that some false positives may be triggered in existing installations after upgrading. This does not mean the checks are invalid or broken. It does mean that local configuration matters that may not have had obvious side effects previously may now prevent the tests from getting accurate results. 

In nearly all cases the resolution is one or more of the following:

- verifying all entries in ``trusted_domains`` and the value of ``overwrite.cli.url`` are valid, resolvable in DNS, and reachable *from the Nextcloud Server itself*
- verifying that the Server can reach its own URL(s)
- verifying all ``overwrite*`` config values are reasonable

In diagnosing the above, many admins have found it useful to review not only their `config.php` (for cleanup) but also:

- their local DNS resolvers and ``/etc/hosts`` files for reasonableness
- their firewall configurations
- their container network configuration if using Docker/etc (especially for outbound connectivity)

.. tip:: Testing of connectivity and reachability of specific URLs can usually be tested from servers or containers via ``curl`` or ``wget``.

Monitoring
----------

Beginning with Nextcloud 28, the monitoring endpoint no longer provides information about available app updates, as gathering the data always involves at least one external request to apps.nextcloud.com.

You can still ask the monitoring endpoint to show new app updates by using the URL parameter skipApps=false. However, please do not check this endpoint too often.

https://github.com/nextcloud/serverinfo#api

Previews for Office files using LibreOffice
-------------------------------------------

Nextcloud can generate previews for Office files using LibreOffice.

Since Nextcloud 28, you can also create previews for EMF files. 
To enable it, add ``'OC\Preview\EMF'`` to ``enabledPreviewProviders``.


Until Nextcloud 28, the same LibreOffice user profile was used to generate the previews. LibreOffice can only be invoked once per user profile, so the generation of a preview for an office file would fail if another one were created right now.

Beginning with Nextcloud 28, a different LibreOffice user profile is used for each file. Downside: If you upload 100 emf files, you may end up with 100 LibreOffice 
invocations. Though, you can use ``preview_concurrency_new`` and ``preview_concurrency_all`` to limit the number of previews that can be generated concurrently when php-sysvsem is available.

The configuration option ``preview_office_cl_parameters`` was removed with Nextcloud 28. 
We expect LibreOffice to be started with the given parameters, so it's unfavorable to have a configuration option to change the parameters. 
Please reach out to us via https://github.com/nextcloud/server/pull/41395 if that's causing any trouble for you. 


.. tip:: Previews for EMF files can be enabled without a local LibreOffice installation if you are already using Nextcloud Office / Collabora. Make sure you have Nextcloud Office 8.3.0 installed and add ``'OCA\Richdocuments\Preview\EMF'`` to ``enabledPreviewProviders``.
