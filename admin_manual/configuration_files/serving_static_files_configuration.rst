Serving Static Files for Better Performance
===========================================

Since ownCloud 5 it is possible to let web servers handle static file serving.
This should generally improve performance (web servers are optimized for this) and in some cases permits controlled
file serving (i.e. pause and resume downloads).

.. note :: This feature can currently only be activated for local files, i.e. files inside the **data/** directory and local mounts.  It also does not work with the Encryption App enabled.
  Controlled file serving **does not work for generated zip files**. This is due to zip files being generated and streamed back directly to the client.

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
        XSendFilePath /home/valerio
    </Directory>

* **SetEnv MOD_X_SENDFILE_ENABLED**: tells ownCloud scripts that they should add the X-Sendfile header when serving files
* **XSendFile**: enables web server handling of X-Sendfile headers (and therefore file serving) for the specified Directory
* **XSendFileAllowAbove (<0.10)**: enables file serving through web server on path outside the specified Directory. This is needed for configured local mounts which may reside outside data directory
* **XSendFilePath (>=0.10)**: a white list of paths that the web server is allowed to serve outside of the specified Directory. Other paths which correspond to local mounts should be configured here as well. For a more in-depth documentation of this directive refer to mod_xsendfile website linked above

LigHTTPd (X-Sendfile2)
----------------------
LigHTTPd uses similar headers to Apache2, apart from the fact that it does not handle partial downloads in the same way
Apache2 does. For this reason, a different method is used for LigHTTPd.

Installation
~~~~~~~~~~~~
X-Sendfile and X-Sendfile2 are supported by default in LigHTTPd and no additional operation should be needed to install it.

Configuration
~~~~~~~~~~~~~
Your server configuration should include the following statements::

      fastcgi.server          = ( ".php" => ((
         ...
         "allow-x-send-file" => "enable",
         "bin-environment" => (
            "MOD_X_SENDFILE2_ENABLED" => "1",
         ),
      )))

* **allow-x-send-file**: enables LigHTTPd to use X-Sendfile and X-Sendfile2 headers to serve files
* **bin-environment**: is used to parse MOD_X_SENDFILE2_ENABLED to the ownCloud backend, to make it use the X-Sendfile and X-Sendfile2 headers in it's response


Nginx (X-Accel-Redirect)
------------------------
Nginx supports handling of static files differently from Apache. Documentation can be found in the Nginx Wiki
section `Mod X-Sendfile <http://wiki.nginx.org/XSendfile>`_ and section `X-Accell <http://wiki.nginx.org/X-accel>`_.
The header used by Nginx is X-Accel-Redirect.

Installation
~~~~~~~~~~~~
X-Accel-Redirect is supported by default in Nginx and no additional operation should be needed to install it.

Configuration
~~~~~~~~~~~~~
Configuration is similar to Apache::

    location ~ \.php(?:$|/) {
        ...
        fastcgi_param MOD_X_ACCEL_REDIRECT_ENABLED on;
    }

    location ^~ /data {
        internal;
        # Set 'alias' if not using the default 'datadirectory'
        #alias /path/to/non-default/datadirectory;

    #    LOCAL-MOUNT-NAME should match "Folder name" and 'alias' value should match "Configuration"
    #    A 'Local' External Storage Mountpoint available to a single user
    #    location /data/USER/files/LOCAL-FS-MOUNT-NAME {
    #        alias /path/to/local-mountpoint;
    #    }

    #    A 'Local' External Storage Mountpoint available to mulitple users
    #    location ~ ^/data/(?:USER1|USER2)/files/LOCAL-FS-MOUNT-NAME/(.+)$ {
    #        alias /path/to/local-mountpoint/$1;
    #    }

    #    A 'Local' External Storage Mountpoint available to all users
    #    location ~ ^/data/[^/]+/files/LOCAL-FS-MOUNT-NAME/(.+)$ {
    #        alias /path/to/local-mountpoint/$1;
    #    }

    }


* **fastcgi_param MOD_X_ACCEL_REDIRECT_ENABLED** ~ Tells ownCloud scripts that they should add the X-Accel-Redirect header when serving files.
* **/data** ~ The ownCloud data directory.  Any 'Local' External Storage Mounts must also have nested locations here.

  * set alias if you are using a non-default data directory

  * **/data/USER/files/LOCAL-MOUNT-NAME** ~ a local external storage mount available to a single user

  * **~ ^/data/(?:USER1|USER2)/files/LOCAL-MOUNT-NAME/(.+)$** ~ a local external storage mount available to multiple users

  * **~ ^/data/[^/]+/files/LOCAL-MOUNT-NAME/(.+)$** ~ a local external storage mount available to all users

How to check if it's working?
-----------------------------
You are still able to download stuff via the web interface and single, local file downloads can be paused and resumed.
