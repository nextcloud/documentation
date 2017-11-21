===========================
Reverse proxy configuration
===========================

Nextcloud can be run through a reverse proxy, which can cache static assets such
as images, CSS or JS files, move the load of handling HTTPS to a different
server or load balance between multiple servers.

Defining trusted proxies
------------------------

For security, you must explicitly define the proxy servers that Nextcloud is to
trust. Connections from trusted proxies will be specially treated to get the
real client information, for use in access control and logging. Parameters are
configured in :file:`config/config.php`

Set the **trusted_proxies** parameter as an array of IP address to define the
servers Nextcloud should trust as proxies. This parameter provides protection
against client spoofing, and you should secure those servers as you would your
Nextcloud server.

A reverse proxy can define HTTP headers with the original client IP address,
and Nextcloud can use those headers to retrieve that IP address. Nextcloud uses
the de-facto standard header 'X-Forwarded-For' by default, but this can be
configured with the **forwarded_for_headers** parameter. This parameter is an
array of PHP lookup strings, for example 'X-Forwarded-For' becomes
'HTTP_X_FORWARDED_FOR'. Incorrectly setting this parameter may allow clients
to spoof their IP address as visible to Nextcloud, even when going through the
trusted proxy! The correct value for this parameter is dependent on your
proxy software.

Overwrite parameters
--------------------

The automatic hostname, protocol or webroot detection of Nextcloud can fail in
certain reverse proxy situations. This configuration allows the automatic detection
to be manually overridden.

If Nextcloud fails to automatically detect the hostname, protocol or webroot
you can use the **overwrite** parameters inside the :file:`config/config.php`.
The **overwritehost** parameter is used to set the hostname of the proxy. You
can also specify a port. The **overwriteprotocol** parameter is used to set the
protocol of the proxy. You can choose between the two options **http** and
**https**. The **overwritewebroot** parameter is used to set the absolute web
path of the proxy to the Nextcloud folder. When you want to keep the automatic
detection of one of the three parameters you can leave the value empty or don't
set it. The **overwritecondaddr** parameter is used to overwrite the values
dependent on the remote address. The value must be a **regular expression** of
the IP addresses of the proxy. This is useful when you use a reverse SSL proxy
only for https access and you want to use the automatic detection for http
access.

Example
-------

Multiple domains reverse SSL proxy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you want to access your Nextcloud installation **http://domain.tld/nextcloud**
via a multiple domains reverse SSL proxy
**https://ssl-proxy.tld/domain.tld/nextcloud** with the IP address **10.0.0.1**
you can set the following parameters inside the :file:`config/config.php`.

::

  <?php
  $CONFIG = array (
    "trusted_proxies"   => ['10.0.0.1'],
    "overwritehost"     => "ssl-proxy.tld",
    "overwriteprotocol" => "https",
    "overwritewebroot"  => "/domain.tld/nextcloud",
    "overwritecondaddr" => "^10\.0\.0\.1$",
  );

.. note:: If you want to use the SSL proxy during installation you have to
  create the :file:`config/config.php` otherwise you have to extend the existing
  **$CONFIG** array.
