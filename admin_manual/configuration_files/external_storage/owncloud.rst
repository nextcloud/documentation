========
ownCloud
========

An ownCloud storage is a specialized :doc:`webdav` storage, with optimizations
for ownCloud-ownCloud communication. See the :doc:`webdav` documentation for
how to configure an ownCloud external storage.

When filling in the ``URL`` field, put the path to the root of the ownCloud
installation, rather than the path to the WebDAV endpoint. So, for a server at
``http://example.com/owncloud``, put ``http://example.com/owncloud``, not
``http://example.com/owncloud/remote.php/webdav``.
