=================================================
Nginx configuration for the ownCloud 8.x branches
=================================================

ownCloud in the webroot of nginx
--------------------------------

The following configuration should be used when ownCloud is placed in the 
webroot of your Nginx installation. Be careful about line breaks if you copy 
the examples, as long lines may be broken for page formatting.

::

  upstream php-handler {
      server 127.0.0.1:9000;
      #server unix:/var/run/php5-fpm.sock;
  }

  server {
      listen 80;
      server_name cloud.example.com;
      # enforce https
      return 301 https://$server_name$request_uri;  
  }

  server {
      listen 443 ssl;
      server_name cloud.example.com;

      ssl_certificate /etc/ssl/nginx/cloud.example.com.crt;
      ssl_certificate_key /etc/ssl/nginx/cloud.example.com.key;

      # Add headers to serve security related headers
      # Before enabling Strict-Transport-Security headers please read into this 
      # topic first.
      # add_header Strict-Transport-Security "max-age=15768000; 
      # includeSubDomains; preload;";
      add_header X-Content-Type-Options nosniff;
      add_header X-Frame-Options "SAMEORIGIN";
      add_header X-XSS-Protection "1; mode=block";
      add_header X-Robots-Tag none;

      # Path to the root of your installation
      root /var/www/owncloud/;

      # set max upload size 
      client_max_body_size 512M;             
      fastcgi_buffers 64 4K;

      # Disable gzip to avoid the removal of the ETag header
      gzip off;

      # Uncomment if your server is build with the ngx_pagespeed module
      # This module is currently not supported.
      #pagespeed off;

      index index.php;
      error_page 403 /core/templates/403.php;
      error_page 404 /core/templates/404.php;

      rewrite ^/.well-known/carddav /remote.php/carddav/ permanent;
      rewrite ^/.well-known/caldav /remote.php/caldav/ permanent;

      # The following 2 rules are only needed for the user_webfinger app.
      # Uncomment it if you're planning to use this app.
      #rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
      #rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json 
      # last;

      location = /robots.txt {
          allow all;
          log_not_found off;
          access_log off;
      }

      location ~ ^/(build|tests|config|lib|3rdparty|templates|data)/ {
          deny all;
      }

      location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console) {
          deny all;
      }

      location / {

          rewrite ^/remote/(.*) /remote.php last;
          rewrite ^(/core/doc/[^\/]+/)$ $1/index.html;

          try_files $uri $uri/ =404;
      }

      location ~ \.php(?:$|/) {
          fastcgi_split_path_info ^(.+\.php)(/.+)$;
          include fastcgi_params;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          fastcgi_param PATH_INFO $fastcgi_path_info;
          fastcgi_param HTTPS on;
          #Avoid sending the security headers twice
          fastcgi_param modHeadersAvailable true; 
          fastcgi_pass php-handler;
          fastcgi_intercept_errors on;
          fastcgi_request_buffering off;
      }

      # Adding the cache control header for js and css files
      # Make sure it is BELOW the location ~ \.php(?:$|/) { block
      location ~* \.(?:css|js)$ {
          add_header Cache-Control "public, max-age=7200";
          # Add headers to serve security related headers  (It is intended to 
          # have those duplicated to the ones above)
          # Before enabling Strict-Transport-Security headers please read into 
          # this topic first.
          # add_header Strict-Transport-Security "max-age=15768000; 
          # includeSubDomains; preload;";
          add_header X-Content-Type-Options nosniff;
          add_header X-Frame-Options "SAMEORIGIN";
          add_header X-XSS-Protection "1; mode=block";
          add_header X-Robots-Tag none;
          # Optional: Don't log access to assets
          access_log off;
      }

      # Optional: Don't log access to other assets
      location ~* \.(?:jpg|jpeg|gif|bmp|ico|png|swf)$ {
          access_log off;
      }
    }

ownCloud in a subdir of nginx
------------------------------

The following config should be used when ownCloud is placed within a subdir of 
your nginx installation.

.. note:: This config is currently untested

::

  upstream php-handler {
      server 127.0.0.1:9000;
      #server unix:/var/run/php5-fpm.sock;
  }

  server {
      listen 80;
      server_name example.com;
      # enforce https
      return 301 https://$server_name$request_uri;
  }

  server {
      listen 443 ssl;
      server_name example.com;
  
      ssl_certificate /etc/ssl/nginx/cloud.example.com.crt;
      ssl_certificate_key /etc/ssl/nginx/cloud.example.com.key;
  
      # Add headers to serve security related headers
      # Before enabling Strict-Transport-Security headers please read into this 
      # topic first.
      # add_header Strict-Transport-Security "max-age=15768000; 
      # includeSubDomains; preload;";
      add_header X-Content-Type-Options nosniff;
      add_header X-Frame-Options "SAMEORIGIN";
      add_header X-XSS-Protection "1; mode=block";
      add_header X-Robots-Tag none;
  
      # Path to the root of your website (one level above owncloud folder)
      root /var/www;
  
      rewrite ^/.well-known/carddav /owncloud/remote.php/carddav/ redirect;
      rewrite ^/.well-known/caldav /owncloud/remote.php/caldav/ redirect;

      # The following 2 rules are only needed for the user_webfinger app.
      # Uncomment it if you're planning to use this app.
      #rewrite ^/.well-known/host-meta /owncloud/public.php?service=host-meta 
      # last;
      #rewrite ^/.well-known/host-meta.json 
      # /owncloud/public.php?service=host-meta-json last;

      location = /robots.txt {
          allow all;
          log_not_found off;
          access_log off;
      }
  
      location ^~ /owncloud {
  
          # set max upload size
          client_max_body_size 512M;
          fastcgi_buffers 64 4K;
  
          # Disable gzip to avoid the removal of the ETag header
          gzip off;
  
          # Uncomment if your server is build with the ngx_pagespeed module
          # This module is currently not supported.
          #pagespeed off;
  
          index index.php;
  
          error_page 403 /owncloud/core/templates/403.php;
          error_page 404 /owncloud/core/templates/404.php;
  
          location ~ 
          ^/owncloud/(build|tests|config|lib|3rdparty|templates|data)/ {
              deny all;
          }

          location ~ ^/owncloud/(?:\.|autotest|occ|issue|indie|db_|console) {
              deny all;
          }
  
          rewrite ^/owncloud/remote/(.*) /owncloud/remote.php last;
          rewrite ^/owncloud/core/doc/([^\/]+)(?:$|/) 
           /owncloud/core/doc/$1/index.html;
 
          try_files $uri $uri/ =404;
  
          location ~ \.php(?:$|/) {
              fastcgi_split_path_info ^(.+\.php)(/.+)$;
              include fastcgi_params;
              fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
              fastcgi_param PATH_INFO $fastcgi_path_info;
              fastcgi_param HTTPS on;
              #Avoid sending the security headers twice
              fastcgi_param modHeadersAvailable true; 
              fastcgi_pass php-handler;
              fastcgi_intercept_errors on;
              fastcgi_request_buffering off;
          }
  
          # Adding the cache control header for js and css files
          # Make sure it is BELOW the location ~ \.php(?:$|/) { block
          location ~* \.(?:css|js)$ {
              add_header Cache-Control "public, max-age=7200";
              # Add headers to serve security related headers  (It is intended 
              # to have those duplicated to the ones above)
              # Before enabling Strict-Transport-Security headers please read 
              # into this topic first.
              # add_header Strict-Transport-Security "max-age=15768000; 
              # includeSubDomains; preload;";
              add_header X-Content-Type-Options nosniff;
              add_header X-Frame-Options "SAMEORIGIN";
              add_header X-XSS-Protection "1; mode=block";
              add_header X-Robots-Tag none;
              # Optional: Don't log access to assets
              access_log off;
          }

          # Optional: Don't log access to other assets
          location ~* \.(?:jpg|jpeg|gif|bmp|ico|png|swf)$ {
              access_log off;
          }
      }
  }
