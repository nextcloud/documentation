Other Web Servers
=================
The most popular server choice for ownCloud is Apache, which is why
it is also the combinations tested best. However, it is also possible
to run ownCloud on other web servers. This section does not cover
Microsoft Internet Information Services (IIS), it is covered
in the :doc:`installation_windows` section.

Nginx Configuration
-------------------

-  You need to insert the following code into
   **your nginx config file.**
-  Adjust **server_name**, **root**, **ssl_certificate** and **ssl_certificate_key** to suit your needs.
-  Make sure your SSL certificates are readable by the server (see `http://wiki.nginx.org/HttpSslModule`_).

.. code-block:: python

    server {
      listen 80;
      server_name cloud.example.com;
      return  https://$server_name$request_uri;  # enforce https
    }

    server {
      listen 443 ssl;
      server_name cloud.example.com;

      ssl_certificate /etc/ssl/nginx/cloud.example.com.crt;
      ssl_certificate_key /etc/ssl/nginx/cloud.example.com.key;

      # Path to the root of your installation
      root /var/www/;

      client_max_body_size 10G; # set max upload size
      fastcgi_buffers 64 4K;

      rewrite ^/caldav(.*)$ /remote.php/caldav$1 redirect;
      rewrite ^/carddav(.*)$ /remote.php/carddav$1 redirect;
      rewrite ^/webdav(.*)$ /remote.php/webdav$1 redirect;

      index index.php;
      error_page 403 = /core/templates/403.php;
      error_page 404 = /core/templates/404.php;

      location ~ ^/(data|config|\.ht|db_structure\.xml|README) {
        deny all;
      }

      location / {
        # The following 2 rules are only needed with webfinger
        rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
        rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json last;

        rewrite ^/.well-known/carddav /remote.php/carddav/ redirect;
        rewrite ^/.well-known/caldav /remote.php/caldav/ redirect;

        rewrite ^(/core/doc/[^\/]+/)$ $1/index.html;

        try_files $uri $uri/ index.php;
      }

      location ~ ^(.+?\.php)(/.*)?$ {
        try_files $1 = 404;

        include fastcgi_params;
        fastcgi_param PATH_INFO $2;
        fastcgi_param HTTPS on;
        fastcgi_pass 127.0.0.1:9000;
        # Or use unix-socket with 'fastcgi_pass unix:/var/run/php5-fpm.sock;'
      }

      # Optional: set long EXPIRES header on static assets
      location ~* ^.+\.(jpg|jpeg|gif|bmp|ico|png|css|js|swf)$ {
        expires 30d;
        # Optional: Don't log access to assets
        access_log off;
      }

    }

.. note:: You can use Owncloud without SSL/TLS support, but we strongly encourage you not to do that:

-  Remove the server block containing the redirect
-  Change **listen 443 ssl** to **listen 80;**
-  Remove **ssl_certificate** and **ssl_certificate_key**.
-  Remove **fastcgi_params HTTPS on;**

.. note:: If you want to effectively increase maximum upload size you will also
          have to modify your **php-fpm configuration** (**usually at
          /etc/php5/fpm/php.ini**) and increase **upload_max_filesize** and
          **post_max_size** values. You’ll need to restart php5-fpm and nginx
	  services in order these changes to be applied.

Lighttpd Configuration
----------------------

This assumes that you are familiar with installing PHP application on
lighttpd.

It is important to note that the **.htaccess** files used by ownCloud to protect the **data** folder are ignored by lighttpd, so you have to secure it by yourself, otherwise your **owncloud.db** database and user data are publicly readable even if directory listing is off. You need to add two snippets to your lighttpd configuration file:

Disable access to data folder::

    $HTTP["url"] =^ "^/owncloud/data/" {
         url.access-deny = ("")
       }

Disable directory listing::

    $HTTP["url"] =^ "^/owncloud($|/)" {
         dir-listing.activate = "disable"
       }

.. note:: The **check-local** option of lighttpd's fastcgi_  must be enabled.
          It is sometimes disabled for security reasons. For example, 
          the PHP process can run as a different user than lighttpd. 
          Then, lighttpd might not be able to read/check the PHP files 
          which the PHP process is able to read. Disabling 
          **check-local** results in an incorrect **PATH_INFO** 
          in PHP which produces a strange behavior of owncloud (such as 
          incompletely loaded pages).

.. _fastcgi: http://redmine.lighttpd.net/projects/1/wiki/Docs_ModFastCGI

Yaws Configuration
------------------

This should be in your **yaws_server.conf**. In the configuration file, the
**dir_listings = false** is important and also the redirect from **/data**
to somewhere else, because files will be saved in this directory and it
should not be accessible from the outside. A configuration file would look
like this

.. code-block:: xml

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

The apache **.htaccess** file that comes with ownCloud is configured to
redirect requests to nonexistent pages. To emulate that behaviour, you
need a custom error handler for yaws. See this `github gist for further
instructions`_ on how to create and compile that error handler.

Hiawatha Configuration
----------------------

Add **WebDAVapp = yes** to the ownCloud virtual host. Users accessing
WebDAV from MacOS will also need to add **AllowDotFiles = yes**.

Disable access to data folder::

    UrlToolkit {
        ToolkitID = denyData
        Match ^/data DenyAccess
    }


PageKite Configuration
----------------------

You can use this `PageKite how to`_ to make your local ownCloud accessible from the
internet using PageKite.

.. _github gist for further instructions: https://gist.github.com/2200407
.. _PageKite how to: https://pagekite.net/wiki/Howto/GNULinux/OwnCloud/

.. _`http://wiki.nginx.org/HttpSslModule`: http://wiki.nginx.org/HttpSslModule
