.. _webdavindex:

==========
Basic APIs
==========

This document provides a quick overview of the WebDAV operations supported in Nextcloud, to keep things readable it won't go into many details
for each operation, further information for each operation can be found in the corresponding RFC where applicable.

WebDAV basics
-------------

The base url for all WebDAV operations for a Nextcloud instance is :code:`/remote.php/dav`.

All requests need to provide authentication information, either as a basic auth header or by passing a set of valid session cookies.

If your Nextcloud installation uses an external auth provider (such as an OIDC server) you may have to create an app password. To do that, go to your personal security settings and create one. It will provide a username and password which you can use within the Basic Auth header.

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
        <d:propfind xmlns:d="DAV:">
          <d:prop xmlns:oc="http://owncloud.org/ns">
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
			<d:propfind xmlns:d="DAV:">
				<d:prop xmlns:oc="http://owncloud.org/ns">
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
	<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
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

The following properties are supported:


getlastmodified
^^^^^^^^^^^^^^^
- Id: ``{DAV:}getlastmodified``
- Property: ``<d:getlastmodified />``
- Description: The latest modification time.
- Example: ``"Wed, 20 Jul 2022 05:12:23 GMT"``

getetag
^^^^^^^
- Id: ``{DAV:}getetag``
- Property: ``<d:getetag />``
- Description: The file's etag.
- Example: ``"&quot;6436d084d4805&quot;"``

getcontenttype
^^^^^^^^^^^^^^
- Id: ``{DAV:}getcontenttype``
- Property: ``<d:getcontenttype />``
- Description: The mime type of the file.
- Example: ``"image/jpeg"``

resourcetype
^^^^^^^^^^^^
- Id: ``{DAV:}resourcetype``
- Property: ``<d:resourcetype />``
- Description: Specifies the nature of the resource.
- Example: ``<d:collection />`` for a folder

getcontentlength
^^^^^^^^^^^^^^^^
- Id: ``{DAV:}getcontentlength``
- Property: ``<d:getcontentlength />``
- Description: The size if it is a file.
- Example: ``3030237``

id
^^
- Id: ``{http://owncloud.org/ns}id``
- Property: ``<oc:id />``
- Description: The fileid namespaced by the instance id, globally unique

fileid
^^^^^^
- Id: ``{http://owncloud.org/ns}fileid``
- Property: ``<oc:fileid />``
- Description: The unique id for the file within the instance

permissions
^^^^^^^^^^^
- Id: ``{http://owncloud.org/ns}permissions``
- Property: ``<oc:permissions />``
- Description: The permissions that the user has over the file. ``true`` or ``false``

mount-type
^^^^^^^^^^
- Id: ``{http://nextcloud.org/ns}mount-type``
- Property: ``<nc:mount-type />``
- Description: The type of mount.
- Example: ``''`` = local; ``'shared'`` = received share; ``'external'`` or ``'external-session'`` = external storage

is-encrypted
^^^^^^^^^^^^
- Id: ``{http://nextcloud.org/ns}is-encrypted``
- Property: ``<nc:is-encrypted />``
- Description: Whether the file is end-to-end encrypted

favorite
^^^^^^^^
- Id: ``{http://owncloud.org/ns}favorite``
- Property: ``<oc:favorite />``
- Description: The favorite state.
- Example: ``0`` for not favourited, ``1`` for favourited

comments-href
^^^^^^^^^^^^^
- Id: ``{http://owncloud.org/ns}comments-href``
- Property: ``<oc:comments-href />``
- Description: The DAV endpoint to fetch teh comments

comments-count
^^^^^^^^^^^^^^
- Id: ``{http://owncloud.org/ns}comments-count``
- Property: ``<oc:comments-count />``
- Description: The number of comments

comments-unread
^^^^^^^^^^^^^^^
- Id: ``{http://owncloud.org/ns}comments-unread``
- Property: ``<oc:comments-unread />``
- Description: The number of unread comments

owner-id
^^^^^^^^
- Id: ``{http://owncloud.org/ns}owner-id``
- Property: ``<oc:owner-id />``
- Description: The user id of the owner of a shared file

owner-display-name
^^^^^^^^^^^^^^^^^^
- Id: ``{http://owncloud.org/ns}owner-display-name``
- Property: ``<oc:owner-display-name />``
- Description: The display name of the owner of a shared file

share-types
^^^^^^^^^^^
- Id: ``{http://owncloud.org/ns}share-types``
- Property: ``<oc:share-types />``
- Description: The list of type share.
- Example: ``0`` = user; ``1`` = group; ``3`` = public link; ``4`` = email; ``6`` = federated cloud share; ``7`` = circle; ``10`` = Talk conversation

share-permissions
^^^^^^^^^^^^^^^^^
- Id: ``{http://open-collaboration-services.org/ns}share-permissions``
- Property: ``{http://open-collaboration-services.org/ns}share-permissions``
- Description: The permissions that the user has over the share.
- Example: Create = ``4``; Read = ``1``; Update = ``2``; Delete = ``8``; Share = ``16``; All = ``31``;

checksums
^^^^^^^^^
- Id: ``{http://owncloud.org/ns}checksums``
- Property: ``<oc:checksums />``
- Description:
has-preview
^^^^^^^^^^^
- Id: ``{http://nextcloud.org/ns}has-preview``
- Property: ``<nc:has-preview />``
- Description: Whether a preview of the file is available

size
^^^^
- Id: ``{http://owncloud.org/ns}size``
- Property: ``<oc:size />``
- Description: Unlike :code:`getcontentlength`, this property also works for folders reporting the size of everything in the folder

rich-workspace
^^^^^^^^^^^^^^
- Id: ``{http://nextcloud.org/ns}rich-workspace``
- Property: ``<nc:rich-workspace />``
- Description: This property is provided by the text app

contained-folder-count
^^^^^^^^^^^^^^^^^^^^^^
- Id: ``{http://nextcloud.org/ns}contained-folder-count``
- Property: ``<nc:contained-folder-count />``
- Description: The number of folders directly contained in the folder (not recursively)

contained-file-count
^^^^^^^^^^^^^^^^^^^^
- Id: ``{http://nextcloud.org/ns}contained-file-count``
- Property: ``<nc:contained-file-count />``
- Description: The number of files directly contained in the folder (not recursively)


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

A file can be downloaded by sending a :code:`GET` request to the WebDAV url of the file.

.. code::

	GET remote.php/dav/files/user/path/to/file

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

- ``X-OC-MTIME``: allow to specify a mtime. The response will contain the header ``X-OC-MTime: accepted`` if the mtime was accepted.
- ``X-OC-CTIME``: allow to specify a creation time. The response will contain the header ``X-OC-CTime: accepted`` if the ctime was accepted.
- ``OC-CHECKSUM``: allow to specify a checksum.
- ``X-HASH``: allow to request the file's hash from the server. Possible values are ``md5``, ``sha1``, and ``sha256``. The server will return the hash in a header named either ``X-Hash-MD5``, ``X-Hash-SHA1``, or ``X-Hash-SHA256``.
- ``OC-CHUNKED``: specify that the sent data is part of a chunk upload.
- ``OC-Total-Length``: contains the total size of the file during a chunk upload. This allow the server to abort faster if the remaining user's quota is not enough.

Response Headers
----------------

Nextcloud will answer with

- ``OC-Etag``: On creation, move and copy, the response contain the etag of the file.
- ``OC-FileId``: On creation, move and copy, the response contain the fileid of the file. Format: ``<padded-id><instance-id>``. Example: ``"00000259oczn5x60nrdu"``
