==================
Large File Uploads
==================

When uploading files through the web client, Nextcloud is limited by PHP and 
Apache configurations. By default, PHP is configured for only 2 megabyte 
uploads. As this default upload limit is not entirely useful, we recommend that 
your Nextcloud admin increase the Nextcloud variables to sizes appropriate for 
users.

Modifying certain Nextcloud variables requires administrative access.  If you
require larger upload limits than have been provided by the default (or already
set by your administrator):

* Contact your administrator to request an increase in these variables

* Refer to the section in the `Admin Documentation  
  <https://docs.nextcloud.org/server/9/admin_manual/configuration_files/
  big_file_upload_configuration.html>`_ that describes how to manage file 
  upload size limits.
