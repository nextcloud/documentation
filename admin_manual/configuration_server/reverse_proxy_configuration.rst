===========================
Reverse proxy configuration
===========================

Nextcloud can be run through a reverse proxy, which can cache static assets such
as images, CSS or JS files, move the load of handling HTTPS to a different
server or load balance between multiple servers.
In this example, we will be assuming that we are using NGiNX and Certbot.

Setting up Reverse Proxy
------------------------

All requests will initially be received by the reverse proxy which will then
perform SSL termination and route the request to the correct server. SSL
certificate is managed by Certbot.

We will need to configure the reverse proxy to handle the requests. So we will
utilize the following configuration on the reverse proxy server:

::

 server {
    listen 80;
	  server_name nextcloud.domain.com;

	return 301 https://$server_name$request_uri;
  location /.well-known {
    root /var/www/nextcloud/;
    allow all;
  }
  }

 server {
	listen 443 ssl;
	server_name nextcloud.domain.com;

	access_log /var/log/nginx/nextcloud.domain.com.access.log;
	error_log /var/log/nginx/nextcloud.domain.com.error.log;

	client_max_body_size 0;
	underscores_in_headers on;

	ssl on;
        ssl_certificate /etc/letsencrypt/live/nextcloud.domain.com/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/nextcloud.domain.com/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

	ssl_stapling on;
	ssl_stapling_verify on;

	location / {
		proxy_headers_hash_max_size 512;
		proxy_headers_hash_bucket_size 64;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

		add_header Front-End-Https on;
		# whatever the IP of your cloud server is
		proxy_pass http://IP_OF_NEXTCLOUD_SERVER;
	}
 }

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

Nextcloud Configuration
------------------------
On the server with Nextcloud installed we will install Nextcloud in the /usr/share/nginx directory and we will add the following configuration in NGiNX:

::

 server {
    listen 80;
    server_name nextcloud.domain.com;

    # Add headers to serve security related headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Robots-Tag none;
    add_header X-Download-Options noopen;
    add_header X-Permitted-Cross-Domain-Policies none;

    # Path to the root of your installation
    root /usr/share/nginx/nextcloud/;

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }



    # The following 2 rules are only needed for the user_webfinger app.
    # Uncomment it if you're planning to use this app.
    #rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
    #rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json
    # last;

    location = /.well-known/carddav {
        return 301 $scheme://$host/remote.php/dav;
    }
    location = /.well-known/caldav {
       return 301 $scheme://$host/remote.php/dav;
    }

    location ~ /.well-known/acme-challenge {
      allow all;
    }

    # set max upload size
    client_max_body_size 512M;
    fastcgi_buffers 64 4K;

    # Disable gzip to avoid the removal of the ETag header
    gzip off;

    # Uncomment if your server is build with the ngx_pagespeed module
    # This module is currently not supported.
    #pagespeed off;

    error_page 403 /core/templates/403.php;
    error_page 404 /core/templates/404.php;

    location / {
       rewrite ^ /index.php$uri;
    }

    location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)/ {
       deny all;
    }
    location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console) {
       deny all;
     }

    location ~ ^/(?:index|remote|public|cron|core/ajax/update|status|ocs/v[12]|updater/.+|ocs-provider/.+|core/templates/40[34])\.php(?:$|/) {
       include fastcgi_params;
       fastcgi_split_path_info ^(.+\.php)(/.*)$;
       fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       fastcgi_param PATH_INFO $fastcgi_path_info;
       #Avoid sending the security headers twice
       fastcgi_param modHeadersAvailable true;
       fastcgi_param front_controller_active true;
       fastcgi_pass unix:/run/php/php7.2-fpm.sock;
       fastcgi_intercept_errors on;
       fastcgi_request_buffering off;
    }

    location ~ ^/(?:updater|ocs-provider)(?:$|/) {
       try_files $uri/ =404;
       index index.php;
    }

    # Adding the cache control header for js and css files
    # Make sure it is BELOW the PHP block
    location ~* \.(?:css|js)$ {
        try_files $uri /index.php$uri$is_args$args;
        add_header Cache-Control "public, max-age=7200";
        # Add headers to serve security related headers (It is intended to
        # have those duplicated to the ones above)
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Robots-Tag none;
        add_header X-Download-Options noopen;
        add_header X-Permitted-Cross-Domain-Policies none;
        # Optional: Don't log access to assets
        access_log off;
   }

   location ~* \.(?:svg|gif|png|html|ttf|woff|ico|jpg|jpeg)$ {
        try_files $uri /index.php$uri$is_args$args;
        # Optional: Don't log access to other assets
        access_log off;
   }
 }

For the config.php portion we have used the following configuration:

::

 <?php
  $CONFIG = array (
  'instanceid' => '[IGNORE_THIS_PART]',
  'passwordsalt' => '[IGNORE_THIS_PART]',
  'secret' => '[IGNORE_THIS_PART]',
  'trusted_domains' =>
  array (
    0 => 'nextcloud.domain.com',
  ),
  'trusted_proxies'   => ['IP_OF_REVERSE_PROXY'],
  'overwrite.cli.url' => 'https://nextcloud.domain.com',
  'overwritehost'     => 'nextcloud.domain',
  'overwriteprotocol' => 'https',
  'datadirectory' => '/usr/share/nginx/nextcloud/data',
  'dbtype' => 'mysql',
  'version' => '13.0.0.14',
  'dbname' => 'cloud',
  'dbhost' => 'localhost',
  'dbport' => '',
  'dbtableprefix' => 'oc_',
  'mysql.utf8mb4' => true,
  'dbuser' => 'oc_superoffice',
  'dbpassword' => '[IGNORE_THIS_PART]',
  'installed' => true,
  'mail_smtpmode' => 'smtp',
  'mail_smtpauthtype' => 'LOGIN',
  'mail_smtpsecure' => 'ssl',
  'mail_from_address' => 'nextcloud',
  'mail_domain' => 'domain.com',
  'mail_smtpauth' => 1,
  'mail_smtphost' => 'smtp.domain.com',
  'mail_smtpport' => '465',
  'mail_smtpname' => 'nextcloud@domain.com',
  'mail_smtppassword' => [IGNORE_THIS_PART]',
    );

Please take note that most details written in the config.php file will be done by Nextcloud itself but it is important to add:

::

  'trusted_proxies'   => ['IP_OF_REVERSE_PROXY'],
  'overwrite.cli.url' => 'https://nextcloud.domain.com',
  'overwritehost'     => 'nextcloud.domain',
  'overwriteprotocol' => 'https',

This will set for Nextcloud to trust the reverse proxy and properly function. Because we do not have additional websites or Nextcloud websites running on the same server we do not have to set the specific directory:

::

    'overwritewebroot'  => '/domain.tld/nextcloud',
    'overwritecondaddr' => '^10\.0\.0\.1$',

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
    'trusted_proxies'   => ['10.0.0.1'],
    'overwritehost'     => 'ssl-proxy.tld',
    'overwriteprotocol' => 'https',
    'overwritewebroot'  => '/domain.tld/nextcloud',
    'overwritecondaddr' => '^10\.0\.0\.1$',
  );

.. note:: If you want to use the SSL proxy during installation you have to
  create the :file:`config/config.php` otherwise you have to extend the existing
  **$CONFIG** array.
