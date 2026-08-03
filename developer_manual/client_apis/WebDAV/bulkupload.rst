================
File bulk upload
================

.. sectionauthor:: Matthieu Gallien <matthieu.gallien@nextcloud.com>

Introduction
------------

Uploading many small files is often slower than what could be achieved because we do not
use the whole network bandwidth. Nextcloud has a bulk upload API where you can upload
many small files together in order to optimize the use of network bandwidth.

Usage
-----

The API is available to authenticated users at:

.. code-block:: HTTP

   POST <server>/remote.php/dav/bulk

Before using this endpoint, clients should check the capabilities response for
``dav.bulkupload`` version ``1.0``. Administrators can disable the feature, so
clients must fall back to regular uploads when this capability is absent.

The request
^^^^^^^^^^^

A bulk upload is an HTTP ``POST`` request with an outer request header of:

.. code-block:: HTTP

    Content-Type: multipart/related; boundary=<boundary>

The server requires the ``multipart/related`` media type and the
``boundary`` parameter. Multipart boundaries, part headers, and the
header/body separator must use CRLF (``\r\n``).

Each part starts with ``--<boundary>\r\n``. After its headers, send an empty
line (``\r\n``), followed by exactly the number of payload bytes declared in
that part's ``Content-Length`` header, then ``\r\n``. Terminate the request
with ``--<boundary>--\r\n``.

The ``Content-Length`` is the size in bytes of the file payload only. It
does not include multipart boundaries, part headers, or CRLF delimiters. The
server reads exactly the specified number of bytes, so file payloads may contain
newlines and arbitrary binary data.

Each file is sent as one part.

Each file part needs the following headers:

* ``Content-Length: <file size>``
* ``X-File-Path: <destination file path>``
* A checksum header; one or both of:

  * ``OC-Checksum: <algorithm>:<hex digest>``
  * ``X-File-MD5: <md5 checksum>``

The following per-part headers are optional:

* ``Content-Type: <mimetype>``
* ``X-OC-Mtime: <Unix timestamp in seconds>``

The destination file path is within the authenticated user's files root.
All intermediate folders must already exist.

At least one checksum header is required. ``OC-Checksum`` is the preferred
checksum header. For example:

.. code-block:: HTTP

   OC-Checksum: SHA1:3b5d5c3712955042212316173ccf37be800c4f6e

If compatibility with Nextcloud Server versions before 32 is required, clients
should also send the legacy ``X-File-MD5`` header:

* ``X-File-MD5: <md5 checksum>``

When both checksum headers are present, the server uses the checksum specified
in the ``OC-Checksum`` header for validation and ignore any provided
``X-File-MD5`` header value.

The server also accepts ``X-File-Mtime`` as an alternative to
``X-OC-Mtime``. When both headers are supplied, ``X-File-Mtime`` takes
precedence. The desktop client currently sends ``Content-Type:
application/octet-stream`` and ``X-File-Mtime``.

The example below uses ``OC-Checksum`` only. Clients that need compatibility
with Nextcloud Server versions before 32 must also calculate and send
``X-File-MD5`` for every file part.

The response
^^^^^^^^^^^^

The reply is a JSON document keyed by the ``X-File-Path`` value. A successful
file upload has the following structure:

.. code-block:: JSON

  {
      "/small file.txt": {
          "error": false,
          "etag": "adb9aa24cbfa8e372c88431d1d99629a",
          "fileid": "123",
          "permissions": "RGDNVCK"
      }
  }

For a file-level error, the corresponding entry contains ``"error": true``
and an error message:

.. code-block:: JSON

  {
      "/unwritable/file.txt": {
          "error": true,
          "message": "..."
      }
  }

The request can return HTTP ``200 OK`` even if one or more individual file
uploads failed. Clients must inspect the response entry for every submitted
file. Malformed multipart requests return HTTP ``400 Bad Request``.

Example
-------

Example code to upload some test files using the bulk upload protocol using *curl*:

.. code-block:: BASH

    #!/bin/bash

    NB=$1
    SIZE=$2

    USER="admin"
    PASS="admin"
    SERVER="nextcloud.local"
    UPLOAD_PATH="/tmp/bulk_upload_request_$(openssl rand --hex 8).txt"
    BOUNDARY="boundary_$(openssl rand --hex 8)"
    REMOTE_FOLDER="/test"

    for ((i=1; i<="$NB"; i++))
    do
            file_name=$(openssl rand --hex 8)
            file_local_path="./$file_name.txt"
            file_remote_path="$REMOTE_FOLDER/$file_name.txt"
            head -c "$SIZE" /dev/urandom > "$file_local_path"
            file_mtime=$(stat -c %Y "$file_local_path")
            file_hash=$(sha1sum "$file_local_path" | awk '{ print $1 }')
            file_size=$(du -sb "$file_local_path" | awk '{ print $1 }')

            {
                    echo -en "--$BOUNDARY\r\n"
                    echo -en "X-File-Path: $file_remote_path\r\n"
                    echo -en "X-OC-Mtime: $file_mtime\r\n"
                    echo -en "Content-Type: application/octet-stream\r\n"
                    echo -en "OC-Checksum: SHA1:$file_hash\r\n"
                    echo -en "Content-Length: $file_size\r\n"
                    echo -en "\r\n"

                    cat "$file_local_path"
                    echo -en "\r\n"
            } >> "$UPLOAD_PATH"
    done

    echo -en "--$BOUNDARY--\r\n" >> "$UPLOAD_PATH"

    echo "Creating folder /test"
    curl \
            -X MKCOL \
            -k \
            "https://$USER:$PASS@$SERVER/remote.php/dav/files/$USER/test" > /dev/null

    echo "Uploading $NB files with total size: $(du -sh "$UPLOAD_PATH" | cut -d '   ' -f1)"
    echo "Local file is: $UPLOAD_PATH"
    curl \
            -X POST \
            -k \
            --progress-bar \
            --cookie "XDEBUG_PROFILE=true;path=/;" \
            -H "Content-Type: multipart/related; boundary=$BOUNDARY" \
            --data-binary "@$UPLOAD_PATH" \
            "https://$USER:$PASS@$SERVER/remote.php/dav/bulk"
