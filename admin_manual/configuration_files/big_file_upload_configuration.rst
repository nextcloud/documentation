===========================
Uploading big files > 512MB
===========================

The default maximum file size for uploads is 512MB. You can increase this 
limit up to what your filesystem and operating system allows. There are certain 
hard limits that cannot be exceeded:

* < 2GB on 32Bit OS-architecture
* < 2GB on Windows (32Bit and 64Bit)
* < 2GB with Server Version 4.5 or older
* < 2GB with IE6 - IE8
* < 4GB with IE9 - IE11

64-bit filesystems have much higher limits; consult the documentation for your 
filesystem.

.. note:: The ownCloud sync client is not affected by these upload limits
   as it is uploading files in smaller chunks.

System Configuration
--------------------

* Make sure that the latest version of PHP (at least 5.4.9) is installed
* Disable user quotas, which makes them unlimited
* Your temp file or partition has to be big enough to hold multiple 
  parallel uploads from multiple users; e.g. if the max upload size is 10GB and 
  the average number of users uploading at the same time is 100: temp space has 
  to hold at least 10x100 GB

Configuring Your Webserver
--------------------------

| ownCloud comes with its own ``owncloud/.htaccess`` file. Because ``php-fpm`` can't 
| read PHP settings in ``.htaccess`` these settings and permissions must be set
| in the ``owncloud/.user.ini`` file.

Set the following two parameters inside the corresponding php.ini file (see the 
**Loaded Configuration File** section of :ref:`label-phpinfo` to find your 
relevant php.ini files) ::

 php_value upload_max_filesize = 16G
 php_value post_max_size = 16G

Adjust these values for your needs. If you see PHP timeouts in your logfiles, 
increase the timeout values, which are in seconds::

 php_value max_input_time 3600
 php_value max_execution_time 3600

The `mod_reqtimeout <https://httpd.apache.org/docs/current/mod/mod_reqtimeout.html>`_
Apache module could also stop large uploads from completing. If you're using this
module and getting failed uploads of large files either disable it in your Apache
config or raise the configured ``RequestReadTimeout`` timeouts.

There are also several other configuration options in your webserver config which
could prevent the upload of larger files. Please see the manual of your webserver
for how to configure those values correctly:

Apache
^^^^^^
* `LimitRequestBody <https://httpd.apache.org/docs/current/en/mod/core.html#limitrequestbody>`_
* `SSLRenegBufferSize <https://httpd.apache.org/docs/current/mod/mod_ssl.html#sslrenegbuffersize>`_

Apache with mod_fcgid
^^^^^^^^^^^^^^^^^^^^^
* `FcgidMaxRequestLen <https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidmaxrequestlen>`_

nginx
^^^^^
* `client_max_body_size <http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size>`_
* `fastcgi_read_timeout <http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_read_timeout>`_
* `client_body_temp_path <http://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_temp_path>`_

For more info how to configure nginx to raise the upload limits see also `this
<https://github.com/owncloud/documentation/wiki/Uploading-files-up-to-16GB#configuring-nginx>`_
wiki entry.

.. note:: For ``client_body_temp_path`` make sure it is pointing to a path/partition which
   holds enough space for the filesize you want to upload. Also place it at least at the same
   partition the ``upload_tmp_dir`` or ``tempdirectory`` settings described below are pointing
   to. For optimal performance ``client_body_temp_path`` and ``upload_tmp_dir/tempdirectory``
   should be also placed on different devices/hard drives.

Configuring PHP
---------------

If you don't want to use the ownCloud ``.htaccess`` or ``.user.ini`` file, you may 
configure PHP instead. Make sure to comment out any lines ``.htaccess`` 
pertaining to upload size, if you entered any.

If you are running ownCloud on a 32-bit system, any ``open_basedir`` directive 
in your ``php.ini`` file needs to be commented out.

Set the following two parameters inside ``php.ini``, using your own desired 
file size values::

 upload_max_filesize = 16G
 post_max_size = 16G
 
Tell PHP which temp file you want it to use::
 
 upload_tmp_dir = /var/big_temp_file/

**Output Buffering** must be turned off in ``.htaccess`` or ``.user.ini`` or ``php.ini``, or PHP 
will return memory-related errors:

* ``output_buffering = 0``

Configuring ownCloud
--------------------

As an alternative to the ``upload_tmp_dir`` of PHP (e.g. if you don't have access to your
``php.ini``) you can also configure a temporary location for uploaded files by using the
``tempdirectory`` setting in your ``config.php`` (See :doc:`../configuration_server/config_sample_php_parameters`).

If you have configured the ``session_lifetime`` setting in your ``config.php``
(See :doc:`../configuration_server/config_sample_php_parameters`) file then 
make sure it is not too
low. This setting needs to be configured to at least the time (in seconds) that
the longest upload will take. If unsure remove this completely from your
configuration to reset it to the default shown in the ``config.sample.php``.
