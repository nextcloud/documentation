Big Files
=========

There are a few default configuration settings that you will want to change to enable ownCloud to operate 
more effectively as a self hosted file sync and share server. 
When uploading through the web client, ownCloud is governed by PHP and Apache. 
As a default, PHP is configured for only 2 MB uploads. 
This is not entirely useful, so it is important to increase these variables to the sizes you want to
support on your server.
Ask your administrator to increase these variables for you or read the section in concern `within the
Admin Documentation <http://doc.owncloud.org/server/6.0/admin_manual/configuration/configuring_big_file_upload.html>`_.
