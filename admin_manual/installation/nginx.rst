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
   SSL Module documentation <http://wiki.nginx.org/HttpSslModule>`_).
-  ``add_header`` statements are only taken from the current level and are not
   cascaded from or to a different level. All necessary ``add_header``
   statements must be defined in each level needed. For better readability it
   is possible to move *common* add header statements into a separate file
   and include that file wherever necessary. However, each ``add_header``
   statement must be written in a single line to prevent connection problems
   with sync clients.
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
      #server unix:/var/run/php/php7.2-fpm.sock;
  }

  server {
      listen 80;
      listen [::]:80;
      server_name cloud.example.com;
      # enforce https
      return 301 https://$server_name:443$request_uri;
  }

  server {
      listen 443 ssl http2;
      listen [::]:443 ssl http2;
      server_name cloud.example.com;

      # Use Mozilla's guidelines for SSL/TLS settings
      # https://mozilla.github.io/server-side-tls/ssl-config-generator/
      # NOTE: some settings below might be redundant
      ssl_certificate /etc/ssl/nginx/cloud.example.com.crt;
      ssl_certificate_key /etc/ssl/nginx/cloud.example.com.key;

      # Add headers to serve security related headers
      # Before enabling Strict-Transport-Security headers please read into this
      # topic first.
      #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
      #
      # WARNING: Only add the preload option once you read about
      # the consequences in https://hstspreload.org/. This option
      # will add the domain to a hardcoded list that is shipped
      # in all major browsers and getting removed from this list
      # could take several months.
      add_header Referrer-Policy "no-referrer" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-Download-Options "noopen" always;
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Permitted-Cross-Domain-Policies "none" always;
      add_header X-Robots-Tag "none" always;
      add_header X-XSS-Protection "1; mode=block" always;

      # Remove X-Powered-By, which is an information leak
      fastcgi_hide_header X-Powered-By;

      # Path to the root of your installation
      root /var/www/nextcloud;

      location = /robots.txt {
          allow all;
          log_not_found off;
          access_log off;
      }

      # The following 2 rules are only needed for the user_webfinger app.
      # Uncomment it if you're planning to use this app.
      #rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
      #rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json last;

      # The following rule is only needed for the Social app.
      # Uncomment it if you're planning to use this app.
      #rewrite ^/.well-known/webfinger /public.php?service=webfinger last;

      location = /.well-known/carddav {
        return 301 $scheme://$host:$server_port/remote.php/dav;
      }
      location = /.well-known/caldav {
        return 301 $scheme://$host:$server_port/remote.php/dav;
      }

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

      # Uncomment if your server is build with the ngx_pagespeed module
      # This module is currently not supported.
      #pagespeed off;

      location / {
          rewrite ^ /index.php$request_uri;
      }

      location ~ ^\/(?:build|tests|config|lib|3rdparty|templates|data)\/ {
          deny all;
      }
      location ~ ^\/(?:\.|autotest|occ|issue|indie|db_|console) {
          deny all;
      }

      location ~ ^\/(?:index|remote|public|cron|core\/ajax\/update|status|ocs\/v[12]|updater\/.+|oc[ms]-provider\/.+)\.php(?:$|\/) {
          fastcgi_split_path_info ^(.+?\.php)(\/.*|)$;
          include fastcgi_params;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          fastcgi_param PATH_INFO $fastcgi_path_info;
          fastcgi_param HTTPS on;
          # Avoid sending the security headers twice
          fastcgi_param modHeadersAvailable true;
          # Enable pretty urls
          fastcgi_param front_controller_active true;
          fastcgi_pass php-handler;
          fastcgi_intercept_errors on;
          fastcgi_request_buffering off;
      }

      location ~ ^\/(?:updater|oc[ms]-provider)(?:$|\/) {
          try_files $uri/ =404;
          index index.php;
      }

      # Adding the cache control header for js, css and map files
      # Make sure it is BELOW the PHP block
      location ~ \.(?:css|js|woff2?|svg|gif|map)$ {
          try_files $uri /index.php$request_uri;
          add_header Cache-Control "public, max-age=15778463";
          # Add headers to serve security related headers (It is intended to
          # have those duplicated to the ones above)
          # Before enabling Strict-Transport-Security headers please read into
          # this topic first.
          #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
          #
          # WARNING: Only add the preload option once you read about
          # the consequences in https://hstspreload.org/. This option
          # will add the domain to a hardcoded list that is shipped
          # in all major browsers and getting removed from this list
          # could take several months.
          add_header Referrer-Policy "no-referrer" always;
          add_header X-Content-Type-Options "nosniff" always;
          add_header X-Download-Options "noopen" always;
          add_header X-Frame-Options "SAMEORIGIN" always;
          add_header X-Permitted-Cross-Domain-Policies "none" always;
          add_header X-Robots-Tag "none" always;
          add_header X-XSS-Protection "1; mode=block" always;

          # Optional: Don't log access to assets
          access_log off;
      }

      location ~ \.(?:png|html|ttf|ico|jpg|jpeg|bcmap)$ {
          try_files $uri /index.php$request_uri;
          # Optional: Don't log access to other assets
          access_log off;
      }
  }

Nextcloud in a subdir of nginx
------------------------------

The following config should be used when Nextcloud is placed within a subdir of
your nginx installation.

.. code-block:: nginx

  upstream php-handler {
      server 127.0.0.1:9000;
      #server unix:/var/run/php/php7.2-fpm.sock;
  }

  server {
      listen 80;
      listen [::]:80;
      server_name cloud.example.com;
      # enforce https
      return 301 https://$server_name:443$request_uri;
  }

  server {
      listen 443 ssl http2;
      listen [::]:443 ssl http2;
      server_name cloud.example.com;

      # Use Mozilla's guidelines for SSL/TLS settings
      # https://mozilla.github.io/server-side-tls/ssl-config-generator/
      # NOTE: some settings below might be redundant
      ssl_certificate /etc/ssl/nginx/cloud.example.com.crt;
      ssl_certificate_key /etc/ssl/nginx/cloud.example.com.key;

      # Add headers to serve security related headers
      # Before enabling Strict-Transport-Security headers please read into this
      # topic first.
      #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
      #
      # WARNING: Only add the preload option once you read about
      # the consequences in https://hstspreload.org/. This option
      # will add the domain to a hardcoded list that is shipped
      # in all major browsers and getting removed from this list
      # could take several months.
      add_header Referrer-Policy "no-referrer" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-Download-Options "noopen" always;
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Permitted-Cross-Domain-Policies "none" always;
      add_header X-Robots-Tag "none" always;
      add_header X-XSS-Protection "1; mode=block" always;

      # Remove X-Powered-By, which is an information leak
      fastcgi_hide_header X-Powered-By;

      # Path to the root of your installation
      root /var/www;

      location = /robots.txt {
          allow all;
          log_not_found off;
          access_log off;
      }

      # The following 2 rules are only needed for the user_webfinger app.
      # Uncomment it if you're planning to use this app.
      #rewrite ^/.well-known/host-meta /nextcloud/public.php?service=host-meta last;
      #rewrite ^/.well-known/host-meta.json /nextcloud/public.php?service=host-meta-json last;

      # The following rule is only needed for the Social app.
      # Uncomment it if you're planning to use this app.
      #rewrite ^/.well-known/webfinger /nextcloud/public.php?service=webfinger last;

      location = /.well-known/carddav {
        return 301 $scheme://$host:$server_port/nextcloud/remote.php/dav;
      }
      location = /.well-known/caldav {
        return 301 $scheme://$host:$server_port/nextcloud/remote.php/dav;
      }

      location /.well-known/acme-challenge { }

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

          # Uncomment if your server is build with the ngx_pagespeed module
          # This module is currently not supported.
          #pagespeed off;

          location /nextcloud {
              rewrite ^ /nextcloud/index.php$request_uri;
          }

          location ~ ^\/nextcloud\/(?:build|tests|config|lib|3rdparty|templates|data)\/ {
              deny all;
          }
          location ~ ^\/nextcloud\/(?:\.|autotest|occ|issue|indie|db_|console) {
              deny all;
          }

          location ~ ^\/nextcloud\/(?:index|remote|public|cron|core\/ajax\/update|status|ocs\/v[12]|updater\/.+|oc[ms]-provider\/.+)\.php(?:$|\/) {
              fastcgi_split_path_info ^(.+?\.php)(\/.*|)$;
              include fastcgi_params;
              fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
              fastcgi_param PATH_INFO $fastcgi_path_info;
              fastcgi_param HTTPS on;
              # Avoid sending the security headers twice
              fastcgi_param modHeadersAvailable true;
              # Enable pretty urls
              fastcgi_param front_controller_active true;
              fastcgi_pass php-handler;
              fastcgi_intercept_errors on;
              fastcgi_request_buffering off;
          }

          location ~ ^\/nextcloud\/(?:updater|oc[ms]-provider)(?:$|\/) {
              try_files $uri/ =404;
              index index.php;
          }

          # Adding the cache control header for js, css and map files
          # Make sure it is BELOW the PHP block
          location ~ ^\/nextcloud\/.+[^\/]\.(?:css|js|woff2?|svg|gif|map)$ {
              try_files $uri /nextcloud/index.php$request_uri;
              add_header Cache-Control "public, max-age=15778463";
              # Add headers to serve security related headers  (It is intended
              # to have those duplicated to the ones above)
              # Before enabling Strict-Transport-Security headers please read
              # into this topic first.
              #add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
              #
              # WARNING: Only add the preload option once you read about
              # the consequences in https://hstspreload.org/. This option
              # will add the domain to a hardcoded list that is shipped
              # in all major browsers and getting removed from this list
              # could take several months.
              add_header Referrer-Policy "no-referrer" always;
              add_header X-Content-Type-Options "nosniff" always;
              add_header X-Download-Options "noopen" always;
              add_header X-Frame-Options "SAMEORIGIN" always;
              add_header X-Permitted-Cross-Domain-Policies "none" always;
              add_header X-Robots-Tag "none" always;
              add_header X-XSS-Protection "1; mode=block" always;

              # Optional: Don't log access to assets
              access_log off;
          }

          location ~ ^\/nextcloud\/.+[^\/]\.(?:png|html|ttf|ico|jpg|jpeg|bcmap)$ {
              try_files $uri /nextcloud/index.php$request_uri;
              # Optional: Don't log access to other assets
              access_log off;
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
