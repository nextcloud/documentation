===============
Web server Tips
===============

PHP safe mode
-------------

PHP safe mode has to be turned off. It is deprecated and has been removed in 
newer PHP versions. Verify its status with :ref:`label-phpinfo`, and look for 
``safe_mode 
on/off``. If it is on, then add this line to ``php.ini`` to turn it off::

 safe_mode = Off


Enable the SPDY / http_v2 protocol
----------------------------------

Your Web server can be configured to use the SPDY / http_v2 protocol which could improve 
the overall performance of ownCloud. Please have a look at the documentation of 
your Web servers module for more information:

====================  ==================
Web server            Module Name / Link
====================  ==================
Apache                `mod-spdy <https://code.google.com/p/mod-spdy/>`_
nginx (<1.9.5)        `ngx_http_spdy_module <http://nginx.org/en/docs/http/ngx_http_spdy_module.html>`_
nginx (+1.9.5)        `ngx_http_http2_module <http://nginx.org/en/docs/http/ngx_http_v2_module.html>`_
====================  ==================

.. note:: If you want to enable SPDY for Apache please note the `Known Issues 
   <https://code.google.com/p/mod-spdy/wiki/KnownIssues>`_
   of this module to avoid problems after enabling it.

.. note:: If you want to use http_v2 for nginx you have to check two things:

   1.) be aware that this module is not built in by default due to a dependency 
   to the openssl version used on your system. It will be enabled with the 
   ``--with-http_v2_module`` configuration parameter during compilation. The 
   dependency should be checked automatically. You can check the presence of http_v2
   with ``nginx -V 2>&1 | grep http_v2 -o``. An example how to compile nginx can
   be found in section "Configure Nginx with the ``nginx-cache-purge`` module" below.
   
   2.) When you have used SPDY before, the nginx config has to be changed from 
   ``listen 443 ssl spdy;`` to ``listen 443 ssl http2;``

Apache Tuning
-------------

Maximum number of Apache processes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

An Apache process uses around 12MB of RAM. Apache should be configured so that 
the maximum number of HTTPD processes times 12MB is lower than the amount of 
RAM. Otherwise the system begins to swap and the performance goes down. 

KeepAlive should be configured with sensible defaults
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The KeepAlive directive enables persistent HTTP connections, allowing multiple 
requests to be sent over the same TCP connection. This reduces latency by as 
much as 50%. Especially in combination with the periodic checks of the sync
client the following settings are recommended:

.. code-block:: apache

	KeepAlive On
	KeepAliveTimeout 100
	MaxKeepAliveRequests 200

mod_gzip
^^^^^^^^

``mod_gzip`` should be used because it speeds up the transfer of data and 
helps to free server memory, and HTTP connections are closed faster.

MPM
^^^

Apache prefork has to be used. Don’t use threaded ``mpm`` with ``mod_php`` 
because PHP is currently not thread safe.

Hostname Lookups
^^^^^^^^^^^^^^^^

.. code-block:: bash

	# cat /etc/httpd/conf/httpd.conf
        ...
	HostnameLookups off

Log files
^^^^^^^^^

Log files should be switched off for maximum performance.

Comment out the ``CustomLog`` directive. Keep ``ErrorLog`` to be able to track 
down errors.

.. todo: loglevel?

.. commented out until somebody knows what to do with it
.. MaxKeepAliveRequests 4096
.. ^^^^^^^^^^^^^^^^^^^^^^^^^

.. .. code-block:: apache

..	<IfModule prefork.c>
..		StartServers 100
..		MinSpareServers 100
..		MaxSpareServers 2000
..		ServerLimit 6000
..		MaxClients 6000
..		MaxRequestsPerChild 4000
..	</IfModule>

..	<Directory "/var/www/html">
..		Options Indexes SymLinksIfOwnerMatch AllowOverride All
..	</Directory>

Nginx: caching ownCloud gallery thumbnails
------------------------------------------

One of the optimizations for ownCloud when using Nginx as the Web server is to 
combine FastCGI caching with "Cache Purge", a `3rdparty Nginx module 
<http://wiki.nginx.org/3rdPartyModules>`_  that adds the ability to purge 
content from `FastCGI`, `proxy`, `SCGI` and `uWSGI` caches. This mechanism 
speeds up thumbnail presentation as it shifts requests to Nginx and minimizes 
php invocations which otherwise would take place for every thumbnail presented 
every 
time.
 
The following procedure is based on an Ubuntu 14.04 system. You may need to 
adapt it according your OS type and release.

.. note::
   Unlike Apache, Nginx does not dynamically load modules. All modules needed 
   must be compiled into Nginx. This is one of the reasons for Nginx´s 
   performance. It is expected to have an already running Nginx installation 
   with a working configuration set up as described in the ownCloud 
   documentation.

Nginx module check
^^^^^^^^^^^^^^^^^^

As a first step, it is necessary to check if your Nginx installation has the 
``nginx cache purge`` module compiled in::
 
 nginx -V 2>&1 | grep ngx_cache_purge -o
 
If your output contains ``ngx_cache_purge``, you can continue with the 
configuration, otherwise you need to manually compile Nginx with the module 
needed.

Compile Nginx with the ``nginx-cache-purge`` module
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. **Preparation:**

.. code-block:: bash

    cd /opt
    wget http://nginx.org/keys/nginx_signing.key
    sudo apt-key add nginx_signing.key
    sudo vi /etc/apt/sources.list.d/nginx.list
    
Add the following lines (if different, replace ``{trusty}`` by your distribution 
 
name)::

   deb http://nginx.org/packages/mainline/ubuntu/ trusty nginx
   deb -src http://nginx.org/packages/mainline/ubuntu/ trusty nginx    

Then run ``sudo apt-get update``

.. note:: If you're not overly cautious and wish to install the latest and 
   greatest Nginx packages and features, you may have to install Nginx from its 
   mainline repository. From the Nginx homepage: "In general, you should 
   deploy Nginx from its mainline branch at all times." If you would like to 
   use standard Nginx from the latest mainline branch but without compiling in 
   any additional modules, just run ``sudo apt-get install nginx``.   

2. **Download the Nginx source from the ppa repository**

.. code-block:: bash

   cd /opt
   sudo apt-get build-dep nginx
   sudo apt-get source nginx

3. **Download module(s) to be compiled in and configure compiler arguments**
    
.. code-block:: bash 
   
   ls -la
    
Please replace ``{release}`` with the release downloaded::

   cd /opt/nginx-{release}/debian
    
If folder "modules" is not present, do:

.. code-block:: bash

   sudo mkdir modules
   cd modules
   sudo git clone https://github.com/FRiCKLE/ngx_cache_purge.git
   sudo vi /opt/nginx-{release}/debian/rules
    
If not present, add the following line at the top under::

   #export DH_VERBOSE=1:
   MODULESDIR = $(CURDIR)/debian/modules
   
And at the end of every ``configure`` command add::

  --add-module=$(MODULESDIR)/ngx_cache_purge
    
Don't forget to escape preceeding lines with a backslash ``\``.
The parameters may now look like::
      
   --with-cc-opt="$(CFLAGS)" \
   --with-ld-opt="$(LDFLAGS)" \
   --with-ipv6 \
   --add-module=$(MODULESDIR)/ngx_cache_purge

4. **Compile and install Nginx**

.. code-block:: bash

   cd /opt/nginx-{release}
   sudo dpkg-buildpackage -uc -b
   ls -la /opt
   sudo dpkg --install /opt/nginx_{release}~{distribution}_amd64.deb

5. **Check if the compilation and installation of the ngx_cache_purge module 
   was successful**
   
.. code-block:: bash  

   nginx -V 2>&1 | grep ngx_cache_purge -o
    
It should now show: ``ngx_cache_purge``
    
Show Nginx version including all features compiled and installed::

   nginx -V 2>&1 | sed s/" --"/"\n\t--"/g

6. **Mark Nginx to be blocked from further updates via apt-get**

.. code-block:: bash

   sudo dpkg --get-selections | grep nginx
    
For every nginx component listed run ``sudo apt-mark hold <component>``   

7. **Regular checks for nginx updates**

Do a regular visit on the `Nginx news page <http://nginx.org>`_ and proceed 
in case of updates with items 2 to 5.

Configure Nginx with the ``nginx-cache-purge`` module
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. **Preparation**
   Create a directory where Nginx will save the cached thumbnails. Use any 
   path that fits to your environment. Replace ``{path}`` in this example with 
   your path created:
   
.. code-block:: bash   
   
   sudo mkdir -p /usr/local/tmp/cache   

2. **Configuration**

.. code-block:: bash

   sudo vi /etc/nginx/sites-enabled/{your-ownCloud-nginx-config-file}
   
Add at the *beginning*, but *outside* the ``server{}`` block::

   # cache_purge
   fastcgi_cache_path {path} levels=1:2 keys_zone=OWNCLOUD:100m inactive=60m;
   map $request_uri $skip_cache {
        default 1;
        ~*/thumbnail.php 0;
        ~*/apps/galleryplus/ 0;
        ~*/apps/gallery/ 0;
   }

.. note:: Please adopt or delete any regex line in the ``map`` block according 
   your needs and the ownCloud version used.
.. note:: As an alternative to mapping, you can use as many ``if`` statements in 
   your server block as necessary::
   
    set $skip_cache 1;
    if ($request_uri ~* "thumbnail.php")      { set $skip_cache 0; }
    if ($request_uri ~* "/apps/galleryplus/") { set $skip_cache 0; }
    if ($request_uri ~* "/apps/gallery/")     { set $skip_cache 0; }

Add *inside* the ``server{}`` block, as an example of a configuration::
   
   
   # cache_purge (with $http_cookies we have unique keys for the user)
   fastcgi_cache_key $http_cookie$request_method$host$request_uri;
   fastcgi_cache_use_stale error timeout invalid_header http_500;
   fastcgi_ignore_headers Cache-Control Expires Set-Cookie;
   
   location ~ \.php(?:$/) {
         fastcgi_split_path_info ^(.+\.php)(/.+)$;
       
         include fastcgi_params;
         fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
         fastcgi_param PATH_INFO $fastcgi_path_info;
         fastcgi_param HTTPS on;
         fastcgi_pass php-handler;
       
         # cache_purge
         fastcgi_cache_bypass $skip_cache;
         fastcgi_no_cache $skip_cache;
         fastcgi_cache OWNCLOUD;
         fastcgi_cache_valid  60m;
         fastcgi_cache_methods GET HEAD;
         }
   
.. note:: Note regarding the ``fastcgi_pass`` parameter:
   Use whatever fits your configuration. In the example above, an ``upstream`` 
   was defined in an Nginx global configuration file.
   This may look like::
       
     upstream php-handler {
         server unix:/var/run/php5-fpm.sock;
         # or
         # server 127.0.0.1:9000;
       } 
   
3. **Test the configuration**

.. code-block:: bash

   sudo nginx -s reload
   
*  Open your browser and clear your cache.   
*  Logon to your ownCloud instance, open the gallery app, move thru your       
   folders and watch while the thumbnails are generated for the first time.
*  You may also watch with eg. ``htop`` your system load while the 
   thumbnails are processed.
*  Go to another app or logout and relogon.
*  Open the gallery app again and browse to the folders you accessed before.
   Your thumbnails should appear more or less immediately.
*  ``htop`` will not show up additional load while processing, compared to 
   the high load before.
