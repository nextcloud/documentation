.. _webdavversions:

==================
WebDAV Versions
==================

Nextcloud makes the versions of files available via the webdav endpoint.

Listing the versions of a file
------------------------------

To obtain all the version of a file a normal :code:`PROPFIND` has to be send to
:code:`https://cloud.example.com/remote.php/dav/versions/USER/versions/FILEID`. This will
list the versions for this file.

The name is the timestamp of the version.


Restoring a version
---------------------------

To restore a version all that needs to be done is to move a version 
the special restore folder at :code:`https://cloud.example.com/remote.php/dav/versions/USER/restore`

