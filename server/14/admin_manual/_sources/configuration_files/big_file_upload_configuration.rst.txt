===========================
Uploading big files > 512MB
===========================

The default maximum file size for uploads is 512MB. You can increase this 
limit up to what your filesystem and operating system allows. There are certain 
hard limits that cannot be exceeded:

* < 2GB on 32Bit OS-architecture
* < 2GB with IE6 - IE8
* < 4GB with IE9 - IE11

64-bit filesystems have much higher limits; consult the documentation for your 
filesystem.

.. note:: The Nextcloud sync client is not affected by these upload limits
   as it is uploading files in smaller chunks.

System configuration
--------------------

* Make sure that the latest version of PHP is installed
* Disable user quotas, which makes them unlimited
* Your temp file or partition has to be big enough to hold multiple 
  parallel uploads from multiple users; e.g. if the max upload size is 10GB and 
  the average number of users uploading at the same time is 100: temp space has 
  to hold at least 10x100 GB

Configuring your Web server
---------------------------

.. note:: Nextcloud comes with its own ``nextcloud/.htaccess`` file. Because ``php-fpm``
   can't read PHP settings in ``.htaccess`` these settings must be set in the
   ``nextcloud/.user.ini`` file.

Set the following two parameters inside the corresponding php.ini file (see the 
**Loaded Configuration File** section of :ref:`label-phpinfo` to find your 
relevant php.ini files) ::

 php_value upload_max_filesize 16G
 php_value post_max_size 16G

Adjust these values for your needs. If you see PHP timeouts in your logfiles, 
increase the timeout values, which are in seconds::

 php_value max_input_time 3600
 php_value max_execution_time 3600

The `mod_reqtimeout <https://httpd.apache.org/docs/current/mod/mod_reqtimeout.html>`_
Apache module could also stop large uploads from completing. If you're using this
module and getting failed uploads of large files either disable it in your Apache
config or raise the configured ``RequestReadTimeout`` timeouts.

There are also several other configuration options in your Web server config which
could prevent the upload of larger files. Please see the manual of your Web server
for how to configure those values correctly:

Apache
^^^^^^
* `LimitRequestBody <https://httpd.apache.org/docs/current/en/mod/core.html#limitrequestbody>`_
* `SSLRenegBufferSize <https://httpd.apache.org/docs/current/mod/mod_ssl.html#sslrenegbuffersize>`_

Apache with mod_fcgid
^^^^^^^^^^^^^^^^^^^^^
* `FcgidMaxRequestInMem <https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidmaxrequestinmem>`_
* `FcgidMaxRequestLen <https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidmaxrequestlen>`_

.. note:: If you are using Apache/2.4 with mod_fcgid, as of February/March 2016,
   ``FcgidMaxRequestInMem`` still needs to be significantly increased from its default value
   to avoid the occurrence of segmentation faults when uploading big files. This is not a regular
   setting but serves as a workaround for `Apache with mod_fcgid bug #51747 <https://bz.apache.org/bugzilla/show_bug.cgi?id=51747>`_.
   
   Setting ``FcgidMaxRequestInMem`` significantly higher than normal may no longer be
   necessary, once bug #51747 is fixed.

nginx
^^^^^
* `client_max_body_size <http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size>`_
* `fastcgi_read_timeout <http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_read_timeout>`_
* `client_body_temp_path <http://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_temp_path>`_

Since nginx 1.7.11 a new config option `fastcgi_request_buffering
<https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_request_buffering>`_
is availabe. Setting this option to ``fastcgi_request_buffering off;`` in your nginx config
might help with timeouts during the upload. Furthermore it helps if you're running out of
disc space on the tmp partition of your system.

.. note:: Make sure that ``client_body_temp_path`` points to a partition with 
   adequate space for your upload file size, and on the same partition as
   the ``upload_tmp_dir`` or ``tempdirectory`` (see below). For optimal 
   performance, place these on a separate hard drive that is dedicated to 
   swap and temp storage.
   
If your site is behind a nginx frontend (for example a loadbalancer): 

By default, downloads will be limited to 1GB due to ``proxy_buffering`` and ``proxy_max_temp_file_size`` on the frontend.

* If you can access the frontend's configuration, disable `proxy_buffering <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering>`_ or increase `proxy_max_temp_file_size <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_max_temp_file_size>`_ from the default 1GB.
* If you do not have access to the frontend, set the `X-Accel-Buffering <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering>`_ header to ``add_header X-Accel-Buffering no;`` on your backend server.

Configuring PHP
---------------

If you don't want to use the Nextcloud ``.htaccess`` or ``.user.ini`` file, you may 
configure PHP instead. Make sure to comment out any lines ``.htaccess`` 
pertaining to upload size, if you entered any.

If you are running Nextcloud on a 32-bit system, any ``open_basedir`` directive 
in your ``php.ini`` file needs to be commented out.

Set the following two parameters inside ``php.ini``, using your own desired 
file size values::

 upload_max_filesize = 16G
 post_max_size = 16G
 
Tell PHP which temp directory you want it to use::
 
 upload_tmp_dir = /var/big_temp_file/

**Output Buffering** must be turned off in ``.htaccess`` or ``.user.ini`` or ``php.ini``, or PHP 
will return memory-related errors:

* ``output_buffering = 0``

Configuring Nextcloud
---------------------

As an alternative to the ``upload_tmp_dir`` of PHP (e.g. if you don't have access to your
``php.ini``) you can also configure a temporary location for uploaded files by using the
``tempdirectory`` setting in your ``config.php`` (See :doc:`../configuration_server/config_sample_php_parameters`).

If you have configured the ``session_lifetime`` setting in your ``config.php``
(See :doc:`../configuration_server/config_sample_php_parameters`) file then 
make sure it is not too
low. This setting needs to be configured to at least the time (in seconds) that
the longest upload will take. If unsure remove this completely from your
configuration to reset it to the default shown in the ``config.sample.php``.

Configuring upload limits within the GUI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If all prerequisites described in this documentation are in place an admin can change the
upload limits on demand by using the ``File handling`` input box within the administrative
backend of Nextcloud.

.. figure:: images/admin_filehandling-1.png

Depending on your environment you might get an insufficient permissions message shown for
this input box.

.. figure:: images/admin_filehandling-2.png

To be able to use this input box you need to make sure that:

* your Web server is able to use the ``.htaccess`` file shipped by Nextcloud (Apache only)
* the user your Web server is running as has write permissions to the files ``.htaccess`` and ``.user.ini``


