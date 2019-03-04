.. _webdavsearch:

==================
WebDAV Search
==================

Nextcloud implements rfc5323_ WebDAV search to allow clients to search for files on the server.
WebDAV search allows for fairly complex search queries with filtering and sorting on multiple properties.

This document describes how to use WebDAV search with a Nextcloud server and provides some example queries,
full details of the api can be found at rfc5323_.

Making search requests
----------------------

Search requests can be made by sending a :code:`SEARCH` http request to :code:`https://cloud.example.com/remote.php/dav/`
with a content type of :code:`text/xml` and the query as xml in the request body.

For example, to search for text files for the user 'test':

.. code-block:: bash

    curl -u username:password 'https://cloud.example.com/remote.php/dav/' -X SEARCH -u test:test -H "content-Type: text/xml" --data '<?xml version="1.0" encoding="UTF-8"?>
     <d:searchrequest xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
         <d:basicsearch>
             <d:select>
                 <d:prop>
                     <oc:fileid/>
                     <d:displayname/>
                     <d:getcontenttype/>
                     <d:getetag/>
                     <oc:size/>
                 </d:prop>
             </d:select>
             <d:from>
                 <d:scope>
                     <d:href>/files/test</d:href>
                     <d:depth>infinity</d:depth>
                 </d:scope>
             </d:from>
             <d:where>
                 <d:like>
                     <d:prop>
                         <d:getcontenttype/>
                     </d:prop>
                     <d:literal>text/%</d:literal>
                 </d:like>
             </d:where>
             <d:orderby/>
        </d:basicsearch>
    </d:searchrequest>'

Supported DAV properties
------------------------

The following DAV properties are supported for use in either :code:`select`, :code:`where` and :code:`orderby`,
not all properties can be used for each operation.

+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| Property name                                | Description                     | Selectable | Searchable | Sortable | Type     |
+==============================================+=================================+============+============+==========+==========+
| {DAV:}displayname                            | File name                       | ✓          | ✓          | ✓        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {DAV:}getcontenttype                         | Mime type                       | ✓          | ✓          | ✓        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {DAV:}getlastmodified                        | Modified date                   | ✓          | ✓          | ✓        | Datetime |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}size                 | File size or folder size        | ✓          | ✓          | ✓        | Integer  |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}favorite             | Favorite status                 | ✓          | ✓          | ✓        | Boolean  |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}fileid               | Nextcloud file id               | ✓          | ✓          |❌        | Integer  |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {DAV:}resourcetype                           | File or folder                  | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {DAV:}getcontentlength                       | File size, not for folders      | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}checksums            | Stored checksums for the file   | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}permissions          | File permissions                | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {DAV:}getetag                                | File etag                       | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}owner-id             | File owner                      | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}owner-display-name   | File owner display name         | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://owncloud.org/ns}data-fingerprint     | Fingerprint for recovery status | ✓          |❌          |❌        | String   |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+
| {http://nextcloud.org/ns}has-preview         | Preview status                  | ✓          |❌          |❌        | Boolean  |
+----------------------------------------------+---------------------------------+------------+------------+----------+----------+

Search scope
------------

All search queries are scoped to a single folder relative to the dav root.
At the moment only search queries for files are supported meaning the the scope should always start with :code:`files/$username`.

Inside the user's files, any existing folder can be used as search scope.

Examples search bodies
----------------------

Search for all plain text files in the folder :code:`Documents`, sorted by size.

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <d:searchrequest xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
        <d:basicsearch>
            <d:select>
                <d:prop>
                    <d:displayname/>
                </d:prop>
            </d:select>
            <d:from>
                <d:scope>
                    <d:href>/files/test/Documents</d:href>
                    <d:depth>infinity</d:depth>
                </d:scope>
            </d:from>
            <d:where>
                <d:like>
                    <d:prop>
                        <d:getcontenttype/>
                    </d:prop>
                    <d:literal>text/%</d:literal>
                </d:like>
            </d:where>
            <d:orderby>
                <d:prop>
                    <oc:size/>
                </d:prop>
                <d:ascending/>
            </d:orderby>
        </d:basicsearch>
    </d:searchrequest>

Get a file by id.

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <d:searchrequest xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
        <d:basicsearch>
            <d:select>
                <d:prop>
                    <d:displayname/>
                </d:prop>
            </d:select>
            <d:from>
                <d:scope>
                    <d:href>/files/test</d:href>
                    <d:depth>infinity</d:depth>
                </d:scope>
            </d:from>
            <d:where>
                <d:eq>
                    <d:prop>
                        <oc:fileid/>
                    </d:prop>
                    <d:literal>12345</d:literal>
                </d:eq>
            </d:where>
            <d:orderby/>
        </d:basicsearch>
    </d:searchrequest>

Get all png and jpg files over 10MB.

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <d:searchrequest xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
        <d:basicsearch>
            <d:select>
                <d:prop>
                    <d:displayname/>
                </d:prop>
            </d:select>
            <d:from>
                <d:scope>
                    <d:href>/files/test</d:href>
                    <d:depth>infinity</d:depth>
                </d:scope>
            </d:from>
            <d:where>
                <d:and>
                    <d:or>
                        <d:eq>
                            <d:prop>
                                <d:getcontenttype/>
                            </d:prop>
                            <d:literal>image/png</d:literal>
                        </d:eq>
                        <d:eq>
                            <d:prop>
                                <d:getcontenttype/>
                            </d:prop>
                            <d:literal>image/jpg</d:literal>
                        </d:eq>
                    </d:or>
                        <d:gt>
                            <d:prop>
                                <oc:size/>
                            </d:prop>
                            <d:literal>10000000</d:literal>
                        </d:gt>
                </d:and>
            </d:where>
            <d:orderby/>
        </d:basicsearch>
    </d:searchrequest>

.. _rfc5323: https://tools.ietf.org/html/rfc5323
