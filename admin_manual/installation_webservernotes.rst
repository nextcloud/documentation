Web server Notes
----------------

The most popular server choice for ownCloud is Apache, which is why
it is also the combinations tested best. However, it is also possible
to run ownCloud on other web servers. This section does not cover
Microsoft Internet Information Services (IIS), it is covered
in the `Windows 7 and Windows Server 2008`_ section.

Nginx Configuration
~~~~~~~~~~~~~~~~~~~

-  You need to insert the following code into
   ``your nginx config file.``
-  Adjust ``server_name``, ``root``, ``ssl_certificate`` and
   ``ssl_certificate_key`` to suit your needs.
-  Make sure your SSL certificates are readable by the server (see
   `http://wiki.nginx.org/HttpSslModule`_).

::

    # redirect http to https.
    server {
      listen 80;
      server_name owncloud.example.org;
      return 301 https://$server_name$request_uri;  # enforce https
    }

    # owncloud (ssl/tls)
    server {
      listen 443 ssl;
      ssl_certificate /etc/nginx/certs/server.crt;
      ssl_certificate_key /etc/nginx/certs/server.key;
      server_name owncloud.example.org;
      root /path/to/owncloud;
      index index.php;
      client_max_body_size 1000M; # set maximum upload size

      # deny direct access
      location ~ ^/(data|config|\.ht|db_structure\.xml|README) {
        deny all;
      }

      # default try order
      location / {
        try_files $uri $uri/ @webdav;
      }

      # owncloud WebDAV
      location @webdav {
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        fastcgi_pass 127.0.0.1:9000; # or use php-fpm with: "unix:/var/run/php-fpm/php-fpm.sock;"
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS on;
        include fastcgi_params;
      }

      # enable php
      location ~ \.php$ {
        try_files $uri = 404;
        fastcgi_pass 127.0.0.1:9000; # or use php-fpm with: "unix:/var/run/php-fpm/php-fpm.sock;"
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS on;
        include fastcgi_params;
      }
    }

.. note:: You can use Owncloud without SSL/TLS support, but we strongly
          encourage you not to do that:

-  Remove the server block containing the redirect
-  Change ``listen 443 ssl`` to ``listen 80;``
-  Remove ``ssl_certificate`` and ``ssl_certificate_key``.
-  Remove ``fastcgi_params HTTPS on;``

.. note:: If you want to effectively increase maximum upload size you will also
          have to modify your ``php-fpm configuration`` (``usually at
          /etc/php5/fpm/php.ini``) and increase ``upload_max_filesize`` and
          ``post_max_size`` values. You’ll need to restart php5-fpm and nginx
	  services in order these changes to be applied.

Lighttpd Configuration
~~~~~~~~~~~~~~~~~~~~~~

This assumes that you are familiar with installing PHP application on
lighttpd.

It is important to note that the ``.htaccess`` files used by ownCloud to protect
the ``data`` folder are ignored by lighttpd, so you have to secure it by yourself,
otherwise your ``owncloud.db``` database and user data are publicly readable even if
directory listing is off. You need to add two snippets to your lighttpd configuration
file:

Disable access to data folder::

    $HTTP["url"] =^ "^/owncloud/data/" {
         url.access-deny = ("")
       }

Disable directory listing::

    $HTTP["url"] =^ "^/owncloud($|/)" {
         dir-listing.activate = "disable"
       }

Yaws Configuration
~~~~~~~~~~~~~~~~~~

This should be in your ``yaws_server.conf``. In the configuration file, the
``dir_listings = false`` is important and also the redirect from ``/data``
to somewhere else, because files will be saved in this directory and it
should not be accessible from the outside. A configuration file would look
like this::

    <server owncloud.myserver.com/>
            port = 80
            listen = 0.0.0.0
            docroot = /var/www/owncloud/src
            allowed_scripts = php
            php_handler = <cgi, /usr/local/bin/php-cgi>
            errormod_404 = yaws_404_to_index_php
            access_log = false
            dir_listings = false
            <redirect>
                    /data == /
            </redirect>
    </server>

The apache ``.htaccess`` file that comes with ownCloud is configured to
redirect requests to nonexistent pages. To emulate that behaviour, you
need a custom error handler for yaws. See this `github gist for further
instructions`_ on how to create and compile that error handler.

Hiawatha Configuration
~~~~~~~~~~~~~~~~~~~~~~

Add ``WebDAVapp = yes`` to the ownCloud virtual host. Users accessing
WebDAV from MacOS will also need to add ``AllowDotFiles = yes``.

Disable access to data folder::

    UrlToolkit {
        ToolkitID = denyData
        Match ^/data DenyAccess
    }


PageKite Configuration
~~~~~~~~~~~~~~~~~~~~~~

You can use this `PageKite how to`_ to make your local ownCloud accessible from the
internet using PageKite.

.. _github gist for further instructions: https://gist.github.com/2200407
.. _PageKite how to: https://pagekite.net/wiki/Howto/GNULinux/OwnCloud/

.. _`http://wiki.nginx.org/HttpSslModule`: http://wiki.nginx.org/HttpSslModule
