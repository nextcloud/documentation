Nginx Configuration
===================

-  You need to insert the following code into **your nginx config file.**
-  The config assumes that ownCloud is installed in /var/www/owncloud and
   that it is accessed via http(s)://cloud.example.com.
-  Adjust **server_name**, **root**, **ssl_certificate** and 
   **ssl_certificate_key** to suit your needs.
-  Make sure your SSL certificates are readable by the server (see `Nginx HTTP 
   SSL Module documentation <http://wiki.nginx.org/HttpSslModule>`_).

.. code-block:: python

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

    # Path to the root of your installation
    root /var/www/owncloud/;
    # set max upload size 
    client_max_body_size 10G;             
    fastcgi_buffers 64 4K;

    rewrite ^/caldav(.*)$ /remote.php/caldav$1 redirect;
    rewrite ^/carddav(.*)$ /remote.php/carddav$1 redirect;
    rewrite ^/webdav(.*)$ /remote.php/webdav$1 redirect;

    index index.php;
    error_page 403 /core/templates/403.php;
    error_page 404 /core/templates/404.php;

    location = /robots.txt {
      allow all;
      log_not_found off;
      access_log off;
      }

    location ~ ^/(?:\.htaccess|data|config|db_structure\.xml|README){
      deny all;
      }

    location / {
     # The following 2 rules are only needed with webfinger
     rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
     rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json last;

     rewrite ^/.well-known/carddav /remote.php/carddav/ redirect;
     rewrite ^/.well-known/caldav /remote.php/caldav/ redirect;

     rewrite ^(/core/doc/[^\/]+/)$ $1/index.html;

     try_files $uri $uri/ /index.php;
     }

     location ~ \.php(?:$|/) {
     fastcgi_split_path_info ^(.+\.php)(/.+)$;
     include fastcgi_params;
     fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
     fastcgi_param PATH_INFO $fastcgi_path_info;
     fastcgi_param HTTPS on;
     fastcgi_pass php-handler;
     }

     # Optional: set long EXPIRES header on static assets
     location ~* \.(?:jpg|jpeg|gif|bmp|ico|png|css|js|swf)$ {
         expires 30d;
         # Optional: Don't log access to assets
           access_log off;
     }

    }

.. note:: You can use ownCloud over plain http, but we strongly encourage you to
          use SSL/TLS to encrypt all of your server traffic, and to protect 
          user's logins and data in transit.

-  Remove the server block containing the redirect
-  Change **listen 443 ssl** to **listen 80;**
-  Remove **ssl_certificate** and **ssl_certificate_key**.
-  Remove **fastcgi_params HTTPS on;**

.. note:: If you want to effectively increase maximum upload size you will also
          have to modify your **php-fpm configuration** (**usually at
          /etc/php5/fpm/php.ini**) and increase **upload_max_filesize** and
          **post_max_size** values. You’ll need to restart php5-fpm and nginx
	  services in order these changes to be applied.

.. note:: ownCloud comes with its own ``owncloud/.htaccess`` file. If PHP-FPM is used, it can't read ``.htaccess`` PHP settings unless a PECL extension is installed. If PHP-FPM is used without the PECL extension installed, settings and permissions must be set in the ``owncloud/.user.ini`` file.
