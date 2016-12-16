============================
Nginx Example Configurations
============================

This page covers example Nginx configurations to use with running an Nextcloud 
server. Note that Nginx is not officially supported, and this page is 
community-maintained. (Thank you, contributors!)


-  You need to insert the following code into **your Nginx configuration file.**
-  The configuration assumes that Nextcloud is installed in 
   ``/var/www/nextcloud`` and that it is accessed via 
   ``http(s)://cloud.example.com``.
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

Example Configurations
----------------------

- :doc:`nginx_nextcloud_9x`

You can use Nextcloud over plain http, but we strongly encourage you to use 
SSL/TLS to encrypt all of your server traffic, and to protect user's logins and 
data in transit.

-  Remove the server block containing the redirect
-  Change **listen 443 ssl** to **listen 80;**
-  Remove **ssl_certificate** and **ssl_certificate_key**.
-  Remove **fastcgi_params HTTPS on;**

Suppressing Log Messages
========================

If you're seeing meaningless messages in your logfile, for example `client 
denied by server configuration: /var/www/data/htaccesstest.txt 
<https://forum.owncloud.org/viewtopic.php?f=17&t=20217>`_, add this section to 
your nginx configuration to suppress them:

.. code-block:: nginx

        location = /data/htaccesstest.txt {
          allow all;
          log_not_found off;
          access_log off;
        }

JavaScript (.js) or CSS (.css) files not served properly
========================================================

A common issue with custom nginx configs is that JavaScript (.js)
or CSS (.css) files are not served properly leading to a 404 (File not found)
error on those files and a broken webinterface.

This could be caused by the:

.. code-block:: nginx

        location ~* \.(?:css|js)$ {

block shown above not located **below** the:

.. code-block:: nginx

        location ~ \.php(?:$|/) {

block. Other custom configurations like caching JavaScript (.js)
or CSS (.css) files via gzip could also cause such issues.

Performance Tuning
==================

* `nginx (<1.9.5) <ngx_http_spdy_module <http://nginx.org/en/docs/http/ngx_http_spdy_module.html>`_
* `nginx (+1.9.5) <ngx_http_http2_module <http://nginx.org/en/docs/http/ngx_http_v2_module.html>`_

To use http_v2 for nginx you have to check two things:

1.) be aware that this module is not built in by default due to a dependency 
to the openssl version used on your system. It will be enabled with the 
``--with-http_v2_module`` configuration parameter during compilation. The 
dependency should be checked automatically. You can check the presence of 
http_v2 with ``nginx -V 2>&1 | grep http_v2 -o``. An example of how to 
compile nginx can be found in section "Configure nginx with the 
``nginx-cache-purge`` module" below.
   
2.) When you have used SPDY before, the nginx config has to be changed from 
``listen 443 ssl spdy;`` to ``listen 443 ssl http2;``

nginx: caching Nextcloud gallery thumbnails
===========================================

One of the optimizations for Nextcloud when using nginx as the Web server is to 
combine FastCGI caching with "Cache Purge", a `3rdparty nginx module 
<http://wiki.nginx.org/3rdPartyModules>`_  that adds the ability to purge 
content from `FastCGI`, `proxy`, `SCGI` and `uWSGI` caches. This mechanism 
speeds up thumbnail presentation as it shifts requests to nginx and minimizes 
php invocations which otherwise would take place for every thumbnail presented 
every time.
 
The following procedure is based on an Ubuntu 14.04 system. You may need to 
adapt it according your OS type and release.

.. note::
   Unlike Apache, nginx does not dynamically load modules. All modules needed 
   must be compiled into nginx. This is one of the reasons for nginx´s 
   performance. It is expected to have an already running nginx installation 
   with a working configuration set up as described in the Nextcloud 
   documentation.

nginx module check
==================

As a first step, it is necessary to check if your nginx installation has the 
``nginx cache purge`` module compiled in::
 
 nginx -V 2>&1 | grep ngx_cache_purge -o
 
If your output contains ``ngx_cache_purge``, you can continue with the 
configuration, otherwise you need to manually compile nginx with the module 
needed.

Compile nginx with the ``nginx-cache-purge`` module
===================================================

1. **Preparation:**

::

    cd /opt
    wget http://nginx.org/keys/nginx_signing.key
    sudo apt-key add nginx_signing.key
    sudo vi /etc/apt/sources.list.d/nginx.list
    
Add the following lines (if different, replace ``{trusty}`` by your 
distribution name)::

   deb http://nginx.org/packages/mainline/ubuntu/ trusty nginx
   deb -src http://nginx.org/packages/mainline/ubuntu/ trusty nginx    

Then run ``sudo apt-get update``

.. note:: If you're not overly cautious and wish to install the latest and 
   greatest nginx packages and features, you may have to install nginx from its 
   mainline repository. From the nginx homepage: "In general, you should 
   deploy nginx from its mainline branch at all times." If you would like to 
   use standard nginx from the latest mainline branch but without compiling in 
   any additional modules, just run ``sudo apt-get install nginx``.   

2. **Download the nginx source from the ppa repository**

::

   cd /opt
   sudo apt-get build-dep nginx
   sudo apt-get source nginx

3. **Download module(s) to be compiled in and configure compiler arguments**
    
:: 
   
   ls -la
    
Please replace ``{release}`` with the release downloaded::

   cd /opt/nginx-{release}/debian
    
If folder "modules" is not present, do:

::

   sudo mkdir modules
   cd modules
   sudo git clone https://github.com/FRiCKLE/ngx_cache_purge.git
   sudo vi /opt/nginx-{release}/debian/rules
    
If not present, add the following line at the top under::

   #export DH_VERBOSE=1:
   MODULESDIR = $(CURDIR)/debian/modules
   
And at the end of every ``configure`` command add::

  --add-module=$(MODULESDIR)/ngx_cache_purge
    
Don't forget to escape preceding lines with a backslash ``\``.
The parameters may now look like::
      
   --with-cc-opt="$(CFLAGS)" \
   --with-ld-opt="$(LDFLAGS)" \
   --with-ipv6 \
   --add-module=$(MODULESDIR)/ngx_cache_purge

4. **Compile and install nginx**

::

   cd /opt/nginx-{release}
   sudo dpkg-buildpackage -uc -b
   ls -la /opt
   sudo dpkg --install /opt/nginx_{release}~{distribution}_amd64.deb

5. **Check if the compilation and installation of the ngx_cache_purge module 
   was successful**
   
::  

   nginx -V 2>&1 | grep ngx_cache_purge -o
    
It should now show: ``ngx_cache_purge``
    
Show nginx version including all features compiled and installed::

   nginx -V 2>&1 | sed s/" --"/"\n\t--"/g

6. **Mark nginx to be blocked from further updates via apt-get**

::

   sudo dpkg --get-selections | grep nginx
    
For every nginx component listed run ``sudo apt-mark hold <component>``   

7. **Regular checks for nginx updates**

Do a regular visit on the `nginx news page <http://nginx.org>`_ and proceed 
in case of updates with items 2 to 5.

Configure nginx with the ``nginx-cache-purge`` module
=====================================================

1. **Preparation**
   Create a directory where nginx will save the cached thumbnails. Use any 
   path that fits to your environment. Replace ``{path}`` in this example with 
   your path created:
   
::   
   
   sudo mkdir -p /usr/local/tmp/cache   

2. **Configuration**

::

   sudo vi /etc/nginx/sites-enabled/{your-nextcloud-nginx-config-file}
   
Add at the *beginning*, but *outside* the ``server{}`` block:

.. code-block:: nginx

   # cache_purge
   fastcgi_cache_path {path} levels=1:2 keys_zone=NEXTCLOUD:100m inactive=60m;
   map $request_uri $skip_cache {
        default 1;
        ~*/thumbnail.php 0;
        ~*/apps/galleryplus/ 0;
        ~*/apps/gallery/ 0;
   }

.. note:: Please adopt or delete any regex line in the ``map`` block according 
   your needs and the Nextcloud version used.
   As an alternative to mapping, you can use as many ``if`` statements in 
   your server block as necessary:

   .. code-block:: nginx
   
    set $skip_cache 1;
    if ($request_uri ~* "thumbnail.php")      { set $skip_cache 0; }
    if ($request_uri ~* "/apps/galleryplus/") { set $skip_cache 0; }
    if ($request_uri ~* "/apps/gallery/")     { set $skip_cache 0; }

Add *inside* the ``server{}`` block, as an example of a configuration:

.. code-block:: nginx   
   
   # cache_purge (with $http_cookies we have unique keys for the user)
   fastcgi_cache_key $http_cookie$request_method$host$request_uri;
   fastcgi_cache_use_stale error timeout invalid_header http_500;
   fastcgi_ignore_headers Cache-Control Expires Set-Cookie;
   
   location ~ \.php(?:$/) {
         fastcgi_split_path_info ^(.+\.php)(/.*)$;
       
         include fastcgi_params;
         fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
         fastcgi_param PATH_INFO $fastcgi_path_info;
         fastcgi_param HTTPS on;
         fastcgi_pass php-handler;
         fastcgi_request_buffering off; #Available since nginx 1.7.11
       
         # cache_purge
         fastcgi_cache_bypass $skip_cache;
         fastcgi_no_cache $skip_cache;
         fastcgi_cache NEXTCLOUD;
         fastcgi_cache_valid  60m;
         fastcgi_cache_methods GET HEAD;
         }
   
.. note:: Note regarding the ``fastcgi_pass`` parameter:
   Use whatever fits your configuration. In the example above, an ``upstream`` 
   was defined in an nginx global configuration file.
   This may look like:

   .. code-block:: nginx
       
      upstream php-handler {
          server unix:/var/run/php5-fpm.sock;
          # or
          # server 127.0.0.1:9000;
      } 
   
3. **Test the configuration**

::

   sudo nginx -s reload
   
*  Open your browser and clear your cache.   
*  Logon to your Nextcloud instance, open the gallery app, move through your
   folders and watch while the thumbnails are generated for the first time.
*  You may also watch with eg. ``htop`` your system load while the 
   thumbnails are processed.
*  Go to another app or logout and relogon.
*  Open the gallery app again and browse to the folders you accessed before.
   Your thumbnails should appear more or less immediately.
*  ``htop`` will not show up additional load while processing, compared to 
   the high load before.
