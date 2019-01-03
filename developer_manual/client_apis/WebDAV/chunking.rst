===================
Chunked file upload
===================

.. sectionauthor:: Roeland Jago Douma <roeland@famdouma.nl>

Introduction
------------
Uploading large files is always a bit problematic as your connection can be interrupted
which will fail your entire upload. Nextcloud has a chunking API where you can
upload smaller chunks which will be assembled on the server once they are all uploaded.

Usage
-----

The API is only available for registered users of your instance. And uses the path:
``<server>/remote.php/dav/uploads/<userid>``. For this guide we will assume:
``https://server/remote.php/dav/uploads/roeland``

Starting a chunked upload
^^^^^^^^^^^^^^^^^^^^^^^^^

A chunked upload is handled in 1 folder. This is the location all the chunks
are uploaded to.

Start by creating a folder with a unique name. You can list the current available
folder but if you take a random UUID chances of collision are tiny.

``curl -X MKCOL -u roeland:pass https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0``

Uploading chunks
^^^^^^^^^^^^^^^^

Once a folder for the chunks has been created we can start uploading the chunks.
We pose no limitations on the order or the sizes of the chunks you try to upload. which
means you can even adapt your chunk size to your available bandwidth. For example
if you switch from mobile internet to WiFi you might want to increase the chunk size.

We sort the chunks. Before assembling. So it is recommended to name them in a way
sorting always works.

``XXXXXXXXXXXXXXX-YYYYYYYYYYYYYYY``

Where ``XXXXXXXXXXXXXXX`` is the start byte of the chunk (with leading zeros) and
``YYYYYYYYYYYYYYY`` is the end byte of the chunk with leading zeros.

``curl -X PUT -u roeland:pass https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/000000000000000-000000010485759 -d @chunk1``
``curl -X PUT -u roeland:pass https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/000000010485760-000000015728640 -d @chunk2``

This will upload 2 chunks of a file. The first chunk is 10MB in size and the second
chunk is 5MB in size.

Assembling the chunks
^^^^^^^^^^^^^^^^^^^^^

Assembling the chunk on the server is a matter of initiating a move from the client.

``curl -X MOVE -u roeland:pass --header 'Destination:https://server/remote.php/dav/files/roeland/dest/file.zip' https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/.file``

The server will now assemble the chunks and move the final file to the folder ``dest/file.zip``.
The chunks and the upload folder will be deleted afterwards.

Aborting the upload
^^^^^^^^^^^^^^^^^^^

If the upload has to be aborted this is a simple matter or deleting the upload folder.

``curl -X DELETE -u roeland:pass https://server/remote.php/dav/uploads/roeland/myapp-e1663913-4423-4efe-a9cd-26e7beeca3c0/``
