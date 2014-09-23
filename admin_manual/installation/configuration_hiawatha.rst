Hiawatha Configuration
======================

Add ``WebDAVapp = yes`` to the ownCloud virtual host. Users accessing
WebDAV from MacOS will also need to add ``AllowDotFiles = yes``.

Disable access to data folder::

    UrlToolkit {
        ToolkitID = denyData
        Match ^/data DenyAccess
    }
