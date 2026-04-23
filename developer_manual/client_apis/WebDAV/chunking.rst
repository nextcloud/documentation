###################
Chunked file upload
###################

.. sectionauthor:: Roeland Jago Douma <roeland@famdouma.nl>
.. sectionauthor:: Julius Härtl <jus@bitgrid.net>
.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>

Introduction
============
Uploading large files is always a bit problematic as your connection can be interrupted
which will fail your entire upload. Nextcloud has a chunking API where you can
upload smaller chunks which will be assembled on the server once they are all uploaded.

There are two versions of the chunking API. Version 1 is the original version and version 2 was built as a backward compatible extension to support uploads directly to supporting target storages like S3. Version 2 is the recommended version to use.

Version 2 comes with a few additional requirements and limitations to consider (compared to version 1):

- Every request needs to have a ``Destination`` header present which specifies the target path of the file
- The naming of the individual chunks is limited to be a number between 1 and 10000
- The chunks will be assembled in the order of their names
- The size of chunks must be between 5MB and 5GB (except for the last chunk, which can be smaller)
- Chunks cannot be downloaded from the upload directory

Nextcloud will expire the upload directory after 24 hours of inactivity. This means that if you start an upload and do not finish it within 24 hours, the upload directory will be deleted and the upload will fail.

Chunked upload v2
=================

The API is only available for registered users of your instance. And uses the path:
``<server>/remote.php/dav/uploads/<userid>``. For this guide we will assume:
``https://server/remote.php/dav/uploads/roeland``

Starting a chunked upload
-------------------------

A chunked upload is handled in 1 folder. This is the location all the chunks
are uploaded to.

Start by creating a folder with a unique name. You can list the current available
folder but if you take a random UUID chances of collision are tiny.

.. code-block:: console

    curl -X MKCOL -u roeland:pass \
        https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0 \
        --header 'Destination: https://server/remote.php/dav/files/roeland/dest/file.zip'

Uploading chunks
----------------

Once a folder for the chunks has been created we can start uploading the chunks.

- The naming of the individual chunks is limited to be a number between 1 and 10000
- The chunks will be assembled in the order of their names
- The size of chunks must be between 5MB and 5GB (except for the last chunk, which can be smaller)
- To have the quota of the user checked, you need to provide the header ``OC-Total-Length`` with
  the total size of the file. It will reject the chunk with a ``507 Insufficient Storage error``.
  If you do not provide it, the upload will only fail on the ``MOVE`` assembling step.

.. code-block:: console

    curl -X PUT -u roeland:pass \
        https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/00001 \
        --data-binary @chunk1 \
        --header 'Destination: https://server/remote.php/dav/files/roeland/dest/file.zip' \
        --header 'OC-Total-Length: 15000000'

    curl -X PUT -u roeland:pass \
        https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/00002 \
        --data-binary @chunk2 \
        --header 'Destination: https://server/remote.php/dav/files/roeland/dest/file.zip' \
        --header 'OC-Total-Length: 15000000'

This will upload 2 chunks of a file. The first chunk is 10MB in size and the second
chunk is 5MB in size.

Assembling the chunks
---------------------

Assembling the chunk on the server is a matter of initiating a move from the client.

.. code-block:: console

    curl -X MOVE -u roeland:pass \
        https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/.file \
        --header 'Destination: https://server/remote.php/dav/files/roeland/dest/file.zip' \
        --header 'OC-Total-Length: 15000000'

The server will now assemble the chunks and move the final file to the folder ``dest/file.zip``.

Setting the modification time
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If a modification time should be set, you can by adding it as header with date as unixtime:

.. code-block:: console

    curl -X MOVE -u roeland:pass
        --header 'Destination: https://server/remote.php/dav/files/roeland/dest/file.zip' \
        --header 'X-OC-Mtime: 1547545326' \
        --header 'OC-Total-Length: 15000000'

Otherwise the current upload date will be used as modification date.

The chunks and the temporary upload folder will be deleted afterwards.

Aborting the upload
-------------------

If the upload has to be aborted this is a simple matter or deleting the upload folder.

.. code-block:: console

    curl -X DELETE -u roeland:pass \
        https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/
