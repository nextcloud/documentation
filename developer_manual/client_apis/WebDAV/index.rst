.. _webdavindex:

==================
WebDAV client APIs
==================

This document provides a quick overview of the WebDAV operations supported in Nextcloud, to keep things readable it won't go into many details
for each operation, further information for each operation can be found in the corresponding rfc where applicable

WebDAV basics
-------------

The base url for all WebDAV operations for a Nextcloud instance is :code:`/remote.php/dav`.

All requests need to provide authentication information, either as a Basic Auth header or by passing a set of valid session cookies.

Testing requests with curl
--------------------------

All WebDAV requests can be easily tested out using :code:`curl` by specifying the request method (:code:`GET`, :code:`PROPFIND`, :code:`PUT`, etc) and setting a request body where needed.

For example: you can perform a :code:`PROPFIND` request to find files in a folder using


.. code-block:: bash

    curl -u username:password 'https://cloud.example.com/remote.php/dav/files/username/folder' -X PROPFIND --data '<?xml version="1.0" encoding="UTF-8"?>
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


Listing folders (rfc4918_)
--------------------------

The contents of a folder can be listed by sending a :code:`PROPFIND` request to the folder.

.. code::

	PROPFIND remote.php/dav/files/user/path/to/folder

Requesting properties
^^^^^^^^^^^^^^^^^^^^^

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
	  </d:prop>
	</d:propfind>

The following properties are supported:

- :code:`{DAV:}getlastmodified`
- :code:`{DAV:}getetag`
- :code:`{DAV:}getcontenttype`
- :code:`{DAV:}resourcetype`
- :code:`{DAV:}getcontentlength`
- :code:`{http://owncloud.org/ns}id` The fileid namespaced by the instance id, globally unique
- :code:`{http://owncloud.org/ns}fileid` The unique id for the file within the instance
- :code:`{http://owncloud.org/ns}favorite`
- :code:`{http://owncloud.org/ns}comments-href`
- :code:`{http://owncloud.org/ns}comments-count`
- :code:`{http://owncloud.org/ns}comments-unread`
- :code:`{http://owncloud.org/ns}owner-id` The user id of the owner of a shared file
- :code:`{http://owncloud.org/ns}owner-display-name` The display name of the owner of a shared file
- :code:`{http://owncloud.org/ns}share-types`
- :code:`{http://owncloud.org/ns}checksums`
- :code:`{http://nextcloud.org/ns}has-preview`
- :code:`{http://owncloud.org/ns}size` Unlike :code:`getcontentlength`, this property also works for folders reporting the size of everything in the folder.

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

A file can be uploading by sending a :code:`PUT` request to the file and sending the raw file contents as the request body.

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

A file or folder can be created by sending a :code:`DELETE` request to the file or folder.

.. code::

	DELETE remote.php/dav/files/user/path/to/file

When deleting a folder, it's contents will be deleted recursively.

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

Setting the :code:`oc:favorite` property to 1 marks a file as favorite, setting it to 0 un-marks it as favorite.

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
