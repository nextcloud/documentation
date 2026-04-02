===================
NGINX configuration
===================

.. warning::
    Please note that webservers other than Apache 2.x are not officially supported.

.. note::
    This page covers example NGINX configurations to run a Nextcloud server.
    These configurations examples were originally provided by `@josh4trunks <https://github.com/josh4trunks>`_
    and are exclusively community-maintained. (Thank you contributors!)

-  You need to insert the following code into **your Nginx configuration file.**
-  Adjust **server_name**, **root**, **ssl_certificate** and
   **ssl_certificate_key** to suit your needs.
-  Make sure your SSL certificates are readable by the server (see `nginx HTTP
   SSL Module documentation <https://wiki.nginx.org/HttpSslModule>`_).
-  Be careful about line breaks if you copy the examples, as long lines may be
   broken for page formatting.
-  Some environments might need a ``cgi.fix_pathinfo`` set to ``1`` in their
   ``php.ini``.

Nextcloud in the webroot of NGINX
---------------------------------

The following configuration should be used when Nextcloud is placed in the
webroot of your nginx installation. In this example it is
``/var/www/nextcloud`` and it is accessed via ``http(s)://cloud.example.com/``

.. literalinclude:: nginx-root.conf.sample
   :language: nginx

Nextcloud in a subdir of the NGINX webroot
------------------------------------------

The following config should be used when Nextcloud is placed within a subdir of
the webroot of your nginx installation.
In this example the Nextcloud files are located at
``/var/www/nextcloud`` and the Nextcloud instance is accessed via ``http(s)://cloud.example.com/nextcloud/``.
The configuration differs from the "Nextcloud in webroot" configuration above in the following ways:

- All requests for ``/nextcloud`` are encapsulated within a single ``location`` block, namely ``location ^~ /nextcloud``.
- The string ``/nextcloud`` is prepended to all prefix paths.
- The root of the domain is mapped to ``/var/www`` rather than ``/var/www/nextcloud``, so that the URI ``/nextcloud`` is mapped to the server directory ``/var/www/nextcloud``.
- The blocks that handle requests for paths outside of ``/nextcloud`` (i.e. ``/robots.txt`` and ``/.well-known``) are pulled out of the ``location ^~ /nextcloud`` block.
- The block which handles `/.well-known` doesn't need a regex exception, since the rule which prevents users from accessing hidden folders at the root of the Nextcloud installation no longer matches that path.

.. literalinclude:: nginx-subdir.conf.sample
   :language: nginx

Tips and tricks
---------------

Suppressing log messages
^^^^^^^^^^^^^^^^^^^^^^^^

If you're seeing meaningless messages in your logfile, for example ``client
denied by server configuration: /var/www/data/htaccesstest.txt``, add this section to
your nginx configuration to suppress them:

.. code-block:: nginx

        location = /data/htaccesstest.txt {
          allow all;
          log_not_found off;
          access_log off;
        }

JavaScript (.js) or CSS (.css) files not served properly
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A common issue with custom nginx configs is that JavaScript (.js)
or CSS (.css) files are not served properly leading to a 404 (File not found)
error on those files and a broken webinterface.

This could be caused by the:

.. code-block:: nginx

        location ~* \.(?:css|js)$ {

block shown above not located **below** the:

.. code-block:: nginx

        location ~ \.php(?:$|\/) {

block. Other custom configurations like caching JavaScript (.js)
or CSS (.css) files via gzip could also cause such issues.

Another cause of this issue could be not properly including mimetypes in the
http block, as shown `here. <https://www.nginx.com/resources/wiki/start/topics/examples/full/>`_

Upload of files greater than 10 MiB fails
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you configure nginx (globally) to block all requests to (hidden) dot files,
it may be not possible to upload files greater than 10 MiB using the webpage
due to Nextclouds requirement to upload the file to an url ending with ``/.file``.

You may require to change:

.. code-block:: nginx

    location ~ /\. {

to the following to re-allow file uploads:

.. code-block:: nginx

    location ~ /\.(?!file).* {

See `issue #8802 on nextcloud/server <https://github.com/nextcloud/server/issues/8802>`_ for more information.

Login loop without any clue in access.log, error.log, nor nextcloud.log
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you after fresh installation (Centos 7 with nginx) have problem with first login, you should as first check these files:

.. code-block:: bash

    tail /var/www/nextcloud/data/nextcloud.log
    tail /var/log/nginx/access.log
    tail /var/log/nginx/error.log

If you just see some correct requests in access log, but no login happens, you check access rights for php session and wsdlcache directory. Try to check permissions and execute change if needed:

.. code-block:: bash

    chown nginx:nginx /var/lib/php/session/
    chown root:nginx /var/lib/php/wsdlcache/
    chown root:nginx /var/lib/php/opcache/
