===================
File bulk upload
===================

.. sectionauthor:: Matthieu Gallien <matthieu.gallien@nextcloud.com>

Introduction
------------
Uploading many small files is often slower than what could be achieved because we do not
use the whole network bandwidth. Nextcloud has a bulk upload API where you can upload
many small files together in order to optimize the use of network bandwidth.

Usage
-----

The API is only available for registered users of your instance. And uses the path:
``<server>/remote.php/dav/bulk``.

Starting a bulk upload
^^^^^^^^^^^^^^^^^^^^^^^^^

A bulk upload is simply using a request structured as HTTP multipart with related mime type.

Each file is then sent as one HTTP part.

Each file inside an HTTP Part will need the following headers:

* Content-Length: <file size>
* Content-Type: <mimetype>
* X-File-MD5: <md5 checksum>
* X-File-Mtime: <modification time of file>
* X-File-Path: <destination file path>

The reply is a json document with the following structure:

.. code-block:: JSON

  {
      "/small file.txt": {
          "error": false,
          "etag": "adb9aa24cbfa8e372c88431d1d99629a"
      }
  }
