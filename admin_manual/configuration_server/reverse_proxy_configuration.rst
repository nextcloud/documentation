Reverse Proxy Configuration
===========================

The automatic hostname, protocol or webroot detection of ownCloud can fail in
certain reverse proxy situations. This configuration allows to manually override
the automatic detection.

Parameters
----------

If ownCloud fails to automatically detected the hostname, protocol or webroot
you can use the **overwrite** parameters inside the :file:`config/config.php`.
The **overwritehost** parameter is used to set the hostname of the proxy. You
can also specify a port. The **overwriteprotocol** parameter is used to set the
protocol of the proxy. You can choose between the two options **http** and
**https**. The **overwritewebroot** parameter is used to set the absolute web
path of the proxy to the ownCloud folder. When you want to keep the automatic
detection of one of the three parameters you can leave the value empty or don't
set it. The **overwritecondaddr** parameter is used to overwrite the values
dependent on the remote address. The value must be a **regular expression** of
the IP addresses of the proxy. This is useful when you use a reverse SSL proxy
only for https access and you want to use the automatic detection for http
access.

Example
-------

Multiple Domains Reverse SSL Proxy
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want to access your ownCloud installation **http://domain.tld/owncloud**
via a multiple domains reverse SSL proxy
**https://ssl-proxy.tld/domain.tld/owncloud** with the IP address **10.0.0.1**
you can set the following parameters inside the :file:`config/config.php`.

.. code-block:: php

  <?php
  $CONFIG = array (
    "overwritehost"     => "ssl-proxy.tld",
    "overwriteprotocol" => "https",
    "overwritewebroot"  => "/domain.tld/owncloud",
    "overwritecondaddr" => "^10\.0\.0\.1$",
  );

.. note:: If you want to use the SSL proxy during installation you have to
  create the :file:`config/config.php` otherwise you have to extend to existing
  **$CONFIG** array.
