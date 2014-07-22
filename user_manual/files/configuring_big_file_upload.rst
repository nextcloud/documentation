Managing Big Files
==================

There are a few default configuration settings that you will want to change to
enable ownCloud to operate more effectively as a self-hosted file sync and
share server.

When uploading through the web client, ownCloud is governed by PHP and Apache.
By default, PHP is configured for only 2 megabyte uploads. As this default
upload limit is not entirely useful, we recommend that you increase the
ownCloud variables to the sizes you want to support on your server.

Modifying certain ownCloud variables requires administrative access.  If you
require larger upload limits than have been provided by the default (or already
set by your administrator):

* Contact your administrator to request an increase in these variables

* Refer to the section in the `Admin Documentation
  <http://doc.owncloud.org/server/6.0/admin_manual/configuration/configuring_big_file_upload.html>`_
  that describes how to configure for big files.
