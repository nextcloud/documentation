Yaws Configuration
==================

This should be in your **yaws_server.conf**. In the configuration file, the
**dir_listings = false** is important and also the redirect from **data/**
to somewhere else, because files will be saved in this directory and it
should not be accessible from the outside. A configuration file would look
like this

.. code-block:: xml

    <server owncloud.myserver.com/>
            port = 80
            listen = 0.0.0.0
            docroot = /var/www/owncloud/src
            allowed_scripts = php
            php_handler = <cgi, /usr/local/bin/php-cgi>
            errormod_404 = yaws_404_to_index_php
            access_log = false
            dir_listings = false
            <redirect>
                    /data == /
            </redirect>
    </server>

The Apache :file:`.htaccess` that comes with ownCloud is configured to redirect 
requests to non-existent pages. To emulate that behaviour, you need a custom 
error handler for yaws. See this `github gist for further instructions 
<https://gist.github.com/2200407>`_ on how to create and compile that error 
handler.
