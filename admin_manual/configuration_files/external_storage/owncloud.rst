========
ownCloud
========

An ownCloud storage is a specialized :doc:`webdav` storage, with optimizations
for ownCloud-ownCloud communication. See the :doc:`webdav` documentation to 
learn how to configure an ownCloud external storage.

When filling in the **URL** field, use the path to the root of the ownCloud
installation, rather than the path to the WebDAV endpoint. So, for a server at
``https://example.com/owncloud``, use ``https://example.com/owncloud`` and not
``https://example.com/owncloud/remote.php/dav``.

See :doc:`../external_storage_configuration_gui` for additional mount 
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
