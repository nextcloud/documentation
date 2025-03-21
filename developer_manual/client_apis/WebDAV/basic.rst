.. _webdavindex:

==========
Basic APIs
==========

This document provides a quick overview of the WebDAV operations supported in Nextcloud, to keep things readable it won't go into many details
for each operation, further information for each operation can be found in the corresponding RFC where applicable.

WebDAV basics
-------------

The base url for all (authenticated) WebDAV operations for a Nextcloud instance is :code:`/remote.php/dav`.

All requests need to provide authentication information, either as a basic auth header or by passing a set of valid session cookies.

If your Nextcloud installation uses an external auth provider (such as an OIDC server) you may have to create an app password.
To do that, go to your personal security settings and create one. It will provide a username and password which you can use within the Basic Auth header.

Public shares
^^^^^^^^^^^^^

The :code:`/remote.php/dav` endpoint only allows authenticated access to WebDAV resources,
for files shared using public link shares a different endpoint is provided which does not require authentication.

The base URL for public link shares is :code:`/public.php/dav`, particularly for files: :code:`/public.php/dav/files/{share_token}`.
If a password is set for the share then a basic auth header must be sent with ``anonymous`` as the username and the share password as the password.

.. note:: This endpoint for public shares is available since Nextcloud 29.

Testing requests
----------------

With curl
^^^^^^^^^

All WebDAV requests can be easily tested out using :code:`curl` by specifying the request method (:code:`GET`, :code:`PROPFIND`, :code:`PUT`, ...) and providing a request body where needed.

For example: you can perform a :code:`PROPFIND` request to find files in a folder using:

.. code-block:: bash

    curl 'https://cloud.example.com/remote.php/dav/files/username/folder' \
      --user username:password \
      --request PROPFIND \
      --data '<?xml version="1.0" encoding="UTF-8"?>
        <d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
          <d:prop>
            <d:getlastmodified/>
            <d:getcontentlength/>
            <d:getcontenttype/>
            <oc:permissions/>
            <d:resourcetype/>
            <d:getetag/>
          </d:prop>
        </d:propfind>'

Making requests in JavaScript
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Here is a JavaScript code sample to get you started:

.. code-block:: javascript

	import { createClient } from 'webdav'
	import { generateRemoteUrl } from '@nextcloud/router'
	import { getCurrentUser } from '@nextcloud/auth'

	const client = createClient(generateRemoteUrl('dav'))
	const response = await client.getDirectoryContents(`/files/${getCurrentUser()?.uid}/folder`, {
		details: true,
		data: `<?xml version="1.0" encoding="UTF-8"?>
			<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
				<d:prop>
					<d:getlastmodified/>
					<d:getcontentlength/>
					<d:getcontenttype/>
					<oc:permissions/>
					<d:resourcetype/>
					<d:getetag/>
				</d:prop>
			</d:propfind>`,
	})

Requesting properties
---------------------

By default, a :code:`PROPFIND` request will only return a small number of properties for each file: last modified date, file size, whether it's a folder, etag and mime type.

You can request additional properties by sending a request body with the :code:`PROPFIND` request that lists all requested properties.

.. code-block:: xml

	<?xml version="1.0"?>
	<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
	  <d:prop>
		<d:getlastmodified />
		<d:getetag />
		<d:getcontenttype />
		<d:resourcetype />
		<oc:fileid />
		<oc:permissions />
		<oc:size />
		<d:getcontentlength />
		<nc:has-preview />
		<oc:favorite />
		<oc:comments-unread />
		<oc:owner-display-name />
		<oc:share-types />
		<nc:contained-folder-count />
		<nc:contained-file-count />
	  </d:prop>
	</d:propfind>

A note about namespaces URI
^^^^^^^^^^^^^^^^^^^^^^^^^^^

When building the body of your DAV request, you will request properties that are available under specific namespace URI.
It is usual to declare prefixes for those namespace in the ``d:propfind`` element of the body.

Here is the list of available namespace:

=========================================  ======
                   URI                     Prefix
=========================================  ======
DAV:                                       d
http://owncloud.org/ns                     oc
http://nextcloud.org/ns                    nc
http://open-collaboration-services.org/ns  ocs
http://open-cloud-mesh.org/ns              ocm
=========================================  ======

And here is how it should look in your DAV request:

.. code-block:: xml

	<?xml version="1.0"?>
		<d:propfind
			xmlns:d="DAV:"
			xmlns:oc="http://owncloud.org/ns"
			xmlns:nc="http://nextcloud.org/ns"
			xmlns:ocs="http://open-collaboration-services.org/ns">
			xmlns:ocm="http://open-cloud-mesh.org/ns">
		...

Supported properties
^^^^^^^^^^^^^^^^^^^^

+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
|           Property            |                   Description                   |                                 Example                                              |
+===============================+=================================================+======================================================================================+
| <d:creationdate />            | The creation date of the node.                  | ``1970-01-01T00:00:00+00:00``                                                        |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:getlastmodified />         | The latest modification time.                   | ``Wed, 20 Jul 2022 05:12:23 GMT``                                                    |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:getetag />                 | The file's etag.                                | ``&quot;6436d084d4805&quot;``                                                        |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:getcontenttype />          | The mime type of the file.                      | ``image/jpeg``                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:resourcetype />            | Specifies the nature of the resource.           | ``<d:collection />`` for a folder                                                    |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:getcontentlength />        | The size if it is a file in bytes.              | ``3030237``                                                                          |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:getcontentlanguage />      | The language of the content.                    | ``en``                                                                               |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:displayname />             | A name suitable for presentation.               | ``File name``                                                                        |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:lockdiscovery />           | | Dummy endpoint for class 2 WebDAV support.    | ``<d:lockdiscovery />``                                                              |
|                               | | Should return the list of lock, but           |                                                                                      |
|                               | | always return an empty response.              |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:quota-available-bytes />   | Amount of available bytes in the folder.        | | ``3950773``                                                                        |
|                               |                                                 | | ``-1`` Uncomputed free space.                                                      |
|                               |                                                 | | ``-2`` Unknown free space.                                                         |
|                               |                                                 | | ``-3`` Unlimited free space.                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:quota-used-bytes />        | Amount of bytes used in the folder.             | ``3950773``                                                                          |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <d:supportedlock />           | | Dummy endpoint for class 2 WebDAV support.    | | ``<d:lockentry>``                                                                  |
|                               | | Always provide the same lock capabilities.    | |     ``<d:lockscope><d:exclusive /></d:lockscope>``                                 |
|                               | |                                               | |     ``<d:locktype><d:write /></d:locktype></d:lockentry>``                         |
|                               | |                                               | | ``</d:lockentry>``                                                                 |
|                               | |                                               | | ``<d:lockentry>``                                                                  |
|                               | |                                               | |     ``<d:lockscope><d:shared /></d:lockscope>``                                    |
|                               | |                                               | |     ``<d:locktype><d:write /></d:locktype>``                                       |
|                               | |                                               | | ``</d:lockentry>``                                                                 |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:id />                     | | The fileid namespaced by the instance id.     | ``00000007oc9l3j5ur4db``                                                             |
|                               | | Globally unique.                              |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:fileid />                 | The unique id for the file within the instance. | ``7``                                                                                |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:downloadURL />            | | A URL to directly download the file from a    |                                                                                      |
|                               | | storage. No storage implements that yet.      |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:permissions />            | | The permissions that the user has over the    | | ``S``: Shared                                                                      |
|                               | | file. The value is a string containing        | | ``R``: Shareable                                                                   |
|                               | | letters for all available permissions.        | | ``M``: Mounted                                                                     |
|                               |                                                 | | ``G``: Readable                                                                    |
|                               |                                                 | | ``D``: Deletable                                                                   |
|                               |                                                 | | ``NV``: Updateable, Renameable, Moveable                                           |
|                               |                                                 | | ``W``: Updateable (file)                                                           |
|                               |                                                 | | ``CK``: Creatable                                                                  |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:creation_time />          | Same as ``creationdate``, but as a timestamp.   | ``1675789581``                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:mount-type />             | The type of mount.                              | | ``''`` = local                                                                     |
|                               |                                                 | | ``'shared'`` = received share                                                      |
|                               |                                                 | | ``'group'`` = group folder                                                         |
|                               |                                                 | | ``'external'`` = external storage                                                  |
|                               |                                                 | | ``'external-session'`` = external storage                                          |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:is-encrypted />           | Whether the folder is end-to-end encrypted.     | | ``0`` for ``false``                                                                |
|                               |                                                 | | ``1`` for ``true``                                                                 |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:is-mount-root>            | | This is a special property which is used to   | ``true`` or ``false``                                                                |
|                               | | determine if a node is a mount root or not,   |                                                                                      |
|                               | | e.g. a shared folder. If so, then the node    |                                                                                      |
|                               | | can only be unshared and not deleted.         |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:tags />                   | List of user specified tags.                    | ``<oc:tag>test</oc:tag>``                                                            |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:favorite />               | The favorite state.                             | | ``0`` for not favourited                                                           |
|                               |                                                 | | ``1`` for favourited                                                               |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:comments-href />          | The DAV endpoint to fetch the comments.         | ``/remote.php/dav/comments/files/{fileId}``                                          |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:comments-count />         | The number of comments.                         | ``2``                                                                                |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:comments-unread />        | The number of unread comments.                  | ``0``                                                                                |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:owner-id />               | The user id of the owner of a shared file.      | ``alice``                                                                            |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:owner-display-name />     | The display name of the owner of a shared file. | ``Alice``                                                                            |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:share-types />            | XML array of share types.                       | | ``<oc:share-type>{shareTypeId}</oc:share-type>``                                   |
|                               |                                                 | | ``0`` = User                                                                       |
|                               |                                                 | | ``1`` = Group                                                                      |
|                               |                                                 | | ``3`` = Public link                                                                |
|                               |                                                 | | ``4`` = Email                                                                      |
|                               |                                                 | | ``6`` = Federated cloud share                                                      |
|                               |                                                 | | ``7`` = Circle                                                                     |
|                               |                                                 | | ``8`` = Guest                                                                      |
|                               |                                                 | | ``9`` = Remote group                                                               |
|                               |                                                 | | ``10`` = Talk conversation                                                         |
|                               |                                                 | | ``12`` = Deck                                                                      |
|                               |                                                 | | ``15`` = Science mesh                                                              |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <ocs:share-permissions />     | | The permissions that the                      | | ``1`` = Read                                                                       |
|                               | | user has over the share.                      | | ``2`` = Update                                                                     |
|                               |                                                 | | ``4`` = Create                                                                     |
|                               |                                                 | | ``8`` = Delete                                                                     |
|                               |                                                 | | ``16`` = Share                                                                     |
|                               |                                                 | | ``31`` = All                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <ocm:share-permissions />     | | The permissions that the user has             | ``["share", "read", "write"]``                                                       |
|                               | | over the share as a JSON array.               |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:share-attributes />       | User set attributes as a JSON array.            | ``[{ "scope" => <string>, "key" => <string>, "enabled" => <bool> }]``                |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:sharees />                | The list of share recipient.                    | | ``<nc:sharee>``                                                                    |
|                               |                                                 | |     ``<nc:id>alice</nc:id>``                                                       |
|                               |                                                 | |     ``<nc:display-name>Alice</nc:display-name>``                                   |
|                               |                                                 | |     ``<nc:type>0</nc:type>``                                                       |
|                               |                                                 | | ``</nc:sharee>``                                                                   |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:checksums />              | An array of checksums stored in the DB by other | ``<oc:checksum>md5:04c36b75222cd9fd47f2607333029106</oc:checksum>``                  |
|                               | clients.                                        |                                                                                      |
|                               | Currently used algorithms are ``MD5``, ``SHA1``,|                                                                                      |
|                               | ``SHA256``, ``SHA3-256``, ``Adler32``.          |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:has-preview />            | Whether a preview of the file is available.     | ``true`` or ``false``                                                                |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:hidden>                   | | Defines if a file should be hidden            | ``true`` or ``false``                                                                |
|                               | | Currently only used for live photos           |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <oc:size />                   | | Unlike ``getcontentlength``, this property    | ``127815235``                                                                        |
|                               | | also works for folders, reporting the size of |                                                                                      |
|                               | | everything in the folder. Size is in bytes.   |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:rich-workspace-file />    | The id of the workspace file.                   | `3456`                                                                               |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:rich-workspace />         | The content of the workspace file.              |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:upload_time />            | Date this file was uploaded.                    | ``1675789581``                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:note />                   | Share note.                                     |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:contained-folder-count /> | | The number of folders directly contained      |                                                                                      |
|                               | | in the folder (not recursively).              |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:contained-file-count />   | | The number of files directly contained        |                                                                                      |
|                               | | in the folder (not recursively).              |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:data-fingerprint />       | | Used by the clients to find out               |                                                                                      |
|                               | | if a backup has been restored.                |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:acl-enabled>              | Whether ACL is enabled for this group folder.   | ``1`` or ``0``                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:acl-can-manage>           | Whether the current user can manager ACL.       | ``1`` or ``0``                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:acl-list>                 | Array of ACL rules.                             | | ``<nc:acl>``                                                                       |
|                               |                                                 | |   ``<nc:acl-mapping-type>group</nc:acl-mapping-type>``                             |
|                               |                                                 | |   ``<nc:acl-mapping-id>admin</nc:acl-mapping-id>``                                 |
|                               |                                                 | |   ``<nc:acl-mapping-display-name>admin</nc:acl-mapping-display-name>``             |
|                               |                                                 | |   ``<nc:acl-mask>20</nc:acl-mask>``                                                |
|                               |                                                 | |   ``<nc:acl-permissions>15</nc:acl-permissions>``                                  |
|                               |                                                 | | ``</nc:acl>``                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:inherited-acl-list>       | Array of ACL rules from the parents folders     | See <nc:acl-list>                                                                    |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:group-folder-id>          | Numerical id of that group folder.              | ``1``                                                                                |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock>                     | Whether the file is locked.                     | ``1`` or ``0``                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock-owner-type>          | Type of the owner of the lock.                  | ``0`` = User                                                                         |
|                               |                                                 | ``1`` = Office or Text                                                               |
|                               |                                                 | ``2`` = WebDAV                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock-owner>               | User id of the owner of the lock.               | ``alice``                                                                            |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock-owner-displayname>   | Display name of the owner of the lock.          | ``Alice``                                                                            |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock-owner-editor>        | App id of an app owned lock.                    |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock-time>                | Date when the lock was created as a timestamp.  | ``1675789581``                                                                       |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock-timeout>             | TTL of the lock in seconds staring from the     | ``0`` = No timeout                                                                   |
|                               | creation time.                                  |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:lock-token>               | The token of the lock.                          | ``files_lock/0e53dfb6-61b4-46f0-b38e-d9a428292998``                                  |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:reminder-due-date>        | | The due date of the reminder                  | ``1970-01-01T00:00:00+00:00``                                                        |
|                               | | as an ISO 8601 formatted string.              |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:version-label />          | The user-set label for a file.                  |                                                                                      |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+
| <nc:version-author />         | The author's id of a specified file version.    | ``admin``, ``jane``, ``thisAuthorsID``                                               |
+-------------------------------+-------------------------------------------------+--------------------------------------------------------------------------------------+

Listing folders (rfc4918_)
--------------------------

The contents of a folder can be listed by sending a :code:`PROPFIND` request to the folder.

.. code::

	PROPFIND remote.php/dav/files/user/path/to/folder

Getting properties for just the folder
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can request properties of a folder without also getting the folder contents by adding a :code:`Depth: 0` header to the request.

Downloading files
-----------------

.. note:: For shared files this only works if the download permission was not denied by the sharer.

A file can be downloaded by sending a :code:`GET` request to the WebDAV url of the file.

.. code::

	GET remote.php/dav/files/user/path/to/file

.. _webdav-download-folders:

Downloading folders
-------------------

.. note:: The :code:`GET` method is not defined by the WebDAV standard, this is a Nextcloud specific WebDAV extension.
.. note:: For shared folders this only works if the download permission was not denied by the sharer.

A folder can be downloaded as an archive by sending a :code:`GET` request to the WebDAV URL of the folder.
The :code:`Accept` header must be set and contain the MIME type for ZIP archives (:code:`application/zip`) or tarballs (:code:`application/x-tar`).

.. code::

	GET remote.php/dav/files/user/path/to/folder
	Accept: application/zip

Optionally it is possible to only include some files from the folder in the archive by providing the files using the custom :code:`X-NC-Files` header:

.. code::

	GET remote.php/dav/files/user/path/to/folder
	Accept: application/zip
	X-NC-Files: document.txt
	X-NC-Files: image.png

As setting headers is not possible with HTML links it is also possible to provide this both options as query parameters.
In this case the :code:`Accept` header value must be passed as the :code:`accept` query parameter.
The optional files list can be provided as a JSON encoded array through the :code:`files` query parameter.

.. code::

	GET remote.php/dav/files/user/path/to/folder?accept=zip&files=["image.png","document.txt"]

Uploading files
---------------

A file can be uploaded by sending a :code:`PUT` request to the file and sending the raw file contents as the request body.

.. code::

	PUT remote.php/dav/files/user/path/to/file

Any existing file will be overwritten by the request.

Creating folders (rfc4918_)
---------------------------

A folder can be created by sending a :code:`MKCOL` request to the folder.

.. code::

	MKCOL remote.php/dav/files/user/path/to/new/folder

Deleting files and folders (rfc4918_)
-------------------------------------

A file or folder can be deleted by sending a :code:`DELETE` request to the file or folder.

.. code::

	DELETE remote.php/dav/files/user/path/to/file

When deleting a folder, its contents will be deleted recursively.

Moving files and folders (rfc4918_)
-----------------------------------

A file or folder can be moved by sending a :code:`MOVE` request to the file or folder and specifying the destination in the :code:`Destination` header as full url.

.. code::

	MOVE remote.php/dav/files/user/path/to/file
	Destination: https://cloud.example/remote.php/dav/files/user/new/location

The overwrite behavior of the move can be controlled by setting the :code:`Overwrite` head to :code:`T` or :code:`F` to enable or disable overwriting respectively.

Copying files and folders (rfc4918_)
------------------------------------

A file or folder can be copied by sending a :code:`COPY` request to the file or folder and specifying the destination in the :code:`Destination` header as full url.

.. code::

	COPY remote.php/dav/files/user/path/to/file
	Destination: https://cloud.example/remote.php/dav/files/user/new/location

The overwrite behavior of the copy can be controlled by setting the :code:`Overwrite` head to :code:`T` or :code:`F` to enable or disable overwriting respectively.

Settings favorites
------------------

A file or folder can be marked as favorite by sending a :code:`PROPPATCH` request to the file or folder and setting the :code:`oc-favorite` property

.. code-block:: xml

	PROPPATCH remote.php/dav/files/user/path/to/file
	<?xml version="1.0"?>
	<d:propertyupdate xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
	  <d:set>
		<d:prop>
		  <oc:favorite>1</oc:favorite>
		</d:prop>
	  </d:set>
	</d:propertyupdate>

Setting the :code:`oc:favorite` property to ``1`` marks a file as favorite, setting it to ``0`` un-marks it as favorite.

Listing favorites
-----------------

Favorites for a user can be retrieved by sending a :code:`REPORT` request and specifying :code:`oc:favorite` as a filter

.. code-block:: xml

	REPORT remote.php/dav/files/user/path/to/folder
	<?xml version="1.0"?>
	<oc:filter-files  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
		 <oc:filter-rules>
			 <oc:favorite>1</oc:favorite>
		 </oc:filter-rules>
	 </oc:filter-files>

File properties can be requested by adding a :code:`<d:prop/>` element to the request listing the requested properties in the same way as it would be done for a :code:`PROPFIND` request.

When listing favorites, the request will find all favorites in the folder recursively, all favorites for a user can be found by sending the request to :code:`remote.php/dav/files/user`

.. _rfc4918: https://tools.ietf.org/html/rfc4918


Special Headers
---------------

Request Headers
^^^^^^^^^^^^^^^

You can set some special headers that Nextcloud will interpret.

+-----------------+-----------------------------------------------------------------+------------------------------------------+
|     Header      |                           Description                           |                 Example                  |
+=================+=================================================================+==========================================+
| X-OC-MTime      | | Allow to specify a modification time.                         | ``1675789581``                           |
|                 | | The response will contain the header ``X-OC-MTime: accepted`` |                                          |
|                 | | if the mtime was accepted.                                    |                                          |
+-----------------+-----------------------------------------------------------------+------------------------------------------+
| X-OC-CTime      | | Allow to specify a creation time.                             | ``1675789581``                           |
|                 | | The response will contain the header ``X-OC-CTime: accepted`` |                                          |
|                 | | if the mtime was accepted.                                    |                                          |
+-----------------+-----------------------------------------------------------------+------------------------------------------+
| OC-Checksum     | | A checksum that will be stored in the DB.                     | ``md5:04c36b75222cd9fd47f2607333029106`` |
|                 | | The server will not do any sort of  validation.               |                                          |
|                 | | Currently used algorithms are ``MD5``, ``SHA1``, ``SHA256``,  |                                          |
|                 | | ``SHA3-256``, ``Adler32``.                                    |                                          |
+-----------------+-----------------------------------------------------------------+------------------------------------------+
| X-Hash          | | Allow to request the file's hash from the server.             | ``md5``, ``sha1``, or ``sha256``         |
|                 | | The server will return the hash in a header named either:     |                                          |
|                 | | ``X-Hash-MD5``, ``X-Hash-SHA1``, or ``X-Hash-SHA256``.        |                                          |
+-----------------+-----------------------------------------------------------------+------------------------------------------+
| OC-Total-Length | | Contains the total size of the file during a chunk upload.    | ``4052412``                              |
|                 | | This allow the server to abort faster if the remaining        |                                          |
|                 | | user's quota is not enough.                                   |                                          |
+-----------------+-----------------------------------------------------------------+------------------------------------------+
| OC-Chunked      | | Used for legacy chunk upload to differentiate a regular       | Deprecated ⚠️                            |
|                 | | upload from a chunked upload. It allowed checking for quota   |                                          |
| (deprecated)    | | and various other things. Nowadays, you need to provide the   | You do not have to provide this anymore  |
|                 | | ``OC-Total-Length`` header on the ``PUT`` requests instead.   |                                          |
+-----------------+-----------------------------------------------------------------+------------------------------------------+

Response Headers
----------------

+-----------+------------------------------------------------+-----------------------------------------+
|  Header   |                  Description                   |                 Example                 |
+===========+================================================+=========================================+
| OC-Etag   | | On creation, move and copy,                  | ``"50ef2eba7b74aa84feff013efee2a5ef"``  |
|           | | the response contain the etag of the file.   |                                         |
+-----------+------------------------------------------------+-----------------------------------------+
| OC-FileId | | On creation, move and copy,                  | | Format: ``<padded-id><instance-id>``. |
|           | | the response contain the fileid of the file. | | Example: ``00000259oczn5x60nrdu``     |
+-----------+------------------------------------------------+-----------------------------------------+
