===================
Nginx configuration
===================

This page covers example Nginx configurations to use with running a Nextcloud
server. These configurations examples were originally provided by
`@josh4trunks <https://github.com/josh4trunks>`_ and are community-maintained. (Thank you contributors!)

-  You need to insert the following code into **your Nginx configuration file.**
-  Adjust **server_name**, **root**, **ssl_certificate** and
   **ssl_certificate_key** to suit your needs.
-  Make sure your SSL certificates are readable by the server (see `nginx HTTP
   SSL Module documentation <https://wiki.nginx.org/HttpSslModule>`_).
-  Be careful about line breaks if you copy the examples, as long lines may be
   broken for page formatting.
-  Some environments might need a ``cgi.fix_pathinfo`` set to ``1`` in their
   ``php.ini``.

Nextcloud in the webroot of nginx
---------------------------------

The following configuration should be used when Nextcloud is placed in the
webroot of your nginx installation. In this example it is
``/var/www/nextcloud`` and it is accessed via ``http(s)://cloud.example.com/``

.. code-block:: nginx

  upstream php-handler {
      server 127.0.0.1:9000;
      #server unix:/var/run/php/php7.4-fpm.sock;
  }

  server {
      listen 80;
      listen [::]:80;
      server_name cloud.example.com;
      
      # Enforce HTTPS
      return 301 https://$server_name$request_uri;
  }

  server {
      listen 443      ssl http2;
      listen [::]:443 ssl http2;
      server_name cloud.example.com;

      # Use Mozilla's guidelines for SSL/TLS settings
      # https://mozilla.github.io/server-side-tls/ssl-config-generator/
      ssl_certificate     /etc/ssl/nginx/cloud.example.com.crt;
      ssl_certificate_key /etc/ssl/nginx/cloud.example.com.key;

      # HSTS settings
      # WARNING: Only add the preload option once you read about
      # the consequences in https://hstspreload.org/. This option
      # will add the domain to a hardcoded list that is shipped
      # in all major browsers and getting removed from this list
      # could take several months.
      #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
      
      # set max upload size
      client_max_body_size 512M;
      fastcgi_buffers 64 4K;

      # Enable gzip but do not remove ETag headers
      gzip on;
      gzip_vary on;
      gzip_comp_level 4;
      gzip_min_length 256;
      gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
      gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;

      # Pagespeed is not supported by Nextcloud, so if your server is built
      # with the `ngx_pagespeed` module, uncomment this line to disable it.
      #pagespeed off;
      
      # HTTP response headers borrowed from Nextcloud `.htaccess`
      add_header Referrer-Policy                      "no-referrer"   always;
      add_header X-Content-Type-Options               "nosniff"       always;
      add_header X-Download-Options                   "noopen"        always;
      add_header X-Frame-Options                      "SAMEORIGIN"    always;
      add_header X-Permitted-Cross-Domain-Policies    "none"          always;
      add_header X-Robots-Tag                         "none"          always;
      add_header X-XSS-Protection                     "1; mode=block" always;
      
      # Remove X-Powered-By, which is an information leak
      fastcgi_hide_header X-Powered-By;
      
      # Path to the root of your installation
      root /var/www/nextcloud;
      
      # Specify how to handle directories -- specifying `/index.php$request_uri`
      # here as the fallback means that Nginx always exhibits the desired behaviour
      # when a client requests a path that corresponds to a directory that exists
      # on the server. In particular, if that directory contains an index.php file,
      # that file is correctly served; if it doesn't, then the request is passed to
      # the front-end controller. This consistent behaviour means that we don't need
      # to specify custom rules for certain paths (e.g. images and other assets,
      # `/updater`, `/ocm-provider`, `/ocs-provider`), and thus
      # `try_files $uri $uri/ /index.php$request_uri`
      # always provides the desired behaviour.
      index index.php index.html /index.php$request_uri;
      
      # Default Cache-Control policy
      expires 1m;
      
      # Rule borrowed from `.htaccess` to handle Microsoft DAV clients
      location = / {
          if ( $http_user_agent ~ ^DavClnt ) {
              return 302 /remote.php/webdav/$is_args$args;
          }
      }
      
      location = /robots.txt {
          allow all;
          log_not_found off;
          access_log off;
      }
      
      # Make a regex exception for `/.well-known` so that clients can still
      # access it despite the existence of the regex rule
      # `location ~ /(\.|autotest|...)` which would otherwise handle requests
      # for `/.well-known`.
      location ^~ /.well-known {
          # The following 6 rules are borrowed from `.htaccess`
      
          rewrite ^/\.well-known/host-meta\.json  /public.php?service=host-meta-json  last;
          rewrite ^/\.well-known/host-meta        /public.php?service=host-meta       last;
          rewrite ^/\.well-known/webfinger        /public.php?service=webfinger       last;
          rewrite ^/\.well-known/nodeinfo         /public.php?service=nodeinfo        last;
          
          location = /.well-known/carddav     { return 301 /remote.php/dav/; }
          location = /.well-known/caldav      { return 301 /remote.php/dav/; }

          try_files $uri $uri/ =404;
      }
      
      # Rules borrowed from `.htaccess` to hide certain paths from clients
      location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  { return 404; }
      location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console)              { return 404; }
      
      # Ensure this block, which passes PHP files to the PHP process, is above the blocks
      # which handle static assets (as seen below). If this block is not declared first,
      # then Nginx will encounter an infinite rewriting loop when it prepends `/index.php`
      # to the URI, resulting in a HTTP 500 error response.
      location ~ \.php(?:$|/) {
          fastcgi_split_path_info ^(.+?\.php)(/.*)$;
          set $path_info $fastcgi_path_info;
          
          try_files $fastcgi_script_name =404;
          
          include fastcgi_params;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          fastcgi_param PATH_INFO $path_info;
          fastcgi_param HTTPS on;
          
          fastcgi_param modHeadersAvailable true;         # Avoid sending the security headers twice
          fastcgi_param front_controller_active true;     # Enable pretty urls
          fastcgi_pass php-handler;
          
          fastcgi_intercept_errors on;
          fastcgi_request_buffering off;
      }
      
      location ~ \.(?:css|js|svg|gif)$ {
          try_files $uri /index.php$request_uri;
          expires 6M;         # Cache-Control policy borrowed from `.htaccess`
          access_log off;     # Optional: Don't log access to assets
      }
      
      location ~ \.woff2?$ {
          try_files $uri /index.php$request_uri;
          expires 7d;         # Cache-Control policy borrowed from `.htaccess`
          access_log off;     # Optional: Don't log access to assets
      }
      
      location / {
          try_files $uri $uri/ /index.php$request_uri;
      }
  }

Nextcloud in a subdir of the nginx webroot
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

.. code-block:: nginx

  upstream php-handler {
      server 127.0.0.1:9000;
      #server unix:/var/run/php/php7.4-fpm.sock;
  }

  server {
      listen 80;
      listen [::]:80;
      server_name cloud.example.com;

      # Enforce HTTPS just for `/nextcloud`
      location /nextcloud {
          return 301 https://$server_name$request_uri;
      }
  }

  server {
      listen 443      ssl http2;
      listen [::]:443 ssl http2;
      server_name cloud.example.com;

      # Use Mozilla's guidelines for SSL/TLS settings
      # https://mozilla.github.io/server-side-tls/ssl-config-generator/
      ssl_certificate     /etc/ssl/nginx/cloud.example.com.crt;
      ssl_certificate_key /etc/ssl/nginx/cloud.example.com.key;

      # HSTS settings
      # WARNING: Only add the preload option once you read about
      # the consequences in https://hstspreload.org/. This option
      # will add the domain to a hardcoded list that is shipped
      # in all major browsers and getting removed from this list
      # could take several months.
      #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;

      # Path to the root of the domain
      root /var/www;
      
      location = /robots.txt {
          allow all;
          log_not_found off;
          access_log off;
      }

      location /.well-known {
          # The following 6 rules are borrowed from `.htaccess`

          rewrite ^/\.well-known/host-meta\.json  /nextcloud/public.php?service=host-meta-json    last;
          rewrite ^/\.well-known/host-meta        /nextcloud/public.php?service=host-meta         last;
          rewrite ^/\.well-known/webfinger        /nextcloud/public.php?service=webfinger         last;
          rewrite ^/\.well-known/nodeinfo         /nextcloud/public.php?service=nodeinfo          last;

          location = /.well-known/carddav   { return 301 /nextcloud/remote.php/dav/; }
          location = /.well-known/caldav    { return 301 /nextcloud/remote.php/dav/; }

          try_files $uri $uri/ =404;
      }
      
      location ^~ /nextcloud {
          # set max upload size
          client_max_body_size 512M;
          fastcgi_buffers 64 4K;

          # Enable gzip but do not remove ETag headers
          gzip on;
          gzip_vary on;
          gzip_comp_level 4;
          gzip_min_length 256;
          gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
          gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;

          # Pagespeed is not supported by Nextcloud, so if your server is built
          # with the `ngx_pagespeed` module, uncomment this line to disable it.
          #pagespeed off;
          
          # HTTP response headers borrowed from Nextcloud `.htaccess`
          add_header Referrer-Policy                      "no-referrer"   always;
          add_header X-Content-Type-Options               "nosniff"       always;
          add_header X-Download-Options                   "noopen"        always;
          add_header X-Frame-Options                      "SAMEORIGIN"    always;
          add_header X-Permitted-Cross-Domain-Policies    "none"          always;
          add_header X-Robots-Tag                         "none"          always;
          add_header X-XSS-Protection                     "1; mode=block" always;
          
          # Remove X-Powered-By, which is an information leak
          fastcgi_hide_header X-Powered-By;
          
          # Specify how to handle directories -- specifying `/nextcloud/index.php$request_uri`
          # here as the fallback means that Nginx always exhibits the desired behaviour
          # when a client requests a path that corresponds to a directory that exists
          # on the server. In particular, if that directory contains an index.php file,
          # that file is correctly served; if it doesn't, then the request is passed to
          # the front-end controller. This consistent behaviour means that we don't need
          # to specify custom rules for certain paths (e.g. images and other assets,
          # `/updater`, `/ocm-provider`, `/ocs-provider`), and thus
          # `try_files $uri $uri/ /nextcloud/index.php$request_uri`
          # always provides the desired behaviour.
          index index.php index.html /nextcloud/index.php$request_uri;
          
          # Default Cache-Control policy
          expires 1m;

          # Rule borrowed from `.htaccess` to handle Microsoft DAV clients
          location = /nextcloud {
              if ( $http_user_agent ~ ^DavClnt ) {
                  return 302 /nextcloud/remote.php/webdav/$is_args$args;
              }
          }
          
          # Rules borrowed from `.htaccess` to hide certain paths from clients
          location ~ ^/nextcloud/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)    { return 404; }
          location ~ ^/nextcloud/(?:\.|autotest|occ|issue|indie|db_|console)                { return 404; }
          
          # Ensure this block, which passes PHP files to the PHP process, is above the blocks
          # which handle static assets (as seen below). If this block is not declared first,
          # then Nginx will encounter an infinite rewriting loop when it prepends
          # `/nextcloud/index.php` to the URI, resulting in a HTTP 500 error response.
          location ~ \.php(?:$|/) {
              fastcgi_split_path_info ^(.+?\.php)(/.*)$;
              set $path_info $fastcgi_path_info;
              
              try_files $fastcgi_script_name =404;
              
              include fastcgi_params;
              fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
              fastcgi_param PATH_INFO $path_info;
              fastcgi_param HTTPS on;
              
              fastcgi_param modHeadersAvailable true;         # Avoid sending the security headers twice
              fastcgi_param front_controller_active true;     # Enable pretty urls
              fastcgi_pass php-handler;
              
              fastcgi_intercept_errors on;
              fastcgi_request_buffering off;
          }
          
          location ~ \.(?:css|js|svg|gif)$ {
              try_files $uri /nextcloud/index.php$request_uri;
              expires 6M;         # Cache-Control policy borrowed from `.htaccess`
              access_log off;     # Optional: Don't log access to assets
          }
          
          location ~ \.woff2?$ {
              try_files $uri /nextcloud/index.php$request_uri;
              expires 7d;         # Cache-Control policy borrowed from `.htaccess`
              access_log off;     # Optional: Don't log access to assets
          }
          
          location /nextcloud {
              try_files $uri $uri/ /nextcloud/index.php$request_uri;
          }
      }
  }

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

See `issue #8802 on nextcloud/server <https://github.com/nextcloud/server/issues/8802>` for more information.

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
