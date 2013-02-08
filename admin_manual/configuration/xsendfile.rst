Serving static files via web server
===================================
Since ownCloud 5 it is possible to let web servers handle static file serving.
This should generally improve performance (web servers are optimized for this) and in some cases permits controlled file serving (i.e. pause
and resume downloads).

.. note :: This feature can currently only be activated for local files, i.e. files inside the **data/** directory and local mounts. Controlled file serving **does not work for generated zip files**. This is due to how temporary files are created. Also it has **never been tested under lighttpd** but its configuration should be the same as Apache

Apache2 (X-Sendfile)
--------------------
It is possible to let Apache handle static file serving via `mod_xsendfile <https://tn123.org/mod_xsendfile/>`_.

Installation
~~~~~~~~~~~~
On Debian and Ubuntu systems use:

.. code-block:: bash

   apt-get install libapache2-mod-xsendfile


Configuration
~~~~~~~~~~~~~
Configuration of mod_xsendfile for ownCloud depends on its version.
For versions below 0.10 (Debian squeeze ships with 0.9)

.. code-block:: xml

    <Directory /var/www/owncloud>
        ...
        SetEnv MOD_X_SENDFILE_ENABLED 1
        XSendFile On
        XSendFileAllowAbove On
    </Directory>

For versions >=0.10 (e.g. Ubuntu 12.10)

.. code-block:: xml

    <Directory /var/www/owncloud>
        ...
        SetEnv MOD_X_SENDFILE_ENABLED 1
        XSendFile On
        XSendFilePath /tmp/oc-noclean
        XSendFilePath /home/valerio
    </Directory>

* **SetEnv MOD_X_SENDFILE_ENABLED**: tells ownCloud scripts that they should add the X-Sendfile header when serving files
* **XSendFile**: enables web server handling of X-Sendfile headers (and therefore file serving) for the specified Directory
* **XSendFileAllowAbove (<0.10)**: enables file serving through web server on path outside the specified Directory. This is needed for PHP temporary directory where zip files are created and for configured local mounts which may reside outside data directory
* **XSendFilePath (>=0.10)**: a white list of paths that the web server is allowed to serve outside of the specified Directory. At least PHP temporary directory concatenated with *oc-noclean* must be configured. Temporary zip files will be created inside this directory when using mod_xsendfile. Other paths which correspond to local mounts should be configured here aswell. For a more in-dept documentation of this directive refer to mod_xsendfile website linked above


Nginx (X-Accel-Redirect)
------------------------
Nginx supports handling of static files differently from Apache. Documentation can be found in the Nginx Wiki section `Mod X-Sendfile <http://wiki.nginx.org/XSendfile>`_ and section `X-Accell <http://wiki.nginx.org/X-accel>`_. The header used by Nginx is X-Accel-Redirect.

Installation
~~~~~~~~~~~~
X-Accel-Redirect is supported by default in Nginx and no additional operation should be needed to install it.

Configuration
~~~~~~~~~~~~~
Configuration is similar to Apache::

    location ~ \.php$ {
        ...
        fastcgi_param MOD_X_ACCEL_REDIRECT_ENABLED on;
    }

    location ~ ^/home/valerio/(owncloud/)?data {
        internal;
        root /;
    }

    location ~ ^/tmp/oc-noclean/.+$ {
        internal;
        root /;
    }


* **fastcgi_param MOD_X_ACCEL_REDIRECT_ENABLED:** tells ownCloud scripts that they should add the X-Accel-Redirect header when serving files

* **internal location:** each directory that contains local user data should correspond to an internal location. In the example uses the following directories:

  * **/home/valerio/owncloud/data**: ownCloud data directory
  * **/home/valerio/data**: a local mount
  * **/tmp/oc-noclean**: PHP temporary directory concatenated with *oc-noclean*. Temporary zip files will be created inside this directory when using X-Accel-Redirect

How to check if it's working?
-----------------------------
You are still able to download stuff via the web interface and single, local file downloads can be paused and resumed.
